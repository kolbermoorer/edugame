function trace(txt, showAlert)
{
    console.log(txt);

    if (showAlert)
        alert(txt);
}

function showError(text)
{
    trace(text);
    $("#errorLb").html("<b>ATTENTION</b><br/>" + text).toggle();
}

function onGameExtensionResponse(event)
{
    var cmd = event.cmd;
    var params = event.params;
    //trace(params);

    switch(cmd){
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
            trace(topics);
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
            trace(params);
            initFirstPhase(params);
            break;
        case "updateStartStatusText":
            $("#startStatusText").html(params.text);
            break;
        case "start":
            startGame(params);
            break;
        case "pickCard":
            questionData = JSON.parse(params.card);
            trace(questionData);
            fillCard(questionData);
            if(gameType == "single")
                singePlayerOpenCard();
            break;
        case "setPlayedCard":
            if(gameType == "single")
                singePlayerOpenCard();
            break;
        case "checkAnswer":
            markAnswer(params);
            if(params.gameEnd)
                stopGame(params);
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
