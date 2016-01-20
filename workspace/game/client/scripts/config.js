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
var nextBt;
var singleBt;;
var competeBt;
var collaborateBt;
var topicList;
var backTopicBt;
var doCreateGameBt;
var last_row_opened;
var last_row_opened_number;
var selectedTopicRow;

//game view
var feedbackSlider;
var gameChatAreaPn;
var sendGameMsgBt;
var leaveGameBt;
var ratingStars;
var gaugeMeter;

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
    createGameWin = $("#createGameWin").jqxWindow({width:600, height:448, isModal:true, autoOpen:false, resizable:false, draggable:false, cancelButton:$("#cancelBt"), showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    createGameWinTabs = $("#createGameWinTabs").jqxTabs({width:"100%", height:395, theme:theme});
    closeBt = $("#closeBt").jqxButton({width:100, theme:theme});
    nextBt = $("#nextBt").jqxButton({width:100, theme:theme});

    singleBt = $("#single").jqxToggleButton({width:80, toggled: true, theme:theme});
    competeBt = $("#compete").jqxToggleButton({width:80, toggled: false, theme:theme});
    collaborateBt = $("#collaborate").jqxToggleButton({width:80, toggled: false, theme:theme});

    backTopicBt = $("#backTopicBt").jqxButton({width:100, theme:theme});
    doCreateGameBt = $("#doCreateGameBt").jqxButton({width:100, theme:theme});

    // game view

    //gameChatAreaPn = $("#gameChatAreaPn").jqxPanel({width:260, height:200, theme:theme, autoUpdate:true});
    //sendGameMsgBt = $("#sendGameMsgBt").jqxButton({width:76, theme:theme});
    leaveGameBt = $("#leaveGameBt").jqxButton({width:100, theme:theme});
    ratingStars = $("#jqxRating").jqxRating({ width: 100, height: 18, singleVote:true, theme: theme});
    gaugeMeter = $('#gauge').jqxGauge({
        ranges: [{ startValue: 0, endValue: 30, style: { fill: '#e53d37', stroke: '#e53d37' }, startDistance: 0, endDistance: 0 },
            { startValue: 30, endValue: 60, style: { fill: '#fad00b', stroke: '#fad00b' }, startDistance: 0, endDistance: 0 },
            { startValue: 60, endValue: 100, style: { fill: '#4cb848', stroke: '#4cb848' }, startDistance: 0, endDistance: 0}],
        cap: { size: '5%', style: { fill: '#2e79bb', stroke: '#2e79bb'} },
        border: { style: { fill: '#8e9495', stroke: '#7b8384', 'stroke-width': 1 } },
        ticksMinor: { interval: 5, size: '5%' },
        ticksMajor: { interval: 10, size: '10%' },
        pointer: { style: { fill: '#2e79bb' }, width: 5 },
        max: 100,
        animationDuration: 1500,
        width: 200,
        caption: { value: 'Quality of Question', position: 'bottom', offset: [0, 10], visible: true }
    });
    $(".countdown").TimeCircles({
        "start": false,
        "count_past_zero": false,
        "time": {
            "Days": {
                "show": false
            },
            "Hours": {
                "show": false
            },
            "Minutes": {
                "show": false
            },
            "Seconds": {
                "text": "Seconds",
                "color": "#FF9999",
                "show": true
            }}
    });
    $(".countdown").TimeCircles().addListener(updateCountdown);



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
    $(".selectBt").click(onSelectBtClick);
    doCreateGameBt.click(onDoCreateGameBtClick); //open the first window to create the game
    closeBt.click(onCloseBtClick); // close the create the game window
    nextBt.click(onNextBtClick); //go to topic selection
    backTopicBt.click(onTopicBackBtClick); //go back to basic settings decision

    // game view
    $(".answerFields").click(onAnswerBtClick);
    //sendGameMsgBt.click(onSendMessageBtClick);
    $(document).on("mouseenter", ".ratingEnabled", function(e) {
        e.stopPropagation();
        var value = $(this).parent().parent().parent().index();
        gaugeMeter.jqxGauge('value', value*20);
    });
    ratingStars.on('change', function (event) {
        $(".jqx-rating-image").removeClass("ratingEnabled");
        var value = event.value;
        if(value > 0)
            onSendFeedbackBtClick(value);
    });

    gaugeMeter.jqxGauge('value', 50);

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

    leaveGameBt.click(onLeaveGameBtClick);
    $("#openWikipediaBt").click(onOpenWikipediaBtClick);
    $("#nextQuestionBt").click(onNextQuestionBtClick);
}