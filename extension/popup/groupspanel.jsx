// This just creates a dummy store for us to connect to.
const store = Redux.createStore(Reducer);

console.log("Reducer: " + Reducer);
console.log("store: " + store);

browser.runtime.sendMessage({'reducer': Reducer});
browser.runtime.sendMessage({'store': store});

class Site extends React.Component {
    render() {
        let favicon = React.DOM.img({
            alt: "",
            className: "tab-icon",
            src: this.props.site.favicon
        });
        let siteSpan = React.DOM.span({className: "tab-title"}, this.props.site.title)

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

                        var sending = browser.runtime.sendMessage({'url': site.url});
                        sending.then((message) => {console.log(`Message from the background script:  ${message.response}`);},
                                     (error) => {console.log(`Error: ${error}`);});
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
            <SiteList sites={SITES} />
        </ul>
    );
  }
}


var SITES = [
  {favicon: "https://www.amazon.com/favicon.ico",
   title: "Amazon - AC Charger Power Adapter For ASUS Chromebook Flip C100",
   url: "https://www.amazon.ca/Charger-Chromebook-10-1-Inch-Convertible-Touchscreen/dp/B01IXZE6Z8/ref=sr_1_1?ie=UTF8&qid=1488569483&sr=8-1&keywords=chromebook+asus+adapter" },
  {favicon: "https://code.facebook.com/favicon.ico",
   title: 'Thinking in React - React',
   url: "https://facebook.github.io/react/docs/thinking-in-react.html" },
  {favicon: "https://www.reddit.com/favicon.ico",
   title: 'top scoring links - Reddit',
   url: "https://www.reddit.com/top/"}
];


var suggestedLinks = React.createElement(SuggestedLinks,
    {sites:SITES});

ReactDOM.render(
  suggestedLinks,
  document.getElementById('container')
);
