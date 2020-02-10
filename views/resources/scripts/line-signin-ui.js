



function LineSignInUI(redirect, auth) {

    this._line = new Line(auth);
    this._redirect = redirect;
    this._spinner = new Spinner();

    //this.isSignIn();
    this.signInWithGoogleOAuth();
    this.signInWithEmailPass();
};

LineSignInUI.prototype.isSignIn = function() {

    let self = this;

    console.log("--- ", self._line.isSignIn());

    if(self._line.isSignIn() && self._line.getJwt()) {
        self._line.redirect(self._redirect);
    }
}

LineSignInUI.prototype.signInWithGoogleOAuth = function() {
    let self = this;
    let signInGoogleButton = $("#sl-signin-google-btn");
    signInGoogleButton.click(function(e) {
        e.preventDefault();
        self._spinner.spin($(".card-container").get(0));
        console.log("--- google signin clicked");

        self._line.signInGoogleAuthGoogleOAuth((__result, __user) => {
            self._spinner.stop();
            if(__result.status == "signuprequired") {
                console.log("--- hello ",__user.claims.name, '. You need to sign up.');
                self.__signUpHelper(__user);
            }else {
                console.log("--- ", __user.claims.name, ' successfuly signed in with role:', __user.claims.role);
                self._line.redirect('/service');
            }
        });

    });
}

LineSignInUI.prototype.__signUpHelper = function(__user){

    let signupHtml = `<div class="tab-content" id="myTabContent">
                        
                            <div class="tab-pane fade show active" role="tabpanel" style="margin-top: 3em;">
                                <button id="line-signup-btn" class="btn btn-lg btn-secondary btn-block">Sign Up</button>
                            </div>
                            <p style="margin-top: 2em;"><a href="/" >Not this time</a></p>
                        
                      </div>`;
    $("#line-title").html("Hello " + __user.claims.name);
    $("#line-sub-title").html(`<p style="margin-top: 1em;">You are not with us yet. Please join!</p>`);
    $("#line-user-image").attr("src", __user.claims.picture);
    $("#line-sign-form").html(signupHtml);

    $("#line-signup-btn").click((e) => {
        e.preventDefault();
        console.log("--- signup btn clicked");
    });
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


