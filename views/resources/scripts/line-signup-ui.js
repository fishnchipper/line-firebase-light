



function LineSignUpUI(redirect, auth) {

    this._line = new Line(auth);
    this._redirect = redirect;
    this._spinner = new Spinner();

    //this.isSignIn();
    this.signUpWithGoogleOAuth();
};



LineSignUpUI.prototype.signUpWithGoogleOAuth = function() {
    let self = this;
    let signUpGoogleButton = $("#sl-signup-google-btn");
    signUpGoogleButton.click(function(e) {
        e.preventDefault();
        self._spinner.spin($(".card-container").get(0));
        console.log("--- google signup clicked");

        self._line.signInGoogleAuthGoogleOAuth((__result, __user) => {
            self._spinner.stop();
            if(__result.status == "signUpRequired") {
                console.log("--- hello ",__user.claims.name, '. You need to sign up.');
                self.__signUpHelper(__user);
            }else if(__result.status == "signedUp"){
                console.log("--- ", __user.claims.name, ' successfuly signed in with role:', __user.claims.role);
                self._line.redirect('/service');
            }else if(__result.status == "fail"){
                console.log("--- error: ", __result);
            }
        });

    });
}

LineSignUpUI.prototype.__signUpHelper = function(__user){
    let self = this;
    $('#line-signin-link').remove();
    let signupHtml = `<div class="tab-content" id="myTabContent">                        
                            <div class="tab-pane fade show active" role="tabpanel" style="margin-top: 3em;">
                                <button id="line-signup-btn" class="btn btn-lg btn-secondary btn-block">Continue Sign Up</button>
                            </div>
                            <p style="margin-top: 2em;">by continuing, you agree to <a href="">Line's Policy & Terms of Use</a></p>
                            <hr>
                            <p style="margin-top: 1em;"><a href="/" >Not this time</a></p>
                        
                      </div>`;
    $('#line-title').html("");
    $("#line-subtitle").html("Hello " + __user.claims.name);
    //$("#line-sub-title").html(`<p style="margin-top: 1em;">You are not with us yet. Please join!</p>`);
    $("#line-user-image").attr("src", __user.claims.picture);
    $("#line-sign-form").html(signupHtml);

    $("#line-signup-btn").click((e) => {
        e.preventDefault();
        console.log("--- signup btn clicked");
        self._line.signUpWithSocial("google", __user.claims.user_id, (res)=> {
            console.log("--- signup res: ", res.status);
            if(res.status === "success") {
                console.log("--- signup successful");
                self._line.redirect('/service');
            }else if(res.status === "error") {
                console.log("--- error: ", res.status);
            }else if(res.status === "fail") {
                console.log("--- error: ", res.status);
            }
        });
    });
}


