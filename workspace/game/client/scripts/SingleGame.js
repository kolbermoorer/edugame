function updateLoadingScreen(event) {
    var time = Math.floor($("#loadingTime").attr("ms"));
    time = time - Math.floor(event.delta);
    if(time >= 0) {
        var sec = Math.floor((time / 1000)) % 60;
        $("#loadingTime").attr("ms", time )
        $("#loadingTime").text(sec);
    }
    else {
    }
}

function singePlayerOpenCard() {
    var backSide = selectedCard.children[0];
    var frontSide = selectedCard.children[1];

    createjs.Tween.get(selectedCard, { loop: false })
        .to({ x: BOARD_WIDTH+20+CARD_FRONTSIDE_WIDTH/2, y: 152+CARD_FRONTSIDE_HEIGHT/2}, 700, createjs.Ease.getPowInOut(4))
        .call(function() {
            createjs.Tween.get(backSide, {loop: false})
                .to({scaleX: 0}, 300)
                .call(function () {
                    createjs.Tween.get(frontSide, {loop: false})
                        .to({scaleX: 1, scaleY: 1}, 300)
                        .call(showQuestion);
                });
        });
}

function singlePlayerCreateQuestion() {
    var allProperties = selectedCard.properties;
    var notInErrorList = [];
    $.each(allProperties, function (index, property) {
        var propertyName = Object.keys(property)[0];
        if(jQuery.inArray( propertyName, selectedCard.errors ) > 0) {
            selectedCard.properties.splice(index,1); //TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
    });

    var propertyData = shuffle(selectedCard.properties)[0];
    var property = Object.keys(propertyData)[0];
    var answers = propertyData[Object.keys(propertyData)[0]];

    var cardId = selectedCard.id;
    var pixel = "14px";
    var top = 200;

    if(property.length > 25)
        pixel = "13px";

    $("#questionTitle").css("font-size", pixel);
    $('.answerFieldsContent').css("top", "16px");
    $("#questionTitleProperty").text(property); //questionData["propertyQuestion"]);
    $("#questionBox").css("display", "block");

    for(var index = 1; index <= answers.length; index++) { //questionData["answers"]
        createAnswer(answers[index-1], index, cardId, property);
    }

    $(".countdown").css("opacity", 1);
    $('.answerFields').addClass("enabled");
    $("#errorAnswer").css("display", "block");


    $("#ratingText").text("How would you rate the quality of this question?");
    $("#ratingTable").css("display", "block");
    /* build rating scale */
    $("#jqxRating").remove();
    $( "#jqxWidget" ).append( "<div id='jqxRating'></div>" );
    ratingStars = $("#jqxRating").jqxRating({ width: 100, height: 18, singleVote:true, theme: theme});
    ratingStars.on('change', function (event) {
        $(".jqx-rating-image").removeClass("ratingEnabled");
        var value = event.value;
        if(value > 0)
            onSendFeedbackBtClick(value);
    });
    $(".jqx-rating-image").addClass("ratingEnabled");
    $(".answerFields").css("background", "lightgray");
    $(".answerFields").removeClass("hasImpact");
    $(".answerFields").css("opacity", 1);
    $(".answerFields").css("border", "4px double #8b9798");
    $(".countdown").TimeCircles().restart();
    answerTimeStart = new Date();
}

function singlePlayerHandleMove(answerCorrect, error) {
    previousSelectedCard = selectedCard;
    flipBackwards();
    if(!answerCorrect && !error) { //lost the card, send to top
        $.each(cards, function (index, card) {
            if(card.playerId != player1.id && card.categoryId == previousSelectedCard.categoryId) {
                if (card.id != previousSelectedCard.id) {
                    card.zIndex++;
                    card.stackPosition++;
                    card.x--;
                    card.y--;
                    card.initX--;
                    card.initY--;
                    card.offset++;
                }
                else {
                    card.zIndex = 0;
                    card.stackPosition = 1;
                    card.initX += card.offset;
                    card.initY += card.offset;
                    card.offset = 0;
                }
            }
        });
    }
    else { //win the card, send to bottom
        player1.stack[previousSelectedCard.categoryId]++;
        player2.stack[previousSelectedCard.categoryId]--;
        previousSelectedCard.playerId = player1.id;
        previousSelectedCard.initY = board.height-CARD_BACKSIDE_HEIGHT/2-15;
        $.each(cards, function (index, card) {
            if (card.categoryId == previousSelectedCard.categoryId && card.playerId == player1.id) {
                if (card.id != previousSelectedCard.id) {
                    card.zIndex--;
                    card.stackPosition--;
                }
                else {
                    card.zIndex = 0;
                    card.stackPosition = 0;
                }
            }
        });
    }
    cardContainer.sortChildren(sortByZ);
    createjs.Tween.get(previousSelectedCard, {loop: false})
        .to({x: previousSelectedCard.initX, y: previousSelectedCard.initY}, 700, createjs.Ease.getPowInOut(4));

    stage.update();
    enableBoard(true);
}

/**
 * Enable board click
 */
function enableBoard(enable){
    $.each( cards, function( index, card ) {
        card.topCard = false;
        if(card.playerId == 999 && myTurn()) {
            if(card.stackPosition == player2.stack[card.categoryId]) {
                if(enable) {
                    card.addEventListener("click", getCardDetails);
                    card.cursor = "pointer";
                    card.topCard = true;
                    card.addEventListener("rollover", onRollOverCard);
                    card.addEventListener("rollout", onRollOutCard);
                }
                else {
                    card.removeEventListener("click", getCardDetails);
                    card.cursor = "default";
                    card.topCard = true;
                    card.removeEventListener("rollover", onRollOverCard);
                    card.removeEventListener("rollout", onRollOutCard);
                }
            }
        }
        else {
            card.cursor = "default"; ///"not-allowed";
            card.removeEventListener("click", getCardDetails);
            card.removeEventListener("rollover", onRollOverCard);
            card.removeEventListener("rollout", onRollOutCard);
        }
    });
}

function onRollOverCard(event) {
    var category = event.target.categoryName;
    var topic = event.target.topicName;
    setStatusText(2, category, topic);
}

function onRollOutCard(event) {
    setStatusText(0);
}
