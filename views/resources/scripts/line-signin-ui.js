



function LineSignInUI(redirect, auth) {

    this._line = new Line(auth);
    this._redirect = redirect;
    this._spinner = new Spinner();

    this.isSignIn();
    this.signInWithGoogle();
    this.signInWithEmailPass();
};

LineSignInUI.prototype.isSignIn = function() {

    let self = this;

    console.log("--- ", self._line.isSignIn());

    if(self._line.isSignIn() && self._line.getJwt()) {
        self._line.redirect(self._redirect);
    }
}

LineSignInUI.prototype.signInWithGoogle = function() {
    let self = this;
    let signinGoogleButton = $("#sl-signin-google-btn");
    signinGoogleButton.click(function(e) {
        e.preventDefault();
        console.log("--- google signin clicked",  self._firebase.auth);

        var provider = new self._firebase.auth.GoogleAuthProvider();
        self._firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            console.log("--- signed-in result from firebase sdk: ", result);
            console.log("--- google credential: ", result.credential);
            console.log("--- signed-in user detail: ", user);
            self._firebase.auth().currentUser.getIdToken(true).then(function(idToken){
                console.log("--- signed-in user idToken: ", idToken);
            });

          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
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


