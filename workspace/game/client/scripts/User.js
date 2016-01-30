function updateUserLists() {
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("getAllUsersInZone"));
}

function populateUsersLists(data) {
    var usersInLobby = JSON.parse(data["usersInLobby"]);
    var source =
    {
        localData: usersInLobby,
        dataType: "json",
        dataFields:
            [
                { name: 'username', type: 'string' },
                { name: 'points', type: 'int' }
            ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#userList").jqxDataTable({source: dataAdapter});

    var usersInRooms = JSON.parse(data["usersInRooms"]);
    source =
    {
        localData: usersInRooms,
        dataType: "json",
        dataFields:
            [
                { name: 'username', type: 'string' },
                { name: 'room', type: 'string' },
                { name: 'points', type: 'int' }
            ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#userInRoomsList").jqxDataTable({source: dataAdapter, sortable: true});

    $("#usersInLobbyHeader").text("Available Players (" + usersInLobby.length + ")");
    $("#usersInRoomsHeader").text("In Rooms (" + usersInRooms.length + ")");
}

function onHighscoreBtClick() {
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("getRankingList"));
}

function populateRankingList(data) {
    var source =
    {
        localData: data,
        dataType: "json",
        dataFields: [
            { name: 'rank', type: 'int'},
            { name: 'username', type: 'string'},
            { name: 'points', type: 'int'}
        ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    rankingWinTable.jqxDataTable({source: dataAdapter, sortable: true});

    rankingWin.jqxWindow("open");
    rankingWinTable.jqxDataTable('render');
}