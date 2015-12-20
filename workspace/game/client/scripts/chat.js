function onSendMessageBtClick()
{
    var chatWindow = (inGame ? $("#gameMsgIn") : $("#publicMsgIn"));
    if(chatWindow != "") {
        var isSent = sfs.send(new SFS2X.Requests.System.PublicMessageRequest(chatWindow.val()));
        if (isSent)
            chatWindow.val("");
    }
}

function onPublicMessage(event)
{
    var sender = (event.sender.isItMe ? "You" : event.sender.name);
    writeToChatArea("<b>" + sender + ": </b>" + event.message);
}

function writeToChatArea(text) {
    var chatWindow = (inGame ? $("#gameChatAreaPn") : $("#publicChatAreaPn"));
    chatWindow.jqxPanel("append", "<p class='chatAreaElement'>" + text + "</p>");
    if (chatWindow.jqxPanel("getScrollHeight") != 1000)
        chatWindow.jqxPanel("scrollTo", 0, chatWindow.jqxPanel("getScrollHeight"));

}