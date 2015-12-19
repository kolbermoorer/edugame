function trace(txt, showAlert)
{
    console.log(txt);

    if (showAlert)
        alert(txt);
}

function showError(text)
{
    trace(text);
    $("#errorLb").html("<b>ATTENTION</b><br/>" + text);
    $("#errorLb").toggle();
}

function onGameExtensionResponse(event)
{
    var cmd = event.cmd;
    var params = event.params;
    trace(params);

    switch(cmd){
        case "updateRoomTable":
            updatePlayersInRoom(event.params);
            break;
        case "getAllUsersInZone":
            populateUsersLists(event.params);
            break;
        case "getCategories":
            var categories = JSON.parse(event.params.data);
            populateCategoryList(categories);
            break;
        case "getTopics":
            var topics = JSON.parse(event.params.data);
            if (topics.results.bindings.length < 1) {
                trace("No topics could be found for category '" + params.sentParams.categoryLabel + "': Do you want to search for upper category '" + params.sentParams.upperCategoryLabel + "'?");
                executeSparql(params.sentParams.upperCategoryLabel, params.sentParams.upperCategoryUri );
            }
            else
                populateTopicList(topics, event.params.sentParams);
            break;
        case "getEntries":
            var entries = JSON.parse(event.params.data);
            populateEntryList(entries);
            break;
        case "init":
            params.cardData = JSON.parse(params.cardData);
            initGame(params);
            break;
        case "start":
            startGame(params);
            break;
        case "pickCard":
            var cardDetails = JSON.parse(params.card);
            fillCard(cardDetails);
            flip();
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