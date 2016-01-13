var ZONE_NAME = "EduGame";
var LOBBY_ROOM_NAME = "Lobby";
var USERVAR_RANKING = "points";

var sfs = null;
var currentGameStarted = false;
var inGame = false;

var theme = "arctic";

//badges section
var highscoreButton;
var takeSurveyBt;
var enableSurveyBt;
var gamesPlayedTotal;
var badges;

//ranking window
var rankingWin;
var rankingWinTable;

//left side room table
var roomTable;
var joinGameBt;
var quickJoinBt;
var createGameBt;

//left side chat
var publicChatAreaPn;
var publicMsgIn;
var sendPublicMsgBt;
var logoutBt;

//right side user lists
var sideBar;
var usersList;
var usersInRoomsList;

//achievements Popup
var achievementsWin;

//game creation window
var createGameWin;
var createGameWinTabs;
var closeBt;
var gameNameIn;
var gameTypeDd;
var gameDifficultyDd;
var categoryList;
var backCategoryBt;
var pickCategoryBt;
var nextCategoryBt;
var topicList;
var backTopicBt;
var pickTopicBt;
var nextTopicBt;
var doCreateGameBt;
var last_row_opened;
var last_row_opened_number;
var selectedTopicRow;

//game view
var gameChatAreaPn;
var sendGameMsgBt;
//var leaveGameBt;

//game popups
var waitGameWin;
var endGameWin;

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

