/**
 * 
 */

(function( window ) {
    'use strict';
    function Line(url) {
        this._url = url;

        this._view = "";
        this._collection = "";
        this._what = "";
        this._error;
        this._data;
        // member properties
        
    };
    window.Line = Line;
})(window);




/**
 * common function to call APIs of other app
 */
Line.prototype.__callApi = function(_calltype, _callurl, cb) {

    let self = this;
    
    $.ajax({
        crossDomain: true,
        type: _calltype,
        contentType: 'application/json; charset=utf-8',
        url: _callurl,
        success: function(data){
                console.log("=== return with success -->", data);
                if(data.success == true) {
                    cb(null, data);
                }else {
                    if(data.code === 'tokenNotValid') {
                        data.res = 'invalid_token.session';
                    }else if (data.code === 'authTokenNotSupplied') {
                        data.res = 'no_token.session';
                    }
                    cb(null, data);
                }

            },
        error: function(err) {
                console.log("=== return with error--->", err);
                cb(err, null);
            },
        beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.getJwt());
                // TODO: remove cookies before sending
            }
    });
}


/**
 * execution of serlook api query
 */
Line.prototype.post = async function(object) {
    let self = this;

    let lineApi = self._url + self._collection + self._what;

    console.log("=== url --->", lineApi);
    console.log("=== object --->", object);

    
    await $.ajax({
        crossDomain: true,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(object),
        url: lineApi,
        success: function(data){
                console.log("=== return with success -->", data);
                if(data.success == true) {
                    self._data = data;
                }else {
                    if(data.code === 'tokenNotValid') {
                        data.res = 'invalid_token.session';
                    }else if (data.code === 'authTokenNotSupplied') {
                        data.res = 'no_token.session';
                    }
                    self._data = data;
                }
            },
        error: function(data) {
                console.log("=== return with error--->", data);
                self._error = new Error('unknown what');               
            },
        beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.getJwt());
                // TODO: remove cookies before sending
            }
        });

    return self;       
}



Line.prototype.get = async function(param) {
    let self = this;

    // clear error
    self._error = null;

    let lineApi = self._url + self._collection + self._what;

    if(param) {
        lineApi += "/" + param;
    }
    console.log("=== query: ", lineApi);

    await $.ajax({
        crossDomain: true,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        url: lineApi,
        success: function(data){
                console.log("=== return with success -->", data);
                if(data.success == true) {
                    self._data = data;
                }else {
                    if(data.code === 'tokenNotValid') {
                        data.res = 'invalid_token.session';
                    }else if (data.code === 'authTokenNotSupplied') {
                        data.res = 'no_token.session';
                    }
                    self._data = data;
                }
                
                
            },
        error: function(data) {
                console.log("=== return with error--->", data);
                self._error = new Error('unknown what');
                
            },
        beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.getJwt());
                // TODO: remove cookies before sending
            }
    });

    return self;
}


Line.prototype.signOut = function(cb) {
    Cookies.remove('gIsLogin');
    Cookies.remove('gJwt');
    Cookies.remove('gUser');
    
    cb();
}

/**
 * Check sign in status
 * 
 * @return {boolean} true & false
 */
Line.prototype.isSignIn = function() {
    if(Cookies.get("gIsLogin") === "true") return true;
    return false;
}

/**
 * Get JWT from Cookies object
 * 
 * @return {string} JWT token or null if not found
 */
Line.prototype.getJwt = function() {
    if(Cookies.get("gJwt")) {
        return Cookies.get("gJwt");
    }
    return null;
}

/**
 * Get a user info from Cookies object
 * 
 * @return {object} user object
 */
Line.prototype.getUserInfo = function() {
    return Cookies.getJSON('gUser');
}


/**
 * sign in with email & password
 *
 * @param {object}      credential with username and password
 * @param {string}      redirect uri when authentication is successful
 * @param {function}    cb callback
 */
Line.prototype.signinWithEmailPass = function(credential, redirect, cb) {

    let self = this;

    let jsonData = {};
    jsonData = { "username": credential.email, "password": md5(credential.password) };

    let url = self._url + '/login';

    console.log("=== url --->", url);
    console.log("=== jsonData --->", jsonData);

    $.ajax({
        crossDomain: true,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(jsonData),
        url: url,
        success: function(data){
               console.log("=== return with success -->", data);

               if(data.success == true) {
                    
                   self._jwt = data.token;
                   self._user = data.user;
                   Cookies.set("gIsLogin", "true", { expires: 1});
                   Cookies.set("gJwt", data.token, { expires: 1});
                   Cookies.set("gUser", data.user, { expires: 1});

                   if(redirect) {
                       console.log("=== redirect to ", redirect);
                       self.redirect(redirect);
                       //$(location).attr('href', redirect);
                   }else cb(null, data);
               }else {
                   if(data.code === 'incorrectPassword') {
                       data.res = 'wrong_password.account';
                   }else if (data.code === 'incorrectUsername') {
                       data.res = 'wrong_username.account';
                   }else if (data.code === 'communicationError') {
                       data.res = 'comm.error';
                   }
                   cb(null, data);
               }
            },
        error: function(data) {
               console.log("=== return with error--->", data);
               cb(new Error('signinWithEmailPass error'), null);
            }
    });
}

/**
 * redirect location with session data at the header
 * 
 * @param {string}  url where to redirect
 */
Line.prototype.redirect = function(redirect) {
    let self = this;
    let url = self._url + redirect;
    console.log("=== ", url);
    self.__callApi("GET", url, (err, data)=> {
        if(err) {
            $(":root").html("[" + err.status + "] " + err.statusText);
        }else {
            //console.log("=== ", data);
            window.history.pushState("object or string", "Page Title", redirect);
            window.document.write(data);
        }
    });
}


Line.prototype.view = function(view) {
    let self = this;
    self._error = null;
    self._view = '/service/' + view;

    return self;
}


Line.prototype.getView = async function(param) {
    let self = this;

    // clear error
    self._error = null;

    let lineApi = self._url + self._view;

    if(param) {
        lineApi += "/" + param;
    }
    console.log("=== query: ", lineApi);

    await $.ajax({
        crossDomain: true,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        url: lineApi,
        success: function(data){
                console.log("=== return with success -->", data);
                if(data.success == true) {
                    self._data = data;
                }else {
                    if(data.code === 'tokenNotValid') {
                        data.res = 'invalid_token.session';
                    }else if (data.code === 'authTokenNotSupplied') {
                        data.res = 'no_token.session';
                    }
                    self._data = data;
                }               
            },
        error: function(data) {
                console.log("=== return with error--->", data);
                self._error = new Error('unknown what');               
            },
        beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.getJwt());
                // TODO: remove cookies before sending
            }
    });

    return self;
}

/**
 * returning the result of serlook api query
 */
Line.prototype.then = function(cb) {
    let self = this;

    if (self._data) {
        // session check 
        if(self._data.code == 'tokenNotValid') {
            self.signOut(() => {
                $(location).attr('href', self._url + '/sign-in');
            });
        }
        // session ok, move on.
        cb(self._data);
    }else {
        return self;
    }
    return self;
}

/**
 * Error handling of serlook api query
 */
Line.prototype.catch = function(cb) {
    let self = this;

    if (self._error) {
        cb(self._error);
    }
}



/**
 * Collections for server requests
 * 
 */
Line.prototype.collection = function(_collection) {
    let self = this;
    self._collection = "/api/" + _collection;

    return self;
}

/**
 * Actions on collections
 * 
 */
Line.prototype.what = function(_what) {
    let self = this;
    self._error = null;

    self._what = "/" + _what;
 
    return self;
}
