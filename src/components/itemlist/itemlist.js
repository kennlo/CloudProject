import React, { Component, Fragment } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';
//import TableDisplay from '../table/TableDisplay';
import ItemDisplay from '../itemlist/itemdisplay';
import CartDisplay from '../cartlist/cartdisplay';



export default class ItemList extends Component {
  //instance variables
  state = {
    response: '',
    filelist: '',
    user: '',
    loaded: false,
    tableData: [],
    imageURL: '',
    name: '',
    price: '',
    id: '',
    items: new Map(),
  };

  componentDidMount = () => {
    Auth.currentAuthenticatedUser()
      .then(user => { this.setState({ user: user.username, }); })
      .catch(err => console.log(err));
    this.setState({ loaded: true });
    this.getDatabaseItems();
  }

  async getDatabaseItems() {
    await axios.get('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/items'
    ).then(response => {
      this.setState({
        tableData: response.data
          .map(item => ({
            name: item.name,
            id: item.id,
            price: item.price,
            imageURL: item.imageURL,
          }))
      });
    });
  }

  constructor(props) {
    super(props);
    this.handleSend = this.handleSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }

  async handleSend() {
    await axios.put('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/items',
      {
        id: String(new Date().getTime()),
        price: this.state.price,
        name: this.state.name,
        imageURL: this.state.imageURL,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(res => {
      console.log(res);
    });
  }

  handleAddItem = (key, value) => {
    this.setState(prevState => {
      const newItems = new Map(prevState.items);
      newItems.set(key, value);
      return { items: newItems };
    });
  };

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
    console.log(this.state.user);
  }

  async handleDelete() {
    await axios.delete(`https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/items/${this.state.id}`,
      {
        id: this.state.id,
      });
  }

  render() {
    return (
      <Fragment>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '70%' }}>
            <section className="section">
              {/* <div className="container">
                <h1>Items</h1>
                <p className="subtitle is-5">All the items available.</p>
                <TableDisplay tableData={this.state.tableData} />
              </div> */}
              <div className="container">
                <h1>Items</h1>
                <p className="subtitle is-5">All the items available.</p>
                <ItemDisplay tableData={this.state.tableData} onAddItem={this.handleAddItem} />
              </div>
              <div>
                {this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' ? (
                  <form onSubmit={this.handleSend}>
                    <h1> Add Item to Inventory </h1>
                    <body>
                      <label>ImageURL</label>
                      <input
                        type="string"
                        name="imageURL"
                        onChange={this.handleChange}
                        value={this.state.imageURL}
                      />
                    </body>
                    <body>
                      <label>Name</label>
                      <input
                        type="string"
                        name="name"
                        onChange={this.handleChange}
                        value={this.state.name}
                      />
                    </body>
                    <body>
                      <label>Price</label>
                      <input
                        type="number"
                        name="price"
                        onChange={this.handleChange}
                        value={this.state.price}
                      />
                    </body>
                    <button type="submit">Add Item</button>
                  </form>
                ) : null}
              </div>
              <div>
                {this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' ? (
                  <form onSubmit={this.handleDelete}>
                    <h1> Delete Item from Inventory </h1>
                    <body>
                      <label>Item ID</label>
                      <input
                        type="string"
                        name="id"
                        onChange={this.handleChange}
                        value={this.state.id}
                      />
                    </body>
                    <button type="submit">Delete Item</button>
                  </form>
                ) : null}
              </div>
            </section>
          </div>
          <div style={{ width: '30%', borderLeft: '2px solid black' }}>
            <section className="section">
              <div className='container'>
                <h1>Cart</h1>
                <CartDisplay tableData={this.state.items} />
              </div>
            </section>
          </div>
        </div>
      </Fragment>
    );
  }
}