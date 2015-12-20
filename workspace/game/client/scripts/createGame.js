var DETAILS_HEIGHT = 220;
var last_row_opened;

/**
 * Create game button click handler.
 * Shows the game room creation panel.
 */
function onCreateGameBtClick() {
    $("#createGameWin").jqxWindow("open");
    $('#createGameWinTabs').jqxTabs('disableAt', 1);
    $('#createGameWinTabs').jqxTabs('disableAt', 2);
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
    $('#createGameWinTabs').jqxTabs('disableAt', 1);
    $("#createGameWinTabs").jqxTabs({selectedItem: 0});
}

function onPickCategoryBtClick() {
    var tableRows = $("#categoryList").jqxDataTable('getRows').length;
    var randomNumber = Math.floor(Math.random() * tableRows);
    $("#categoryList").jqxDataTable('selectRow', randomNumber);
    var selectedIndex = $("#categoryList").jqxDataTable('getSelection')[0].uid;
    $("#categoryList").jqxDataTable('scrollOffset', Math.round((selectedIndex*28.05) / 10) * 10+10, 0);

}

function onCategoryNextBtClick() {
    $('#createGameWinTabs').jqxTabs('enableAt', 1);
    var params = {};
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("getCategories", params));
}

function onTopicBackBtClick() {
    $('#createGameWinTabs').jqxTabs('disableAt', 2);
    $("#createGameWinTabs").jqxTabs({selectedItem: 1});
}

function onTopicNextBtClick() {
    $('#createGameWinTabs').jqxTabs('enableAt', 2);
    var categoryListSelected = $("#categoryList").jqxDataTable('getSelection')[0];
    var categoryLabel = categoryListSelected.categoryLabel;
    var categoryUri = categoryListSelected.categoryUri;
    var upperCategoryLabel = (typeof categoryListSelected.upperCategoryLabel === "undefined" ? "" : categoryListSelected.upperCategoryLabel);
    var upperCategoryUri = (typeof categoryListSelected.upperCategoryUri === "undefined" ? "" : categoryListSelected.upperCategoryUri);
    executeSparql(categoryLabel, categoryUri, upperCategoryLabel, upperCategoryUri);
}

function executeSparql(categoryLabel, categoryUri, upperCategoryLabel, upperCategoryUri) {
    var level = $("#gameDifficultyDd").jqxDropDownList('getSelectedItem').label;
    var params = {};
    params.type = "getTopics";
    params.categoryLabel = categoryLabel;
    params.categoryUri = categoryUri;
    params.upperCategoryLabel = upperCategoryLabel;
    params.upperCategoryUri = upperCategoryUri;
    params.level = level;
    trace(params);
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql", params));
}

/**
 * Create game button click event listener (create game panel).
 * Create a new game using the parameters entered in the game creation popup window.
 */
function onDoCreateGameBtClick() {
    var roomName = "Test"; //$("#gameNameIn").val();
    var roomType = "TestType"; //$("#gameTypeDd").jqxDropDownList('getSelectedItem').label;
    var roomCategory = "TestCategory"; //$("#categoryList").jqxListBox('getSelectedItem').label;

    if (roomName != "") {
        var params = {};
        params.roomName = roomName;
        params.roomType = roomType;
        params.roomCategory = roomCategory;
        sfs.send(new SFS2X.Requests.System.ExtensionRequest("createRoom", params));
    }
}

function populateCategoryList(categories) {
    trace(categories);
    var data = [];
    categories.forEach(function (category) {
        var row = {};
        row["id"] = category.id;
        row["categoryLabel"] = toTitleCase(category.categoryLabel);
        row["categoryUri"] = category.categoryUri;
        row["topicCount"] = category.count;
        data.push(row);
    });
    data.sort(function (a, b) {
        return (a.categoryLabel > b.categoryLabel) ? 1 : ((b.categoryLabel > a.categoryLabel) ? -1 : 0);
    });

    var source =
    {
        localData: data,
        dataType: "array",
        dataFields: [
            {name: 'id', type: 'int'},
            {name: 'categoryLabel', type: 'string'},
            {name: 'categoryUri', type: 'string'},
            {name: 'topicCount', type: 'int'}
        ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#categoryList").jqxDataTable({
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
            {text: 'Topics', dataField: 'topicCount', width: 80, sortable:false, align: 'center', cellsAlign: 'center'}
        ]
    });
    $("#createGameWinTabs").jqxTabs({selectedItem: 1});
    $("#categoryList").jqxDataTable('refresh');
    $("#categoryList").on('rowSelect', function () {
        $("#nextTopicBt").jqxButton({disabled: false});
    });
}

