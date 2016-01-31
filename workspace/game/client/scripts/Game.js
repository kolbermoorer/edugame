var STAGE_WIDTH = 1000;
var BOARD_WIDTH = 700;
var BOARD_HEIGHT = 700;
var CARD_BACKSIDE_WIDTH = 80;
var CARD_BACKSIDE_HEIGHT = 114;
var SPACE_BETWEEN_CARDS = 17;
var CARD_FRONTSIDE_WIDTH = 263;
var CARD_FRONTSIDE_HEIGHT = 375;
var NUMBER_OF_CATEGORIES = 3;
var NUMBER_OF_CARDS_PER_CATEGORY = 6;
var NUMBER_OF_PROPERTIES_PER_CARD = 4;

//game variables
var gameType = "single";
var multiPlayer = false;
var category, topic, color, totalAvgPageRank, totalAvgWeight, totalCards;

var previousSelectedCard;
var selectedCard;

var nextForwardAction;
var nextBackwardAction;

// Vars
var inited = false;
var canvas;
var stage;
var board;

var timeLeft;

var cardContainer;
var cards = [];

var player1 = {};
var player2 = {};
var whoseTurn;

var p1NameCont;
var p2NameCont;

var gameStarted = false;

var currentPopUp;

var ready;

function setReadyStatus(){
    gameStarted = false;
    $("#gameContainerHandler").html('<canvas id="gameContainer" width="1000" height="700">Your Browser does not support Canvas</canvas>');
    canvas = document.getElementById("gameContainer");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    stage.enableDOMEvents(true);
    stage.mouseEventsEnabled = true;

    var line = new createjs.Shape();
    line.graphics.beginStroke("black").setStrokeStyle(1).beginFill("black").drawRoundRect(BOARD_WIDTH+20.5, 15.5, STAGE_WIDTH-BOARD_WIDTH-37, 120, 10);
    line.alpha = 0.2;

    stage.addChild(line);
    createjs.Ticker.addEventListener("tick", handleTick);

    $("#timerText").text("Autostart");
    $("#startGameBt").removeClass("enabled").addClass("disabled");

    if(gameType == "single") {
        showGamePopUp("loading", '<div class="popupContent"><img src="img/loader.gif"/> <br> Loading cards (<span id="loadingTime" ms="20000">20</span>)</div>', "Please Wait ...");
    }

    if(instructions) {
        $("#instructionsWin").jqxWindow("open");
        $('#instructionsWinTabs').jqxTabs('disableAt', 0);
        $('#instructionsWinTabs').jqxTabs('disableAt', 1);
        $('#instructionsWinTabs').jqxTabs('disableAt', 2);
        $('#instructionsWinTabs').jqxTabs('disableAt', 3);
        $('#instructionsWinTabs').jqxTabs('enableAt', 4);
        $('#instructionsWinTabs').jqxTabs('enableAt', 5);
        $("#instructionsWinTabs").jqxTabs('val', 4);
    }

    var params = {};
    params.category = category;
    params.topic = topic;
    params.color = color;
    params.totalAvgPageRank = totalAvgPageRank;
    params.totalAvgWeight = totalAvgWeight;
    params.totalCards = totalCards;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("ready", params, sfs.lastJoinedRoom) );
}

function handleTick(event) {
    if(!inited)
        updateLoadingScreen(event);
    else
        setTimer(event);
    stage.update();
}

