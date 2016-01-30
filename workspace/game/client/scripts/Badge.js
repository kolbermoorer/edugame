function updateBadges(data) {
    var winQuestionsRow = data["winQuestionsRow"];
    var winGamesRow = data["winGamesRow"];
    var gamesPlayed = data["win"]+data["lose"];
    trace(data);
    var winrate = Math.round((parseInt(data["rightAnswers"])/(parseInt(data["rightAnswers"])+parseInt(data["wrongAnswers"])))*100);
    var points = data["points"];
    var winContribution = data["winContribution"];
    var surveyTaken = data["surveyTaken"];

    $("#qm-value").text(winGamesRow);
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
    $("#cc-value").text(winContribution);
    $("#ts-value").text(surveyTaken);

    if(winGamesRow > 4) replaceImageBadge($("#qm-img"));
    if(winQuestionsRow > 4) replaceImageBadge($("#vm-img"));
    if(winrate > 0.75) replaceImageBadge($("#in-img"));
    if(points > 4) replaceBadge($("#vv-img"), level);
    if(winContribution > 24) replaceImageBadge($("#cc-img"));
    if(surveyTaken === "yes") replaceImageBadge($("#ts-img"));

    if(gamesPlayed > 2 && surveyTaken === "no") {
        enableSurveyBt = true;
    }
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
            content = "Awarded to a player who answered at least 5 questions right in row while enemy failed. A series is unbroken by (a) answering a question wrong or (b) your enemy gives right answer. <i>Only the longest series is included.</i><br><br>Game Mode: Defeat your enemy";
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
    var win = window.open('http://www.surveygizmo.com/s3/2531497/Survey-on-EduGame?u=' + $("#usernameLb").text() + "&c=" + gamesPlayedTotal, '_blank');
    if(win){
        //Browser has allowed it to be opened
        win.focus();
    }else{
        //Broswer has blocked it
        alert('Please allow popups for this site');
    }
}
