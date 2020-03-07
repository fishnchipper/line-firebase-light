/**
 * 
 */

(function(factory) {

    window.Line = factory();

})(function(){

    const _url = ___LINE___.url;

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
                        _callApiPromise("POST", "/auth/signin", obj, _resolve, _reject)
                    })
                    .catch((err) => {
                        reject(err);
                    });       
                });
            }
            method.signUpWithGoogleAuth = function() {
                return new Promise((_resolve, _reject) => {
                    let obj = { userId: firebase.auth().currentUser.uid};
                    _callApiPromise("POST", "/auth/signup", obj, _resolve, _reject);
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
                        _callApiPromise("POST", "/auth/signin", obj, _resolve, _reject)
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
                _callApiPromise("POST", "/auth/signout", {}, _resolve, _reject);
            });
        }
        api.redirect = function(_redirectPath) {
            window.location.assign(_redirectPath);
            /*
            return new Promise((__resolve, __reject) => {
                _callApiPromise("GET", "/redirect" + _redirectPath, __resolve, __reject);
            });
            */
            /*
            let url = _url + redirect;
            console.log("=== ", url);
            _callApiPromise("GET", url, "", (data)=> {

                    //console.log("=== ", data);
                    window.history.pushState("object or string", "Page Title", redirect);
                    window.document.write(data);
                }, null);
                */
        }
        api.getUser = function() {
            return firebase.auth().currentUser;
        }

        return api;
    }
    return main();
});