function resetGameBoard() {
    $("#gameContainer").remove();
    createjs.Ticker.removeEventListener("tick", handleTick);
    canvas = null;
    stage = null;
    board = null;
    startWiki = null;
    $("#startGameBt").children(0).text("Start Game");
    $("#startGameBt").removeClass("enabled").addClass("disabled");
    $("#timerText").text("Autostart");
    $("#startStatusText").text("Click on 'Start Game' if you are ready!");
    $("#statusTextWrapper").css("color", "#333333");

    $(".gameBarControls").css("display", "none");
    $("#gameButtons").css("display", "none");
    $("#statusTextWrapper").css("display","none");
    $("#questionBox").css("display", "none");
    $("#feedbackWrapper").css("display", "none");
    $("#stackOverview").css("display", "none");
    $("#countCardsTop").css("display","none");

    $(".countdown").TimeCircles().stop();
    $(".opponentCountdown").TimeCircles().stop();
    $(".timeToStartEnd").TimeCircles().stop();
    $(".countdown").css("opacity", 0);
    $(".opponentCountdown").css("opacity", 0);
    gameChatAreaPn.jqxPanel('clearcontent');
    inited = false;
    inGame = false;
    gameStarted = false;
    cards = [];
    cardContainer = null;
    player1 = {};
    player2 = {};
    selectedCard = null;
    $("#closeGameBt").jqxButton({disabled:true, theme:theme});
    $("#joinGameBt").jqxButton({disabled:true, theme:theme});
    $("#createGameBt").jqxButton({disabled:false, theme:theme});
}

function initFirstPhase(data) {
    player1.id = sfs.mySelf.id;
    player1.name = sfs.mySelf.name;
    player1.mySelf = true;
    player1.stack = [0, 0, 0];

    player2.id = (data.p1i == sfs.mySelf.id ? data.p2i : data.p1i);
    player2.name = (data.p1i == sfs.mySelf.id ? data.p2n : data.p1n);
    player2.mySelf = false;
    player2.stack = [0, 0, 0];

    whoseTurn = data.t;

    if(inited == false){
        inited = true;
        ready = false;
        buildFirstPhaseUI(data.cardData, data.layouts);
    }
    removeGamePopUp();
    $("#gameButtons").css("display", "block");
    $("#stackOverview").css("display", "block");

    if(gameType != "single") {
        $(".gameBarControls").css("display", "block");
    }
    $("#startGameBt").removeClass("disabled").addClass("enabled");
    $(".timeToStartEnd").data('timer', 301).TimeCircles().restart();
}

function buildFirstPhaseUI(cards, layouts) {
    board = new createjs.Container();
    board.width = BOARD_WIDTH;
    board.height = BOARD_HEIGHT;
    stage.addChild(board);

    timeLeft = 301000; // 5 min + 1sec for first phase
    buildCards(cards, layouts);
}

function autostart() {
    onStartGameBtClick();
}

function onStartGameBtClick(evt) {
    if(instructions) {
        $("#instructionsWin").jqxWindow("open");
        $('#instructionsWinTabs').jqxTabs('disableAt', 4);
        $('#instructionsWinTabs').jqxTabs('disableAt', 5);
        $('#instructionsWinTabs').jqxTabs('enableAt', 6);
        $("#instructionsWinTabs").jqxTabs('val', 6);
    }
    if (typeof evt != 'undefined')
        evt.stopImmediatePropagation();
    $.each( cards, function( index, card ) {
        card.removeEventListener("click", showWikiPage);
        card.cursor = null;
    });
    if(startWiki !== null) {
        var endWiki = new Date();
        sfs.send( new SFS2X.Requests.System.ExtensionRequest("wikipedia", {time: endWiki-startWiki, when: "start", i: selectedCard.cardId}, sfs.lastJoinedRoom) );
    }
    $("#startGameBt").children(0).text("Waiting ...");
    $("#startStatusText").html("The opponent player is <span style ='color: red; font-weight: bold;'>NOT</span>ready to play!");
    $("#startGameBt").removeClass("enabled").addClass("disabled");
    $("#stackOverview").css("display", "none");
    var params = {};
    params.start = true;
    params.clicks = clicks;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("start", params, sfs.lastJoinedRoom) );
}

