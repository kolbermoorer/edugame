var sfs = null;

function init()
{
    trace("Registration started");
    // Create configuration object
    var config = {};
    config.host = "localhost"; //"52.25.12.255"
    config.port = 8888;
    config.zone = "Registration";
    config.debug = true;

    // Create SmartFox client instance
    sfs = new SmartFox(config);
    trace("SmartFox API version: " + sfs.version);
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
    sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
}

function onRegisterBtClick()
{
    if(!sfs.isConnected())
        sfs.connect();
    else
        performSignup();
}

function onConnection()
{
    sfs.send(new SFS2X.Requests.System.LoginRequest(null));
}

function onLogin() {
    performSignup();
}

function performSignup () {
    var params = {};
    params.username = $("#username").val();
    params.password = $("#password").val();
    params.email = $("#email").val();
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("$SignUp.Submit", params));
}

function onExtensionResponse(event)
{
    var created = event.params;
    trace(created.errorMessage);
    if(created.errorMessage == null)
        trace("User was created succesfully.");
    else {
        var errorMsg = created.errorMessage;
        trace(errorMsg, true);
    }
}

function trace(txt, showAlert)
{
    console.log(txt);

    if (showAlert)
        alert(txt);
}

function showError(text)
{
    trace(text);
    $("#errorLb").html("<b>ATTENTION</b><br/>" + text).toggle();
}