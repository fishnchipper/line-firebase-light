/**
 * 
 * 
 * 
 */
(function(_initUI, _eHanlder) {

    let initUI = _initUI();
    let eHandler = _eHanlder();

    eHandler.clickSignOutBtn();

})(function() { // initialization
    function main() {
        function init() {}
        return init;
    }
    return main();
},function() { // event handler

    function main() {

        // event handler function
        function eHandler() {}

        // event: click sign out button
        eHandler.clickSignOutBtn = function() {
            $('#line-signout-btn').click((e)=>{
                e.preventDefault();
                Line.signOut()
                .then((res) => {
                    console.log("---- res: ", res);
                    Line.redirect("/");
                })
                .catch((err) => {
                    console.log("--- error: ", err);
                    Line.redirect("/oops")
                });
            });
        }
        return eHandler;
    }

    return main();
});

