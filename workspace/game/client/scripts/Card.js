var shifts;
var lookupWiki;
var startWiki = null;
var clicks;
var cardPropertiesContainer;

function buildCards(data, layouts) {
    clicks = 0;
    var zIndex = 0;
    cardContainer = new createjs.Container();
    console.log(data);
    for (var j=0;j < data.length;j++) {
        var stack = data[j];
        var cardsInStack = stack["cards"];
        var categoryName = stack["category"];
        var topicName = stack["topic"];
        $("#stackOverview").css("display", "block");
        $(".stacks:eq(" + j +")").children("span:eq(0)").text(categoryName);
        $(".stacks:eq(" + j +")").children("span:eq(1)").text(topicName);

        var offset=0;
        var card = null;
        $.each( cardsInStack, function( index, properties ) {
            card = new createjs.Container();
            card.zIndex = zIndex;
            zIndex++;
            card.errors = [];
            card.categoryId = j;
            card.cardId = properties["id"];
            card.data = properties["data"];
            card.categoryName = categoryName;
            card.topicName = topicName;
            card.playerId = properties["playerId"];
            card.wikiUri = properties["uri"];
            card.x = BOARD_WIDTH+CARD_BACKSIDE_WIDTH/2+24-offset;
            card.y = BOARD_HEIGHT/2-137-offset+(CARD_BACKSIDE_HEIGHT+SPACE_BETWEEN_CARDS)*j;
            card.initY = card.y;
            card.initX = card.x;
            card.offset = offset;

            var backSide = new createjs.Bitmap("http://tkutschk.dubhe.uberspace.de/game/client/img/cards/category0" + layouts[j] + "_small.png");
            backSide.regX = CARD_BACKSIDE_WIDTH/2;
            backSide.regY = CARD_BACKSIDE_HEIGHT/2;
            card.addChild(backSide);

            lookupWiki = $("#lookupWiki");

            var frontSide = new createjs.Shape();
            frontSide.graphics.beginStroke("black").setStrokeStyle(1).beginFill("white").drawRoundRect(15.5, 15.5, 685, 668, 10);
            frontSide.regX = (690)/2;
            frontSide.regY = (670)/2;
            frontSide.scaleX = 0;
            frontSide.scaleY = 0;
            card.addChild(frontSide);

            cards.push(card);
            cardContainer.addChild(card);
            offset++;
        });
        card.addEventListener("click", showWikiPage);
        card.cursor = "pointer";
    }
    board.addChild(cardContainer);
}

function showWikiPage(event) {
    if(startWiki !== null) {
        var endWiki = new Date();
        sfs.send( new SFS2X.Requests.System.ExtensionRequest("wikipedia", {time: endWiki-startWiki, when: "start", i: selectedCard.data}, sfs.lastJoinedRoom) );
        startWiki = new Date();
    }
    else {
        startWiki = new Date();
    }
    clicks++;
    selectedCard = event.target.parent;

    if(typeof previousSelectedCard != 'undefined') {
        lookupWiki.css('display', 'none');
        nextBackwardAction = "moveCardToPreviousPosition";
        flipBackwards();
    }
    executeFlip(event);
}

function executeFlip() {
    selectedCard.removeEventListener("click", showWikiPage);
    selectedCard.cursor = null;
    $.each( cards, function( index, card ) {
        if(card.categoryId == selectedCard.categoryId) {
            if(card.offset == (selectedCard.offset-1)) {
                card.addEventListener("click", showWikiPage);
                card.cursor = "pointer";
            }
        }
    });
    nextForwardAction = "openWikiPage";
    flip();
}

function shuffleCards() {
    if(gameType == "single")
        shuffle(cards);

    var waitTime = 0;
    shifts = 0;
    $.each( cards, function( index, card ) {
        card.removeEventListener("click", showWikiPage);
        card.zIndex = index;
        card.cursor = null;
        var randomWait = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        createjs.Tween.get(card, { loop: false })
            .wait(waitTime).to({ x: BOARD_WIDTH/2, y:BOARD_HEIGHT/2}, 100, createjs.Ease.getPowInOut(4));
        waitTime = waitTime + randomWait;
    });
    createjs.Tween.get().wait(2000).call(spreadCards);
}

function spreadCards() {
    cardContainer.sortChildren(sortByZ);
    var waitTime = 0;
    var leftSpace = (board.width-(NUMBER_OF_CATEGORIES-1)*100-86)/2;
    $.each( cards, function( index, card ) {
        var randomWait = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        var categoryId = card.categoryId;
        player2.stack[categoryId]++;
        var x = CARD_BACKSIDE_WIDTH/2 + 13 + leftSpace + 2 * categoryId + 100*categoryId-player2.stack[categoryId];
        var y = CARD_BACKSIDE_HEIGHT/2+20-player2.stack[categoryId];
        card.offset = player2.stack[categoryId];
        card.stackPosition = player2.stack[categoryId];
        card.initX = x;
        card.initY = y;
        createjs.Tween.get(card, { loop: false })
            .wait(waitTime).to({ x: x, y:y}, 100, createjs.Ease.getPowInOut(4));

        waitTime = waitTime + randomWait;
    });
    enableBoard(true);

    if(gameType == "single")
        setStatusText(0);
    else
        setStatusText(1);
    $("#statusTextWrapper").css("display","block");
    $("#countCardsTop").css("display","block");
}

