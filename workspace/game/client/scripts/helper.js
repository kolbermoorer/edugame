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
            updatePlayersInRoom(event.params);
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
            trace(entries);
            populateEntryList(entries);
            break;
        case "init":
            params.cardData = JSON.parse(params.cardData);
            trace(params);
            initFirstPhase(params);
            //initGame(params);
            break;
        case "start":
            startGame(params);
            break;
        case "pickCard":
            //var cardDetails = JSON.parse(params.card);
            questionData = JSON.parse(params.card);
            fillCard(questionData);
            singePlayerMove();
            //createQuestion(cardDetails);
            //createQuestionUI(cardDetails);
            //flip();
            break;
        case "sendQuestion":
            /*buildTestButtons();
            flipFrontwards();
            moveLeft();*/
            break;
        case "checkAnswer":
            markAnswer(params);
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

//Upper case each first letter in listbox
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}