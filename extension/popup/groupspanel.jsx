
class ProductCategoryRow extends React.Component {
  render() {
    return <tr><th colSpan="2">{this.props.category}</th></tr>;
  }
}

class ProductRow extends React.Component {
  render() {
    var name = this.props.product.stocked ?
      this.props.product.name :
      <span style={{color: 'red'}}>
        {this.props.product.name}
      </span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.product.price}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    var rows = [];
    var lastCategory = null;
    this.props.products.forEach(function(product) {
      if (product.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  render() {
    return (
      <form>
        <input type="text" placeholder="Search..." />
        <p>
          <input type="checkbox" />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
}

class Site extends React.Component {
    render() {
        return (
            <li className="tab">
                <img alt="" className="tab-icon" src="{this.props.site.favicon}"/>
                <span className="tab-title">{this.props.site.title}|{this.props.site.url}</span>
            </li>
        );
    }
}

class TabList extends React.Component {
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
            <TabList sites={SITES} />
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



ReactDOM.render(
  <SuggestedLinks sites={SITES} />,
  document.getElementById('container')
);
