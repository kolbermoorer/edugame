package sfs2x.extensions.room.play;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

import com.smartfoxserver.v2.core.SFSEventType;
import com.smartfoxserver.v2.entities.Room;
import com.smartfoxserver.v2.entities.User;
import com.smartfoxserver.v2.entities.data.ISFSObject;
import com.smartfoxserver.v2.entities.data.SFSObject;
import com.smartfoxserver.v2.entities.variables.SFSUserVariable;
import com.smartfoxserver.v2.entities.variables.UserVariable;
import com.smartfoxserver.v2.extensions.SFSExtension;

import sfs2x.extensions.room.play.events.OnUserGoneHandler;
import sfs2x.extensions.room.play.events.OnUserJoinHandler;

public class RoomExtension extends SFSExtension
{
	private ArrayList<String[]> settings;
	private EduGameBoard gameBoard;
	
	private User whoseTurn;
	private volatile boolean gameStarted;
	
	private final String version = "1.0.5";
	
	public static void main(String[] args) {
	}

	@Override
	public void init() {
		trace("Tris game Extension for SFS2X started, rel. " + version);
		setSettings(new ArrayList<String[]>(3));
		addRequestHandler("ready", ReadyHandler.class);	
		addRequestHandler("start", StartHandler.class);
		addRequestHandler("pickCard", PickCardHandler.class);	
		
		addEventHandler(SFSEventType.USER_JOIN_ROOM, OnUserJoinHandler.class);
		addEventHandler(SFSEventType.USER_DISCONNECT, OnUserGoneHandler.class);
		addEventHandler(SFSEventType.USER_LEAVE_ROOM, OnUserGoneHandler.class);
		
	}
	
	@Override
    public void destroy()
    {
		trace("Room was destroyed succesfully!");
    	super.destroy();
    }
	
	public Room getGameRoom()
	{
		return this.getParentRoom();
	}
    
    void initGame() throws IOException
	{
    	if (gameStarted)
			throw new IllegalStateException("Game is already started!");
		
		gameStarted = true;

		User player1 = getParentRoom().getUserByPlayerId(1);
		User player2 = getParentRoom().getUserByPlayerId(2);
		UserVariable ready = new SFSUserVariable("ready", false);
		ready.setHidden(true);
		getApi().setUserVariables(player1, Arrays.asList(ready));
		getApi().setUserVariables(player2, Arrays.asList(ready));
		
		gameBoard = new EduGameBoard(24, settings, player1, player2);
		//gameBoard.generateResourceList();
		//gameBoard.generateCardList();
		gameBoard.generateTestDataset(player1.getId(), player2.getId());
		String json = gameBoard.getAllCards();
		
		if (whoseTurn == null)
			whoseTurn = player1;

		ISFSObject resObj = new SFSObject();
		resObj.putUtfString("cardData", json);
		resObj.putInt("t", whoseTurn.getPlayerId());
		resObj.putInt("p1i", player1.getId());
		resObj.putInt("p2i", player2.getId());
		resObj.putUtfString("p1n", player1.getName());
		resObj.putUtfString("p2n", player2.getName());
		resObj.putIntArray("layouts", defineCardsBackground());
		
		send("init", resObj, getParentRoom().getUserList());
	}
    
    void startGame() {
    	ISFSObject resObj = new SFSObject();
    	ArrayList<User> usersInGame = gameBoard.getUsersInGame();
    	int indexUser = 1;
    	for(User user : usersInGame) {
    		resObj.putUtfString("p" + indexUser + "n", user.getName());
    	}
		//resObj.putUtfString("p1n", player1.getName());
		//resObj.putUtfString("p2n", player2.getName());
    	resObj.putBool("start", true);
		send("start", resObj, getParentRoom().getUserList());
    }
    
    public void stopGame()
	{
		gameStarted = false;
		whoseTurn = null; 
	}
    
    public ArrayList<Integer> defineCardsBackground() {
    	ArrayList<Integer> layouts = new ArrayList<Integer>();
		ArrayList<Integer> list = new ArrayList<Integer>();
        for (int i=1; i < 7; i++) { //we have 6 different layouts for background of cards
            list.add(new Integer(i));
        }
        Collections.shuffle(list); //shuffle the layouts
        for (int i=0; i < 3; i++) { //get first 3 layouts
            int index = list.get(i);
            layouts.add(index);
        }
        return layouts;
	}

    
    
    /*
     * Getter and setter
     */
	public ArrayList<String[]> getSettings() {
		return settings;
	}
	public void setSettings(ArrayList<String[]> settings) {
		this.settings = settings;
	}
	public EduGameBoard getGameBoard() {
		return gameBoard;
	}
	public void setGameBoard(EduGameBoard gameBoard) {
		this.gameBoard = gameBoard;
	}

}
