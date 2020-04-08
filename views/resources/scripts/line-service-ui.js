/**
 * 
 * 
 * 
 */
(function(_initUI, _eHanlder) {

    _initUI().spinner();
    let eHandler = _eHanlder();

    // init event handlers
    eHandler.clickBrandName();
    eHandler.clickSignOutBtn();
    eHandler.clickProfileBtn();
    eHandler.clickSettingsBtn();
    eHandler.clickApiDocBtn();

})(function() { // initialization
    function main() {
        function init() {}

        // init spinner
        init.spinner = function() {
            window.Line_Service_Spinner = new Spinner();
        }
        return init;
    }
    return main();
},function() { // event handler

    function main() {

        // event handler function
        function eHandler() {}

        // event: click sign out button
        eHandler.clickBrandName = function() {
            $('#line-service-main').click((e)=>{
                e.preventDefault();
                $('#content-main').html("");
            });
        }
        eHandler.clickSignOutBtn = function() {
            $('#line-signout-btn').click((e)=>{
                e.preventDefault();
                Line_Firebase.signOut()
                .then((res) => {
                    console.log("---- res: ", res);
                    Line_Firebase.redirect("/");
                })
                .catch((err) => {
                    console.log("--- error: ", err);
                    Line_Firebase.redirect("/oops")
                });
            });
        }
        eHandler.clickProfileBtn = function() {
            $('#line-profile-btn').click((e)=>{
                e.preventDefault();
                console.log("--- profile btn clicked. ");
                Line_Firebase.view().getBlock("/service/user/profile")
                .then((block)=> {
                    $('#content-main').html(block);
                })
                .catch((error)=> {
                    console.log("--- error: ", error);
                })
            });
        }
        eHandler.clickSettingsBtn = function() {
            $('#line-settings-btn').click((e)=>{
                e.preventDefault();
                console.log("--- settings btn clicked. ");
                Line_Firebase.view().getBlock("/service/settings")
                .then((block)=> {
                    $('#content-main').html(block);
                })
                .catch((error)=> {
                    console.log("--- error: ", error);
                })
            });
        }
        eHandler.clickApiDocBtn = function() {
            $('#line-apidoc-btn').click((e)=>{
                e.preventDefault();
                console.log("--- api doc btn clicked. ");
                Line_Firebase.redirect("/api/docs");
            });
        }
        return eHandler;
    }

    return main();
});




