var shifts;
//var clickedCard;

function buildCards(data, layouts) {
    var zIndex = 0;
    cardContainer = new createjs.Container();
    for (var j=0;j < data.length;j++) {
        var stack = data[j];
        var cardsInStack = stack.cards;
        var categoryName = stack.category;
        var offset=0;
        var card = null;
        $.each( cardsInStack, function( index, properties ) {
            card = new createjs.Container();
            card.zIndex = zIndex;
            zIndex++;
            card.categoryId = j;
            card.cardId = properties.id;
            card.categoryName = categoryName;
            card.playerId = properties.playerId;
            card.wikiUri = properties.uri;
            //card.y = BOARD_HEIGHT/2-CARD_BACKSIDE_HEIGHT+(CARD_BACKSIDE_HEIGHT+SPACE_BETWEEN_CARDS)*j-offset;
            //card.x = BOARD_WIDTH+CARD_BACKSIDE_WIDTH/2+10-offset;
            card.x = BOARD_WIDTH+CARD_BACKSIDE_WIDTH/2+24+(CARD_BACKSIDE_WIDTH+SPACE_BETWEEN_CARDS)*j-offset;
            card.y = BOARD_HEIGHT/2-offset-70;
            card.initY = card.y;
            card.initX = card.x;
            card.offset = offset;


            var backSide = new createjs.Bitmap("http://tkutschk.dubhe.uberspace.de/game/client/img/cards/category0" + layouts[j] + "_small.png");
            backSide.regX = CARD_BACKSIDE_WIDTH/2;
            backSide.regY = CARD_BACKSIDE_HEIGHT/2;
            card.addChild(backSide);

            var frontSide = new createjs.Shape();
            frontSide.graphics.beginStroke("black").setStrokeStyle(1).beginFill("white").drawRoundRect(0.5, 0.5, $("#lookupWiki").width()+20, $("#lookupWiki").height()+20, 10);
            frontSide.regX = ($("#lookupWiki").width()+20)/2;
            frontSide.regY = ($("#lookupWiki").height()+20)/2;
            frontSide.scaleX = 0;
            frontSide.scaleY = 0;
            frontSide.cache(0,0,$("#lookupWiki").width()+20, $("#lookupWiki").height()+20);
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
    selectedCard = event.target.parent;
    if(typeof previousSelectedCard != 'undefined') {
        $('#lookupWiki').css('display', 'none');
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
    shuffle(cards);

    var waitTime = 0;
    shifts = 0;
    $.each( cards, function( index, card ) {
        card.removeEventListener("click", showWikiPage);
        card.zIndex = index;
        card.cursor = null;
        var randomWait = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        createjs.Tween.get(card, { loop: false })
            .wait(waitTime).to({ x: BOARD_WIDTH/2, y:BOARD_HEIGHT/2}, 100, createjs.Ease.getPowInOut(4))
            .call(shiftComplete);
        waitTime = waitTime + randomWait;
    });
}

function shiftComplete() {
    shifts++;
    if(shifts == NUMBER_OF_CATEGORIES*NUMBER_OF_CARDS_PER_CATEGORY) {
        cardContainer.sortChildren(sortByZ);
        trace(cards);
        spreadCards();
        enableBoard(true);
    }
}

function spreadCards() {
    var waitTime = 0;
    var leftSpace = (board.width-(NUMBER_OF_CATEGORIES-1)*100-86)/2;
    var stackP1 = {0:0,1:0,2:0};
    var stackP2 = {0:0,1:0,2:0};
    $.each( cards, function( index, card ) {
        var randomWait = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        var categoryId = card.categoryId;
        var x;
        var y;
        if(card.playerId != sfs.mySelf.id) { //shift card to top
            x = CARD_BACKSIDE_WIDTH/2 + leftSpace + 2 * categoryId + 100*categoryId-stackP1[categoryId];
            y = CARD_BACKSIDE_HEIGHT/2+20-stackP1[categoryId];
            if(card.playerId == sfs.mySelf.id)
                stackP1[categoryId]++;
        } else {
            x = CARD_BACKSIDE_WIDTH/2 + leftSpace + 2 * categoryId + 100*categoryId-stackP2[categoryId];
            y = board.height-CARD_BACKSIDE_HEIGHT/2-20-stackP2[categoryId];
            if(card.playerId == sfs.mySelf.id)
                stackP2[categoryId]++;
        }
        createjs.Tween.get(card, { loop: false })
            .wait(waitTime).to({ x: x, y:y}, 100, createjs.Ease.getPowInOut(4))
            .call(setOpacity);
        waitTime = waitTime + randomWait;
    });
}

function setOpacity(event) {
    var card = event.target;
    if(card.playerId != sfs.mySelf.id)
        createjs.Tween.get(card, { loop: false })
            .to({alpha:0.1}, 1000);
    else
        card.cursor = "pointer";
}

function fillCard(cardDetails) {
    trace(cardDetails);
    var frontSide = new createjs.Container();
    frontSide.scaleX = 0;
    frontSide.scaleY = 0;
    frontSide.regX = CARD_FRONTSIDE_WIDTH/2;
    frontSide.regY = CARD_FRONTSIDE_HEIGHT/2;

    var frontSideShape = new createjs.Shape();
    frontSideShape.graphics.beginStroke("black").setStrokeStyle(1).beginFill("white").drawRoundRect(0.5, 0.5, CARD_FRONTSIDE_WIDTH, CARD_FRONTSIDE_HEIGHT, 10);
    frontSide.addChild(frontSideShape);

    var charNumberContainer = new createjs.Container();
    charNumberContainer.x = charNumberContainer.y = 9.5;
    var charNumberShape = new createjs.Shape();
    charNumberShape.graphics.setStrokeStyle(1);
    charNumberShape.graphics.beginStroke("gray");
    charNumberShape.width = charNumberShape.height = 30;
    charNumberShape.graphics.drawRect(0, 0, charNumberShape.width, charNumberShape.height);
    charNumberContainer.addChild(charNumberShape);

    charNumberContainer.name = new createjs.Text(cardDetails.charNumber, "bold 14px Verdana", "#000000");
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
    var pixel = 14;
    var y = 5;
    var category = cardDetails.topic;
    trace(category.length);
    if(category.length>24 && category.length<46) {
        y = 2;
    }
    else if(category.length>=46) {
        pixel = 10;
        y = 3;
    }
    cardCategoryContainer.name = new createjs.Text(cardDetails.topic, "italic " + pixel + "px Verdana", "#000000");
    cardCategoryContainer.name.textAlign = "center";
    cardCategoryContainer.name.lineWidth = cardCategoryShape.width-10;
    cardCategoryContainer.name.x = cardCategoryShape.width/2;
    cardCategoryContainer.name.y = y;
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

    var cardNameContainer = new createjs.Container();
    cardNameContainer.x = charNumberContainer.x;
    cardNameContainer.y = cardImageContainer.y + 120 + 10;
    cardNameContainer.name = new createjs.Text(cardDetails.name, "bold 13px Verdana", "#000000");
    cardNameContainer.name.textAlign = "center";
    cardNameContainer.name.x = (charNumberShape.width + cardCategoryShape.width)/2;
    cardNameContainer.name.y = 0;
    cardNameContainer.category = new createjs.Text(cardDetails.category, "10px Verdana", "#000000");
    cardNameContainer.category.textAlign = "center";
    cardNameContainer.category.x = cardNameContainer.name.x;
    cardNameContainer.category.y = 15;
    cardNameContainer.addChild(cardNameContainer.name);
    cardNameContainer.addChild(cardNameContainer.category);

    frontSide.addChild(cardNameContainer);

    var top = cardNameContainer.y+40;
    var row=0;
    for (row; row < NUMBER_OF_PROPERTIES_PER_CARD; row++) {
        var cardPropertyContainer = new createjs.Container();
        var cardPropertyShape = new createjs.Shape();
        cardPropertyContainer.x = charNumberContainer.x;
        cardPropertyContainer.y = top + row*22;
        cardPropertyShape.graphics.setStrokeStyle(1);
        cardPropertyShape.graphics.beginStroke("gray");
        var propertyBackground = (row%2 == 0 ? "#c4c4c4" : "#e9e9e9");
        cardPropertyShape.graphics.beginFill(propertyBackground);
        cardPropertyShape.width = CARD_FRONTSIDE_WIDTH - 20;
        cardPropertyShape.height = 22;
        cardPropertyShape.graphics.drawRect(0, 0, cardPropertyShape.width, cardPropertyShape.height);
        cardPropertyContainer.addChild(cardPropertyShape);

        var property = cardDetails.properties[row];
        var propertyText = "";
        var valueText = "";
        if (typeof property != 'undefined') {
            propertyText = Object.keys(property)[0];
            valueText = property[Object.keys(property)[0]];
        }
        trace(property);
        cardPropertyContainer.property = new createjs.Text(propertyText, "bold 12px Verdana", "#000000");
        cardPropertyContainer.property.textAlign = "left";
        cardPropertyContainer.property.x = 3;
        cardPropertyContainer.property.y = 3;
        cardPropertyContainer.value = new createjs.Text(valueText, "12px Verdana", "#000000");
        cardPropertyContainer.value.textAlign = "right";
        cardPropertyContainer.value.x = cardPropertyShape.width-3;
        cardPropertyContainer.value.y = 3;
        cardPropertyContainer.addChild(cardPropertyContainer.property);
        cardPropertyContainer.addChild(cardPropertyContainer.value);

        frontSide.addChild(cardPropertyContainer);
    }


    selectedCard.addChild(frontSide);
}


function sortByZ(a,b) {
    if (a.zIndex < b.zIndex) return -1;
    if (a.zIndex > b.zIndex) return 1;
    return 0;
}

/*
 Fisher-Yates (aka Knuth) Shuffle
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}