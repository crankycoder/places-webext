"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Site = function (_React$Component) {
    _inherits(Site, _React$Component);

    function Site() {
        _classCallCheck(this, Site);

        return _possibleConstructorReturn(this, (Site.__proto__ || Object.getPrototypeOf(Site)).apply(this, arguments));
    }

    _createClass(Site, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "li",
                { className: "tab" },
                React.createElement("img", { alt: "", className: "tab-icon", src: "{this.props.site.favicon}" }),
                React.createElement(
                    "span",
                    { className: "tab-title" },
                    this.props.site.title,
                    "|",
                    this.props.site.url
                )
            );
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
                React.createElement(SiteList, { sites: SITES })
            );
        }
    }]);

    return SuggestedLinks;
}(React.Component);

var SITES = [{ favicon: "https://www.amazon.com/favicon.ico",
    title: "Amazon - AC Charger Power Adapter For ASUS Chromebook Flip C100",
    url: "https://www.amazon.ca/Charger-Chromebook-10-1-Inch-Convertible-Touchscreen/dp/B01IXZE6Z8/ref=sr_1_1?ie=UTF8&qid=1488569483&sr=8-1&keywords=chromebook+asus+adapter" }, { favicon: "https://code.facebook.com/favicon.ico",
    title: 'Thinking in React - React',
    url: "https://facebook.github.io/react/docs/thinking-in-react.html" }, { favicon: "https://www.reddit.com/favicon.ico",
    title: 'top scoring links - Reddit',
    url: "https://www.reddit.com/top/" }];

ReactDOM.render(React.createElement(SuggestedLinks, { sites: SITES }), document.getElementById('container'));

