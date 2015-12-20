var ZONE_NAME = "EduGame";
var LOBBY_ROOM_NAME = "Lobby";
var USERVAR_RANKING = "rank";

var sfs = null;
var currentGameStarted = false;
var inGame = false;

function init()
{
    trace("Application started");
    // Create configuration object
    var config = {};
    config.host = "localhost"; //"52.25.12.255"
    config.port = 8888;
    config.zone = ZONE_NAME;
    config.debug = false;

    // Create SmartFox client instance
    sfs = new SmartFox(config);
    trace("SmartFox API version: " + sfs.version);
    sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onGameExtensionResponse);
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGOUT, onLogout, this);
    sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoin, this);
    sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, onRoomJoinError, this);
    sfs.addEventListener(SFS2X.SFSEvent.ROOM_ADD, onRoomAdd, this);
    sfs.addEventListener(SFS2X.SFSEvent.ROOM_REMOVE, onRoomRemove, this);
    sfs.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, onUserEnterRoom, this);
    sfs.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, onUserExitRoom, this);
    sfs.addEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, onPublicMessage, this);
    //TODO: Add Rome Creation error handling

}