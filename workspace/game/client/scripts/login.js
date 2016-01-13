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
    trace("You have been disconnected; reason is: " + event.reason);
    setView("login", true);
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
    trace("Login successful!" +
        "\n\tZone: " + event.zone +
        "\n\tUser: " + event.user +
        "\n\tData: " + event.data);

    $("#usernameLb").html(event.user.name);
    $("#scoreLb").html(event.data.points);

    var points = event.data.points;
    var rankingVar = new SFS2X.Entities.Variables.SFSUserVariable(USERVAR_RANKING, points);
    sfs.send(new SFS2X.Requests.System.SetUserVariablesRequest([rankingVar]));

    updateBadges(event.data);
    joinLobbyRoom();
}

function onLoginError(event)
{
    //TODO: add error message to UI
    // Show error
    var error = "Login error: " + event.errorMessage + " (code " + event.errorCode + ")";
    showError(error);
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
    trace("Logout from zone " + event.zone + " performed!");
    setView("login", true);
}