function calculateFontSize(text, startPixel, font, width, height) {
    var txt = new createjs.Text( text , font, "black" );
    txt.lineWidth = width-4;
    var fontSize = startPixel+1;
    while (txt.getMeasuredHeight() > height-4) {
        fontSize = fontSize-1;
        txt.font = fontSize + "px Verdana";
        stage.update();
    }
    return [fontSize, txt.getMeasuredHeight()];
}

function fillCard(cardDetails) {
    var frontSide = new createjs.Container();
    frontSide.scaleX = 0;
    frontSide.scaleY = 0;
    frontSide.regX = CARD_FRONTSIDE_WIDTH/2;
    frontSide.regY = CARD_FRONTSIDE_HEIGHT/2;

    var color = "black";
    var shadow = new createjs.Shadow(color, 0, 0, 5);
    shadow.blur= 10;

    var frontSideShape = new createjs.Shape();
    frontSideShape.graphics.beginStroke("black").setStrokeStyle(1).beginFill("white").drawRoundRect(0.5, 0.5, CARD_FRONTSIDE_WIDTH, CARD_FRONTSIDE_HEIGHT, 10);
    frontSideShape.shadow = shadow;
    frontSide.addChild(frontSideShape);

    var charNumberContainer = new createjs.Container();
    charNumberContainer.x = charNumberContainer.y = 9.5;
    var charNumberShape = new createjs.Shape();
    charNumberShape.graphics.setStrokeStyle(1);
    charNumberShape.graphics.beginStroke("gray");
    charNumberShape.width = charNumberShape.height = 30;
    charNumberShape.graphics.drawRect(0, 0, charNumberShape.width, charNumberShape.height);
    charNumberContainer.addChild(charNumberShape);

    charNumberContainer.name = new createjs.Text(cardDetails["charNumber"], "bold 14px Verdana", "#000000");
    charNumberContainer.name.textAlign = "center";
    charNumberContainer.name.x = (charNumberShape.width)/2;
    charNumberContainer.name.y = 6;
    charNumberContainer.addChild(charNumberContainer.name);
    frontSide.addChild(charNumberContainer);

    var cardCategoryContainer = new createjs.Container();
    cardCategoryContainer.x = charNumberShape.width + 10;
    cardCategoryContainer.y = charNumberContainer.y;
    var cardCategoryShape = new createjs.Shape();
    cardCategoryShape.graphics.setStrokeStyle(1);
    cardCategoryShape.graphics.beginStroke("gray");
    cardCategoryShape.width = CARD_FRONTSIDE_WIDTH - charNumberShape.width - 20;
    cardCategoryShape.height = charNumberShape.height;
    cardCategoryShape.graphics.drawRect(0, 0, cardCategoryShape.width, cardCategoryShape.height);
    cardCategoryContainer.addChild(cardCategoryShape);

    var font = calculateFontSize(cardDetails["topic"], 14, "italic 14px Verdana", cardCategoryShape.width-10, 30);

    cardCategoryContainer.name = new createjs.Text(cardDetails["topic"], "italic " + font[0] + "px Verdana", "#000000");
    cardCategoryContainer.name.textAlign = "center";
    cardCategoryContainer.name.lineWidth = cardCategoryShape.width-10;
    cardCategoryContainer.name.x = cardCategoryShape.width/2;
    cardCategoryContainer.name.y = (30-font[1])/2-2;
    cardCategoryContainer.addChild(cardCategoryContainer.name);
    frontSide.addChild(cardCategoryContainer);

    var cardImageContainer = new createjs.Container();
    cardImageContainer.x = charNumberContainer.x;
    cardImageContainer.y = charNumberContainer.y + charNumberShape.height + 10;

    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = cardDetails.image;

    $(img).one('load',function(){
        var orgWidth = img.width;
        var orgHeight = img.height;
        var scale = 120 / orgHeight;
        var shape = new createjs.Bitmap(img);
        shape.scaleX = scale;
        shape.scaleY = scale;
        shape.x = (charNumberShape.width + cardCategoryShape.width)/2-(orgWidth*scale)/2;
        shape.y = 0;
        cardImageContainer.addChild(shape);

     });
    frontSide.addChild(cardImageContainer);

    font = calculateFontSize(cardDetails["name"], 13, "bold 13px Verdana", cardCategoryShape.width+charNumberShape.width, 25);

    var cardNameContainer = new createjs.Container();
    cardNameContainer.x = charNumberContainer.x;
    cardNameContainer.y = cardImageContainer.y + 120 + (25-font[1])/2;
    cardNameContainer.name = new createjs.Text(cardDetails["name"], "bold " + font[0] +"px Verdana", "#000000");
    cardNameContainer.name.textAlign = "center";
    cardNameContainer.name.x = (charNumberShape.width + cardCategoryShape.width)/2;
    cardNameContainer.name.y = 0;

    font = calculateFontSize(cardDetails["category"], 10, "10px Verdana", cardCategoryShape.width+charNumberShape.width, 25);

    cardNameContainer.category = new createjs.Text(cardDetails["category"], font[0] + "px Verdana", "#000000");
    cardNameContainer.category.textAlign = "center";
    cardNameContainer.category.x = cardNameContainer.name.x;
    cardNameContainer.category.y = 15;
    cardNameContainer.addChild(cardNameContainer.name);
    cardNameContainer.addChild(cardNameContainer.category);

    frontSide.addChild(cardNameContainer);

    var top = cardNameContainer.y+40;
    var row=0;
    var blurFilter = new createjs.BlurFilter(20, 5, 1);
    var bounds = blurFilter.getBounds();
    var properties = [];
    cardPropertiesContainer = [];

    for (row; row < NUMBER_OF_PROPERTIES_PER_CARD; row++) {
        var cardPropertyContainer = new createjs.Container();
        var cardPropertyShape = new createjs.Shape();
        cardPropertyContainer.x = charNumberContainer.x;
        cardPropertyContainer.y = top + row*36;
        cardPropertyShape.graphics.setStrokeStyle(1);
        cardPropertyShape.graphics.beginStroke("gray");
        var propertyBackground = (row%2 == 0 ? "#c4c4c4" : "#e9e9e9");
        cardPropertyShape.graphics.beginFill(propertyBackground);
        cardPropertyShape.overColor = "#3281FF";
        cardPropertyShape.outColor = propertyBackground;
        cardPropertyShape.width = CARD_FRONTSIDE_WIDTH - 20;
        cardPropertyShape.height = 36;
        cardPropertyShape.graphics.drawRect(0, 0, cardPropertyShape.width, cardPropertyShape.height);
        cardPropertyContainer.addChild(cardPropertyShape);

        var property = cardDetails["properties"][row];
        var propertyText = Object.keys(property)[0];
        var answers = property[Object.keys(property)[0]];

        cardPropertyContainer.property = new createjs.Text(propertyText, "bold 12px Verdana", "#000000");
        cardPropertyContainer.property.textAlign = "left";
        cardPropertyContainer.property.x = 3;
        cardPropertyContainer.property.y = 10;

        cardPropertyContainer.value = new createjs.Text(answers[3], "12px Verdana", "#000000");
        cardPropertyContainer.value.textAlign = "right";
        cardPropertyContainer.value.lineWidth = 90;
        cardPropertyContainer.value.x = cardPropertyShape.width-3;
        cardPropertyContainer.value.y = 8;

        var propertyData = new Object;
        propertyData[propertyText] = answers.slice(0,3);
        properties.push(propertyData);

        cardPropertyContainer.value.filters = [blurFilter];
        cardPropertyContainer.value.cache(-80+bounds.x, -0.5+bounds.y, 80+bounds.width, 22+bounds.height);

        if(gameType != "single" && myTurn()) {
            cardPropertyContainer.cursor = "pointer";
            cardPropertyContainer.addEventListener("rollover", changeBackground);
            cardPropertyContainer.addEventListener("rollout", changeBackground);
            cardPropertyContainer.addEventListener("click", showQuestion);
            cardPropertiesContainer.push(cardPropertyContainer);
        }
        cardPropertyContainer.addChild(cardPropertyContainer.property);
        cardPropertyContainer.addChild(cardPropertyContainer.value);

        frontSide.addChild(cardPropertyContainer);
    }

    /* Get the selected card on multiplayer version to know which card to open */
    if(gameType != "single" && !myTurn()) {
        $.each(cards, function (index, card) {
            if (card.cardId == cardDetails.id) {
                selectedCard = card;
            }
        });
    }
    selectedCard.properties = properties;
    selectedCard.addChild(frontSide);
}

