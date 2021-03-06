function trace(txt, showAlert)
{
    console.log(txt);

    if (showAlert)
        alert(txt);
}

function onGameExtensionResponse(event)
{
    var cmd = event.cmd;
    var params = event.params;

    switch(cmd){
        case "setBadges":
            getBadges();
            break;
        case "getBadges":
            updateBadges(event.params.data[0]);
            break;
        case "updateRoomTable":
            updateRoomData(event.params);
            break;
        case "updateRoomTableCategories":
            updateCategoriesInRoom(event.params);
            break;
        case "getAllUsersInZone":
            populateUsersLists(event.params);
            break;
        case "getRankingList":
            var rankingList = JSON.parse(event.params.rankingList);
            populateRankingList(rankingList);
            break;
        case "getTopics":
            var topics = JSON.parse(event.params.data);
            //console.log(topics);
            populateTopicList(topics);
            break;
        case "getEntries":
            var entries = JSON.parse(event.params.data);
            populateEntryList(entries);
            break;
        case "setMultiplayerView":
            waitGameWin.jqxWindow('close');
            setView("game", true);
            break;
        case "init":
            params.cardData = JSON.parse(params.cardData);
            initFirstPhase(params);
            break;
        case "updateStartStatusText":
            $("#startStatusText").html(params.text);
            break;
        case "start":
            startGame(params);
            break;
        case "stopGame":
            destroyGame();
            break;
        case "showResults":
            showResults(params);
            break;
        case "pickCard":
            questionData = JSON.parse(params.card);

            fillCard(questionData);
            var countText = (player2.stack[selectedCard.categoryId]-1 == 0 ? "" : player2.stack[selectedCard.categoryId]-1);
            $("#countTop" + selectedCard.categoryId).text(countText);
            if(gameType == "single")
                singePlayerOpenCard();
            else
                multiPlayerOpenCard();
            break;
        case "checkAnswer":
            if(params.isError) {
                answerError = true;
                onNextQuestionBtClick();
            }
            else {
                answerError = false;
                markAnswer(params);
            }

            if(params.gameEnd)
                destroyGame();
            break;
        case "hideErrorBox":
            $("#errorAnswer").css("display", "none");
            break;
        case "agreeError":
            $("#isErrorWin").jqxWindow('open');
            break;
        case "noError":
            $("#errorAnswer").css("display", "none");
            break;
        case "createMultiplayerQuestion":
            multiPlayerCreateQuestion(params);
            break;
        case "updateTurn":

            onNextQuestionBtClickCss();
            whoseTurn = params["whoseTurn"];
            setStatusText(1);
            handleMove(params["enableBoard"], answerError);
            break;
        case "stopTime":

            stopOpponentTimer();
            break;
        case "updateWeight":
            $(".averageRating").children().children().eq(1).children().eq(1).text(rating);
            break;
        case "getSurveyData":
            fillOutSurveyQuestion(params["surveyData"]);
            break;
    }
}

function setView(viewId, doSwitch)
{
    if (viewId == "login")
    {
    }
    else if (viewId == "lobby")
    {
        buildMainUI();
        addEventListenerMain();
        updateUserLists();
        populateRoomsList();
        $("#statusTextLogin").css("display", "none");
    }
    else if (viewId == "game")
    {
        if(gameType != "single")
            showGamePopUp("loading", '<div class="popupContent"><img src="img/loader.gif"/> <br> Loading cards (<span id="loadingTime" ms="45000">30</span>)</div>', "Please Wait ...");
    }

    // Switch view
    if (doSwitch)
        switchView(viewId);
}

function switchView(viewId)
{
    $('.viewStack').each(function() {
        if ($(this).hasClass(viewId)) {
            $( this ).removeClass('hidden');
        }
        else {
            $( this ).addClass('hidden');
        }
    });
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

//Upper case each first letter in listbox
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
