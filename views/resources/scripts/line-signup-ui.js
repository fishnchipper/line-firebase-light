


(function(_initUI, _eHanlder) {

    let initUI = _initUI();
    let eHandler = _eHanlder();

    eHandler.clickGoogleBtn();

})(function() {  // initialization
    function main() {
        function init() {}
        return init;
    }
    return main();
    
},function() {  // event handler
    function main() {

        let spinner = new Spinner();
        let userInfo = null;
        let _signUpHelper = function(_user){
            $('#line-signin-link').remove();
            let signupHtml = `<div class="tab-content" id="myTabContent">                        
                                    <div class="tab-pane fade show active" role="tabpanel" style="margin-top: 3em;">
                                        <button id="line-signup-btn" class="btn btn-lg btn-secondary btn-block">Continue Sign Up</button>
                                    </div>
                                    <p style="margin-top: 2em;">by continuing, you agree to <a href="">Line's Policy & Terms of Use</a></p>
                                    <hr>
                                    <p style="margin-top: 1em;"><a href="/" >Not this time</a></p>
                                
                              </div>`;
            //$('#line-title').html("");
            //$("#line-subtitle").html("Hello " + __user.claims.name);
            //$("#line-sub-title").html(`<p style="margin-top: 1em;">You are not with us yet. Please join!</p>`);
            //$("#line-user-image").attr("src", __user.claims.picture);
            $("#line-sign-form").html(signupHtml);
        
            $("#line-signup-btn").click((e) => {
                e.preventDefault();
                spinner.spin($(".card-container").get(0));
                console.log("--- signup btn clicked");
                Line.signUpWithSocial("google", Line.getUserId())
                .then((_response) => {
                    let response = JSON.parse(_response);
                    spinner.stop();
                    console.log("--- signup res: ", response.status);
                    if(response.status === "success") {
                        console.log("--- signup successful");
                        Line.redirect('/auth/signin');
                    }else if(response.status === "error") {
                        console.log("--- signup fail");
                        Line.redirect('/oops');
                    }else {
                        Line.redirect('/oops');
                    }
                })
                .catch((error) => {
                    console.log("--- error: ", error);
                    spinner.stop();
                    Line.redirect('/oops')
                }) 
            });
        }

        function eHandler() {}

        eHandler.clickGoogleBtn = function() {
            let signUpGoogleButton = $("#sl-signup-google-btn");
            signUpGoogleButton.click(function(e) {
                e.preventDefault();
                spinner.spin($(".card-container").get(0));
                console.log("--- google signup clicked");
        
                Line.signInGoogleAuthGoogleOAuth()
                .then((_response) => {
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
                        Line.redirect('/oops');
                    }
                })
                .catch((error) => {
                    console.log("--- error: ", error);
                    spinner.stop();
                    Line.redirect('/oops')
                })        
            });
        }
        return eHandler;
    }
    return main();
});


/*
function LineSignUpUI(redirect) {

    this._line = new Line();
    this._redirect = redirect;
    this._spinner = new Spinner();

    //this.isSignIn();
    this.signUpWithOAuthProvider();
};



LineSignUpUI.prototype.signUpWithOAuthProvider = function() {
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


*/