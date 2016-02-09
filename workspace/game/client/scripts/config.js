var ZONE_NAME = "EduGame";
var LOBBY_ROOM_NAME = "Lobby";
var USERVAR_RANKING = "points";

var sfs = null;
var currentGameStarted = false;
var inGame = false;

var theme = "arctic";

// first question window for survey
var firstQuestionWin;

//badges section
var highscoreButton;
var takeSurveyBt;
var gamesPlayedTotal;
var badges;

//ranking window
var rankingWin;
var rankingWinTable;

//left side room table
var roomTable;
var closeGameBt;
var joinGameBt;
//var quickJoinBt;
var createGameBt;
var roomInfoWin;
var roomInfoWinTable;

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

//game view
var instructionsWin;
var instructionsWinTabs;
var gameChatAreaPn;
var gameMsgIn;
var ratingStars;

//game popups
var waitGameWin;
var loadingGameWin;
var afterGameWin;
var afterGameWinTable;
var isErrorWin;

//survey
var wikiClicked = false;

function init()
{
    console.log("Application started");
    // Create configuration object
    var config = {};
    config.host = "52.27.156.152"; //"52.25.12.255" localhost
    config.port = 8888;
    config.zone = ZONE_NAME;
    config.debug = false;

    // Create SmartFox client instance
    sfs = new SmartFox(config);
    console.log("SmartFox API version: " + sfs.version);
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

    $(document).on("click", "#toSignupBt", onToSignupBtClick);

}

