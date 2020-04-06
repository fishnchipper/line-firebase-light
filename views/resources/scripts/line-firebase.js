/**
 * hello
 */

(function(factory) {

    window.Line_Firebase = factory();

})(function(){

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    //firebase.analytics();
    // As httpOnly cookies are to be used, do not persist any state client side.
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    // for csrf token
    let randomString = ((Math.random()*Date.now())*Math.pow(10,5)).toString(16);
    Cookies.set("csrfToken", randomString, { expires: 1, secure: true});

    function _callApiPromise(_callType, _api, _obj, _resolve, _reject) {
        $.ajax({
            crossDomain: true,
            cashe: false,
            type: _callType,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(_obj),
            url: _api
        })
        .done(_resolve)
        .fail(_reject);
    }

    /**
     * sign in using Google Auth
     *
     * @return {Promise<status>} A promise fulfilled with status; otherwise, a rejected promise 
     */
    function main() {

        function api() {}

        api.hello = function() {return "Hello from Line"}

        api.auth = function() {
            function method() {}
            method.signInWithGoogleAuth = function() {

                return new Promise((_resolve, _reject) => {
    
                    let provider = new firebase.auth.GoogleAuthProvider();
                    firebase.auth().signInWithPopup(provider)
                    .then((result) => {
                        // User is signed in. Get the ID token from firebase
                        console.log("=== user: ", result.user);
                        return result.user.getIdToken();
                    }) 
                    .then((idToken) => {
                        // validate ID token and get session returned if okay.
                        console.log("=== user trying sign-in: ", idToken);
                        const csrfToken = Cookies.get('csrfToken');
                        console.log("=== csrfToken: ", csrfToken);
                        
                        let obj = { idToken: idToken,  csrfToken:csrfToken};
                        _callApiPromise("PUT", "/auth/signin", obj, _resolve, _reject)
                    })
                    .catch((err) => {
                        reject(err);
                    });       
                });
            }
            method.signUpWithGoogleAuth = function() {
                return new Promise((_resolve, _reject) => {
                    let obj = { userId: firebase.auth().currentUser.uid};
                    _callApiPromise("PUT", "/auth/signup", obj, _resolve, _reject);
                });
            }
            method.signInWithEmailPassword = function(_credential) {
                return new Promise((_resolve, _reject)=> {
                    firebase.auth().signInWithEmailAndPassword(_credential.email, _credential.password)
                    .then((result) => {
                        // User is signed in. Get the ID token from firebase
                        console.log("=== user: ", result.user);
                        _user = result.user;
                        return result.user.getIdToken();
                    }) 
                    .then((idToken) => {
                        // validate ID token and get session returned if okay.
                        console.log("=== user trying sign-in: ", idToken);
                        const csrfToken = Cookies.get('csrfToken');
                        console.log("=== csrfToken: ", csrfToken);
                        
                        let obj = { idToken: idToken,  csrfToken:csrfToken};
                        _callApiPromise("PUT", "/auth/signin", obj, _resolve, _reject)
                    })
                    .catch((err) => {
                        console.log("=== err: ", err);
                        _reject(err);
                    });
                });
            }
            method.signUpWithEmailPassword = function(_credential) {
                return new Promise((_resolve, _reject)=> {
                    
                    firebase.auth().createUserWithEmailAndPassword(_credential.email, _credential.password)
                    .then((result) => {
                        // User is signed in. Get the ID token from firebase
                        console.log("=== user: ", result.user);
                        _user = result.user;
                        let obj = { userId: result.user.uid};
                        _callApiPromise("POST", "/auth/signup", obj, _resolve, _reject);
                    })
                    .catch((err) => {
                        _reject(err);
                    });
                    
                });
                
            }
            method.sendEmailVerification = function() {
                return new Promise((_resolve, _reject)=> {
                    firebase.auth().onAuthStateChanged(function(user) {
                        console.log("==== user: ", user);
                        if (user) {
                            // User is signed in.
                            console.log("==== user: ", user);
                            user.sendEmailVerification().then(_resolve).catch(_reject);
                        } else {
                            // No user is signed in.
                            _reject({message:"fail to send verification email."});
                        }
                    });
                });
            }
            return method;
        }
        api.view = function() {
            function method() {}
            method.getBlock = function(_path){
                return new Promise((_resolve, _reject) => {
                    _callApiPromise("GET", _path, {}, _resolve, _reject);
                });
            }
            return method;
        }
        api.signOut = function() {
            return new Promise((_resolve, _reject) => {
                _callApiPromise("DELETE", "/auth/signout", {}, _resolve, _reject);
            });
        }
        api.redirect = function(_redirectPath) {
            window.location.assign(_redirectPath);
        }

        return api;
    }
    return main();
});


