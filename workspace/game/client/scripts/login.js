var username;
var password;

function onLoginBtClick()
{
    if(!sfs.isConnected()) {
        sfs.connect();
    }
    else
        performLogin();
}

function onConnection()
{
    performLogin();
}

function onConnectionLost(event)
{
    setView("login", true);
    setStatusTextLogin("You have been disconnected; reason is: " + event.reason, false);
}

function performLogin() {
    var username = $("#username").val();
    var password = CryptoJS.MD5($("#password").val()).toString(CryptoJS.enc.Hex);

    sfs.send(new SFS2X.Requests.System.LoginRequest(username, password));
    $("#username").val("");
    $("#password").val("");
}

function onLogin(event)
{
    setStatusTextLogin("You Have Successfully Logged In", true);
    console.log("Login successful!" +
        "\n\tZone: " + event.zone +
        "\n\tUser: " + event.user +
        "\n\tData: " + event.data);

    $("#usernameLb").html(event.user.name);
    $("#scoreLb").html(event.data.points);

    var points = event.data.points;
    var rankingVar = new SFS2X.Entities.Variables.SFSUserVariable(USERVAR_RANKING, points);
    var id = new SFS2X.Entities.Variables.SFSUserVariable("id", event.data.id);
    sfs.send(new SFS2X.Requests.System.SetUserVariablesRequest([rankingVar, id]));

    sfs.send( new SFS2X.Requests.System.ExtensionRequest("getBadges") );
    joinLobbyRoom();
}

function onLoginError(event)
{
    setStatusTextLogin(event.errorMessage, false);
}

function setStatusTextLogin(text, success) {
    var statusText = $("#statusTextLogin");
    statusText.css("display", "block");
    statusText.text(text);
    if(success) {
        statusText.css("background", "#badc52");
        statusText.css("color", "green");
        statusText.css("border", "1px solid green");
    }
    else {
        statusText.css("background", "#fecccb");
        statusText.css("color", "red");
        statusText.css("border", "1px solid red");
    }
}

function onToSignupBtClick()
{
    window.open("http://tkutschk.dubhe.uberspace.de/game/client/signup.html","_self");
}

/**
 * Logout button click handler.
 * Performs the logout, which in turn (see onLogout event) makes the view switch to the authenticate box.
 */
function onLogoutBtClick()
{
    sfs.send(new SFS2X.Requests.System.LogoutRequest());
}

function onLogout(event)
{
    console.log("Logout from zone " + event.zone + " performed!");
    setView("login", true);
    setStatusTextLogin("You Have Successfully Logged Out", true);
}