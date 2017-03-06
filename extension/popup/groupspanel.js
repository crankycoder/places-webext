"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProductCategoryRow = function (_React$Component) {
  _inherits(ProductCategoryRow, _React$Component);

  function ProductCategoryRow() {
    _classCallCheck(this, ProductCategoryRow);

    return _possibleConstructorReturn(this, (ProductCategoryRow.__proto__ || Object.getPrototypeOf(ProductCategoryRow)).apply(this, arguments));
  }

  _createClass(ProductCategoryRow, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "tr",
        null,
        React.createElement(
          "th",
          { colSpan: "2" },
          this.props.category
        )
      );
    }
  }]);

  return ProductCategoryRow;
}(React.Component);

var ProductRow = function (_React$Component2) {
  _inherits(ProductRow, _React$Component2);

  function ProductRow() {
    _classCallCheck(this, ProductRow);

    return _possibleConstructorReturn(this, (ProductRow.__proto__ || Object.getPrototypeOf(ProductRow)).apply(this, arguments));
  }

  _createClass(ProductRow, [{
    key: "render",
    value: function render() {
      var name = this.props.product.stocked ? this.props.product.name : React.createElement(
        "span",
        { style: { color: 'red' } },
        this.props.product.name
      );
      return React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          null,
          name
        ),
        React.createElement(
          "td",
          null,
          this.props.product.price
        )
      );
    }
  }]);

  return ProductRow;
}(React.Component);

var ProductTable = function (_React$Component3) {
  _inherits(ProductTable, _React$Component3);

  function ProductTable() {
    _classCallCheck(this, ProductTable);

    return _possibleConstructorReturn(this, (ProductTable.__proto__ || Object.getPrototypeOf(ProductTable)).apply(this, arguments));
  }

  _createClass(ProductTable, [{
    key: "render",
    value: function render() {
      var rows = [];
      var lastCategory = null;
      this.props.products.forEach(function (product) {
        if (product.category !== lastCategory) {
          rows.push(React.createElement(ProductCategoryRow, { category: product.category, key: product.category }));
        }
        rows.push(React.createElement(ProductRow, { product: product, key: product.name }));
        lastCategory = product.category;
      });
      return React.createElement(
        "table",
        null,
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              null,
              "Name"
            ),
            React.createElement(
              "th",
              null,
              "Price"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          rows
        )
      );
    }
  }]);

  return ProductTable;
}(React.Component);

var SearchBar = function (_React$Component4) {
  _inherits(SearchBar, _React$Component4);

  function SearchBar() {
    _classCallCheck(this, SearchBar);

    return _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).apply(this, arguments));
  }

  _createClass(SearchBar, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "form",
        null,
        React.createElement("input", { type: "text", placeholder: "Search..." }),
        React.createElement(
          "p",
          null,
          React.createElement("input", { type: "checkbox" }),
          ' ',
          "Only show products in stock"
        )
      );
    }
  }]);

  return SearchBar;
}(React.Component);

var Site = function (_React$Component5) {
  _inherits(Site, _React$Component5);

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

var TabList = function (_React$Component6) {
  _inherits(TabList, _React$Component6);

  function TabList() {
    _classCallCheck(this, TabList);

    return _possibleConstructorReturn(this, (TabList.__proto__ || Object.getPrototypeOf(TabList)).apply(this, arguments));
  }

  _createClass(TabList, [{
    key: "render",
    value: function render() {
      var rows = [];
      this.props.sites.forEach(function (thisSite) {
        rows.push(React.createElement(Site, { site: thisSite, key: thisSite.url }));
      });

      /*
                <li className="tab">
                    <img alt="" className="tab-icon" src="https://www.google.com/favicon.ico"/>
                    <span className="tab-title">Amazon - AC Charger Power Adapter For ASUS Chromebook Flip C100</span>
                </li>
                <li className="tab">
                    <img alt="" className="tab-icon" src="https://www.google.com/favicon.ico"/>
                    <span className="tab-title">ReactDOM - React</span>
                </li>
      */

      return React.createElement(
        "ul",
        { className: "tab-list" },
        rows
      );
    }
  }]);

  return TabList;
}(React.Component);

var SuggestedLinks = function (_React$Component7) {
  _inherits(SuggestedLinks, _React$Component7);

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
        React.createElement(TabList, { sites: SITES })
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

