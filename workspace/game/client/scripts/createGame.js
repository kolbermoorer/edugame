var DETAILS_HEIGHT = 220;
var rowIsAlreadyOpen = false;


/**
 * Create game button click handler.
 * Shows the game room creation panel.
 */
function onCreateGameBtClick() {
    $("#createGameWin").jqxWindow("open");
    createGameWinTabs.jqxTabs('disableAt', 1);
}

function onCloseBtClick() {
    $("#createGameWin").jqxWindow("close");
}

function onLeaveGameBtClick() {
    setView("lobby", true);
    sfs.send( new SFS2X.Requests.System.ExtensionRequest("leaveRoom", {}, sfs.lastJoinedRoom) );
}

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
    var params = {};
    params.type = "getTopics";
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql", params));
}

function onTopicBackBtClick() {
    createGameWinTabs.jqxTabs('disableAt', 1);
    createGameWinTabs.jqxTabs({selectedItem: 0});
}

/**
 * Create game button click event listener (create game panel).
 * Create a new game using the parameters entered in the game creation popup window.
 */
function onDoCreateGameBtClick() {
    var roomType = gameType;
    var roomTopic = topicList.jqxDataTable('getSelection')[0]["topic"];
    var roomCategory = topicList.jqxDataTable('getSelection')[0]["category"];
    var params = {};
    params.roomType = roomType;
    params.roomCategory = roomCategory;
    params.roomTopic = roomTopic;
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("createRoom", params));
    $("#createGameWin").jqxWindow("close");
}

function populateTopicList(topics) {
    topics.forEach(function (topic) {
        var pageRank = parseFloat(topic["difficulty"]);
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
            {name: 'upperRank', type: 'double'},
            {name: 'lowerRank', type: 'double'}
        ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    topicList = $("#topicList").jqxDataTable({
        width: 568,
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
            {text: 'Topic', dataField: 'topic', width: 232},
            {text: 'Category', dataField: 'category', width: 140},
            {text: 'Cards', dataField: 'filteredCards', width: 60, align: 'center', cellsAlign: 'center'},
            {text: 'Difficulty', dataField: 'bar', width: 90, align: 'center', cellsAlign: 'center', filterable: false}
        ]
    });
    topicList.on('rowSelect', function (event) {
        topic = topicList.jqxDataTable('getSelection')[0]["topic"];
        category = topicList.jqxDataTable('getSelection')[0]["category"];
        upperRank = topicList.jqxDataTable('getSelection')[0]["upperRank"];
        lowerRank = topicList.jqxDataTable('getSelection')[0]["lowerRank"];
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

            var params = {};
            params.type = "getEntries";
            params.category = args.row.category;
            params.topic = args.row.topic;

            sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql", params));
        });

    createGameWinTabs.jqxTabs({selectedItem: 1});
    $(".jqx-icon-search").trigger( "click" );
    topicList.jqxDataTable('sortBy', 'topic', 'asc');
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
            {name: 'label', type: 'string'},
            {name: 'wikipedia', type: 'string'},
            {name: 'uri', type: 'string'}
        ]
    };
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
            {text: 'Wikipedia', dataField: 'wikipedia', width: 80, cellsRenderer: function (row) { return '<a href="' + data[row]["wikipedia"] + '" target="_blank">WikiLink</a>';}}
        ]
    });
}


