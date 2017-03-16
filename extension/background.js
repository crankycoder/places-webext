function initHeatmap() {
    console.log("initHeatmap starting");
    var heatmap = [];
    var loop_counter = 1;
    var limit = 500;

    for (var day = 0; day < 7; day++) {
        var hours = [];
        for (var hour = 0; hour < 24; hour++) {
            hours.push({});
        }
        heatmap[day] = hours;
    }

    console.log("Initialized heatmap array");

    var loop_counter = 0;

    var placesCallable = function(places) {
        var places_length = places.length;
        console.log(`Fetched ${places_length} rows from moz_places`);

        // TODO: process each of the rows in places

        places.forEach(function(place) {
            var placeClause = `WHERE place_id = ${place.id}`;
            var query = "SELECT id, visit_date, visit_type FROM moz_historyvisits " + placeClause;

            console.log("Fetching history for place: " + query);

            var historyVisitsPromise  = browser.placesdb.query({query: query, params: ['id', 'visit_date', 'visit_type']});

            historyVisitsPromise.then(function(historyVisits) {
                for (var i = 0; i < historyVisits.length; i++) {
                    var when = new Date(historyVisits[i].visit_date / (10 ** 3));
                    console.log(`Last visited: ${when}`);
                    // TODO: insert_or_append(heatmap, when, place["url"]);
                }
            }, function(reason) {
                // TODO: scanning the moz_historyvisits table didn't work

            });
        });

        // ******************

        if (places_length == limit) {
            // Run another query Func, we're not done yet!
            loop_counter += 1;
            queryFunc(loop_counter, limit);
        }
    };

    var queryFunc = function(loop_counter, limit) {
        var sql = `SELECT id, url FROM moz_places LIMIT ${limit} OFFSET ${loop_counter * limit}`;
        console.log("Querying : " + sql);
        var queryLater = browser.placesdb.query({query: sql, params: ["id", "url"]});
        console.log("Iterating over each unique URL in moz_places");

        queryLater.then(placesCallable, function (reason) {
            /* Querying moz_places failed for some reason */
        });
    }

    queryFunc(loop_counter, limit);


}

function handleMessage(request, sender, sendResponse) {
  initHeatmap();
  console.log("Message from the content script: " + JSON.stringify(request));
  sendResponse({response: "Response from background script"});

}

browser.runtime.onMessage.addListener(handleMessage);

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


