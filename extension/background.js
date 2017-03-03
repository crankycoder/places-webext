browser.placesdb.query({query: "select id, visit_type from moz_historyvisits limit 10", params: ['id', 'visit_type']}).then(
    function(results) {
        for (var i = 0; i < results.length; i++) {
            console.log("Row foo: " + results[i].id + " | " + results[i].visit_type);
        }
    },
    function(reason) {
        console.log("failure resason: " + reason); // Fail!
    }
);
