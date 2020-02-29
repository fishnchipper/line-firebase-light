/**
 * 
 * 
 * 
 */
function ServiceUI() {

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    this._line = new Line(firebase);
    this._redirect = line.url + '/';
    this._spinner = new Spinner();

    this._user = '';

    // member functions
    //this.isSignIn();
    this.signOut();
    this.init();
};



/**
 * Check sign in status before init of Dashboard page
 */
ServiceUI.prototype.isSignIn = function() {
    let self = this;

    if(self._line.isSignIn() && self._line.getJwt()) {
        console.log("--- ", self._line.isSignIn());
    }else {
        // redirect to sign-in page
        $(location).attr('href', self._redirect);
    }
}

ServiceUI.prototype.signOut = function() {

    let self = this;
    let signOutButton = $("#line-signout-btn");

    signOutButton.click(function(e) {
        e.preventDefault();

        console.log("--- button clicked ", self._line);
        self._line.signOut(function(){
            // redirect to sign-in page
            $(location).attr('href', self._redirect);
        });

    }); // end of signinButton.click
}





/**
 * init ServiceUI page
 */
ServiceUI.prototype.init = function() {

    let self = this;

    self._user = self._line.getUserInfo();
    console.log("--- ", self._user.nameDisplay); 
    $("#line-signin-username").html(self._user.nameDisplay);

}
