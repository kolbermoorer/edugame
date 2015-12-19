package sfs2x.extensions.game;

import java.util.Arrays;

import com.smartfoxserver.v2.components.login.ILoginAssistantPlugin;
import com.smartfoxserver.v2.components.login.LoginAssistantComponent;
import com.smartfoxserver.v2.components.login.LoginData;
import com.smartfoxserver.v2.entities.data.ISFSObject;
import com.smartfoxserver.v2.extensions.SFSExtension;

public class GameExtension extends SFSExtension
{	
	private LoginAssistantComponent lac;
	
	public static void main(String[] args) {
	}
	
	@Override
    public void init()
    {
		initLoginAssistant();
		
		addRequestHandler("getAllUsersInZone", GetUsersHandler.class);
		addRequestHandler("createRoom", CreateRoomHandler.class);
		addRequestHandler("sparql", SparqlHandler.class);
    }
     
    @Override
    public void destroy()
    {
    	super.destroy();
    	lac.destroy();
    }
    
    private void initLoginAssistant()
	{
		lac = new LoginAssistantComponent(this);
		
		lac.getConfig().loginTable = "users";
		lac.getConfig().userNameField = "username";
		lac.getConfig().passwordField = "password";
		lac.getConfig().extraFields = Arrays.asList("rank");
		
		lac.getConfig().postProcessPlugin = new ILoginAssistantPlugin ()
	    {
	        public void execute(LoginData loginData)
	        {
	            ISFSObject fields = loginData.extraFields;             
	            int points = fields.getInt("rank");
	            loginData.clientOutGoingData.putInt("score", points);
	        }
	    };
	}
    
    
}

