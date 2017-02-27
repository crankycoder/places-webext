browser.hello.hello().then(
    function(results) {
        for (var i = 0; i < results.length; i++) {
            console.log(results[i].counter);
        }
    },
    function(reason) {
        console.log(reason); // Fail!
    }
);
