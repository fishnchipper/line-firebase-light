



function LineSignInUI(redirect) {

    this._line = new Line();
    this._redirect = redirect;
    this._spinner = new Spinner();

    //this.isSignIn();
    this.signInWithOAuthProviders();
    this.signInWithEmailPass();
};

LineSignInUI.prototype.isSignIn = function() {

    let self = this;

    console.log("--- ", self._line.isSignIn());

    if(self._line.isSignIn() && self._line.getJwt()) {
        self._line.redirect(self._redirect);
    }
}


LineSignInUI.prototype.__signUpHelper = function(__name){
    let self = this;
    $('#line-title').html('');
    $('#line-user-image').remove();
    let signupHtml = `<div class="tab-content" id="myTabContent">
                            <p style="font-size: 2em">Hello ` + __name +
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

        self._line.signInGoogleAuthGoogleOAuth((__result, __user) => {
            self._spinner.stop();
            if(__result.status == "signUpRequired") {
                console.log("--- hello ",__user.claims.name, '. You need to sign up.');
                self.__signUpHelper(__user.claims.name);
            }else if(__result.status == "signedUp"){
                console.log("--- ", __user.claims.name, ' successfuly signed in with role:', __user.claims.role);
                self._line.redirect('/service');
            }else if(__result.status == "fail"){
                console.log("--- error: ", __result);
            }
        })
        .then(() => {
            // A page redirect would suffice as the persistence is set to NONE.
            return self._line.signOut();
        }).then(() => {
            window.location.assign('/');
        });

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

        self._line.signinWithEmailPass(userObj, self._redirect, function(err, response) {
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


