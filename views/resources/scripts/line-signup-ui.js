


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
        let _redirectToSignIn = function() {
            let messageHtml = `<div class="tab-content" id="myTabContent">
                                    <p>Sign Up Successful!</p>
                                    <p style="margin-top: 4em;">Redirecting to Sign In <span id="time-left"></span></p>
                              </div>`;
            $("#line-sign-form").html(messageHtml);
        
            window.setInterval(function() {
                    let timeLeft = $("#time-left").html();
                    if(timeLeft === '...') {
                        window.location= ("/auth/signin");
                    } else if (timeLeft === '..'){
                        $("#time-left").html('...');
                    } else if (timeLeft === '.'){
                        $("#time-left").html('..');
                    } else if (timeLeft === ''){
                        $("#time-left").html('.');
                    }
                }, 1000);
        }
        let _signUpHelper = function(_user){
            $('#line-signin-link').remove();
            let signupHtml = `<div class="tab-content" id="myTabContent">                        
                                    <div class="tab-pane fade show active" role="tabpanel" style="margin-top: 3em;">
                                        <button id="line-signup-btn" class="btn btn-lg btn-secondary btn-block">Continue Sign Up</button>
                                    </div>
                                    <p style="margin-top: 2em;">by continuing, you agree to <a href="">Line's Policy & Terms of Use</a></p>
                                    <hr><p style="margin-top: 1em;"><a href="/" >Not this time</a></p>                   
                              </div>`;
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
                        _redirectToSignIn();
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
