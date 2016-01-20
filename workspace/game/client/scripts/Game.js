var STAGE_WIDTH = 1000;
var BOARD_WIDTH = 700;
var BOARD_HEIGHT = 700;
var CARD_BACKSIDE_WIDTH = 80;
var CARD_BACKSIDE_HEIGHT = 114;
var SPACE_BETWEEN_CARDS = 10;
var CARD_FRONTSIDE_WIDTH = 240;
var CARD_FRONTSIDE_HEIGHT = 342;
var NUMBER_OF_CATEGORIES = 3;
var NUMBER_OF_CARDS_PER_CATEGORY = 6;
var NUMBER_OF_PROPERTIES_PER_CARD = 4;
var BUTTON_WIDTH = 100;
var BUTTON_HEIGHT = 25;

//game variables
var gameType = "single";
var multiPlayer = false;
var category, topic, upperRank, lowerRank;

var previousSelectedCard;
var selectedCard;

var nextForwardAction;
var nextBackwardAction;

// Vars
var inited = false;
var canvas;
var stage;
var board;

var cardContainer;
var cards = [];

var player1 = {};
var player2 = {};
var whoseTurn;

var p1NameCont;
var p2NameCont;

var gameStarted = false;

var timerTF;
var statusTF;
var startButton;

var currentPopUp;

var ready;

function setReadyStatus(){
    gameStarted = false;
    canvas = document.getElementById("gameContainer");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    stage.mouseEventsEnabled = true;
    var boardBackground = new createjs.Bitmap("http://tkutschk.dubhe.uberspace.de/game/client/img/background/LAUAN.jpg");
    stage.addChild(boardBackground);
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
        if(!gameStarted & gameType == "single")
            updateLoadingScreen(event);
        else if(inited)
            setTimer(event);
        stage.update();
    }

    resetGameBoard();

    var message = "Waiting for other players ...";
    if(gameType == "single") {
        showGamePopUp("wait", '<div class="popupContent"><img src="img/loader.gif"/> <br> Loading cards (<span id="loadingTime" ms="30000">30</span>)</div>', "Please Wait ...");
    }


    var params = {};
    params.category = category;
    params.topic = topic;
    params.upperRank = upperRank;
    params.lowerRank = lowerRank;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("ready", params, sfs.lastJoinedRoom) );
}

function resetGameBoard() {
    $(".gameBarControls").css("display", "none");
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
}

function initSecondPhase() {
    $(".gameBarControls").css("display", "block");
}

function buildFirstPhaseUI(cards, layouts) {
    board = new createjs.Container();
    var boardBG = new createjs.Shape();
    boardBG.graphics.beginStroke("black").setStrokeStyle(3);
    boardBG.graphics.drawRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    boardBG.width = BOARD_WIDTH;
    boardBG.height = BOARD_HEIGHT;
    boardBG.cache(0, 0, boardBG.width, boardBG.height);

    board.addChild(boardBG);
    board.width = BOARD_WIDTH;
    board.height = BOARD_HEIGHT;
    buildTimer(1800000);
    buildCards(cards, layouts);
    buildStartGameGroup();

    stage.addChild(board);
}

function setStartStatus() {
    var params = {};
    params.start = true;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("start", params, sfs.lastJoinedRoom) );
    startButton.removeEventListener("click", setStartStatus);
    startButton.name.text = "Waiting ...";
    startButton.cursor = null;
    startButton.children[0].graphics.clear().beginFill("gray").drawRoundRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 5).endFill();
}

function startGame(params) {
    if(params.start) {
        $('#lookupWiki').css('display', 'none');
        $.each( cards, function( index, card ) {
            card.removeChild(card.children[1]);
        });
        gameStarted = true;
        ready = true;
        startButton.visible = false;
        buildNameContainers();
        buildStatusField();
        shuffleCards();
        setStatusText(1);
        timerTF.ms = 1800000; //30 min = 18.000.000 ms
    }
    else {
        startButton.waitingFor.text = startButton.waitingFor.text.replace("NOT ", "");
        trace(params);
    }

}

function buildTimer(milliseconds) {
    timerTF = new createjs.Text("Time left: 180 seconds", "bold 14px Verdana", "#000000");
    timerTF.textAlign = "center";
    timerTF.x = STAGE_WIDTH-(STAGE_WIDTH-BOARD_WIDTH)/2;
    timerTF.y = 20;
    timerTF.ms = milliseconds;
    stage.addChild(timerTF);
}

