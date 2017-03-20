// This just creates a dummy store for us to connect to.

const store = Redux.createStore(heatmapApp);

console.log("heatmapApp: " + heatmapApp);
console.log("store: " + store);
console.log("connect: " + ReactRedux.connect);
console.log("Provider: " + ReactRedux.Provider);

var heatmap_is_loaded = false;

//browser.runtime.sendMessage({'type': 'start'});
function insert_or_append(url, date) {
    // console.log("i_or_a: " + url + " -- " + date);
    store.dispatch({type: 'ADD_LINK',
                    day: date.getDay(),
                    hour: date.getHours(),
                    url: url});
}
//
//
function initHeatmap() {
    console.log("initHeatmap starting");
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
                    insert_or_append(place.url, when);
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
        var sql = `SELECT id, url FROM moz_places LIMIT ${limit} OFFSET ${loop_counter * limit}`;
        var mozPlacesPromise = browser.placesdb.query({query: sql, params: ["id", "url"]});
        console.log("Iterating over each unique URL in moz_places");

        mozPlacesPromise.then(placesCallable, function (reason) {
            /* Querying moz_places failed for some reason */
        });
    }

    mozPlacesLooper(loop_counter, limit);
}

initHeatmap();


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

var SITES = [];

class SuggestedLinks extends React.Component {
  render() {
    return (
        <ul className="group expanded active">
            <span className="group-title">Suggested Links</span>
            <SiteList sites={SITES} />
        </ul>
    );
  }
}


function mapStateToProps(state) {
    // TODO: try accessing the redux store for data
    console.log("mapStateToProps invoked.  Suggestions length: " + state.suggestions.length);

    return {sites: [
        {favicon: "https://www.amazon.com/favicon.ico",
            title: "Amazon - AC Charger Power Adapter For ASUS Chromebook Flip C100",
            url: "https://www.amazon.ca/Charger-Chromebook-10-1-Inch-Convertible-Touchscreen/dp/B01IXZE6Z8/ref=sr_1_1?ie=UTF8&qid=1488569483&sr=8-1&keywords=chromebook+asus+adapter" },
        {favicon: "https://code.facebook.com/favicon.ico",
            title: 'Thinking in React - React',
            url: "https://facebook.github.io/react/docs/thinking-in-react.html" },
        {favicon: "https://www.reddit.com/favicon.ico",
            title: 'top scoring links - Reddit',
            url: "https://www.reddit.com/top/"}]};
}

const StoreBackedSuggestedLinks = ReactRedux.connect(
  mapStateToProps
)(SuggestedLinks);

/*
*/


const App = () => React.createElement(StoreBackedSuggestedLinks);

var Provider = ReactRedux.Provider;

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    ,document.getElementById('container')
);
