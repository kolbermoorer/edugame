package sfs2x.extensions.signup;

import com.smartfoxserver.v2.components.signup.PasswordMode;
import com.smartfoxserver.v2.components.signup.SignUpAssistantComponent;
import com.smartfoxserver.v2.extensions.SFSExtension;

public class SignupExtension extends SFSExtension 
{
	private SignUpAssistantComponent suac;
    
    @Override
    public void init()
    {

    	suac = new SignUpAssistantComponent();
    	suac.getConfig().signUpTable = "users";
        suac.getConfig().usernameField = "username";
        suac.getConfig().passwordField = "password";
        suac.getConfig().emailField = "email";
        
        suac.getConfig().passwordMode = PasswordMode.MD5;
        
        // Set limits for min/max name and password length
        suac.getConfig().minUserNameLength = 4;
        suac.getConfig().maxUserNameLength = 20;
        suac.getConfig().minPasswordLength = 8;
        suac.getConfig().maxPasswordLength = 30;
        suac.getConfig().maxEmailLength = 50;
        
        addRequestHandler(SignUpAssistantComponent.COMMAND_PREFIX, suac); 
    }
     
    @Override
    public void destroy() 
    {
    	super.destroy();
    } 
}
