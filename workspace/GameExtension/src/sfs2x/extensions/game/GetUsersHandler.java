package sfs2x.extensions.game;

import java.util.Arrays;
import java.util.Collection;

import com.smartfoxserver.v2.entities.Room;
import com.smartfoxserver.v2.entities.User;
import com.smartfoxserver.v2.entities.Zone;
import com.smartfoxserver.v2.entities.data.ISFSArray;
import com.smartfoxserver.v2.entities.data.ISFSObject;
import com.smartfoxserver.v2.entities.data.SFSArray;
import com.smartfoxserver.v2.entities.data.SFSObject;
import com.smartfoxserver.v2.extensions.BaseClientRequestHandler;

public class GetUsersHandler extends BaseClientRequestHandler
{
	private ISFSArray usersInLobby;
	private ISFSArray usersInRooms;
	private ISFSArray userRanking;
	private ISFSObject resObj;

	@Override
	public void handleClientRequest(User sender, ISFSObject params) 
	{
		resObj = SFSObject.newInstance(); 
		usersInLobby = new SFSArray();
		usersInRooms = new SFSArray();
		userRanking = new SFSArray();
		Zone zone = getParentExtension().getParentZone();
		Collection<User> users = zone.getUserList();
		for (User user : users) {
			String uName = user.getName();
			String uRank = Integer.toString((int) user.getVariable("rank").getValue());
			Room insideRoom = user.getLastJoinedRoom();
			String roomName = insideRoom.getName();
			if(!uName.equals(sender.getName())) {
				if (roomName.equals("Lobby")) {
					usersInLobby.addUtfStringArray(Arrays.asList(uName, uRank));
				} else {
					usersInRooms.addUtfStringArray(Arrays.asList(uName, uRank));
				}
			}
			userRanking.addUtfStringArray(Arrays.asList(uName, uRank));
		}
		resObj.putSFSArray("usersInLobby", usersInLobby);
		resObj.putSFSArray("usersInRooms", usersInRooms);
		resObj.putSFSArray("userRanking", userRanking);
		send("getAllUsersInZone", resObj, sender);		
	}

}
