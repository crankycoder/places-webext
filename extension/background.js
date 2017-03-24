const store = Redux.createStore(heatmapApp);
var Provider = ReactRedux.Provider;

var DATA_LOADED = false;

function loadGuard() {
    if (DATA_LOADED) {
        console.log("Data is already loaded.");
        return 'DATA_READY';
    }
    DATA_LOADED = true;
    // We want to load the data once and only once
    console.log("Data load requested to the popup");
    loadHeatmap();
    return 'DATA_LOADING';
}

function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case 'REQUEST_DATA':
            /*
             * We need to copy over the suggestions for this day/hour
             * and all the titles for the urls in that list.
             */
            console.log("background.js saw REQUEST_DATA message");
            console.log("Trying to send the data over the wire over to the popup");
            let payload = {'type': 'DATA_UPDATE',
                           'suggestions': store.getState().suggestions};
            browser.runtime.sendMessage(payload);
            sendResponse({'status': 'ok'});
        default:
            // Do nothing
    }
}

browser.runtime.onMessage.addListener(handleMessage);

/**********************************************/
// Loading of the heatmap data starts here
/**********************************************/

function insert_or_append(url, title, date) {
    store.dispatch({type: 'ADD_LINK',
                    day: date.getDay(),
                    hour: date.getHours(),
                    url: url,
                    title: title
    });
}


function loadHeatmap() {
    console.log("loadHeatmap starting");
    var loop_counter = 1;
    var limit = 500;

    var loop_counter = 0;

    var placesCallable = function(places) {
        var places_length = places.length;
        console.log(`Fetched ${places_length} rows from moz_places`);

        places.forEach(function(place) {
            var placeClause = `WHERE place_id = ${place.id}`;
            var query = "SELECT id, visit_date, visit_type FROM moz_historyvisits " + placeClause;

            var historyVisitsPromise  = browser.placesdb.query({query: query, params: ['id', 'visit_date', 'visit_type']});

            historyVisitsPromise.then(function(historyVisits) {
                for (var i = 0; i < historyVisits.length; i++) {
                    var when = new Date(historyVisits[i].visit_date / (10 ** 3));
                    insert_or_append(place.url, place.title,when);
                }
                console.log(`Loaded ${historyVisits.length} rows from moz_historyvisits`);
            }, function(reason) {
                 console.log(`Error ${reason}`);
            });
        });

        // ******************

        if (places_length == limit) {
            // Run another iteration over moz_places as we haven't reached the end of the places table.
            loop_counter += 1;
            mozPlacesLooper(loop_counter, limit);
        } else {
            // We're done - no need to call mozPlacesLooper again
            // Technically, we aren't *really* done.  There may instances of
            // placesCallable and mozPlacesLooper that are still running.
            var sending = browser.runtime.sendMessage({'type': 'DATA_READY'});
            sending.then(function(msg) {
                console.log("Success!  The popup was open and notified!");
            }, function (err) {
                console.log("IgnorableWarning Data load is finished");
            });

        }
    };

    var mozPlacesLooper = function(loop_counter, limit) {
        var sql = `SELECT id, title, url FROM moz_places LIMIT ${limit} OFFSET ${loop_counter * limit}`;
        var mozPlacesPromise = browser.placesdb.query({query: sql, params: ["id", 'title', "url"]});

        mozPlacesPromise.then(placesCallable, function (reason) {
            console.log("Error: `${reason}`");
        });
    };

    console.log("Starting fetch from moz_places");
    mozPlacesLooper(loop_counter, limit);
}


// Kick off the data load
loadGuard();
