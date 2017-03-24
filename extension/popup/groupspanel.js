"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// This just creates a dummy store for us to connect to.

var store = Redux.createStore(heatmapApp);
var Provider = ReactRedux.Provider;

var Site = function (_React$Component) {
    _inherits(Site, _React$Component);

    function Site() {
        _classCallCheck(this, Site);

        return _possibleConstructorReturn(this, (Site.__proto__ || Object.getPrototypeOf(Site)).apply(this, arguments));
    }

    _createClass(Site, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var favicon = React.DOM.img({
                alt: "",
                className: "tab-icon",
                src: this.props.site.favicon
            });
            var siteSpan = React.DOM.span({ className: "tab-title" }, this.props.site.count + " " + this.props.site.title);

            return React.DOM.li({
                className: "tab",
                onClick: function onClick(event) {
                    event.stopPropagation();
                    var site = _this2.props.site;
                    browser.tabs.create({
                        'url': site.url
                    });
                }
            }, favicon, siteSpan);
        }
    }]);

    return Site;
}(React.Component);

var SiteList = function (_React$Component2) {
    _inherits(SiteList, _React$Component2);

    function SiteList() {
        _classCallCheck(this, SiteList);

        return _possibleConstructorReturn(this, (SiteList.__proto__ || Object.getPrototypeOf(SiteList)).apply(this, arguments));
    }

    _createClass(SiteList, [{
        key: "render",
        value: function render() {
            var rows = [];
            this.props.sites.forEach(function (thisSite) {
                rows.push(React.createElement(Site, { site: thisSite, key: thisSite.url }));
            });

            return React.createElement(
                "ul",
                { className: "tab-list" },
                rows
            );
        }
    }]);

    return SiteList;
}(React.Component);

var SuggestedLinks = function (_React$Component3) {
    _inherits(SuggestedLinks, _React$Component3);

    function SuggestedLinks() {
        _classCallCheck(this, SuggestedLinks);

        return _possibleConstructorReturn(this, (SuggestedLinks.__proto__ || Object.getPrototypeOf(SuggestedLinks)).apply(this, arguments));
    }

    _createClass(SuggestedLinks, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "ul",
                { className: "group expanded active" },
                React.createElement(
                    "span",
                    { className: "group-title" },
                    "Suggested Links"
                ),
                React.createElement(SiteList, { sites: this.props.sites })
            );
        }
    }]);

    return SuggestedLinks;
}(React.Component);

var mapStateToProps = function mapStateToProps(state) {
    var now = new Date();
    var day = now.getDay();
    var hour = now.getHours();

    var suggestions = state.suggestions;

    var day_data = suggestions[day];
    if (day_data === undefined) {
        console.log("No data for today");
        return { sites: [] };
    }
    var hour_data = day_data[hour];
    if (hour_data === undefined) {
        console.log("No data for this hour of day");
        return { sites: [] };
    }

    // Scan the root object for data
    var urls = Object.keys(hour_data);
    var sites = [];
    for (var i = 0; i < urls.length; i++) {
        var thisUrl = urls[i];
        var title = suggestions['titles'][thisUrl];
        sites.push({ favicon: "", title: title, url: thisUrl, count: hour_data[thisUrl] });
    }
    sites.sort(function (a, b) {
        return b.count - a.count;
    });

    return { 'sites': sites };
};

var StoreBackedSuggestedLinks = ReactRedux.connect(mapStateToProps)(SuggestedLinks);

var App = function App() {
    return React.createElement(StoreBackedSuggestedLinks);
};

ReactDOM.render(React.createElement(
    Provider,
    { store: store },
    React.createElement(App, null)
), document.getElementById('container'));

/*
 * Make a request to background.js for the latest copy of data
 * we've got.
 */
function requestLatestData() {
    var now = new Date();
    var day = now.getDay();
    var hour = now.getHours();
    var payload = { 'type': 'REQUEST_DATA',
        'day': day,
        'hour': hour };
    browser.runtime.sendMessage(payload);
}

function insert_or_append(url, title, date) {
    store.dispatch({ type: 'ADD_LINK',
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
        case 'DATA_READY':
            requestLatestData();
            break;

        case 'DATA_UPDATE':
            var now = new Date();
            // mapStateToProps will effectively filter the data down to just what we want
            // We're running it twice though.
            // Once because of the cross JS boundary transport and then again
            // in the React UI code. Oh well. Good enough for now.
            var storeDict = mapStateToProps(request);
            var sites = storeDict.sites;
            console.log("Appending " + sites.length + " rows to popup");
            for (var i = 0; i < sites.length; i++) {
                var row = sites[i];
                for (var instance = 0; instance < row.count; instance++) {
                    insert_or_append(row.url, row.title, now);
                }
            }
            break;

        default:
    }
}

browser.runtime.onMessage.addListener(handleMessage);

var sending = browser.runtime.sendMessage({ 'type': 'REQUEST_DATA' });
sending.then(function (resp) {
    console.log("Message from background script: " + JSON.stringify(resp));
}, function (err) {
    console.log("Error sending message " + err);
});