function buildMainUI() {
    //left side room table
    roomTable = $("#roomTable").jqxDataTable({
        width: "100%",
        height:289,
        pageable:true,
        sortable: true,
        selectionMode: 'custom',
        columns: [
            { text: 'ID', dataField: 'id' },
            { text: 'Name', dataField: 'name'},
            { text: 'Type', dataField: 'type'},
            { text: 'Players', dataField: 'players', align: 'center', cellsAlign: 'right'},
            { text: 'Categories', dataField: 'categories', align: 'center', cellsAlign: 'right' }
        ]
    });
    quickJoinBt = $("#quickJoinBt").jqxButton({width:150, disabled:true, theme:theme});
    joinGameBt = $("#joinGameBt").jqxButton({width:100, disabled:true, theme:theme});
    createGameBt = $("#createGameBt").jqxButton({width:150, theme:theme});

    //left side chat
    publicChatAreaPn = $("#publicChatAreaPn").jqxPanel({height:250, theme:theme, autoUpdate:true});
    publicMsgIn = $('#publicMsgIn').jqxTextArea({ placeHolder: 'Type your message & hit send', width: 508, height: 28, minLength: 1 });
    sendPublicMsgBt = $("#sendPublicMsgBt").jqxButton({width:100, theme:theme});
    logoutBt = $("#logoutBt").jqxButton({width:100, theme:theme});

    //right side user lists
    sideBar = $("#sideBar").jqxNavigationBar({theme:theme});
    usersList = $("#userList").jqxDataTable({
        width: 246,
        height:272,
        pageable:true,
        enableHover: false,
        selectionMode: 'custom',
        columns: [
            { text: 'Name', dataField: 'username' },
            { text: 'Points', dataField: 'points', align: 'center', cellsAlign: 'center'}
        ]
    });
    usersInRoomsList = $("#userInRoomsList").jqxDataTable({
        width: 246,
        height:272,
        pageable:true,
        enableHover: false,
        selectionMode: 'custom',
        columns: [
            { text: 'Name', dataField: 'username' },
            { text: 'Points', dataField: 'points', align: 'center', cellsAlign: 'center'}
        ]
    });

    // badges section
    highscoreButton = $("#highscoreBt").jqxButton({width:120, disabled:false, theme:theme});
    takeSurveyBt = $("#takeSurveyBt").jqxButton({width:120, disabled:!enableSurveyBt, theme:theme});
    achievementsWin = $("#achievementsWin").jqxWindow({width:400, height:190, isModal:true, autoOpen:false, resizable:false, draggable:false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});

    //ranking window
    rankingWin = $("#rankingWin").jqxWindow({width:260, height:340, isModal:true, autoOpen:false, draggable:false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    rankingWinTable= $("#rankingWinTable").jqxDataTable({
        width: 250,
        height:290,
        pageable:false,
        enableHover: false,
        selectionMode: 'custom',
        columns: [
            { text: '#', dataField: 'rank', align: 'center', cellsAlign: 'center'},
            { text: 'User', dataField: 'username', align: 'center'},
            { text: 'Points', dataField: 'points', align: 'center', cellsAlign: 'center'}
        ]
    });


    //game creation popup
    createGameWin = $("#createGameWin").jqxWindow({width:400, height:448, isModal:true, autoOpen:false, resizable:false, draggable:false, cancelButton:$("#cancelBt"), showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    createGameWinTabs = $("#createGameWinTabs").jqxTabs({width:"100%", height:391, theme:theme});
    closeBt = $("#closeBt").jqxButton({width:100, theme:theme});
    gameNameIn = $('#gameNameIn').jqxTextArea({ placeHolder: 'Enter a Name', height: 22, width: 180, maxLength: 16});
    gameTypeDd = $("#gameTypeDd").jqxDropDownList({source:["Defeat your Enemy", "The Will To Cooperate"], width:180, height:22, dropDownHeight:60, selectedIndex: 0});
    gameDifficultyDd = $("#gameDifficultyDd").jqxDropDownList({source:["Normal", "Hard"], width:180, height:22, dropDownHeight:70, selectedIndex: 0});
    backCategoryBt = $("#backCategoryBt").jqxButton({width:100, theme:theme});
    pickCategoryBt = $("#pickCategoryBt").jqxButton({width:100, theme:theme});
    nextCategoryBt = $("#nextCategoryBt").jqxButton({width:100, theme:theme, disabled: true});
    backTopicBt = $("#backTopicBt").jqxButton({width:100, theme:theme});
    pickTopicBt = $("#pickTopicBt").jqxButton({width:100, theme:theme});
    nextTopicBt = $("#nextTopicBt").jqxButton({width:100, theme:theme});
    doCreateGameBt = $("#doCreateGameBt").jqxButton({width:100, theme:theme});

    // game view
    gameChatAreaPn = $("#gameChatAreaPn").jqxPanel({width:260, height:200, theme:theme, autoUpdate:true});
    sendGameMsgBt = $("#sendGameMsgBt").jqxButton({width:76, theme:theme});
    //leaveGameBt = $("#leaveGameBt").jqxButton({width:100, theme:theme});

    // game popups
    waitGameWin = $("#waitGameWin").jqxWindow({width:250, height:150, autoOpen:false, resizable:false, draggable:false, showCloseButton: false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    //endGameWin = $("#endGameWin").jqxWindow({width:250, height:150, autoOpen:false, resizable:false, draggable:false, showCloseButton: false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});

}

function addEventListenerMain() {
    // room table
    createGameBt.click(onCreateGameBtClick);
    joinGameBt.click(onJoinGameBtClick);

    //chat
    sendPublicMsgBt.click(onSendMessageBtClick);
    logoutBt.click(onLogoutBtClick);

    //badges
    badges = $(".badge-click").click(onBadgeClick);
    takeSurveyBt.click(onTakeSurveyBtClick);

    // highscore
    highscoreButton.click(onHighscoreBtClick);

    //game creation window
    gameNameIn.keyup(function(e) {
        var name = gameNameIn.val();
        if (name.length > 0)
            nextCategoryBt.jqxButton({disabled: false});
        else
            nextCategoryBt.jqxButton({disabled: true});
    });

    closeBt.click(onCloseBtClick);
    backCategoryBt.click(onCategoryBackBtClick);
    pickCategoryBt.click(onPickCategoryBtClick);
    nextCategoryBt.click(onCategoryNextBtClick);
    backTopicBt.click(onTopicBackBtClick);
    nextTopicBt.click(onTopicNextBtClick);
    doCreateGameBt.click(onDoCreateGameBtClick);

    $('body').on('click', 'span.fillUpCards', function() {
        var row = $(this).attr("row");
        var selectedCheckboxes=$('input[topic-row=' + row + ']:checked').length;
        var notSelected = $('input[topic-row=' + row + ']:not(:checked)');
        var selectRandomNotSelected = shuffle(notSelected).slice(0, 8-selectedCheckboxes);
        selectRandomNotSelected.prop('checked', true);
    });

    $('body').on('click', 'span.deselectAll', function() {
        var row = $(this).attr("row");
        $('input[topic-row=' + row + ']').prop('checked', false);
    });

    $('body').on('click', 'input.cbResource', function() {
        var row = $(this).attr("topic-row");
        var selectedCheckboxes=$('input[topic-row=' + row + ']:checked').length;
        if(selectedCheckboxes > 8) {
            $(this).prop('checked', false);
            trace("Maximum of 8 cards can be selected.", true);
        }
    });


    // game view
    sendGameMsgBt.click(onSendMessageBtClick);

    publicMsgIn.keyup(function(e) {
        if(e.which == 13) {
            onSendMessageBtClick();
        }
    });

    $("#gameMsgIn").keyup(function(e) {
        if(e.which == 13) {
            onSendMessageBtClick();
        }
    });
}