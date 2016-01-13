var DETAILS_HEIGHT = 220;
var rowIsAlreadyOpen = false;

/**
 * Create game button click handler.
 * Shows the game room creation panel.
 */
function onCreateGameBtClick() {
    $("#createGameWin").jqxWindow("open");
    createGameWinTabs.jqxTabs('disableAt', 1);
    createGameWinTabs.jqxTabs('disableAt', 2);
    /*var params = {};
     params.roomName = "Test" + Math.floor(Math.random() * 10000);
     params.roomType = "Test";
     params.roomCategory = "Test";
     sfs.send(new SFS2X.Requests.System.ExtensionRequest("createRoom", params));*/
}

function onCloseBtClick() {
    $("#createGameWin").jqxWindow("close");
}

function onCategoryBackBtClick() {
    createGameWinTabs.jqxTabs('disableAt', 1);
    createGameWinTabs.jqxTabs({selectedItem: 0});
}

function onPickCategoryBtClick() {
    var tableRows = categoryList.jqxDataTable('getRows').length;
    var randomNumber = Math.floor(Math.random() * tableRows);
    categoryList.jqxDataTable('selectRow', randomNumber);
    var selectedIndex = categoryList.jqxDataTable('getSelection')[0].uid;
    categoryList.jqxDataTable('scrollOffset', Math.round((selectedIndex*28.05) / 10) * 10+10, 0);

}

function onCategoryNextBtClick() {
    createGameWinTabs.jqxTabs('enableAt', 1);
    var params = {};
    params.type = "getCategories";
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql", params));
}

function onTopicBackBtClick() {
    createGameWinTabs.jqxTabs('disableAt', 2);
    createGameWinTabs.jqxTabs({selectedItem: 1});
}

function onTopicNextBtClick() {
    createGameWinTabs.jqxTabs('enableAt', 2);
    var selectedCategory = $("#categoryList").jqxDataTable('getSelection')[0].categoryUri;
    var params = {};
    params.type = "getTopics";
    params.category = selectedCategory;
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql", params));
}

/**
 * Create game button click event listener (create game panel).
 * Create a new game using the parameters entered in the game creation popup window.
 */
function onDoCreateGameBtClick() {
    var roomName = $("#gameNameIn").val();
    var roomType = $("#gameTypeDd").jqxDropDownList('getSelectedItem').label;
    var roomCategory = $("#categoryList").jqxDataTable('getSelection')[0].categoryUri;
    var params = {};
    params.roomName = roomName;
    params.roomType = roomType;
    params.roomCategory = roomCategory;
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("createRoom", params));
    //$("#createGameWin").jqxWindow("close");
}

