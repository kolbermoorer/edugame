var selectedAnswer;
var answerTimeStart;
var answerCorrect;
var answerError = false;
var questionData;
var multiPlayerAnswerData;
var wikiLink;
var rating;

function showQuestion(element) {
    if(gameType == "single")
        singlePlayerCreateQuestion();
    else {
        console.log(element);
        $.each(cardPropertiesContainer, function (index, cardPropertyContainer) { //delete the mouse over abilities of the properties
            cardPropertyContainer.cursor = "default";
            cardPropertyContainer.removeEventListener("rollover", changeBackground);
            cardPropertyContainer.removeEventListener("click", showQuestion);
        });

        var property = element.target.parent.children[1].text;
        var params = {};
        params.property = property;
        params.type = "sendProperty";
        sfs.send( new SFS2X.Requests.System.ExtensionRequest("exchangeData", params, sfs.lastJoinedRoom) );
    }
}

function createAnswer(answerContent, index, cardId, property) {
    $("#answer" + index).text(answerContent);
    var height = $("#answer" + index).height();
    if(height == 32)
        $("#answer" + index).parent().css("top", "9px");
    else if(height == 48)
        $("#answer" + index).parent().css("top", "1px");
}

function onAnswerBtClick(event) {
    event.stopImmediatePropagation();
    $(".countdown").TimeCircles().stop();
    $('.answerFields').removeClass("enabled");
    selectedAnswer = $(event.target);
    selectedAnswer.closest('.answerFields').css("border","4px double blue");

    $("#errorAnswer").css("display", "none");
    if(gameType == "single") {
        $("#feedbackWrapper").css("display", "block");
    }
    else {
        var params = {};
        params.type = "stopTime";
        sfs.send( new SFS2X.Requests.System.ExtensionRequest("exchangeData", params, sfs.lastJoinedRoom) );
    }

    answerError = false;

    var params = {};
    params.gameType = gameType;
    params.answer = selectedAnswer.text(); //$(event.target).text()
    params.property = $("#questionTitleProperty").text();
    params.answerTime = new Date() - answerTimeStart;
    params.answerOptions = $('.answerFields').map(function () { return $(this).text(); }).get();
    params.isError = false;

    sfs.send( new SFS2X.Requests.System.ExtensionRequest("checkAnswer", params, sfs.lastJoinedRoom) );
}

function stopOpponentTimer() {
    $(".opponentCountdown").TimeCircles().stop();
}

function onErrorAnswerClick() {
    event.stopImmediatePropagation();
    var playedProperty = $("#questionTitleProperty").text();
    answerCorrect = false;
    answerError = true;

    var params = {};
    params.isError = true;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("checkAnswer", params, sfs.lastJoinedRoom) );

    var params = {};
    params.type = "error";
    params.playedProperty = playedProperty;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("updateWeights", params, sfs.lastJoinedRoom) );
}

function markAnswer(answer) {
    console.log(answer);

    $(".countdown").css("opacity", 0);
    $(".opponentCountdown").css("opacity", 0);
    $("#nextQuestionBt").removeClass("disabled").addClass("enabled");

    //mark right answer green
    $('.answerFields').filter(function() {
        return $(this).text() == answer["right"];
    }).css("background","#d7e4bc").addClass("hasImpact");

    if(gameType != "single") {
        var opponentAnswer = $('.answerFields').filter(function() {
            return $(this).text() == answer["opponentAnswer"];
        });
        if(answer["opponentAnswer"] == answer["answer"])
            opponentAnswer.css("border-top", "4px double orange").css("border-left", "4px double orange");
        else
            opponentAnswer.css("border", "4px double orange");
    }
    var points = answer["points"];
    if(answer["empty"]) {
        $('.answerFields').removeClass("enabled");
        $("#errorAnswer").css("display", "none");

        $("#statusText").text("You didn't lose the game, you just ran out of time! You lost " + points +" point. ");
        $("#statusTextWrapper").css("color", "red");
    }
    else {
        var selectedBox = selectedAnswer.closest('.answerFields');
        selectedBox.css("background",answer["color"]).addClass("hasImpact");
        if(answer["correct"]) {
            if(gameType == "single")
                $("#statusText").text("Amazing! Your answer was correct! You won " + points +" points.");
            else if(gameType == "compete" && answer["opponentAnswer"] == answer["right"])
                $("#statusText").text("Good! You both found the answer. You won " + points +" points.");
            else if(gameType == "compete" && answer["opponentAnswer"] != answer["right"])
                $("#statusText").text("Good! You defeat your enemy this round! You won " + points +" points.");
            else if(gameType == "collaborate" && answer["opponentAnswer"] == answer["right"])
                $("#statusText").text("Woohoo! You both are the best! You won " + points +" points.");
            else if(gameType == "collaborate" && answer["opponentAnswer"] != answer["right"])
                $("#statusText").text("Oops! You were the only one who found the answer! You won " + points +" points.");
            $("#statusTextWrapper").css("color", "green");
            showAnswers(answer["rightAnswers"]);
        }
        else {
            if(gameType == "single")
                $("#statusText").text("D'oh! Your answer was wrong! You lost " + points + " point.");
            else if(gameType == "compete" && answer["opponentAnswer"] != answer["right"])
                $("#statusText").text("Ok. Nobody got it right. You lost " + points +" points.");
            else if(gameType == "compete" && answer["opponentAnswer"] == answer["right"])
                $("#statusText").text("That's bad! You enemy found the answer! You lost " + points +" points.");
            else if(gameType == "collaborate" && answer["opponentAnswer"] != answer["right"])
                $("#statusText").text("Oh no! Nobody got it right. You lost " + points +" points.");
            else if(gameType == "collaborate" && answer["opponentAnswer"] == answer["right"])
                $("#statusText").text("Well ... only your teammate found the answer! You lost " + points +" points.");

            $("#statusTextWrapper").css("color", "red");
            var countText = player2.stack[selectedCard.categoryId];
            $("#countTop" + selectedCard.categoryId).text(countText);
        }
        selectedAnswer = null;
    }
    var feedback = answer["feedback"];
    $("#countVotes").text("Votes: " + feedback["count"]);
    rating = "?";
    if(feedback["count"] > 0) {
        rating = Math.round( (feedback["sum"]/feedback["count"]) * 10 ) / 10;
        //var percent = Math.round((rating/5)*100);

        var color = getColor((5-rating)/5);

        $(".averageRating").TimeCircles().destroy();
        $(".averageRating").data('timer', rating).TimeCircles({
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
                    "color": color,
                    "show": true
                }}
        });
    }
    $("#nextActionTable").css("height", "35px");
    $('#row1nextActionTable').css("opacity", 0);
    $('#row2nextActionTable').css("opacity", 0);
    $("#feedbackWrapper").css("display", "block");


    $('.answerFields').not(".hasImpact").css("opacity",0.2);
    $('.answerFields').css("cursor", "default");
    answerCorrect = answer["correct"];
    wikiLink = answer["wikiLink"];

    multiPlayerAnswerData = answer;

    var params = {};
    params.type = "question";
    params.correct = answer["correct"];
    params.playedProperty = $("#questionTitleProperty").text();
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("updateWeights", params, sfs.lastJoinedRoom) );
}

