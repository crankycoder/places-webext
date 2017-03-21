// This just creates a dummy store for us to connect to.

const store = Redux.createStore(heatmapApp);

console.log("heatmapApp: " + heatmapApp);
console.log("store: " + store);
console.log("connect: " + ReactRedux.connect);
console.log("Provider: " + ReactRedux.Provider);

function insert_or_append(url, title, date) {
    // console.log("i_or_a: " + url + " -- " + date);
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
                //console.log(`Fetched ${historyVisits.length} rows from moz_historyvisits`);
                for (var i = 0; i < historyVisits.length; i++) {
                    var when = new Date(historyVisits[i].visit_date / (10 ** 3));
                    insert_or_append(place.url, place.title,when);
                }
            }, function(reason) {
                // TODO: add error handling when scanning the moz_historyvisits
                // table didn't work
            });
        });

        // ******************

        if (places_length == limit) {
            // Run another iteration over moz_places as we haven't reached the end of the places table.
            loop_counter += 1;
            mozPlacesLooper(loop_counter, limit);
        } else {
            // We're done - no need to call mozPlacesLooper again
        }
    };

    var mozPlacesLooper = function(loop_counter, limit) {
        var sql = `SELECT id, title, url FROM moz_places LIMIT ${limit} OFFSET ${loop_counter * limit}`;
        var mozPlacesPromise = browser.placesdb.query({query: sql, params: ["id", 'title', "url"]});

        mozPlacesPromise.then(placesCallable, function (reason) {
            /* Querying moz_places failed for some reason */
        });
    }

    mozPlacesLooper(loop_counter, limit);
}




class Site extends React.Component {
    render() {
        let favicon = React.DOM.img({
            alt: "",
            className: "tab-icon",
            src: this.props.site.favicon
        });
        let siteSpan = React.DOM.span({className: "tab-title"}, this.props.site.title);

        return (
            React.DOM.li(
                {
                    className: "tab",
                    onClick: (event) => {
                        event.stopPropagation();
                        let site = this.props.site;
                        browser.tabs.create({
                            'url': site.url
                        });
                    }
                },
                favicon,
                siteSpan
            )
        );
    }
}

class SiteList extends React.Component {
  render() {
      var rows = [];
      this.props.sites.forEach(function(thisSite) {
          rows.push(<Site site={thisSite} key={thisSite.url} />);
      });

    return (
            <ul className="tab-list">
                { rows }
            </ul>
      );
  }
}

class SuggestedLinks extends React.Component {
  render() {
    return (
        <ul className="group expanded active">
            <span className="group-title">Suggested Links</span>
            <SiteList sites={this.props.sites}/>
        </ul>
    );
  }
}


const mapStateToProps = (state) => {
    let now = new Date();
    let day = now.getDay();
    let hour = now.getHours();

    let suggestions = state.suggestions;

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

    /*
    store.dispatch({type: 'PRECOMPUTE',
                    rootState: state});
                    hour: date.getHours(),
                    sites: sites});
    */

    return {'sites': sites};
}

const StoreBackedSuggestedLinks = ReactRedux.connect(
  mapStateToProps
)(SuggestedLinks);

const App = () => React.createElement(StoreBackedSuggestedLinks);

var Provider = ReactRedux.Provider;

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    ,document.getElementById('container')
);


// This kicks off the load of the data
var sending = browser.runtime.sendMessage({'type': 'LOAD_GUARD'});
sending.then(function(message) {
    if (message.type === 'LOAD_DATA') {
        loadHeatmap();
    }
},function(error) {
    console.log(`Error: ${error}`);
});