function startGame(params) {
    $('#lookupWiki').css('display', 'none');
    $('#stackOverview').css('display', 'none');
    $("#timerText").text("Game End");
    $("#startStatusText").text("Playing Mode: " + (gameType == "single" ? "Single Player" : gameType == "compete" ? "Defeat Your Enemy" : "The Will To Cooperate"));


    $.each( cards, function( index, card ) {
        card.removeChild(card.children[1]);
    });
    gameStarted = true;
    ready = true;
    $("#startGameBt").children(0).text("Is Running");
    buildNameContainers();
    shuffleCards();

    timeLeft = 901000; //15 min + 1 sec

    $(".timeToStartEnd").TimeCircles().destroy();
    $(".timeToStartEnd").data('timer', 901).TimeCircles({
        "start": true,
        "total_duration": 901,
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

}

function showResults(params) {
    var results = JSON.parse(params.results);
    console.log(results);


    results = $.grep(results, function (el, i) {
        if (el["user"] != sfs.mySelf.getVariable("id").value) {
            return false;
        }
        return true; // keep the element in the array
    });

    source =
    {
        localData: results,
        dataType: "json",
        dataFields:
            [
                { name: 'no', type: 'string' },
                { name: 'category', type: 'string' },
                { name: 'topic', type: 'string' },
                { name: 'name', type: 'string' },
                { name: 'property', type: 'string' },
                { name: 'correct', type: 'string' },
                { name: 'answerRight', type: 'string' },
                { name: 'answer', type: 'string' },
                { name: 'answerOptions', type: 'array' },
                { name: 'wikipedia', type: 'string' },
                { name: 'data', type: 'int' }
            ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    afterGameWinTable.jqxDataTable({source: dataAdapter, sortable: true});

    var gameCount = results.length;
    var rightCount = $.grep(results, function(e){ return e.correct == "true"; }).length;
    var wrongCount = gameCount - rightCount;
    var pointsEarned = params["points"]; 

    //var reason =(typeof params.n == 'undefined' ? "Game is Over" : "User " + params.n + " left the game ")
    var reason = "Game Is Over";
    var newTitle = "<strong>" + reason + " &#x27a0; Total Questions: " + gameCount + "  |  Right: " + rightCount +"  |  Wrong: " + wrongCount + "  |  Points earned: " + pointsEarned + "</strong>"
    afterGameWin.jqxWindow('setTitle', newTitle);
    afterGameWin.jqxWindow('open');
    afterGameWinTable.jqxDataTable('render');
}

function initAnswerDetails(id, row, element, rowinfo) {
    rowinfo.detailsHeight = 92;
    element.append($("<div style='margin-left: 20px;'></div>"));
    var nestedDataTable = $(element.children()[0]);

    console.log(row);
    var options = row.answerOptions;
    var data = [{"option1": options[0], "option2": options[1], "option3": options[2], "correct": row["answerRight"], "answer": row["answer"]}];

    var source =
    {
        localData: data,
        dataType: "array",
        dataFields:
            [
                { name: 'option1', type: 'string' },
                { name: 'option2', type: 'string' },
                { name: 'option3', type: 'string' },
                { name: 'correct', type: 'string' },
                { name: 'answer', type: 'string' }
            ]
    };

    var dataAdapter = new $.jqx.dataAdapter(source);
    nestedDataTable.jqxDataTable({
        width: 750,
        height: rowinfo.detailsHeight-2,
        source: dataAdapter,
        enableHover: false,
        selectionMode: 'custom',
        autoRowHeight: true,
        pageable: false,
        showHeader: true,
        columns: [
            {text: 'Option 1', dataField: 'option1', width: 250, align: 'center',
                cellsRenderer: function (row, column, value, rowData) {
                    var className = (value == rowData["correct"] ? "correct" : value == rowData["answer"] ? "wrong" : "undefined");
                    return '<div class="' + className +'"style="width: 100%; height=100%;">' + value +'</div>';
                }
            },
            {text: 'Option 2', dataField: 'option2', width: 250,align: 'center',
                cellsRenderer: function (row, column, value, rowData) {
                    var className = (value == rowData["correct"] ? "correct" : value == rowData["answer"] ? "wrong" : "undefined");
                    return '<div class="' + className +'"style="width: 100%; height=100%;">' + value +'</div>';
                }
            },
            {text: 'Option 3', dataField: 'option3', width: 250,align: 'center',
                cellsRenderer: function (row, column, value, rowData) {
                    var className = (value == rowData["correct"] ? "correct" : value == rowData["answer"] ? "wrong" : "undefined");
                    return '<div class="' + className +'"style="width: 100%; height=100%;">' + value +'</div>';
                }
            }
        ]
    });

    $(".correct").parent().addClass("correctCell");
    $(".wrong").parent().addClass("wrongCell");
    $(".undefined").parent().addClass("undefinedCell");

}

function destroyGame() {
    setView("lobby", true);
    if (sfs.lastJoinedRoom == null || sfs.lastJoinedRoom.name != LOBBY_ROOM_NAME)
        sfs.send(new SFS2X.Requests.System.LeaveRoomRequest());
    resetGameBoard();
}

function getBadges() {
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("getBadges") );
}

function setTimer(event) {
    timeLeft -= Math.floor(event.delta);
    if(timeLeft >= 0) {
        updateGameTimer(timeLeft);
    }
    else {
        if(!gameStarted) {
            console.log("The Game was started automatically!");
            autostart();
        }
    }
}

function buildNameContainers() {
    //left container
    p2NameCont = new createjs.Container();
    var pBG = new createjs.Shape();
    pBG.graphics.setStrokeStyle(1);
    pBG.graphics.beginStroke("orange");
    pBG.graphics.beginFill("lightgray");
    pBG.width = 150;
    pBG.height = 25;
    pBG.graphics.drawRoundRect(0, 0, pBG.width, pBG.height,12);
    pBG.cache(-2.5, -2.5, pBG.width+5, pBG.height+5);
    p2NameCont.addChild(pBG);
    p2NameCont.name = new createjs.Text(player2.name, "bold 14px Verdana", "#000000");
    p2NameCont.name.textAlign = "center";
    p2NameCont.name.x = (pBG.width)/2;
    p2NameCont.name.y = 3;
    p2NameCont.addChild(p2NameCont.name);
    p2NameCont.x = 28;
    p2NameCont.y = BOARD_HEIGHT-pBG.height-15

    stage.addChild(p2NameCont);

    //right container
    p1NameCont = new createjs.Container();
    var p2BG = new createjs.Shape();
    p2BG.graphics.setStrokeStyle(1);
    p2BG.graphics.beginStroke("blue");
    p2BG.graphics.beginFill("lightgray");
    p2BG.width = 150;
    p2BG.height = 25;
    p2BG.graphics.drawRoundRect(0, 0, pBG.width, pBG.height,12);
    p2BG.cache(-2.5, -2.5, pBG.width+5, pBG.height+5);
    p1NameCont.addChild(p2BG);
    p1NameCont.name = new createjs.Text(player1.name, "bold 14px Verdana", "#000000");
    p1NameCont.name.textAlign = "center";
    p1NameCont.name.x = p2NameCont.name.x;
    p1NameCont.name.y = p2NameCont.name.y;
    p1NameCont.addChild(p1NameCont.name);
    p1NameCont.x = BOARD_WIDTH-pBG.width-13;
    p1NameCont.y = BOARD_HEIGHT-pBG.height-15;

    stage.addChild(p1NameCont);
}

/**
 * Set the "Player's turn" status message
 */
function setStatusText(level, category, topic){
    var statusText;
    switch(level) {
        case 0:
            statusText = "Select a playing card from above to create a question."
            break;
        case 1:
            statusText = (myTurn() ? "It's your turn. Select a card to create a question for you and your opponent!" : "It's your opponent's turn. Get ready for the question!");
            break;
        case 2:
            statusText = "Category: " + category + " | Topic: " + topic;
            break;
    }
    $("#statusText").text(statusText);
}

function myTurn() {
    return (player1.id == whoseTurn);
}

function getCardDetails(event) {
    selectedCard = event.target.parent;
    var cardId = selectedCard.cardId;
    enableBoard(false);
    if(gameType == "single") {
        $("#statusText").text("Please answer the question below.");
    }
    else {
        $("#statusText").text("Please select a property from right for which you want to generate a question.");
    }
    var params = {};
    params.cardId = cardId;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("pickCard", params, sfs.lastJoinedRoom) );
}

function updateCountText(correct) {

}

function flip() {
    createjs.Tween.get(selectedCard, { loop: false })
        .to({ x: BOARD_WIDTH/2-5, y:BOARD_HEIGHT/2-14}, 700, createjs.Ease.getPowInOut(4))
        .call(function() {
            //if(myTurn()) {
                flipFrontwards();
            //}
            //else
            //    createjs.Tween.get(selectedCard, {loop: false})
            //        .to({alpha:1}, 1000);
        });
}

function flipFrontwards() {
    var backSide = selectedCard.children[0];
    var frontSide = selectedCard.children[1];
    createjs.Tween.get(backSide, {loop: false})
        .to({scaleX: 0}, 300)
        .call(function () {
            createjs.Tween.get(frontSide, {loop: false})
                .to({scaleX: 1, scaleY: 1}, 300)
                .call(nextForwardActionFunc);
        });
}

function flipBackwards() {
    var backSide = previousSelectedCard.children[0];
    var frontSide = previousSelectedCard.children[1];

    createjs.Tween.get(frontSide, { loop: false })
        .to({scaleX: 0, scaleY: 0}, 300)
        .call(function() {
            createjs.Tween.get(backSide, { loop: false })
                .to({scaleX: 1}, 300)
                .call(nextBackwardActionFunc);
        });
}

function nextForwardActionFunc() {
    if(typeof nextForwardAction != 'undefined') {
        if(nextForwardAction.localeCompare("openWikiPage") > -1) {
            var wikiUri = selectedCard.wikiUri.replace("en.wikipedia", "en.m.wikipedia");
            $('#lookupWiki').css('display', 'inline').attr('src', wikiUri);
            nextForwardAction = "";
        }
    }
    previousSelectedCard = selectedCard;
}

function nextBackwardActionFunc() {
    if(typeof nextBackwardAction != 'undefined') {
        if (nextBackwardAction.localeCompare("moveCardToPreviousPosition") > -1) {
            $.each(cards, function (index, card) {
                if (card.categoryId == previousSelectedCard.categoryId) {
                    if (card.id != previousSelectedCard.id) {
                        card.zIndex++;
                        card.x--;
                        card.y--;
                        card.initX--;
                        card.initY--;
                        card.offset++;
                    }
                    else {
                        card.zIndex = 0;
                        card.initX += card.offset;
                        card.initY += card.offset;
                        card.offset = 0;
                    }
                }
            });
            cardContainer.sortChildren(sortByZ);
            createjs.Tween.get(previousSelectedCard, {loop: false})
                .to({x: previousSelectedCard.initX, y: previousSelectedCard.initY}, 700, createjs.Ease.getPowInOut(4));

        }
    }

}

//------------------------------------
// Game Popup
//------------------------------------
/**
 * Show the Game PopUp
 */
function showGamePopUp(id, message, title){
    if(currentPopUp != undefined)
        removeGamePopUp();

    currentPopUp = $("#"+id+"GameWin");
    currentPopUp.jqxWindow('setTitle', title);
    currentPopUp.jqxWindow('setContent', message);
    currentPopUp.jqxWindow("open");
}

/**
 * Hide the Game PopUp
 */
function removeGamePopUp(){
    if(currentPopUp != undefined){
        currentPopUp.jqxWindow("close");
        currentPopUp = undefined;
    }
}