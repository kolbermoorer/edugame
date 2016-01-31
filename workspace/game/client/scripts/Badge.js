var instructions = false;

function updateBadges(data) {
    var gamesPlayed = data["gamesPlayed"];
    if((parseInt(data["rightAnswers"]) + parseInt(data["wrongAnswers"]) < 1)) {
            instructions = true;
        instructionsWin.jqxWindow('show');
        $('#instructionsWinTabs').jqxTabs('disableAt', 4);
        $('#instructionsWinTabs').jqxTabs('disableAt', 5);
        $('#instructionsWinTabs').jqxTabs('disableAt', 6);
    }

    var winQuestionsRow = data["winQuestionsRow"];
    var winCompeteRow = data["winCompeteRow"];
    var winCollaborateRow = data["winCollaborateRow"];

    //console.log(data);
    var winrate = Math.round((parseInt(data["rightAnswers"])/(parseInt(data["rightAnswers"])+parseInt(data["wrongAnswers"])))*100);
    var points = data["points"];

    var surveyTaken = data["surveyTaken"];

    $("#qm-value").text(winCompeteRow);
    $("#vm-value").text(winQuestionsRow);
    $("#in-value").text(winrate + "%");
    var level;
    switch(true) {
        case (points < 20):
            level = "-";
            break;
        case (20 <= points && points < 50):
            level = "IV";
            break;
        case (50 <= points && points < 100):
            level = "III";
            break;
        case (100 <= points && points < 300):
            level = "II";
            break;
        case (300 <= points):
            level = "I";
            break;
    }
    $("#vv-value").text(level);
    $("#cc-value").text(winCollaborateRow);
    $("#ts-value").text(surveyTaken);

    if(winCompeteRow > 2) replaceImageBadge($("#qm-img"));
    if(winQuestionsRow > 9) replaceImageBadge($("#vm-img"));
    if(winrate > 0.75) replaceImageBadge($("#in-img"));
    if(points > 19) replaceBadge($("#vv-img"), level);
    if(winCollaborateRow > 4) replaceImageBadge($("#cc-img"));
    if(surveyTaken === "yes") replaceImageBadge($("#ts-img"));

    if(gamesPlayed > 2 && surveyTaken == "no")
        $("#takeSurveyBt").jqxButton({disabled:false});
    gamesPlayedTotal = gamesPlayed;

    $("#scoreLb").text(data["points"]);
}

function replaceImageBadge(element) {
    element.attr("src", element.attr("src").replace("-gray", ""))
}

function replaceBadge(element, level) {
    element.attr("src", "img/badges/victory-class" + level + "-box.png");
}

function onBadgeClick(event) {
    var badgeName = event.target.title;
    var content;
    switch(badgeName) {
        case "Quiz Master":
            content = "Won for the number of points earned. <br><i>Class IV: 20 <br>Class III: 50<br>Class II: 100<br>Class I: 300</i><br><br>Game Mode: All";
            break;
        case "Victory March":
            content = "Awarded to a player who answered at least 10 questions right in row. <i>Only the longest series is included.</i><br><br>Game Mode: All";
            break;
        case "Invincible":
            content = "Arwarded to a player with a right answer percentage over 70%. <i>This badge can be lost again.</i><br><br>Game Mode: All";
            break;
        case "V for Victory":
            content = "Awarded to a player who answered at least 3 questions right in row while enemy failed. A series is unbroken by (a) answering a question wrong or (b) your enemy gives right answer. <i>Only the longest series is included.</i><br><br>Game Mode: Defeat your enemy";
            break;
        case "Crucial Contribution":
            content = "Awarded to a team that answer at least 5 questions right in row.<i> Only the longest series is included.</i><br><br>Game Mode: The Will To Cooperate";
            break;
        case "Take Survey":
            content = "Awarded to players who filled out the survey after they have played <b>at least</b> 3 games.<i><br><br> Important: If you don't fill out the survey you can't get any prizes!. Click on the button 'Take Survey' under this badge to open the survey. </i>";
            break;

    }

    achievementsWin.jqxWindow({title: badgeName, content: content});
    achievementsWin.jqxWindow("open");
}

function onTakeSurveyBtClick() {
    $("#firstQuestionWin").jqxWindow("open");
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("getSurveyData"));
}

function fillOutSurveyQuestion(data) {
    trace(data);

    var property = data[0]["property"].split('/');
    property = property[property.length - 1];

    $("#surveyCategory").text(data[0]["category"]);
    $("#surveyTopic").text(data[0]["topic"]);
    $("#surveyCard").text(data[0]["label"]);
    $("#surveyWikipedia").html('<a id="surveyWikipediaLink" href="' + data[0]["wikipedia"] + '" target="_blank">Wikipedia</a>');
    $("#surveyProperty").text(property);

    data.forEach(function (o, index) {
        $("#survey" + index).text(o["answerOption"]);
    });
    $(".answerFields").addClass("enabled");
    $(".answerFields").css("opacity", 1);
}

function openSurvey(element) {
    var win = window.open('http://www.surveygizmo.com/s3/2531497/Survey-on-EduGame?u=' + $("#usernameLb").text() + "&c=" + gamesPlayedTotal, '_blank');
    if(win){
        //Browser has allowed it to be opened
        win.focus();
    }else{
        //Broswer has blocked it
        alert('Please allow popups for this site');
    }
    $("#firstQuestionWin").jqxWindow("close");

    var params = {};
    params.answer = $(element).text();
    params.clicked = wikiClicked;
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("setSurveyData", params));

}
