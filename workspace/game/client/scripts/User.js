function updateUserLists() {
    sfs.send(new SFS2X.Requests.System.ExtensionRequest("getAllUsersInZone"));
}

function populateUsersLists(lists) {
    var usersInLobby = lists.usersInLobby;
    var data = new Array();
    for (var index in usersInLobby) {
        var user = usersInLobby[index];
        var row = {};
        row["name"] = user[0];
        row["rank"] = user[1];
        data.push(row);
    }
    var source =
    {
        localData: data,
        dataType: "array",
        dataFields:
            [
                { name: 'name', type: 'string' },
                { name: 'rank', type: 'int' }
            ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#userList").jqxDataTable({source: dataAdapter});

    var usersInRooms = lists.usersInRooms;
    data = new Array();
    for (var index in usersInRooms) {
        var user = usersInRooms[index];
        var row = {};
        row["name"] = user[0];
        row["rank"] = user[1];
        data.push(row);
    }
    source =
    {
        localData: data,
        dataType: "array",
        dataFields:
            [
                { name: 'name', type: 'string' },
                { name: 'rank', type: 'int' }
            ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#userInRoomsList").jqxDataTable({source: dataAdapter, sortable: true});

    $("#usersInLobbyHeader").text("Available Players (" + usersInLobby.length + ")");
    $("#usersInRoomsHeader").text("In Rooms (" + usersInRooms.length + ")");
    //TODO add ranking list
}