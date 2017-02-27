browser.hello.hello({query: "select count(*) as counter from moz_historyvisits"}).then(
    function(results) {
        for (var i = 0; i < results.length; i++) {
            console.log("Row foo: " + results[i].counter);
        }
    },
    function(reason) {
        console.log("failure resason: " + reason); // Fail!
    }
);
