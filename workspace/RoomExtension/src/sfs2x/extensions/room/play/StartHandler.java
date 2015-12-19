package sfs2x.extensions.room.play;

import java.util.ArrayList;
import java.util.Arrays;

import com.smartfoxserver.v2.entities.User;
import com.smartfoxserver.v2.entities.data.ISFSObject;
import com.smartfoxserver.v2.entities.data.SFSObject;
import com.smartfoxserver.v2.entities.variables.SFSUserVariable;
import com.smartfoxserver.v2.entities.variables.UserVariable;
import com.smartfoxserver.v2.extensions.BaseClientRequestHandler;

public class StartHandler extends BaseClientRequestHandler{

	@Override
	public void handleClientRequest(User myself, ISFSObject params)
	{
		RoomExtension gameExt = (RoomExtension) getParentExtension();
		ArrayList<User> users = gameExt.getGameBoard().getUsersInGame();
		for (User user : users) {
			if(user.getId() == myself.getId()) {
				UserVariable ready = new SFSUserVariable("ready", true);
				ready.setHidden(true);
				getApi().setUserVariables(user, Arrays.asList(ready));
			}
		}
		
		int startCount = 0;
		User userNotReady = null;
		for (User user : users) {
			boolean userReady = (boolean) user.getVariable("ready").getValue();
			if (userReady) 
				startCount++;
			else
				userNotReady = user;
		}
		
		if(startCount == 2) {
			gameExt.startGame();
		}
		else {
			ISFSObject resObj = new SFSObject();
			resObj.putBool("start", false);
			//resObj.putInt("id", userNotReady.getId());
			//send("start", resObj, gameExt.getParentRoom().getUserList());
			send("start", resObj, gameExt.getParentRoom().getUserById(userNotReady.getId()));			
		}
			
	}

}