function populateCategoryList(categories) {
    trace(categories);
    var source =
    {
        localData: categories,
        dataType: "json",
        dataFields: [
            {name: 'id', type: 'int'},
            {name: 'categoryLabel', type: 'string'},
            {name: 'categoryUri', type: 'string'},
            {name: 'topics', type: 'int'}
        ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    categoryList = $("#categoryList").jqxDataTable({
        width: 366,
        height: 300,
        source: dataAdapter,
        pageable: false,
        filterable: true,
        autoRowHeight: true,
        showHeader: true,
        sortable:true,
        selectionMode: 'singleRow',
        columns: [
            {text: 'Category', dataField: 'categoryLabel', sortable:true, width: 267},
            {text: 'Topics', dataField: 'topics', width: 80, sortable:false, align: 'center', cellsAlign: 'center'}
        ]
    });
    $("#createGameWinTabs").jqxTabs({selectedItem: 1});
    categoryList.jqxDataTable('refresh');
    categoryList.on('rowSelect', function () {
        $("#nextTopicBt").jqxButton({disabled: false});
    });
}

function populateTopicList(topics) {
    trace(topics);
    var maxPop = 0;
    topics.forEach(function (topic) {
        var pop = parseFloat(topic["popularity"]);
        if (pop > maxPop)
            maxPop = pop;
    });

    topics.forEach(function (topic) {
        var pop = parseFloat(topic["popularity"]);
        topic["popularityBar"] = '<progress max="' + maxPop + '" value="' + pop + '"></progress>'
    });

    var source =
    {
        localData: topics,
        dataType: "json",
        dataFields: [
            {name: 'label', type: 'string'},
            {name: 'cards', type: 'integer'},
            {name: 'popularityBar'},
            {name: 'link', type: 'string'},
            {name: 'categoryUri', type: 'string'}
        ],
        sortcolumn: 'name',
        sortdirection: 'asc'
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    topicList = $("#topicList").jqxDataTable({
        width: 366,
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
            {text: 'Topic', dataField: 'label', width: 170},
            {text: 'Cards', dataField: 'cards', width: 60, align: 'center', cellsAlign: 'center'},
            {text: 'Popularity', dataField: 'popularityBar', width: 90, align: 'center', cellsAlign: 'center', filterable: false}
        ]
    });
    $("#createGameWinTabs").jqxTabs({selectedItem: 2});
    topicList.jqxDataTable('refresh');
    topicList.on('rowSelect', function (event) {
        var row = event.args.index;
        selectedTopicRow = row;
        if(!rowIsAlreadyOpen) {
            $("#doCreateGameBt").jqxButton({disabled: false});
            topicList.jqxDataTable('showDetails', row);
            rowIsAlreadyOpen = false;
        }
    });

    topicList.on('rowExpand',
        function (event)
        {
            var row = event.args.index;
            topicList.jqxDataTable('hideDetails', last_row_opened_number); //close last opened panel
            $('.cbResource').prop('checked', false); //deselect ALL checkboxes

            last_row_opened_number = row;
            var selection = topicList.jqxDataTable('getSelection')[0];
            if(selection.uid != event.args.row.uid)
                topicList.jqxDataTable('selectRow', row);
            var level = $("#gameDifficultyDd").jqxDropDownList('getSelectedItem').label;
            var params = {};
            params.type = "getEntries";
            params.category = args.row.categoryUri;
            //params.level = level;
            params.topic = args.row.link;
            sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql", params));
        });
}

function initRowDetails(id, row, element, rowinfo) {
    rowinfo.detailsHeight = DETAILS_HEIGHT;
    last_row_opened = element;
}

function populateEntryList(data) {
    trace(data);
    data.forEach(function (entry) {
        entry["uri"] = "<a href=" + entry["website"] + " target='_blank'>WikiLink</a>";
    });

    var source =
    {
        localData: data,
        dataType: "json",
        dataFields: [
            {name: 'label', type: 'string'},
            {name: 'uri', type: 'string'}
        ]
    };
    last_row_opened.append($("<span row=" + last_row_opened_number + " class='topicDetails fillUpCards'>Fill Up to 8 cards</span>"));
    last_row_opened.append($("<span row=" + last_row_opened_number + " class='topicDetails deselectAll'>Deselect all</span>"));
    last_row_opened.append($("<div style='margin: 10px;'></div>"));
    var nestedDataTable = $(last_row_opened.children()[2]);
    var dataAdapter = new $.jqx.dataAdapter(source);
    nestedDataTable.jqxDataTable({
        width: 317,
        height: DETAILS_HEIGHT - 30,
        source: dataAdapter,
        enableHover: false,
        selectionMode: 'custom',
        autoRowHeight: true,
        pageable: false,
        showHeader: false,
        columns: [
            {
                text: '',
                width: 30,
                cellsRenderer: function (row) {
                    return '<input type="checkbox" id="' + row +'" topic-row="' + last_row_opened_number + '" class="cbResource">';
                }
            },
            {text: 'Card', dataField: 'label', width: 190},
            {text: 'Link', dataField: 'uri', align: 'center', cellsAlign: 'center', width: 80}
        ]
    });
}


