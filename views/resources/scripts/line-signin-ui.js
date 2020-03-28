

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
                Line_Firebase.redirect('/service');
            }else if(response.status == "fail"){
                console.log("--- error: ", __result);
                //Line_Firebase.redirect('/oops');
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
        
                Line_Firebase.auth().signInWithGoogleAuth()
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
                Line_Firebase.auth().signInWithEmailPassword(credential)
                .then(_responseHelper)
                .catch(_errorHelper)
            });
        }

        return eHandler;
    }
    return main();
});
