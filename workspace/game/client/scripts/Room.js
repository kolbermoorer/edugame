var joined;

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
    console.log("Room added: " + event.room);
    updateUserLists();
    insertRoomInTable(event.room);
}

/*
 Dispatched whenever a Room is removed from the Zone, under any of the Room Groups that the User is listening for
 */
function onRoomRemove(event)
{
    console.log("Room removed: " + event.room);
    updateUserLists();
    removeRoomFromTable(event.room);

}

/*
 Dispatched when a Room is joined by the current user
 */
function onRoomJoin(event)
{
    console.log("Room joined: " + event.room);

    // User joined the lobby
    if (event.room.name == LOBBY_ROOM_NAME)
    {
        setView("lobby", true);
        currentGameStarted = false;
    }
    // User CREATED AND JOINED a game
    else
    {
        if(!joined) {
            inGame = true;
            if(gameType == "single")
                setView("game", true);
            else {
                closeGameBt.jqxButton({disabled:false});
                createGameBt.jqxButton({disabled:true});
                waitGameWin.jqxWindow('open');
            }
            setReadyStatus();
        }
        else {
            onJoin();
        }
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
            //populateRoomsList();
            //sfs.send( new SFS2X.Requests.System.ExtensionRequest("populateRoomsList") );
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
        //populateRoomsList();
    }
    else
    {
        //console.log(event);
        //sfs.send( new SFS2X.Requests.System.ExtensionRequest("getBadges") );
    }
}

function onCloseGameBtClick()
{
    inGame = false;
    closeGameBt.jqxButton({disabled:true});
    createGameBt.jqxButton({disabled:false});
    if (sfs.lastJoinedRoom == null || sfs.lastJoinedRoom.name != LOBBY_ROOM_NAME)
        sfs.send(new SFS2X.Requests.System.LeaveRoomRequest());
}


function onJoinGameBtClick()
{
    joined = true;
    joinGameBt.jqxButton({disabled:true});
    var roomId = $("#roomTable").jqxDataTable('getSelection')[0].id;
    var room = sfs.getRoomByName("Room" + roomId);
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
            var roomNo = room["name"].replace("Room", "");
            var roomName = room["name"];
            var roomMode = room.variables["mode"].value;
            var roomLevel = room.variables["level"].value;
            var roomPlayers = players + "/" + maxPlayers;
            var userList = room.variables["userList"].value;
            var roomCategories = room.variables["categories"].value;
            var status = room.variables["status"].value;
            var row = {};
            row["id"] = roomNo;
            row["name"] = roomName;
            row["mode"] = roomMode;
            row["level"] = roomLevel;
            row["players"] =roomPlayers;
            row["userList"] =JSON.stringify(userList);
            row["categories"] = roomCategories;
            row["status"] = status;
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
                { name: 'mode', type: 'string' },
                { name: 'players', type: 'string' },
                { name: 'userList', type: 'string' },
                { name: 'level', type: 'string' },
                { name: 'categories', type: 'array' },
                { name: 'status', type: 'string' }
            ],
        sortcolumn: 'players',
        sortdirection: 'asc'
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#roomTable").jqxDataTable({source: dataAdapter});

    $('#roomTable').on('rowSelect',
        function (event)
        {
            var status = event.args.row.status;
            if(status != "Waiting" || inGame) {
                $("#roomTable").jqxDataTable('unselectRow', args.index);
                $("#joinGameBt").jqxButton({disabled:true});
            }
            else {
                $("#joinGameBt").jqxButton({disabled:false});
            }
        });
}

function insertRoomInTable(room) {
    var mode = room.variables.mode.value;
    var level = room.variables.level.value;
    var rows = $("#roomTable").jqxDataTable('getRows');
    //for (var i = 0; i < rows.length; i++) {
    //    rows[i].uid += 1;
    //}

    $("#roomTable").jqxDataTable('addRow', null, {
        id: room.name.replace("Room", ""),
        name: room.name,
        mode: mode,
        level: level,
        players: (mode == "single" ? "1/1" : "1/2"),
        userList: JSON.stringify(room.variables["userList"].value),
        categories: room.variables.categories.value,
        status: room.variables["status"].value
    }, 'last');

   // $("#roomTable").jqxDataTable('getRows')[0].uid = 0;

}

function removeRoomFromTable (room) {
    var rows = $("#roomTable").jqxDataTable('getRows');
    for (var i = 0; i < rows.length; i++) {
        var rowRoomName = rows[i].name;
        if(rowRoomName == room.name) {
            $("#roomTable").jqxDataTable('deleteRow', i /*rows[i].uid*/);
            return;
        }
    }
}



function updateRoomData (serverRoomData) {
    var rows = $("#roomTable").jqxDataTable('getRows');
    for (var i = 0; i < rows.length; i++) {
        var rowRoomName = rows[i].name;
        var room = sfs.roomManager.getRoomByName(serverRoomData["roomName"]);
        var status = $.grep(room.getVariables(), function(e){ return e.name == "status"; });
        if(rowRoomName == room.name) {
            $("#roomTable").jqxDataTable('updateRow', rows[i].uid, {id: rows[i].id, name: rows[i].name, mode: rows[i].mode, level: rows[i].level, players: serverRoomData["countPlayers"] + "/" + serverRoomData["maxPlayers"], categories: rows[i].categories, status: serverRoomData["status"]});
            $("#roomTable").jqxDataTable('unselectRow', rows[i].uid);
            $("#joinGameBt").jqxButton({disabled:true});
        }
    }
}

function updateCategoriesInRoom (room) {
    var rows = $("#roomTable").jqxDataTable('getRows');
    for (var i = 0; i < rows.length; i++) {
        var rowRoomName = rows[i].name;
        if(rowRoomName == room["roomName"]) {
            $("#roomTable").jqxDataTable('updateRow', rows[i].uid, {id: rows[i].id, name: rows[i].name,  mode: rows[i].mode, level: rows[i].level, players: rows[i].players, categories: room["categories"], status: "Full"});
        }
    }
}

function onRoomTableRowEnter (room) {
    var roomID = room.target.dataset.row;
    roomInfoWin.jqxWindow('move', event.pageX+30, event.pageY+30);
    roomInfoWin.jqxWindow('setTitle', 'Players in room #' + roomID);

    var playersInRoom = JSON.parse(room.target.dataset.users);

    var source =
    {
        localData: playersInRoom,
        dataType: "array",
        dataFields:
            [
                { name: 'name', type: 'string' },
                { name: 'points', type: 'int' }
            ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    roomInfoWinTable.jqxDataTable({source: dataAdapter, sortable: true});


    roomInfoWin.jqxWindow('open');
}

function onRoomTableRowExit () {
    roomInfoWin.jqxWindow('close');
}

