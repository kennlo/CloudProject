import React, { Component, Fragment } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';
//import TableDisplay from '../table/TableDisplay';
import ItemDisplay from '../itemlist/itemdisplay';

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

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
    console.log(this.state.user);
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
                <ItemDisplay tableData={this.state.tableData} />
              </div>
              <div>
                {this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' ? (
                  <form onSubmit={this.handleSend}>
                    <label>ImageURL</label>
                    <input
                      type="string"
                      name="imageURL"
                      onChange={this.handleChange}
                      value={this.state.imageURL}
                    />
                    <label>Name</label>
                    <input
                      type="string"
                      name="name"
                      onChange={this.handleChange}
                      value={this.state.name}
                    />
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      onChange={this.handleChange}
                      value={this.state.price}
                    />
                    <button type="submit">Add Item</button>
                  </form>
                ) : null}
              </div>
            </section>
          </div>
          <div style={{ width: '30%' }}>
            <section className="section">
              <div className='container'>
                <h1>Cart</h1>
                
              </div>
            </section>
          </div>
        </div>
      </Fragment>
    );
  }
}