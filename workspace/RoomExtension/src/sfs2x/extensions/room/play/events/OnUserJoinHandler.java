package sfs2x.extensions.room.play.events;

import java.util.ArrayList;
import java.util.List;

import com.smartfoxserver.v2.core.ISFSEvent;
import com.smartfoxserver.v2.entities.Room;
import com.smartfoxserver.v2.entities.User;
import com.smartfoxserver.v2.entities.Zone;
import com.smartfoxserver.v2.entities.data.ISFSObject;
import com.smartfoxserver.v2.entities.data.SFSObject;
import com.smartfoxserver.v2.exceptions.SFSException;
import com.smartfoxserver.v2.extensions.BaseServerEventHandler;

import sfs2x.extensions.room.play.RoomExtension;

public class OnUserJoinHandler extends BaseServerEventHandler{

	@Override
	public void handleServerEvent(ISFSEvent event) throws SFSException {
		RoomExtension gameExt = (RoomExtension) getParentExtension();
		Room gameRoom = gameExt.getParentRoom();
		Zone gameZone = gameExt.getParentZone();
		List<User> usersInZone = new ArrayList<User>();
		usersInZone.addAll(gameZone.getUserList());
		ISFSObject resObj = new SFSObject();
		resObj.putInt("roomId", gameRoom.getId());
		resObj.putInt("countPlayers", gameRoom.getUserList().size());
		gameExt.send("updateRoomTable", resObj, usersInZone);
	}

}
