var DETAILS_HEIGHT = 220;
var isLoaded;
var row_opened_clicked;

/**
 * Create game button click handler.
 * Shows the game room creation panel.
 */
function onCreateGameBtClick() {
    joined = false;
    $("#createGameWin").jqxWindow("open");
    $('#createGameWin').jqxWindow('setTitle', 'Create new game');
    backTopicBt.jqxButton('val', "Back");
    doCreateGameBt.jqxButton('val', "Create Game");
    createGameWinTabs.jqxTabs('disableAt', 1);
    isLoaded = false;
}

function onJoin() {
    joined = true;
    gameType = roomTable.jqxDataTable('getSelection')[0]["mode"];
    $("#createGameWin").jqxWindow("open");
    $('#createGameWin').jqxWindow('setTitle', 'Join game #' + sfs.lastJoinedRoom.name.replace("Room",""));
    backTopicBt.jqxButton('val', "Cancel");
    doCreateGameBt.jqxButton('val', "Join Game");
    createGameWinTabs.jqxTabs('disableAt', 0);
    isLoaded = false;
    onNextBtClick();
}

function onCloseBtClick() {
    $("#createGameWin").jqxWindow("close");
    if (sfs.lastJoinedRoom == null || sfs.lastJoinedRoom.name != LOBBY_ROOM_NAME)
        sfs.send(new SFS2X.Requests.System.LeaveRoomRequest());
}

function onLeaveGameBtClick(evt) {
    evt.stopImmediatePropagation();
    destroyGame();
}

/* If one of the buttons is clicked to choose the mode of the game */
function onSelectBtClick(event) {
    var buttonId = event.target.id;
    gameType = buttonId;
    multiPlayer = $(event.target).attr("multiPlayer");
    $( ".selectBt" ).each(function( index ) {
        if($(this).val() == "Select" && $(this).attr("id") == buttonId) { //button is pressed and was not selected yet
            $(this).val($("<div>").html("&#10004;").text());
        }
        else if($(this).val() != "Select" && $(this).attr("id") != buttonId) { //button is not pressed and was selected
            $(this).jqxToggleButton('unCheck');
            $(this).val("Select");
        }
        else if($(this).val() != "Select" && $(this).attr("id") == buttonId) { //button was pressed and was selected
            $(this).jqxToggleButton('check');
        }
    });
}

function onNextBtClick() {
    createGameWinTabs.jqxTabs('enableAt', 1);
    createGameWinTabs.jqxTabs({selectedItem: 1});

    if(!isLoaded) {
        var params = {};
        params.type = "getTopics";
        params.notInCategory = (joined ? roomTable.jqxDataTable('getSelection')[0]["categories"][0][0] : "");
        sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql", params));
    }
    isLoaded = true;
}

function onTopicBackBtClick() {
    if(backTopicBt.attr('value') == "Back") {
        createGameWinTabs.jqxTabs('disableAt', 1);
        createGameWinTabs.jqxTabs({selectedItem: 0});
    }
    else {
        onCloseBtClick();
    }

}

/**
 * Create game button click event listener (create game panel).
 * Create a new game using the parameters entered in the game creation popup window.
 */
function onDoCreateGameBtClick(evt) {
    evt.stopImmediatePropagation();
    if(!joined) {
        var roomType = gameType;
        var category = topicList.jqxDataTable('getSelection')[0]["category"];
        var color = topicList.jqxDataTable('getSelection')[0]["color"];
        var params = {};
        params.roomType = roomType;
        params.category = category;
        params.color = color;
        params.clicks = row_opened_clicked;
        sfs.send(new SFS2X.Requests.System.ExtensionRequest("createRoom", params));
    }
    else {
        inGame = true;
        setView("game", true);
        setReadyStatus();
    }
    $("#createGameWin").jqxWindow("close");
}

/* destroy the topic List on close of window so that each time the newest data is loaded */
function destroyTopicList(evt) {
    evt.stopImmediatePropagation();
    if($("#topicList").length > 0) {
        topicList.jqxDataTable('destroy');
    }
    $("#topicListWrapper").append('<div id="topicList"></div>');
    $(".loadingCircle").css("display", "block");
}

