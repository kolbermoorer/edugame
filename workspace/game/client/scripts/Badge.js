function updateBadges(data) {
    trace(data);
    var winQuestionsRow = data["winQuestionsRow"];
    var winGamesRow = data["winGamesRow"];
    var gamesPlayed = data["win"]+data["lose"];
    var winrate = Math.round((data["win"]/(gamesPlayed))*10000)/100;
    trace(winrate);
    var points = data["points"];
    var winContribution = data["winContribution"];
    var surveyTaken = data["surveyTaken"];

    $("#qm-value").text(winQuestionsRow);
    $("#vm-value").text(winGamesRow);
    $("#in-value").text(winrate + "%");
    var level;
    switch(true) {
        case (points < 5):
            level = "-";
            break;
        case (5 <= points && points < 20):
            level = "IV";
            break;
        case (20 <= points && points < 50):
            level = "III";
            break;
        case (50 <= points && points < 100):
            level = "II";
            break;
        case (100 <= points):
            level = "I";
            break;
    }
    $("#vv-value").text(level);
    $("#cc-value").text(winContribution);
    $("#ts-value").text(surveyTaken);

    if(winQuestionsRow > 4) replaceImageBadge($("#qm-img"));
    if(winGamesRow > 4) replaceImageBadge($("#vm-img"));
    if(winrate > 0.75) replaceImageBadge($("#in-img"));
    if(points > 4) replaceBadge($("#vv-img"), level);
    if(winContribution > 24) replaceImageBadge($("#cc-img"));
    if(surveyTaken === "yes") replaceImageBadge($("#ts-img"));

    if(gamesPlayed > 2 && surveyTaken === "no") {
        enableSurveyBt = true;
    }
    gamesPlayedTotal = gamesPlayed;
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
            content = "Win at least five 5 cards in row against your enemy. A series is unbroken by loosing a card to opponent player. <i>Only the longest series is included.</i><br><br>Game Mode: Defeat your enemy";
            break;
        case "Victory March":
            content = "Awarded to a player who won at least 3 games in row. <i>Only the longest series is included.</i><br><br>Game Mode: All";
            break;
        case "Invincible":
            content = "Arwarded to a player with a win percentage over 70%. <i>This badge can be lost again.</i><br><br>Game Mode: All";
            break;
        case "V for Victory":
            content = "Won for the number of points earned. <br><i>Class IV: 5 <br>Class III: 20<br>Class II: 50<br>Class I: 100</i><br><br>Game Mode: All";
            break;
        case "Crucial Contribution":
            content = "Awarded to a team that answer at least 25 questions right.<i> Only the longest series is included.</i><br><br>Game Mode: The Will To Cooperate";
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
