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
var category, topic, color, upperRank, lowerRank;

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
    canvas = document.getElementById("gameContainer");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    stage.mouseEventsEnabled = true;

    var line = new createjs.Shape();
    line.graphics.beginStroke("black").setStrokeStyle(1).beginFill("black").drawRoundRect(BOARD_WIDTH+20.5, 15.5, STAGE_WIDTH-BOARD_WIDTH-37, 120, 10);
    line.alpha = 0.2;

    stage.addChild(line);


    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
        if(!inited)
            updateLoadingScreen(event);
        else
            setTimer(event);
        stage.update();
    }

    $("#timerText").text("Autostart");
    $("#startGameBt").removeClass("enabled").addClass("disabled");

    if(gameType == "single")
        showGamePopUp("loading", '<div class="popupContent"><img src="img/loader.gif"/> <br> Loading cards (<span id="loadingTime" ms="45000">45</span>)</div>', "Please Wait ...");
    //$("#instructionsWin").jqxWindow("open");

    var params = {};
    params.category = category;
    params.topic = topic;
    params.color = color;
    params.upperRank = upperRank;
    params.lowerRank = lowerRank;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("ready", params, sfs.lastJoinedRoom) );
}

function resetGameBoard() {
    $(".timeToStartEnd").TimeCircles().destroy();
    $("#startGameBt").children(0).text("Start Game");
    $("#startGameBt").removeClass("disabled").addClass("enabled");
    $("#timerText").text("Autostart");
    $("#startStatusText").text("Click on 'Start Game' if you are ready!");

    $(".gameBarControls").css("display", "none");
    $("#gameButtons").css("display", "none");
    $("#statusTextWrapper").css("display","none");
    gameChatAreaPn.jqxPanel('clearcontent');
    inited = false;
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
    $(".timeToStartEnd").TimeCircles().restart();
}

function initSecondPhase() {
    //$(".gameBarControls").css("display", "block");
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

function onStartGameBtClick() {
    $.each( cards, function( index, card ) {
        card.removeEventListener("click", showWikiPage);
        card.cursor = null;
    });
    if(typeof startWiki != 'undefined') {
        var endWiki = new Date();
        sfs.send( new SFS2X.Requests.System.ExtensionRequest("wikipedia", {time: endWiki-startWiki, i: selectedCard.cardId}, sfs.lastJoinedRoom) );
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
    //if(params.start) {
        $('#lookupWiki').css('display', 'none');
        $('#stackOverview').css('display', 'none');
        $("#timerText").text("Game End");
        $("#startStatusText").text("");


        $.each( cards, function( index, card ) {
            card.removeChild(card.children[1]);
        });
        gameStarted = true;
        ready = true;
        $("#startGameBt").children(0).text("Is Running");
        buildNameContainers();
        shuffleCards();
        if(gameType == "single")
            setStatusText(0);
        else
            setStatusText(1);
        $("#statusTextWrapper").css("display","block");
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

function stopGame(params) {
    var results = JSON.parse(params.results);
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
                { name: 'wikipedia', type: 'string' }
            ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    afterGameWinTable.jqxDataTable({source: dataAdapter, sortable: true});

    var gameCount = results.length;
    var rightCount = $.grep(results, function(e){ return e.correct == "true"; }).length;
    var wrongCount = gameCount - rightCount;
    var pointsEarned = rightCount * 2 - wrongCount*1;

    var newTitle = "<strong>Game is Over &#x27a0; Total Questions: " + gameCount + "  |  Right: " + rightCount +"  |  Wrong: " + wrongCount + "  |  Points earned: " + pointsEarned + "</strong>"
    afterGameWin.jqxWindow('setTitle', newTitle);
    afterGameWin.jqxWindow('open');
    afterGameWinTable.jqxDataTable('render');
}

function destroyGame() {
    resetGameBoard();
    setView("lobby", true);
}

function setTimer(event) {
    timeLeft -= Math.floor(event.delta);
    if(timeLeft >= 0) {
        updateGameTimer(timeLeft);
    }
    else {
        if(!gameStarted) {
            trace("The Game was started automatically!");
            autostart();
        }
    }
}

function buildNameContainers() {
    //Player2
    p2NameCont = new createjs.Container();
    var pBG = new createjs.Shape();
    pBG.graphics.setStrokeStyle(1);
    pBG.graphics.beginStroke("black");
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

    if(gameType == "collaborate") {
        p2NameCont.x = 28;
        p2NameCont.y = BOARD_HEIGHT-pBG.height-15
    }
    else {
        p2NameCont.x = 28;
        p2NameCont.y = 15;
    }

    stage.addChild(p2NameCont);

    //Player2
    p1NameCont = new createjs.Container();
    var p2BG = pBG.clone();
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
            statusText = (myTurn() ? "It's your turn. Select a card to create a question for your opponent!" : "It's your opponent's turn. Get ready for his cards' question!");
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
    trace(selectedCard);
    if (!selectedCard.hasData) {
        selectedCard.hasData = true;
        var params = {};
        params.cardId = cardId;
        sfs.send( new SFS2X.Requests.System.ExtensionRequest("pickCard", params, sfs.lastJoinedRoom) );
    }
    else {
        if(gameType == "single") {
            var params = {};
            params.cardId = cardId;
            sfs.send( new SFS2X.Requests.System.ExtensionRequest("setPlayedCard", params, sfs.lastJoinedRoom) );
        }
            singePlayerOpenCard();
    }
}

function flip() {
    createjs.Tween.get(selectedCard, { loop: false })
        .to({ x: BOARD_WIDTH/2-5, y:BOARD_HEIGHT/2-14}, 700, createjs.Ease.getPowInOut(4))
        .call(function() {
            if(myTurn()) {
                flipFrontwards();
            }
            else
                createjs.Tween.get(selectedCard, {loop: false})
                    .to({alpha:1}, 1000);
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