function buildMainUI() {
    //left side room table
    roomTable = $("#roomTable").jqxDataTable({
        width: "100%",
        height:289,
        pageable:false,
        sortable: true,
        filterable: true, 
        columns: [
            { text: 'No.', dataField: 'id', align: 'center', cellsalign: 'center', width: 40 },
            { text: 'Mode', dataField: 'mode', align: 'center', cellsalign: 'center', width: 100},
            { text: 'Players', dataField: 'players', align: 'center', cellsalign: 'center', width: 90,
                cellsRenderer: function (row, column, value, rowData) {
                    var container = "<span class='roomTableRows' data-row='" + rowData.id + "' data-users='" + rowData.userList +"' style='width: 100%; height: 100%;'>";
                    container += value;
                    container += "</span>";
                    return container;
                }
            },
            { text: 'Level', dataField: 'level', align: 'center', cellsalign: 'center', width: 90},
            { text: 'Categories', dataField: 'categories', align: 'center',
                cellsRenderer: function (row, column, value, rowData) {
                    var container = '<div style="width: 100%; height: 100%;">'
                    $.each( value, function( index, category ){
                        container += '<div class="categoriesInTable" style="background: ' + category[1] +'">' + category[0] + '</div>';
                    });
                    container += "</div>";
                    return container;
            }
            },
            { text: 'Status', dataField: 'status', align: 'center', cellsalign: 'center', width: 90, cellsRenderer: function (row, column, value, rowData) {
                var colors = {Full : "red", Pending : "blue", Waiting : "green"};
                var color = colors[value];
                var container = '<span style="width: 100%; height: 100%; color: ' + color + '">';
                container += value;
                container += "</span>";
                return container;
            }}
        ]
    });

    closeGameBt = $("#closeGameBt").jqxButton({width:100, disabled:true, theme:theme});
    joinGameBt = $("#joinGameBt").jqxButton({width:100, disabled:true, theme:theme});
    createGameBt = $("#createGameBt").jqxButton({width:150, theme:theme});

    roomInfoWin = $("#roomInfoWin").jqxWindow({width:183, height:108, isModal:false, autoOpen:false, showCloseButton:false, draggable:false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    roomInfoWinTable = $("#roomInfoWinTable").jqxDataTable({
        width: 170,
        height:58,
        pageable:false,
        sortable: false,
        enableHover: false,
        showHeader: false,
        selectionMode: 'custom',
        columns: [
            { text: 'Name', dataField: 'name', align: 'center' },
            { text: 'Points', dataField: 'points', align: 'center', cellsAlign: 'center',width: 60}
        ]
    });

    //left side chat
    publicChatAreaPn = $("#publicChatAreaPn").jqxPanel({height:250, theme:theme, autoUpdate:true});
    publicMsgIn = $('#publicMsgIn').jqxInput({placeHolder: "Type your message & hit send", height: 28, width: 508, minLength: 1});
    sendPublicMsgBt = $("#sendPublicMsgBt").jqxButton({width:100, theme:theme});
    logoutBt = $("#logoutBt").jqxButton({width:100, theme:theme});

    //right side user lists
    sideBar = $("#sideBar").jqxNavigationBar({theme:theme});
    usersList = $("#userList").jqxDataTable({
        width: 246,
        height:272,
        pageable:false,
        sortable: true,
        enableHover: false,
        selectionMode: 'custom',
        columns: [
            { text: 'Name', dataField: 'username', align: 'center' },
            { text: 'Points', dataField: 'points', align: 'center', cellsAlign: 'center', width: 60}
        ]
    });
    usersInRoomsList = $("#userInRoomsList").jqxDataTable({
        width: 246,
        height:272,
        pageable:false,
        sortable: true,
        enableHover: false,
        selectionMode: 'custom',
        columns: [
            { text: 'Name', dataField: 'username', align: 'center' },
            { text: 'Room', dataField: 'room', align: 'center',cellsAlign: 'center', width: 60 },
            { text: 'Points', dataField: 'points', align: 'center', cellsAlign: 'center', width: 60}
        ]
    });

    // badges section
    highscoreButton = $("#highscoreBt").jqxButton({width:120, disabled:false, theme:theme});
    takeSurveyBt = $("#takeSurveyBt").jqxButton({width:120, disabled:false, theme:theme});
    achievementsWin = $("#achievementsWin").jqxWindow({width:400, height:190, isModal:true, autoOpen:false, resizable:false, draggable:false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});

    //ranking window
    rankingWin = $("#rankingWin").jqxWindow({width:260, height:340, isModal:true, autoOpen:false, draggable:false, resizable:false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    rankingWinTable= $("#rankingWinTable").jqxDataTable({
        width: 250,
        height:290,
        pageable:false,
        enableHover: false,
        selectionMode: 'custom',
        columns: [
            { text: '#', dataField: 'rank', align: 'center', cellsAlign: 'center', width: 30},
            { text: 'User', dataField: 'username', align: 'center'},
            { text: 'Points', dataField: 'points', align: 'center', cellsAlign: 'center', width: 60}
        ]
    });


    //game creation popup
    createGameWin = $("#createGameWin").jqxWindow({width:600, height:448, isModal:true, autoOpen:false, resizable:false, draggable:false, showCloseButton:false, cancelButton:$("#cancelBt"), showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    createGameWinTabs = $("#createGameWinTabs").jqxTabs({width:"100%", height:395, theme:theme});
    closeBt = $("#closeBt").jqxButton({width:100, theme:theme});
    nextBt = $("#nextBt").jqxButton({width:100, theme:theme});

    //instructions
    $(".nextBt").jqxButton({width:100, theme:theme});
    $(".backBt").jqxButton({width:100, theme:theme});

    singleBt = $("#single").jqxToggleButton({width:80, toggled: true, theme:theme});
    competeBt = $("#compete").jqxToggleButton({width:80, toggled: false, theme:theme});
    collaborateBt = $("#collaborate").jqxToggleButton({width:80, toggled: false, theme:theme});

    backTopicBt = $("#backTopicBt").jqxButton({width:100, theme:theme, disabled: true});
    doCreateGameBt = $("#doCreateGameBt").jqxButton({width:100, theme:theme, disabled: true});

    // game view
    instructionsWin = $("#instructionsWin").jqxWindow({width:800, height:600, isModal:true, autoOpen:false, showCloseButton:false, resizable:false, draggable:false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    instructionsWinTabs = $("#instructionsWinTabs").jqxTabs({width:"100%", height:550, theme:theme});

    createTimers();

    $("#nextAction").jqxExpander({
        width: 542,
        height: 163,
        theme: theme,
        showArrow:false,
        toggleMode:'none'
    });
    var data = [
        {button: "Rating", label:"How would you rate the quality of this question?"}, //Poor, Fair, Good, Very Good, Excellent
        {button: "Open in Wikipedia", label:"Get more information about 'x' in Wikipedia"},
        {button: "Next Question", label:"Open the next card"}
    ];
    var source = {
        localData: data,
        dataType: "array",
        dataFields: [{
            name: 'button',
            type: 'string'
        }, {
            name: 'label',
            type: 'string'
        }]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#nextActionTable").jqxDataTable({
        width: 538,
        height: 133,
        theme: theme,
        showHeader:false,
        pageable: false,
        enableHover: false,
        selectionMode: 'custom',
        source: dataAdapter,
        columns: [{
            text: 'Button',
            dataField: 'button',
            width: 160,
            cellsRenderer: function (row, column, value, rowData) {
                var container = '<div style="width: 100%; height: 100%;">'
                if(value == "Rating")
                    container += '<div id="jqxWidget"></div>';
                else if(value == "Open in Wikipedia")
                    container += '<div class="nextActionBt enabled" id="openWikipediaBt">' + value + '</div>';
                else
                    container += '<div class="nextActionBt enabled" id="nextQuestionBt">' + value + '</div>';

                container += "</div>";
                return container;
            }
        }, {
            text: 'Text',
            dataField: 'label',
            width: 334,
            cellsRenderer: function (row, column, value, rowData) {
                var container = '<div style="width: 100%; height: 100%;">'
                if(row == 0)
                    container += '<span id="ratingText">' + value +'</span>';
                else if(row == 1)
                    container += value;
                else
                    container += "Open the next card";
                container += "</div>";
                return container;
            }
        }]
    });

    gameChatAreaPn = $("#gameChatAreaPn").jqxPanel({width:265, height:100, theme:theme, autoUpdate:true});
    gameMsgIn = $('#gameMsgIn').jqxInput({placeHolder: "Type your message", height: 29, width: 175, minLength: 1});

    // game popups
    loadingGameWin = $("#loadingGameWin").jqxWindow({width:250, height:160, autoOpen:false, resizable:false, draggable:false, isModal:true, showCloseButton: false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    isErrorWin = $("#isErrorWin").jqxWindow({width:250, height:160, autoOpen:false, resizable:false, draggable:false, isModal:true, showCloseButton: false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});

    waitGameWin = $("#waitGameWin").jqxWindow({
        width:250, height:125, okButton: $('#okButton'),
        initContent: function () {
            $('#okButton').jqxButton({
                width: '65px',
                theme: theme
            });
            $('#okButton').focus();
        },
        autoOpen:false, resizable:false, draggable:false, isModal:true, showCloseButton: false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    afterGameWin = $("#afterGameWin").jqxWindow({width:800, height:600, autoOpen:false, showCloseButton:true, isModal:true,  resizable:false, draggable:false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});
    afterGameWinTable = $("#afterGameWinTable").jqxDataTable({
        width: 789,
        height:552,
        pageable:false,
        sortable: true,
        rowDetails: true,
        initRowDetails: initAnswerDetails,
        enableHover: false,
        selectionMode: 'custom',
        columns: [
            { text: 'No.', dataField: 'no', align: 'center', cellsAlign: 'center', width: 40 },
            { text: 'Category', dataField: 'category', align: 'center', cellsAlign: 'center', width: 150 },
            { text: 'Topic', dataField: 'topic', align: 'center', cellsAlign: 'center' },
            { text: 'Card', dataField: 'name', align: 'center', cellsAlign: 'center', width: 120 },
            { text: 'Property', dataField: 'property', align: 'center', cellsAlign: 'center', width: 120,
                cellsRenderer: function (row, column, value, rowData) {
                    var arr = value.split('/');
                    var ontology = arr[arr.length - 1];
                    return ontology;
                }
            },
            { text: 'Correct', dataField: 'correct', align: 'center', cellsAlign: 'center', width: 60,
                cellsRenderer: function (row, column, value, rowData) {
                    var container = '<div style="font-size: 24px; color: ' + (value == "true" ? "darkgreen" : "red") +'">';
                    container += (value == "true" ? "&#10003;" : "&#10007;");
                    container += "</div>";
                    return container;
                }
            },
            { text: 'Link', dataField: 'wikipedia', align: 'center', cellsAlign: 'center', width: 80,
                cellsRenderer: function (row, column, value, rowData) {
                    return '<a data-card="' + rowData.data + '" class="afterWikipedia" href="' + value + '" target="_blank">Wikipedia</a>';}}
        ]
    });

    $('#afterGameWin').on('close', getBadges);

    firstQuestionWin = $("#firstQuestionWin").jqxWindow({width:530, height:268, autoOpen:false, showCloseButton:false, isModal:true,  resizable:false, draggable:false, showAnimationDuration: 200, closeAnimationDuration: 100, theme:theme});

}

function addEventListenerMain() {
    // room table
    closeGameBt.click(onCloseGameBtClick);
    joinGameBt.click(onJoinGameBtClick);
    createGameBt.click(onCreateGameBtClick);


    $(document).on("mouseenter", ".roomTableRows", onRoomTableRowEnter);
    $(document).on("mouseleave", ".roomTableRows", onRoomTableRowExit);

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
    $(document).on("click", "#doCreateGameBt", onDoCreateGameBtClick);
    closeBt.click(onCloseBtClick); // close the create the game window
    nextBt.click(onNextBtClick); //go to topic selection
    backTopicBt.click(onTopicBackBtClick); //go back to basic settings decision
    $(document).on("click", ".beforeWikipedia", onBeforeWikipediaClick);
    $(document).on("click", ".afterWikipedia", onAfterWikipediaClick);
    createGameWin.on('open', destroyTopicList);

    // game view
    $(document).on("click", "#errorAnswer", onErrorAnswerClick);

    publicMsgIn.keyup(function(e) {
        if(e.which == 13) {
            onSendMessageBtClick();
        }
    });


    gameMsgIn.keyup(function(e) {
        if(e.which == 13) {
            onSendMessageBtClick();
        }
    });
    $(document).on("mouseenter", ".jqx-rating-image.ratingEnabled", onMouseOverRating);
    $(document).on("mouseleave", ".jqx-rating-image.ratingEnabled", onMouseLeaveRating);



    $(document).on("click", ".answerFields.enabled", onAnswerBtClick);
    $(document).on("click", "#isErrorNo", onIsNoErrorBtClick);
    $(document).on("click", "#isErrorYes", onIsYesErrorBtClick);
    $(document).on("click", "#startGameBt.enabled", onStartGameBtClick);
    $(document).on("click", "#sendGameMsgBt.enabled", onSendMessageBtClick);
    $(document).on("click", "#leaveGameBt", onLeaveGameBtClick);

    $(document).on("click", "#nextQuestionBt.enabled", onNextQuestionBtClick);
    $(document).on("click", "#openWikipediaBt", onOpenWikipediaBtClick);

    $(document).on("click", "#surveyWikipediaLink", function() {
        wikiClicked = true;
    });

    //TODO
    $(document).on("click", "#topCardNotClickable", function() {
        $.each( cards, function( index, card ) {
            card.addEventListener("click", getCardDetails);
            card.cursor = "pointer";
            card.addEventListener("rollover", onRollOverCard);
            card.addEventListener("rollout", onRollOutCard);
        });
    });
    $(document).on("click", "#bigCardNotClickable", function() {
        onIsYesErrorBtClick();
    });
    $(document).on("click", "#noFeedbackBox", function() {
        $("#feedbackWrapper").css("display", "block");
    });
    //TODO

    //instructions
    $(document).on("click", ".instructions.nextBt", function() {
        var selected = $("#instructionsWinTabs").val();
        $("#instructionsWinTabs").jqxTabs('val', selected+1);
    });
    $(document).on("click", ".instructions.backBt", function() {
        var selected = $("#instructionsWinTabs").val();
        $("#instructionsWinTabs").jqxTabs('val', selected-1);
    });
    $(document).on("click", "#showTopicsBt", function() {
        $("#instructionsWin").jqxWindow("close");
        $('#instructionsWin').jqxWindow('setTitle', '<strong>Game Instructions (2 | 3)</strong>');
        $("#createGameWin").jqxWindow("open");
        backTopicBt.jqxButton('disabled', true);
        onCreateGameBtClick();
    });

    $(document).on("click", "#startWarmUp", function() {
        $("#instructionsWin").jqxWindow("close");
        $('#instructionsWin').jqxWindow('setTitle', '<strong>Game Instructions (3 | 3)</strong>');
    });

    $(document).on("click", "#startInstructionsGameBt", function() {
        $("#instructionsWin").jqxWindow("close");
    });



}

function createTimers() {
    $(".opponentCountdown").TimeCircles({
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
                "color": "#dbdde0",
                "show": true
            }}
    });
    $(".opponentCountdown").TimeCircles().addListener(updateOpponentCountdown);
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
    $(".timeToStartEnd").TimeCircles({
        "start": false,
        "total_duration": 301,
        "count_past_zero": false,
        "time": {
            "Days": {
                "show": false
            },
            "Hours": {
                "show": false
            },
            "Minutes": {
                "text": "Minutes",
                "color": "darkgray",
                "show": true
            },
            "Seconds": {
                "show": false
            }}
    });
    $(".timeToStartEnd").TimeCircles().addListener(updateGameTimer);

    $(".averageRating").TimeCircles({
        "start": false,
        "total_duration": 5,
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
                "text": "Avg. Rating",
                "color": "darkgray",
                "show": true
            }}
    });

    $(".newRating").TimeCircles({
        "start": false,
        "total_duration": 301,
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
                "text": "New Rating",
                "color": "darkgray",
                "show": true
            }}
    });
}