function populateTopicList(topics) {
    console.log(topics);
    row_opened_clicked = [];
    backTopicBt.jqxButton({disabled: false});
    doCreateGameBt.jqxButton({disabled: false});
    $(".loadingCircle").css("display", "none");

    topics.forEach(function (topic) {
        var pageRank = parseFloat(topic["totalAvgPageRank"]);
        var barValue = Math.max(100-pageRank, 0);

        topic["bar"] = '<progress max="100" value="' + barValue + '"></progress>'
    });

    var source =
    {
        localData: topics,
        dataType: "json",
        dataFields: [
            {name: 'topic', type: 'string'},
            {name: 'category', type: 'string'},
            {name: 'filteredCards', type: 'integer'},
            {name: 'bar'},
            {name: 'totalAvgPageRank', type: 'double'},
            {name: 'totalAvgWeight', type: 'double'},
            {name: 'color', type: 'string'}
        ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    topicList = $("#topicList").jqxDataTable({
        width: 573,
        height: 290,
        source: dataAdapter,
        pageable: false,
        rowDetails: true,
        filterable: true,
        showHeader: true,
        autoRowHeight: true,
        sortable: true,
        initRowDetails: initRowDetails,
        selectionMode: 'singleRow',
        columns: [
            {text: 'Topic', dataField: 'topic'},
            {text: 'Category', dataField: 'category', width: 140},
            {text: 'Cards', dataField: 'filteredCards', width: 60, align: 'center', cellsAlign: 'center'},
            {text: 'Difficulty', dataField: 'bar', width: 90, align: 'center', cellsAlign: 'center', filterable: false, sortable: false}
        ]
    });
    topicList.on('rowSelect', function (event) {
        topic = topicList.jqxDataTable('getSelection')[0]["topic"];
        category = topicList.jqxDataTable('getSelection')[0]["category"];
        color = topicList.jqxDataTable('getSelection')[0]["color"];
        totalAvgPageRank = topicList.jqxDataTable('getSelection')[0]["totalAvgPageRank"];
        totalAvgWeight = topicList.jqxDataTable('getSelection')[0]["totalAvgWeight"];
        totalCards = topicList.jqxDataTable('getSelection')[0]["filteredCards"];
        topicList.jqxDataTable('ensureRowVisible', event.args.row);
    });

    topicList.on('rowExpand',
        function (event)
        {
            var row = event.args.index;
            topicList.jqxDataTable('hideDetails', last_row_opened_number);
            last_row_opened_number = row;
            var selection = topicList.jqxDataTable('getSelection')[0];
            if(selection.uid != event.args.row.uid)
                topicList.jqxDataTable('selectRow', row);
            last_row_opened.append($("<div style='text-align: center; margin-top: 50px'><img src='img/loader.gif'/> <br> Loading Cards</div>"));
            var params = {};
            params.type = "getEntries";
            params.category = args.row.category;
            params.topic = args.row.topic;

            sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql", params));
        });


    $(".jqx-icon-search").trigger( "click" );
    topicList.jqxDataTable('sortBy', 'category', 'asc');
    topicList.jqxDataTable('selectRow', 0);

}

function initRowDetails(id, row, element, rowinfo) {
    rowinfo.detailsHeight = DETAILS_HEIGHT;
    last_row_opened = element;
}

function populateEntryList(data) {
    var source =
    {
        localData: data,
        dataType: "json",
        dataFields: [
            {name: 'id', type: 'int'},
            {name: 'label', type: 'string'},
            {name: 'wikipedia', type: 'string'},
            {name: 'uri', type: 'string'}
        ]
    };
    $(last_row_opened.children()[0]).remove();
    last_row_opened.append($("<div style='margin-left: 20px;'></div>"));
    var nestedDataTable = $(last_row_opened.children()[0]);
    var dataAdapter = new $.jqx.dataAdapter(source);
    nestedDataTable.jqxDataTable({
        width: 500,
        height: DETAILS_HEIGHT - 20,
        source: dataAdapter,
        enableHover: false,
        selectionMode: 'custom',
        autoRowHeight: true,
        pageable: false,
        showHeader: false,
        columns: [
            {text: 'Card', dataField: 'label', width: 372},
            {text: 'Wikipedia', dataField: 'wikipedia', width: 80, cellsRenderer: function (row) { return '<a data-card="' + data[row]["id"] + '" class="beforeWikipedia" href="' + data[row]["wikipedia"] + '" target="_blank">Wikipedia</a>';}}
        ]
    });
}

function onBeforeWikipediaClick(element) {
    element.stopImmediatePropagation();
    var cardId = $(element.target).data("card");
    row_opened_clicked.push(cardId);
}

function onAfterWikipediaClick(element) {
    element.stopImmediatePropagation();
    var cardId = $(element.target).data("card");
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("wikipedia", {time: 0, when: "after", i: cardId}, sfs.lastJoinedRoom) );
}


