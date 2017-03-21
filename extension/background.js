var loaded = false;

function handleMessage(request, sender, sendResponse) {
    if (request.type === 'LOAD_GUARD') {
        if (loaded) {
            console.log("Data is already loaded.");
            sendResponse({'type': 'IGNORE'});
            return;
        }
        loaded = true;
        // We want to load the data once and only once
        console.log("Data load requested to the popup");
        sendResponse({'type': 'LOAD_DATA'});
    }
}

browser.runtime.onMessage.addListener(handleMessage);

/*
browser.placesdb.query({query: "select id, visit_type from moz_historyvisits limit 10", params: ['id', 'visit_type']}).then(
    function(results) {
        for (var i = 0; i < results.length; i++) {
            console.log("Row foo: " + results[i].id + " | " + results[i].visit_type);
        }
    },
    function(reason) {
        console.log("failure reason: " + reason); // Fail!
    }
);
*/
