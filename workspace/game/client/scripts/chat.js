

/**
 * Public message send button click handler.
 * Send a public message, which will be displayed in the chat area (see onPublicMessage event).
 */
function onSendPublicMessageBtClick(event)
{
    if ($("#publicMsgIn").val() != "")
    {
        var isSent = sfs.send(new SFS2X.Requests.System.PublicMessageRequest($("#publicMsgIn").val()));

        if (isSent)
            $("#publicMsgIn").val("");
    }
}

function onPublicMessage(event)
{
    var sender = (event.sender.isItMe ? "You" : event.sender.name);

    if (event.room.name == LOBBY_ROOM_NAME)
        writeToLobbyChatArea("<b>" + sender + ": </b>" + event.message);
}

function writeToLobbyChatArea(text)
{
    $("#publicChatAreaPn").jqxPanel("append", "<p class='chatAreaElement'>" + text + "</p>");

    if ($("#publicChatAreaPn").jqxPanel("getScrollHeight") != 1000)
        $("#publicChatAreaPn").jqxPanel("scrollTo", 0, $("#publicChatAreaPn").jqxPanel("getScrollHeight"));
}