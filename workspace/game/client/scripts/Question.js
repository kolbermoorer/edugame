var selectedAnswer;
var answerTimeStart;
var answerCorrect;
var questionData;
var wikiLink;

function showQuestion() {
    if(gameType == "single")
        singlePlayerCreateQuestion();
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
    $(".countdown").TimeCircles().stop();
    $('.answerFields').removeClass("enabled");
    $("#errorAnswer").css("display", "none");
    $("#feedbackWrapper").css("display", "block");
    selectedAnswer = $(event.target);
    var params = {};
    params.answer = $(event.target).text()
    params.property = $("#questionTitleProperty").text();
    params.answerTime = new Date() - answerTimeStart;
    trace(params);
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("checkAnswer", params, sfs.lastJoinedRoom) );
}

function onErrorAnswerClick(event) {
    var playedProperty = $("#questionTitleProperty").text();
    answerCorrect = false;
    selectedCard.errors.push(playedProperty);
    onNextQuestionBtClick();

    var params = {};
    params.type = "error";
    params.playedProperty = playedProperty;
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("updateWeights", params, sfs.lastJoinedRoom) );
}

function markAnswer(answer) {
    trace(answer);

    //mark right answer green
    $('.answerFields').filter(function() {
        return $(this).text() == answer["right"];
    }).css("background","#d7e4bc").addClass("hasImpact");

    if(answer["empty"]) {
        $('.answerFields').removeClass("enabled");
        $("#errorAnswer").css("display", "none");
        $("#feedbackWrapper").css("display", "block");
        $("#statusText").text("You didn't lose the game, you just ran out of time! You lost -1 point. ");
        $("#statusTextWrapper").css("color", "red");
    }
    else {
        var selectedBox = selectedAnswer.closest('.answerFields');
        selectedBox.css("border","1px solid white");
        selectedBox.css("background",answer["color"]).addClass("hasImpact");
        if(answer["correct"]) {
            $("#statusText").text("Amazing! Your answer was correct! You won +2 points.");
            $("#statusTextWrapper").css("color", "green");
            showAnswers(answer["rightAnswers"]);
        }
        else {
            $("#statusText").text("D'oh! Your answer was wrong! You lost -1 point.");
            $("#statusTextWrapper").css("color", "red");
        }
        selectedAnswer = null;
    }

    $('.answerFields').not(".hasImpact").css("opacity",0.2);
    $('.answerFields').css("cursor", "default");
    answerCorrect = answer["correct"];
    wikiLink = answer["wikiLink"];

    var params = {};
    params.type = "question";
    params.correct = answer["correct"];
    params.playedProperty = $("#questionTitleProperty").text();
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("updateWeights", params, sfs.lastJoinedRoom) );

}

function onOpenWikipediaBtClick() {
    var win = window.open(wikiLink, '_blank');
    if(win){
        //Browser has allowed it to be opened
        win.focus();
    }else{
        //Broswer has blocked it
        alert('Please allow popups for this site');
    }
}

function onSendFeedbackBtClick(value) {
    trace("update weight: " + value);
    var params = {};
    params.value = value;
    params.type = "rating";
    params.playedProperty = $("#questionTitleProperty").text();
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("updateWeights", params, sfs.lastJoinedRoom) );
}

function onNextQuestionBtClick() {
    $('.answerFields').css("border", "1 px solid #8b9798");
    $("#questionBox").css("display", "none");
    $(".gaugeWidget").css("opacity", 0);
    $("#feedbackWrapper").css("display", "none");
    $(".countdown").css("opacity", 0);

    setStatusText(0);
    $("#statusTextWrapper").css("color", "#333333");
    enableBoard(true);

    wikiLink = "";
    ratingStars.jqxRating({ width: 100, height: 18, singleVote:true, theme: theme, value: 0});
    $(".jqx-rating-image").addClass("ratingEnabled");

    if(gameType == "single")
        singlePlayerHandleMove(answerCorrect);
    else
        handleMove(answerCorrect);
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