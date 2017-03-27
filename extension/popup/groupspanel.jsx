// This just creates a dummy store for us to connect to.

const store = Redux.createStore(heatmapApp);
var Provider = ReactRedux.Provider;

class Site extends React.Component {
    render() {
        let favicon = React.DOM.img({
            alt: "",
            className: "tab-icon",
            src: this.props.site.favicon
        });
        let siteSpan = React.DOM.span({className: "tab-title"}, `${this.props.site.title}`);

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
        console.log("groupspanel: No data for today");

        return {sites: [{favicon:"",
                         title: "Data is still processing",
                         url: "about:newpage",
                         count: 0}]};
    }
    let hour_data = day_data[hour];
    if (hour_data === undefined) {
        console.log("groupspanel: No data for this hour of day");
        return {sites: [{favicon:"",
                         title: "Data is still processing",
                         url: "about:newpage",
                         count: 0}]};
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

    return {'sites': sites};
}

const StoreBackedSuggestedLinks = ReactRedux.connect(
  mapStateToProps
)(SuggestedLinks);

const App = () => React.createElement(StoreBackedSuggestedLinks);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    ,document.getElementById('container')
);


/*
 * Make a request to background.js for the latest copy of data
 * we've got.
 */
function requestLatestData() {
    let now = new Date();
    let day = now.getDay();
    let hour = now.getHours();
    let payload = {'type': 'REQUEST_DATA',
                   'day': day,
                   'hour': hour};
    browser.runtime.sendMessage(payload);
}


function insert_or_append(url, title, date) {
    store.dispatch({type: 'ADD_LINK',
                    day: date.getDay(),
                    hour: date.getHours(),
                    url: url,
                    title: title
    });
}

// Declare and register the message handler
function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case 'REQUEST_DATA':
            // This is supposed to be handled by background.js
            console.log("groupspanel.jsx saw REQUEST_DATA message");
            break;
        case 'DATA_UPDATE':
            let now = new Date();
            // mapStateToProps will effectively filter the data down to just what we want
            // We're running it twice though.
            // Once because of the cross JS boundary transport and then again
            // in the React UI code. Oh well. Good enough for now.
            var sites = request.suggestions;
            console.log(`Appending ${sites.length} rows to popup`);
            for (var i = 0; i < sites.length; i++) {
                let row = sites[i];
                // TODO: We're going to ignore the count for now
                insert_or_append(row.url, row.title, now);
            }
            break;
        default:
    }
}

browser.runtime.onMessage.addListener(handleMessage);

requestLatestData();
