var sfs = null;
var captchaSolved = false;

function init()
{
    trace("Registration started");
    // Create configuration object
    var config = {};
    config.host = "52.27.156.152"; //"52.25.12.255" localhost
    config.port = 8888;
    config.zone = "Registration";
    config.debug = true;

    // Create SmartFox client instance
    sfs = new SmartFox(config);
    trace("SmartFox API version: " + sfs.version);
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
    sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);

    $(document).on("click", "#toLoginBt", onToLoginBtClick);
    $(document).on("click", "#agreeBox", onAgreeBoxBtClick);

    $('.input').bind('input', function() {
        var c = this.selectionStart,
            r = /[^a-z0-9]/gi,
            v = $(this).val();
        if(r.test(v)) {
            $(this).val(v.replace(r, ''));
            c--;
        }
        this.setSelectionRange(c, c);
    });
}

function onToLoginBtClick()
{
    window.open("http://tkutschk.dubhe.uberspace.de/game/client/index.html","_self");
}

function onRegisterBtClick()
{
    if(!sfs.isConnected())
        sfs.connect();
    else
        performSignup();
}

function onAgreeBoxBtClick()
{
    if($('#agreeBox').is(":checked"))
        $("#statusText").css("display", "none");
}

function onConnection()
{
    sfs.send(new SFS2X.Requests.System.LoginRequest(null));
}

function onLogin() {
    performSignup();
}

function onCaptchaFilled(event) {
    $("#captchaWrapper").css("display", "none");
    $("#statusText").css("margin-top", "-2px");
    $("#content form input[type='submit']").css("margin-top", "0px");
    $("#statusText").css("display", "none");
    captchaSolved = true;
}

function performSignup () {
    if(!captchaSolved) {
        var v = grecaptcha.getResponse();
        if(v.length == 0)
        {
            setStatusText("You can't leave Captcha Code empty", false);
            return false;
        }
        else
            captchaSolved = true;
    }
    else
    {
        var password = $('#password').val();
        var passwordConf = $('#passwordConfirmation').val();
        if(password != passwordConf) {
            setStatusText("The passwords do not match", false);
        }
        else if(!$('#agreeBox').is(":checked")) {
            setStatusText("Please do agree by confirming the checkbox. ", false);
        }
        else {
            var params = {};
            params.username = $("#username").val();
            params.password = $("#password").val();
            params.email = $("#email").val();
            sfs.send(new SFS2X.Requests.System.ExtensionRequest("$SignUp.Submit", params));
        }
    }

}

function setStatusText(text, success) {
    var statusText = $("#statusText");
    statusText.css("display", "block");
    statusText.text(text);
    if(success) {
        statusText.css("background", "#badc52");
        statusText.css("color", "green");
        statusText.css("border", "1px solid green");
    }
    else {
        statusText.css("background", "#fecccb");
        statusText.css("color", "red");
        statusText.css("border", "1px solid red");
    }
}

function onExtensionResponse(event)
{
    var errorMessage = event.params.errorMessage;
    if(errorMessage == "User name is too short, min. amount of characters is 4")
        errorMessage = "User name is too short, min. 4 characters.";
    else if(errorMessage == "Password is too short, min. amount of characters is 8")
        errorMessage = "Password is too short, min. 8 characters.";

    if(errorMessage == null ) { //created successfully
        setStatusText("User was created succesfully.", true);
    }
    else {
        setStatusText(errorMessage, false);
    }
    //trace(event);

}

function trace(txt, showAlert)
{
    console.log(txt);

    if (showAlert)
        alert(txt);
}