function populateTopicList(topicData, sentParams) {
    var topics = topicData.results.bindings;
    trace(topics);
    var maxPop = 0;
    topics.forEach(function (topic) {
        var pop = parseFloat(topic.popularity.value);
        if (pop > maxPop)
            maxPop = pop;
    });

    var data = [];
    topics.forEach(function (topic) {
        var topicURI = topic.subject.value;
        var topicName = decodeURI(topicURI);
        topicName = topicName.split(':')[2];
        topicName = topicName.replace(/_/g, " ");
        var topicCount = topic.count.value;
        var topicPopularity = topic.popularity.value;
        var row = {};
        row["name"] = topicName;
        row["count"] = topicCount;
        row["popularity"] = '<progress max="' + maxPop + '" value="' + topicPopularity + '"></progress>';
        row["uri"] = topicURI;
        row["categoryUri"] = sentParams.categoryUri;
        data.push(row);
    });
    var source =
    {
        localData: data,
        dataType: "array",
        dataFields: [
            {name: 'name', type: 'string'},
            {name: 'count', type: 'integer'},
            {name: 'popularity'},
            {name: 'uri', type: 'string'},
            {name: 'categoryUri', type: 'string'}
        ],
        sortcolumn: 'name',
        sortdirection: 'asc'
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    $("#topicList").jqxDataTable({
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
            {text: 'Topic', dataField: 'name', width: 170},
            {text: 'Cards', dataField: 'count', width: 60, align: 'center', cellsAlign: 'center'},
            {text: 'Popularity', dataField: 'popularity', width: 90, align: 'center', cellsAlign: 'center', filterable: false}
        ]
    });
    $("#createGameWinTabs").jqxTabs({selectedItem: 2});
    //$(".jqx-icon-search").click();
    $("#topicList").jqxDataTable('refresh');
    $("#topicList").on('rowSelect', function () {
        $("#doCreateGameBt").jqxButton({disabled: false});
    });
}


function initRowDetails(id, row, element, rowinfo) {
    last_row_opened = element;
    $("#topicList").jqxDataTable('showDetails', id);
    rowinfo.detailsHeight = DETAILS_HEIGHT;
    var level = $("#gameDifficultyDd").jqxDropDownList('getSelectedItem').label;
    var params = {};
    params.type = "getEntries";
    params.category = row.categoryUri;
    params.level = level;
    params.uri = row.uri;
    trace(params);
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql", params));
}

function populateEntryList(entryData) {
    var entries = entryData.results.bindings;
    trace(entries);
    var data = [];
    entries.forEach(function (entry) {
        var entryName = entry.name.value;
        var entryUri = "<a href=" + entry.website.value + " target='_blank'>WikiLink</a>";
        var row = {};
        row["name"] = entryName;
        row["uri"] = entryUri;
        data.push(row);
    });
    data.sort(function (a, b) {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
    var source =
    {
        localData: data,
        dataType: "array",
        dataFields: [
            {name: 'name', type: 'string'},
            {name: 'uri', type: 'string'}
        ]
    };
    last_row_opened.append($("<span class='topicDetails'>Select all</span>"));
    last_row_opened.append($("<span class='topicDetails'>Deselect all</span>"));
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
                    return '<input type="checkbox" id="' + row +'" class="cbResource">';
                }
            },
            {text: 'Entry', dataField: 'name', width: 190},
            {text: 'Link', dataField: 'uri', align: 'center', cellsAlign: 'center', width: 80}
        ]
    });
}