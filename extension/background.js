const store = Redux.createStore(heatmapApp);
var Provider = ReactRedux.Provider;

const MAX_RESULT_LENGTH = 50;
var DATA_LOADED = false;
var CACHED_RESULT = {};

function loadGuard() {
    if (DATA_LOADED) {
        console.log("Data is already loaded.");
        return;
    }
    DATA_LOADED = true;
    // We want to load the data once and only once
    loadHeatmap();
}

function computeResults() {
    let suggestionsFilter = (suggestions, day, hour) => {
        let day_data = suggestions[day];
        if (day_data === undefined) {
            console.log("No data for today");
            return { sites: [] };
        }
        let hour_data = day_data[hour];
        if (hour_data === undefined) {
            console.log("No data for this hour of day");
            return { sites: [] };
        }

        // Scan the root object for data
        let urls = Object.keys(hour_data);
        var sites = [];
        for (var i = 0; i < urls.length; i++) {
            let thisUrl = urls[i];
            let title = suggestions['titles'][thisUrl];
            sites.push({favicon:"", title: title, url: thisUrl, count: hour_data[thisUrl]});
        }
        sites.sort(function(a, b) {
            return b.count-a.count;
        });
        if (sites.length > MAX_RESULT_LENGTH) {
            console.log(`Truncating suggestions list down to ${MAX_RESULT_LENGTH}`);
            sites = sites.slice(0, MAX_RESULT_LENGTH);
        }

        console.log(`Filtered suggestions down to: ${sites.length} items`);
        return {'sites': sites};
    };

    var promiseCachedResults = new Promise((resolve, reject) => {
        setTimeout(function() {
            let now = new Date();
            let day = now.getDay();
            let hour = now.getHours();
            console.log(`Computing cached results for [${day}][${hour}]`);

            let day_result = CACHED_RESULT[day];
            if (day_result === undefined) {
                CACHED_RESULT[day] = {};
            }
            let hour_result = CACHED_RESULT[day][hour];
            if (hour_result === undefined) {
                let suggestions = store.getState().suggestions;
                sitesDict = suggestionsFilter(suggestions, day, hour);

                // Clear out the old cached results
                for (var prop in CACHED_RESULT) {
                    if (CACHED_RESULT.hasOwnProperty(prop)) {
                        delete CACHED_RESULT[prop];
                    }
                }
                CACHED_RESULT[day] = {};
                CACHED_RESULT[day][hour] = sitesDict.sites;
            }
            resolve('ok');
        }, 1000);
    });

    // Go off, compute the data and send it back to the
    console.log("Starting to run promise to compute cached results");
    promiseCachedResults.then((success) => {
        console.log(`Promise cache computed: ${success}`);

        var timerId = setTimeout(computeResults, 5 * 60 * 1000);
        console.log(`Set the next timer to run with timerId: ${timerId}`);

    }, (err) => {
        console.log(`Error: ${err}`);
    });
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

            let day = request.day;
            let hour = request.hour;
            let day_result = CACHED_RESULT[day];
            if (day_result === undefined) {
                sendResponse({status: 'ok',
                              result: 'no data'});
                break;
            }
            let hour_result = CACHED_RESULT[day][hour];
            if (hour_result === undefined) {
                sendResponse({status: 'ok',
                              result: 'no data'});
                break;
            }
            let payload = {'type': 'DATA_UPDATE',
                           'suggestions': hour_result};
            console.log(`background.js found data: ${hour_result}`)
            browser.runtime.sendMessage(payload);
            sendResponse({'status': 'ok'});
            break;
        default:
            // Do nothing
    }
}


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

    var mozPlacesLooper = function(loop_counter, limit) {
        console.log("Starting mozPlaces looper");
        var sql = `SELECT id, title, url FROM moz_places LIMIT ${limit} OFFSET ${loop_counter * limit}`;
        var mozPlacesPromise = browser.placesdb.query({query: sql, params: ["id", 'title', "url"]});

        mozPlacesPromise.then(function(places) {
            var placesPromise = new Promise((resolve, reject) => {
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
                        //console.log(`Loaded ${historyVisits.length} rows from moz_historyvisits`);
                    }, function(reason) {
                        console.log(`Error ${reason}`);
                    });
                });

                // ******************

                if (places_length == limit) {
                    // Run another iteration over moz_places as we haven't reached the end of the places table.
                    loop_counter += 1;
                    resolve({continue: true,
                        loop_counter: loop_counter,
                        limit: limit});
                } else {
                    // We're done - no need to call mozPlacesLooper again
                    console.log("Data load is finished");
                    resolve({continue: false});
                }
            });

            placesPromise.then((success) => {
                if (success.continue) {
                    mozPlacesLooper(success.loop_counter, success.limit);
                } else  {
                    computeResults();
                }
            },
                (err) => {
                    console.log(`Error in placesPromise: ${err}`);
                });
        }, function (reason) {
            console.log("Error with mozPlacesPromise: `${reason}`");
        });
        console.log("Ended mozPlaces looper");
    };

    console.log("Starting fetch from moz_places");
    mozPlacesLooper(loop_counter, limit);
}


// Kick off the data load
browser.runtime.onMessage.addListener(handleMessage);
console.log("Registered handleMessage listener");
loadGuard();