function setTimer(event) {
    timerTF.ms -= Math.floor(event.delta);
    if(timerTF.ms >= 0) {
        var min = Math.floor((timerTF.ms / (1000 * 60))) % 60;
        var sec = Math.floor((timerTF.ms / 1000)) % 60;
        min = (min.toString().length == 1 ? "0" + min : min);
        sec = (sec.toString().length == 1 ? "0" + sec : sec);
        timerTF.text = "Time left: " + min + ":" + sec;
    }
    else {
        if(!gameStarted)
            setStartStatus();
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

    p2NameCont.x = 20;
    p2NameCont.y = 20;
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
    p1NameCont.x = BOARD_WIDTH-pBG.width-20;
    p1NameCont.y = BOARD_HEIGHT-pBG.height-20;

    stage.addChild(p1NameCont);
}
function buildStatusField() {
    statusTF = new createjs.Text("Hello World", "bold 14px Verdana", "#000000");
    statusTF.textAlign = "center";
    statusTF.x = BOARD_WIDTH/2;
    statusTF.y = 145;
    stage.addChild(statusTF);
}

function buildStartGameGroup() {
    startButton = new createjs.Container();
    var pBG = new createjs.Shape();
    pBG.graphics.setStrokeStyle(1);
    pBG.graphics.beginStroke("black");
    pBG.graphics.beginFill("orange");
    pBG.width = 100;
    pBG.height = 25;
    pBG.graphics.drawRoundRect(0, 0, pBG.width, pBG.height,5);
    pBG.cache(-2.5, -2.5, pBG.width+5, pBG.height+5);
    startButton.addChild(pBG);
    startButton.name = new createjs.Text("Start Game", "bold 14px Verdana", "#000000");
    startButton.name.textAlign = "center";
    startButton.name.x = (pBG.width-5)/2;
    startButton.name.y = 3;
    startButton.addChild(startButton.name);
    if(multiPlayer) {
        startButton.waitingFor = new createjs.Text("Player '" + player2.name + "' is NOT ready!", "10px Verdana", "#000000");
        startButton.waitingFor.textAlign = "center";
        startButton.waitingFor.x = startButton.name.x;
        startButton.waitingFor.y = startButton.name.y + pBG.height + 10;
        startButton.addChild(startButton.waitingFor);
    }
    startButton.x = STAGE_WIDTH-(STAGE_WIDTH-BOARD_WIDTH)/2-pBG.width/2;
    startButton.y = 60;
    startButton.cursor = "pointer";
    startButton.addEventListener("click", setStartStatus);
    stage.addChild(startButton);



}

/**
 * Set the "Player's turn" status message
 */
function setStatusText(level){
    if(level == 1) {
        statusTF.text = (myTurn()) ? "It's your turn. Select a card to create a question for your opponent!" : "It's your opponent's turn. Get ready for his cards' question!";
    }
}

function myTurn() {
    return (player1.id == whoseTurn);
}

/**
 * Enable board click
 */
function enableBoard(){
    $.each( cards, function( index, card ) {
        card.topCard = false;
        if(card.playerId != player1.id) {
            //if(card.stackPosition == player2.stack[card.categoryId]) { //TODO: enable again!!!!!!!!!!!!!!!!!!!
                if (sfs.mySelf.id == whoseTurn) {
                    card.addEventListener("click", getCardDetails);
                    card.cursor = "pointer";
                    card.topCard = true;
                }
                else {
                    card.cursor = "not-allowed";
                    card.topCard = true;
                }
            //}
        }
        else {
            card.cursor = "not-allowed";
        }
    });
}

function getCardDetails(event) {
    selectedCard = event.target.parent;
    var cardId = selectedCard.cardId;
    trace(selectedCard);
    $.each( cards, function( index, card ) {
        if(card.topCard) {
            //card.removeEventListener("click", getCardDetails); //TODO: enable again
            if(card.cardId == cardId) {
                card.cursor = null;
            }
            else
                card.cursor = "not-allowed";
        }
        else if(card.zIndex == (selectedCard.zIndex-1) && card.categoryId == selectedCard.categoryId) {
            card.cursor = "not-allowed";
        }
    });
    var params = {};
    params.cardId = cardId;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("pickCard", params, sfs.lastJoinedRoom) );
}

function flip() {
    createjs.Tween.get(selectedCard, { loop: false })
        .to({ x: BOARD_WIDTH/2, y:BOARD_HEIGHT/2}, 700, createjs.Ease.getPowInOut(4))
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

    //disabler.visible = true;

    currentPopUp = $("#"+id+"GameWin");
    currentPopUp.jqxWindow('setTitle', title);
    currentPopUp.jqxWindow('setContent', message);
    currentPopUp.jqxWindow("open");
    //currentPopUp.jqxWindow("move", canvas.offsetLeft, (BOARD_HEIGHT/2) - (currentPopUp.jqxWindow("height") / 2));
    //currentPopUp.children(".content").children(".firstRow").children(".message").html(message);
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