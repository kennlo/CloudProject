import React, { Component } from 'react';
import { Auth } from 'aws-amplify';

// import { cartMap } from './itemlist';


export class Item{
  constructor( name, price, quantity){
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

}

class ItemDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quantities: {}
    };
    this.SendToCart = this.SendToCart.bind(this);
  }

  componentDidMount = () => {
    Auth.currentAuthenticatedUser()
      .then(user => { this.setState({ user: user.username, }); })
      .catch(err => console.log(err));
  }

  increaseQuantity = (id) => {
    this.setState(prevState => ({
      quantities: {
        ...prevState.quantities,
        [id]: (prevState.quantities[id] || 0) + 1
      }
    }));
  };

  decreaseQuantity = (id) => {
    this.setState(prevState => ({
      quantities: {
        ...prevState.quantities,
        [id]: (prevState.quantities[id] > 0) ? prevState.quantities[id] - 1 : 0
      }
    }));
  };

  SendToCart = (id, name, price, quantity) => {
    // await axios.put('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/items',
    //   {
    //     id: this.state.id,
    //     price: this.state.price,
    //     name: this.state.name,
    //     imageURL: this.state.imageURL,
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // ).then(res => {
    //   console.log(res);
    // });
    if(quantity > 0)
      this.props.onAddItem(id, new Item(name, price, quantity));
  }

  render() {
    return (
      <div className="grid-container" style={{ gridTemplateColumns: 'auto auto auto', display: 'inline-grid', rowGap: '50px', columnGap: '50px' }}>
        {Array.from(this.props.tableData.entries()).map(([key, value]) => (
          <tr key={key} className="container" style={{ padding: '30px' }}>
            <img src={value.imageURL} alt="Item Image" width="100" height="100" />
            <td style={{ padding: '0 10px' }}>
              {this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' ? (
                <body>
                  ID: {value.id}
                </body>
              ) : null}
              <body style={{ width: '100px', wordWrap: 'break-word' }}>
                Name: {value.name}
              </body>
              <body>
                Price: {value.price}
              </body>
              <body>
                <button onClick={(e) => { e.preventDefault(); this.decreaseQuantity(value.id); }}>
                  -
                </button>
                <input type="number" value={0 || this.state.quantities[value.id]} style={{ width: '30px' }} readOnly />
                <button onClick={(e) => { e.preventDefault(); this.increaseQuantity(value.id); }}>
                  +
                </button>
              </body>
              <button onClick={(e) => { e.preventDefault(); this.SendToCart(value.id, value.name, value.price, this.state.quantities[value.id] || 0); }}>
                Add to Cart
              </button>
            </td>
          </tr>
        ))}
      </div>
    );
  }
}

export default ItemDisplay;