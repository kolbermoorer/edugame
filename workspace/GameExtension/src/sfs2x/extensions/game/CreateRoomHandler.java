package sfs2x.extensions.game;

import java.util.Arrays;
import java.util.List;

import com.smartfoxserver.v2.api.CreateRoomSettings;
import com.smartfoxserver.v2.api.CreateRoomSettings.RoomExtensionSettings;
import com.smartfoxserver.v2.entities.User;
import com.smartfoxserver.v2.entities.data.ISFSObject;
import com.smartfoxserver.v2.entities.variables.RoomVariable;
import com.smartfoxserver.v2.entities.variables.SFSRoomVariable;
import com.smartfoxserver.v2.exceptions.SFSCreateRoomException;
import com.smartfoxserver.v2.extensions.BaseClientRequestHandler;

public class CreateRoomHandler extends BaseClientRequestHandler
{
	//static public String GROUP_GAME = "game";
	static public int MAX_USERS = 2;
	private String roomName;
	private String roomType;
	private String roomCategory;
	private User user;
	
	@Override
	public void handleClientRequest(User user, ISFSObject params) {
		this.user = user;
		this.roomName = params.getUtfString("roomName");
		this.roomType = params.getUtfString("roomType");
		this.roomCategory = params.getUtfString("roomCategory");
		createRoom();
	}
	
	private void createRoom() {
		trace("Create room name:", roomName);
		
		RoomExtensionSettings extension = new RoomExtensionSettings("room", "sfs2x.extensions.room.play.RoomExtension");
		
		CreateRoomSettings setting = new CreateRoomSettings();
		//setting.setGroupId(GROUP_GAME);
		setting.setGame(true);
		setting.setMaxUsers(MAX_USERS);
		setting.setName(roomName);
		setting.setHidden(false);
		setting.setRoomVariables(getRoomVariables());
		setting.setExtension(extension); 
		
		try {
			//createRoom(Zone zone, CreateRoomSettings params, User owner, boolean joinIt, Room roomToLeave, boolean fireClientEvent, boolean fireServerEvent) 
			getApi().createRoom(getParentExtension().getParentZone(), setting, user, true, null, true, false);
		} catch ( SFSCreateRoomException err ) {
			trace(err.getMessage());
		}
	}
	
	private List<RoomVariable> getRoomVariables() {
		
		RoomVariable type = new SFSRoomVariable("type", roomType);
		RoomVariable category = new SFSRoomVariable("category", roomCategory);
		
		type.setGlobal(true);
		category.setGlobal(true);
		
		return  Arrays.asList(type, category);
	}

}
