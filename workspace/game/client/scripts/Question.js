var selectedAnswer;
var answerCorrect;
var questionData;

function showQuestion() {
    var property = questionData["propertyQuestion"];
    var cardId = questionData["id"];
    var pixel = "14px";
    var top = 200;

    if(property.length > 25)
        pixel = "13px";

    $("#questionTitle").css("font-size", pixel);
    $("#questionTitleProperty").text(questionData["propertyQuestion"]);
    $("#questionBox").css("display", "block");

    for(var index = 1; index <= questionData["answers"].length; index++) {
        createAnswer(questionData["answers"][index-1], index, cardId, property);
    }

    $(".gaugeWidget").css("opacity", 1);
    $(".countdown").css("opacity", 1);
    $('.answerFields').css("cursor", "pointer");
    $(".jqx-rating-image").addClass("ratingEnabled");
    $(".answerFields").css("background", "lightgray");
    $(".countdown").TimeCircles().restart();
}

function createAnswer(answerContent, index, cardId, property) {
    $("#answer" + index).text(answerContent);
}

function onAnswerBtClick(event) {
    $(".countdown").TimeCircles().stop();
    $("#errorAnswer").css("display", "none");
    $("#feedbackWrapper").css("display", "block");
    selectedAnswer = $(event.target);
    var params = {};
    params.answer = $(event.target).text()
    params.property = $("#questionTitleProperty").text(); //selectedAnswer.attr("data-property")
    trace(params);
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("checkAnswer", params, sfs.lastJoinedRoom) );
}

function markAnswer(answer) {
    var selectedBox = selectedAnswer.closest('.answerFields');
    selectedBox.css("border","2px solid white");
    selectedBox.css("background",answer["color"]);

    //mark right answer green
    $('.answerFields').filter(function() {
        return $(this).text() == answer["right"];
    }).css("background","#d7e4bc");

    if(answer["correct"]) {
        $("#responseText").text("Amazing! Your answer was correct! You got +2 points!");
        $("#responseText").css("color", "green");
    }
    else {
        $("#responseText").text("D'oh! Your answer was wrong! You lost -1 points!");
        $("#responseText").css("color", "red");
    }

    $('.answerFields').css("cursor", "default");

}

function onOpenWikipediaBtClick() {
    var win = window.open('http://stackoverflow.com/', '_blank');
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
    params.type = "feedback";
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("updateWeights", params, sfs.lastJoinedRoom) );
}

function onNextQuestionBtClick() {
    $("#questionBox").css("display", "none");
    $(".gaugeWidget").css("opacity", 0);
    $("#feedbackWrapper").css("display", "none");
    $(".countdown").css("opacity", 0);
    ratingStars.jqxRating({ width: 100, height: 18, singleVote:true, theme: theme, value: 0});
    $(".jqx-rating-image").addClass("ratingEnabled");
    handleMove(answerCorrect);
}

function updateCountdown(unit, value, total) {
    if(value == 1) {
        var params = {};
        params.answer = "";
        params.property = $("#questionTitleProperty").text();
        sfs.send( new SFS2X.Requests.System.ExtensionRequest("checkAnswer", params, sfs.lastJoinedRoom) );
    }
    var c=(60-value)/60;
    $(".countdown").TimeCircles({time: {Seconds: {color: getColor(c)}}});

}

function getColor(value){
    //value from 1 to 0
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}