function onMouseOverRating(element) {
    element.stopImmediatePropagation();
    var text = ["Poor" , "Fair", "Good", "Very Good", "Excellent"];
    var pos = $(element.target).parent().parent().parent().index();
    $("#ratingText").text(text[pos-1]);
}

function onMouseLeaveRating(evt) {
    evt.stopImmediatePropagation();
    $("#ratingText").text("How would you rate the quality of this question?");
}

function onOpenWikipediaBtClick(evt) {
    evt.stopImmediatePropagation();
    var win = window.open(wikiLink, '_blank');
    if(win){
        //Browser has allowed it to be opened
        win.focus();
    }else{
        //Broswer has blocked it
        alert('Please allow popups for this site');
    }
    var params = {};
    params.i = selectedCard.data;
    params.time = 0;
    params.when = "game";
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("wikipedia", params, sfs.lastJoinedRoom) );
}

function onSendFeedbackBtClick(value) {
    console.log("update weight: " + value);

    $("#ratingTable").css("display", "none");
    $("#nextActionTable").jqxDataTable('render');
    $("#ratingText").text("Thank you for your feedback!");

    var params = {};
    params.value = value;
    params.type = "rating";
    params.playedProperty = $("#questionTitleProperty").text();
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("updateWeights", params, sfs.lastJoinedRoom) );
}

function onNextQuestionBtClick(evt) {
    if(typeof evt != 'undefined')
        evt.stopImmediatePropagation();
    onNextQuestionBtClickCss();

    if(gameType == "single") {
        setStatusText(0);
        enableBoard(true);
        singlePlayerHandleMove(answerCorrect, answerError);
    }
    else {
        if(!myTurn())
            sfs.send( new SFS2X.Requests.System.ExtensionRequest("updateTurn", null, sfs.lastJoinedRoom) );
        else
            $("#statusText").text("It's your opponent's turn. Get ready for the question!");
    }
    answerError = false;
}

function onNextQuestionBtClickCss() {
    $('.answerFields').css("border", "1 px solid #8b9798");
    $("#questionBox").css("display", "none");
    $(".gaugeWidget").css("opacity", 0);
    $("#feedbackWrapper").css("display", "none");
    $("#statusTextWrapper").css("color", "#333333");
    wikiLink = "";
}

function updateOpponentCountdown(unit, value, total) {
    if(total == 0) {
        var params = {};
        params.answer = "";
        params.property = $("#questionTitleProperty").text();
        params.answerTime = new Date() - answerTimeStart;
        sfs.send( new SFS2X.Requests.System.ExtensionRequest("checkAnswer", params, sfs.lastJoinedRoom) );
    }
}

function updateCountdown(unit, value, total) {
    if(total == 0) {
        var params = {};
        params.answer = "";
        params.property = $("#questionTitleProperty").text();
        params.answerTime = new Date() - answerTimeStart;
        sfs.send( new SFS2X.Requests.System.ExtensionRequest("checkAnswer", params, sfs.lastJoinedRoom) );
    }
    var c=(60-value)/60;
    $(".countdown").TimeCircles({time: {Seconds: {color: getColor(c)}}});

}

function updateGameTimer(value) {
    var timeMax = $(".timeToStartEnd").data('timer');
    var c=(timeMax-Math.floor(value/1000))/timeMax;

    $(".timeToStartEnd").TimeCircles({time: {Minutes: {color: getColor(c)}}});
}

function getColor(value){
    //value from 1 to 0
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}