function changeBackground(event) {
    var backgroundShape = event.target.children[0];
    var backgroundColor = (event.type === "rollover" ? backgroundShape.overColor : backgroundShape.outColor);
    backgroundShape.graphics.clear().beginStroke("gray").beginFill(backgroundColor).drawRect(0, 0, backgroundShape.width, backgroundShape.height).endFill();
}

function showAnswers(rightAnswers) {
    var propertyFields = selectedCard.children[1].children.slice(5,9);
    console.log(rightAnswers);
    $.each(propertyFields, function (index, propertyField) {
        var answerField = propertyField.children[2];
        var answerFieldProperty = "http://dbpedia.org/ontology/" + propertyField.property.text;
        $.each(rightAnswers, function (index, property) {
            var propertyCompare = Object.keys(property)[0];
            var rightAnswer = property[Object.keys(property)[0]];
            if(answerFieldProperty == propertyCompare) {
                var font = calculateFontSize(rightAnswer, 12, "12px Verdana", 90, 36);
                answerField.text = rightAnswer;
                answerField.font = font[0] + "px Verdana";
                answerField.y = (36-font[1])/2-2;
            }
        });

        delete answerField.filters;
        answerField.updateCache();
    });
    stage.update();

}

function sortByZ(a,b) {
    if (a.zIndex < b.zIndex) return -1;
    if (a.zIndex > b.zIndex) return 1;
    return 0;
}