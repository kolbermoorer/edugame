function multiPlayerOpenCard() {
    console.log(selectedCard);
    var backSide = selectedCard.children[0];
    var frontSide = selectedCard.children[1];

    createjs.Tween.get(selectedCard, { loop: false })
        .to({ x: BOARD_WIDTH+20+CARD_FRONTSIDE_WIDTH/2, y: 152+CARD_FRONTSIDE_HEIGHT/2}, 700, createjs.Ease.getPowInOut(4))
        .call(function() {
            createjs.Tween.get(backSide, {loop: false})
                .to({scaleX: 0}, 300)
                .call(function () {
                    createjs.Tween.get(frontSide, {loop: false})
                        .to({scaleX: 1, scaleY: 1}, 300);
                });
        });
}

function multiPlayerCreateQuestion(params) {
    var playedProperty = params.property;
    var answers;

    $.each(selectedCard.properties, function (index, property) {
        if(Object.keys(property)[0] == playedProperty)
            answers = property[Object.keys(property)[0]];
    });

    var cardId = selectedCard.id;
    var pixel = "14px";
    var top = 200;

    if(playedProperty.length > 25)
        pixel = "13px";

    $("#questionTitle").css("font-size", pixel);
    $('.answerFieldsContent').css("top", "16px");
    $("#questionTitleProperty").text(playedProperty); //questionData["propertyQuestion"]);
    $("#questionBox").css("display", "block");

    for(var index = 1; index <= answers.length; index++) { //questionData["answers"]
        createAnswer(answers[index-1], index, cardId, playedProperty);
    }

    enableBoard(false);
    $("#statusText").text("Please answer the question below.");

    $(".countdown").css("opacity", 1);
    $(".opponentCountdown").css("opacity", 1);
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
    $(".opponentCountdown").TimeCircles().restart();
    answerTimeStart = new Date();
}

function handleMove(enable) {
    var data = multiPlayerAnswerData;
    console.log("Answer was " + multiPlayerAnswerData.correct + "!");
    previousSelectedCard = selectedCard;
    flipBackwards();
    if(!answerCorrect && multiPlayerAnswerData["opponentAnswer"] != multiPlayerAnswerData["right"] ) { //if nobody got the right answer
        $.each(cards, function (index, card) {
            if(card.playerId == 999 && card.categoryId == previousSelectedCard.categoryId) {
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
    else { //one of the two players gave the right answer
        player1.stack[previousSelectedCard.categoryId]++;
        player2.stack[previousSelectedCard.categoryId]--;
        previousSelectedCard.playerId = player1.id;
        previousSelectedCard.initY = board.height-CARD_BACKSIDE_HEIGHT/2-15;
        $.each(cards, function (index, card) {
            if (card.categoryId == previousSelectedCard.categoryId && card.playerId == player1.id) {
                if (card.id != previousSelectedCard.id) {
                    card.zIndex--;
                    //card.stackPosition--;
                }
                else {
                    card.zIndex = 0;
                    //card.stackPosition = 0;
                }
            }
        });
    }
    cardContainer.sortChildren(sortByZ);
    createjs.Tween.get(previousSelectedCard, {loop: false})
        .to({x: previousSelectedCard.initX, y: previousSelectedCard.initY}, 700, createjs.Ease.getPowInOut(4));

    stage.update();
    //setStatusText(1);
    enableBoard(enable);
}