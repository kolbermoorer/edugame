function joinLobbyRoom()
{
    if (sfs.lastJoinedRoom == null || sfs.lastJoinedRoom.name != LOBBY_ROOM_NAME)
        sfs.send(new SFS2X.Requests.System.JoinRoomRequest(LOBBY_ROOM_NAME));
}

/*
 Dispatched when a new Room was created inside the Zone under any of the Room Groups that the User is listening for
 */
function onRoomAdd(event)
{
    trace("Room added: " + event.room);
    updateUserLists();
    updateRoomsList(event.room);
}

/*
 Dispatched whenever a Room is removed from the Zone, under any of the Room Groups that the User is listening for
 */
function onRoomRemove(event)
{
    trace("Room removed: " + event.room);
    updateUserLists();
    populateRoomsList();

}

/*
 Dispatched when a Room is joined by the current user
 */
function onRoomJoin(event)
{
    trace("Room joined: " + event.room);

    // User joined the lobby
    if (event.room.name == LOBBY_ROOM_NAME)
    {
        setView("lobby", true);
        currentGameStarted = false;
    }
    // User joined a game
    else
    {
        inGame = true;
        setView("game", true);
        // Initialize the game
        setReadyStatus();
    }
}

/*
 Dispatched when an error occurs while the current user is trying to join a Room
 */
function onRoomJoinError(event)
{
    //TODO
}

/*
 Dispatched when one of the Rooms joined by the current user is entered by another user
 */
function onUserEnterRoom(event)
{
    if (event.room.name == LOBBY_ROOM_NAME)
    {
        if(!inGame) {
            writeToChatArea("<em>User " + event.user.name + " entered the lobby</em>");
            updateUserLists();
            populateRoomsList();
        }
    }
    else
    {
        writeToChatArea("<em>User " + event.user.name + " entered the game</em>");
    }
}

/*
 Dispatched when one of the Rooms joined by the current user is left by another user, or by the current user himself
 */
function onUserExitRoom(event)
{
    if (event.room.name == LOBBY_ROOM_NAME)
    {
        updateUserLists();
        populateRoomsList();
    }
    else
    {

    }
}

function onJoinGameBtClick()
{
    //noinspection JSUnresolvedFunction
    var roomId = $("#roomTable").jqxDataTable('getSelection')[0].id;
    var room = sfs.getRoomById(roomId);
    sfs.send(new SFS2X.Requests.System.JoinRoomRequest(room));
}

/**
 * Update the table with rooms overview
 */
function populateRoomsList()
{
    var rooms = sfs.roomManager.getRoomList();
    var data = [];
    for (var r in rooms)
    {
        var room = rooms[r];
        if (room.isGame)
        {
            var players = room.getUserCount();
            var maxPlayers = room.maxUsers;
            var roomId = room.id;
            var roomName = room.name;
            var roomType = room.variables["type"].value;
            var roomPlayers = players + "/" + maxPlayers;
            //var roomCategories = room.variables.category.value;
            var row = {};
            row["id"] = roomId;
            row["name"] = roomName;
            row["type"] = roomType;
            row["players"] =roomPlayers;
            row["categories"] = "";
            row.roomObj = room;
            data.push(row);
        }
    }
    var source =
    {
        localData: data,
        dataType: "array",
        dataFields:
            [
                { name: 'id', type: 'string' },
                { name: 'name', type: 'string' },
                { name: 'type', type: 'string' },
                { name: 'players', type: 'string' },
                { name: 'categories', type: 'string' }
            ],
        sortcolumn: 'players',
        sortdirection: 'asc'
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#roomTable").jqxDataTable({source: dataAdapter});

    $("#roomTable").on('rowClick', function (event) {
        var lastSelectedGame = $("#roomTable").jqxDataTable('getSelection')[0];
        if (typeof lastSelectedGame == 'undefined') {
            $("#joinGameBt").jqxButton({disabled:false});
            $("#roomTable").jqxDataTable('selectRow', event.args.index);
        }
        else {
            $("#roomTable").jqxDataTable('unselectRow', lastSelectedGame.uid);
            if(lastSelectedGame.uid == event.args.index) {
                $("#joinGameBt").jqxButton({disabled:true});
            }
            else
                $("#roomTable").jqxDataTable('selectRow', event.args.index);
        }
    });

}

function updateRoomsList(room) {
    $("#roomTable").jqxDataTable('addRow', null, {
        id: room.id,
        name: room.name,
        type: room.variables.type.value,
        players: "1/2",
        categories: room.variables.category.value
    }, 'first');
}

function updatePlayersInRoom (room) {
    var rows = $("#roomTable").jqxDataTable('getRows');
    for (var i = 0; i < rows.length; i++) {
        var rowRoomId = rows[i].id;
        if(rowRoomId == room.roomId) {
            $("#roomTable").jqxDataTable('updateRow', rows[i].uid, {id: rowRoomId, name: rows[i].name, type: rows[i].type, players: room.countPlayers + "/2", categories: rows[i].categories});
        }
    }
}