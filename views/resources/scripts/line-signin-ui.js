

(function(_initUI, _eHanlder) {

    let initUI = _initUI();
    let eHandler = _eHanlder();

    eHandler.clickGoogleBtn();
    eHandler.clickEmailPasswordBtn();

})(function() {  // initialization
    function main() {
        function init() {}

        return init;
    }
    return main();
    
},function() {  // event handler
    function main() {

        let spinner = new Spinner();
        let _signUpHelper = function(){
            $('#line-signup-link').remove();
            let signupHtml = `<div class="tab-content" id="myTabContent">
                                    <p>Sign Up required.</p>
                                    <p style="margin-top: 4em;">Redirecting to Sign Up <span id="time-left"></span></p>
                              </div>`;
            $("#line-sign-form").html(signupHtml);
        
            window.setInterval(function() {
                    let timeLeft = $("#time-left").html();
                    if(timeLeft === '...') {
                        window.location= ("/auth/signup");
                    } else if (timeLeft === '..'){
                        $("#time-left").html('...');
                    } else if (timeLeft === '.'){
                        $("#time-left").html('..');
                    } else if (timeLeft === ''){
                        $("#time-left").html('.');
                    }
                }, 1000);
        }

        function eHandler() {}

        let _responseHelper = function(_response) {
            let response = JSON.parse(_response);
            console.log("--- result: ", response.status);
            spinner.stop();
            if(response.status == "signUpRequired") {
                console.log("--- sign up required.");
                _signUpHelper();
            }else if(response.status == "signedUp"){
                console.log("--- successfuly signed");
                Line.redirect('/service');
            }else if(response.status == "fail"){
                console.log("--- error: ", __result);
                //Line.redirect('/oops');
            }
        }
        let _errorHelper = function(error) {
            console.log("--- error: ", error);
            spinner.stop();
            let err;
            if(error.responseText) {
                err = JSON.parse(error.responseText);
            } else {
                err = error;
            }
            let code = err.code;
            let message = err.message;
            $('#line-signin-status').html(message);
        }        
        eHandler.clickGoogleBtn = function() {
            let signInGoogleButton = $("#sl-signin-google-btn");
            signInGoogleButton.click(function(e) {
                e.preventDefault();
                spinner.spin($(".card-container").get(0));
                console.log("--- google signin clicked");
        
                Line.auth().signInWithGoogleAuth()
                .then(_responseHelper)
                .catch(_errorHelper)
            });
        }
        eHandler.clickEmailPasswordBtn = function() {
            let signInEmailPasswordBtn = $("#line-signin-btn");
            signInEmailPasswordBtn.click(function(e) {
                e.preventDefault();
                spinner.spin($(".card-container").get(0));
                let email = $('#line-signin-email').val();
                let password = $('#line-signin-pw').val();
                let credential = {email: email, password: password}
                Line.auth().signInWithEmailPassword(credential)
                .then(_responseHelper)
                .catch(_errorHelper)
            });
        }

        return eHandler;
    }
    return main();
});


/*

function LineSignInUI(redirect) {

    //this._line = new Line();
    this._redirect = redirect;
    this._spinner = new Spinner();

    //this.isSignIn();
    this.signInWithOAuthProviders();
    this.signInWithEmailPass();
};

LineSignInUI.prototype.isSignIn = function() {

    let self = this;

    console.log("--- ", Line.isSignIn());

    if(Line.isSignIn() && Line.getJwt()) {
        Line.redirect(self._redirect);
    }
}


LineSignInUI.prototype.__signUpHelper = function(){
    let self = this;
    $('#line-title').html('');
    $('#line-user-image').remove();
    let signupHtml = `<div class="tab-content" id="myTabContent">
                            <p style="font-size: 2em">Hello`+
                            `<p>Sign Up required.</p>
                            <p style="margin-top: 4em;">Redirecting to Sign Up <span id="time-left"></span></p>
                      </div>`;
    $("#line-sign-form").html(signupHtml);

    window.setInterval(function() {
            let timeLeft = $("#time-left").html();
            if(timeLeft === '...') {
                window.location= ("/user/signup");
            } else if (timeLeft === '..'){
                $("#time-left").html('...');
            } else if (timeLeft === '.'){
                $("#time-left").html('..');
            } else if (timeLeft === ''){
                $("#time-left").html('.');
            }
        }, 1000);
}

LineSignInUI.prototype.__eventHandlerGoogleBtnClick = function() {
    let self = this;
    let signInGoogleButton = $("#sl-signin-google-btn");
    signInGoogleButton.click(function(e) {
        e.preventDefault();
        self._spinner.spin($(".card-container").get(0));
        console.log("--- google signin clicked");

        window.Line.signInGoogleAuthGoogleOAuth()
        .then((_response) => {
            let response = JSON.parse(_response);
            console.log("--- result: ", response.status);
            self._spinner.stop();
            if(response.status == "signUpRequired") {
                console.log("--- sign up required.");
                self.__signUpHelper();
            }else if(response.status == "signedUp"){
                console.log("--- successfuly signed");
                Line.redirect('/service');
            }else if(response.status == "fail"){
                console.log("--- error: ", __result);
            }
        })
        .catch((error) => {
            console.log("--- error: ", error);
            self._spinner.stop();
            Line.redirect('/error')
        })

    });

}

LineSignInUI.prototype.signInWithOAuthProviders = function() {
    let self = this;
    self.__eventHandlerGoogleBtnClick();
}



LineSignInUI.prototype.signInWithEmailPass = function() {

    let self = this;

    let signinButton = $("#sl-signin-btn");
    signinButton.click(function(e) {
        e.preventDefault();
        signinButton.css("visibility", "hidden");
        $("#sl-signin-status").hide();
        self._spinner.spin($(".card-container").get(0));

        let userObj = { email: $("#sl-signin-email").val(), password: $("#sl-signin-pw").val()};
        console.log("--- Login credential! --->", userObj);

        Line.signinWithEmailPass(userObj, self._redirect, function(err, response) {
            self._spinner.stop();
            signinButton.css("visibility", "visible");
            if(err) {
                $("#sl-signin-status").html("Error: signin<br>Please contact nwops@nttict.com");
                console.log("--- error --->", err);
            }else if(response.res === 'match.account') {
                console.log("--- Authenticated successfully :", response.account);
                
            }else {
                console.log("--- error --->", response);
                $("#sl-signin-status").show();
                switch(response.res) {
                    case 'comm.error':
                        $("#sl-signin-status").html("Communication Error: " + response.message + "<br>Please retry or contact nwops@nttict.com.");
                    break;
                    case 'wrong_username.account':
                        $("#sl-signin-status").html("Can't find the email<br>Please retry");
                    break;
                    case 'wrong_password.account':
                        $("#sl-signin-status").html("Wrong password<br>Please retry or reset password");
                    break;
                    default:
                        $("#sl-signin-status").html("Incorrect email or password<br>Please retry or reset password");
                }
            }
        });
    }); // end of signinButton.click
}

*/
