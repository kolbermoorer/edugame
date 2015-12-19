var DETAILS_HEIGHT = 200;
var last_row_opened;

/**
 * Create game button click handler.
 * Shows the game room creation panel.
 */
function onCreateGameBtClick(event)
{
    $("#createGameWin").jqxWindow("open");
    /*var params = {};
    params.roomName = "Test" + Math.floor(Math.random() * 10000);
    params.roomType = "Test";
    params.roomCategory = "Test";
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("createRoom", params));*/
}

function onCategoryNextBtClick(event)
{
    var params = {};
    params.type = "getCategories";
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql",params));
}

function onTopicNextBtClick(event)
{
    var categoryListSelected = $("#categoryList").jqxDataTable('getSelection')[0];
    var categoryLabel = categoryListSelected.categoryLabel;
    var categoryUri = categoryListSelected.categoryUri;
    var upperCategoryLabel = (typeof categoryListSelected.upperCategoryLabel === "undefined" ? "" : categoryListSelected.upperCategoryLabel);
    var upperCategoryUri = (typeof categoryListSelected.upperCategoryUri === "undefined" ? "" : categoryListSelected.upperCategoryUri);
    executeSparql(categoryLabel, categoryUri, upperCategoryLabel, upperCategoryUri );
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
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql",params));
}

/**
 * Create game button click event listener (create game panel).
 * Create a new game using the parameters entered in the game creation popup window.
 */
function onDoCreateGameBtClick(event)
{
    var roomName = "Test"; //$("#gameNameIn").val();
    var roomType = "TestType"; //$("#gameTypeDd").jqxDropDownList('getSelectedItem').label;
    var roomCategory = "TestCategory"; //$("#categoryList").jqxListBox('getSelectedItem').label;

    if (roomName != "")
    {
        var params = {};
        params.roomName = roomName;
        params.roomType = roomType;
        params.roomCategory = roomCategory;
        sfs.send(new SFS2X.Requests.System.ExtensionRequest("createRoom", params));
    }
}

function populateCategoryList(data)
{
    var categories = data.results.bindings;
    trace(categories);
    var data = new Array();
    categories.forEach(function(category) {
        var categoryLabel = category.categoryLabel.value;
        var categoryUri = category.categoryUri.value;
        var upperCategoryLabel = (typeof category.upperCategoryLabel === "undefined" ? "" : category.upperCategoryLabel.value);
        var upperCategoryUri = (typeof category.upperCategoryUri === "undefined" ? "" : category.upperCategoryUri.value);
        var row = {};
        row["categoryLabel"] = toTitleCase(categoryLabel);
        row["categoryUri"] = categoryUri;
        row["upperCategoryLabel"] = toTitleCase(upperCategoryLabel);
        row["upperCategoryUri"] = upperCategoryUri;
        data.push(row);
    });
    data.sort(function(a,b) {return (a.categoryLabel > b.categoryLabel) ? 1 : ((b.categoryLabel > a.categoryLabel) ? -1 : 0);} );

    var source =
    {
        localData: data,
        dataType: "array",
        dataFields:
            [
                { name: 'categoryLabel', type: 'string' },
                { name: 'categoryUri', type: 'string' },
                { name: 'upperCategoryLabel', type: 'string' },
                { name: 'upperCategoryUri', type: 'string' }
            ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#categoryList").jqxDataTable({
        width: "95%",
        height:300,
        source: dataAdapter,
        pageable:false,
        showHeader: false,
        selectionMode: 'singleRow',
        columns: [
            { text: 'Category', dataField: 'categoryLabel', width: "100%", autoCellHeight: false}
        ]
    });

    $("#createGameWinTabs").jqxTabs({selectedItem: 1});
    $("#categoryList").on('rowSelect', function (event) {$("#nextTopicBt").jqxButton({disabled:false});});
}

function populateTopicList(data, sentParams)
{
    var topics = data.results.bindings;
    trace(topics);
    var maxPop = 0;
    topics.forEach(function(topic) {
        var pop = parseFloat(topic.popularity.value);
        if (pop > maxPop)
            maxPop = pop;
    })

    var data = new Array();
    topics.forEach(function(topic) {
        var topicURI = topic.subject.value;
        var topicName = decodeURI(topicURI);
        topicName = topicName.split(':')[2];
        topicName = topicName.replace(/_/g, " ");
        var topicCount = topic.count.value;
        var topicPopularity = topic.popularity.value;
        var row = {};
        row["name"] = topicName;
        row["count"] = topicCount;
        row["popularity"] = '<progress max="' + maxPop + '" value="' + topicPopularity +'"></progress>';
        row["uri"] = topicURI;
        row["categoryUri"] = sentParams.categoryUri
        data.push(row);
    });
    var source =
    {
        localData: data,
        dataType: "array",
        dataFields:
            [
                { name: 'name', type: 'string' },
                { name: 'count', type: 'integer' },
                { name: 'popularity' },
                { name: 'uri', type: 'string' },
                { name: 'categoryUri', type: 'string' }
            ],
        sortcolumn: 'name',
        sortdirection: 'asc'
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    $("#topicList").jqxDataTable({
        height:290,
        source: dataAdapter,
        pageable:false,
        rowDetails: true,
        showHeader: true,
        sortable: true,
        initRowDetails: initRowDetails,
        selectionMode: 'singleRow',
        columns: [
            { text: 'Topic', dataField: 'name', width: 190, autoCellHeight: false},
            { text: '#', dataField: 'count', width: 45, align: 'center', cellsAlign: 'center'},
            { text: 'Popularity', dataField: 'popularity', width: 80, align: 'center', cellsAlign: 'center'},
        ]
    });
    $("#createGameWinTabs").jqxTabs({selectedItem: 2});
    $("#topicList").on('rowSelect', function (event) {$("#doCreateGameBt").jqxButton({disabled:false});});
}



function initRowDetails(id, row, element, rowinfo) {
    last_row_opened = element;
    $("#topicList").jqxDataTable('showDetails', id);
    rowinfo.detailsHeight = DETAILS_HEIGHT;
    //var category = $("#categoryList").jqxDataTable('getSelection')[0];
    var level = $("#gameDifficultyDd").jqxDropDownList('getSelectedItem').label;
    var params = {};
    params.type = "getEntries";
    params.category = row.categoryUri;
    params.level = level;
    params.uri = row.uri;
    trace(params);
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("sparql",params));
}

function populateEntryList(data)
{
    var entries = data.results.bindings;
    trace(entries);
    var data = new Array();
    entries.forEach(function(entry) {
        var entryName = entry.name.value;
        var entryUri = "<a href=" + entry.website.value + " target='_blank'>WikiLink</a>";
        var row = {};
        row["name"] = entryName;
        row["uri"] = entryUri;
        data.push(row);
    });
    data.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
    var source =
    {
        localData: data,
        dataType: "array",
        dataFields:
            [
                { name: 'name', type: 'string' },
                { name: 'uri', type: 'string' }
            ]
    };

    last_row_opened.append($("<div style='margin: 10px;'></div>"));
    var nestedDataTable = $(last_row_opened.children()[0]);
    var dataAdapter = new $.jqx.dataAdapter(source);
    nestedDataTable.jqxDataTable({
        width: 310,
        height:DETAILS_HEIGHT-30,
        source: dataAdapter,
        enableHover: false,
        selectionMode: 'custom',
        pageable:false,
        showHeader: false,
        columns: [
            { text: 'Entry', dataField: 'name', width: 200, autoCellHeight: false},
            { text: 'Link', dataField: 'uri', align: 'center', cellsAlign: 'center', width: 80}
        ]
    });

}