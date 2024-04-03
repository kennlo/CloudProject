import React, { Component, Fragment } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import TableDisplay from '../table/TableDisplay';

export default class Photos extends Component {

  state = {
    response: '',
    filelist: '',
    user: '',
    loaded: false,
    pr: '',
    tableData: [],
    inputValue:'',
  };
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getId = () => {
    Auth.currentAuthenticatedUser()
      .then(user => {this.setState({user: user.username,});})
      .catch(err => console.log(err));
  }
  async getDatabaseItems() {
    await axios.get('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orders'
    ).then(response => {
      // console.log(currentUserId);
      this.setState({
        tableData: response.data
          .filter(item => this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' || item.userid === this.state.user)
          .map(item => ({
            name: item['item-name'],
            amount: item.amount,
            status: item['order-status'],
            ...(this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' ? { orderid:item['order-id'],userid: item.userid  } : {})
          }))
      });
    });
  }
  async handleDelete() {
    // event.preventDefault();
    // //console.log(this.state.inputValue);
    // //console.log(value);
    // let itemid;
    // await axios.get(`https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.como/rders/${this.state.inputValue}`
    // ).then(response => {
    //   itemid = response.data.item.userid;
    // });
    // if (itemid === this.state.user) {
    await axios.put('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orders', {
      'order-id': this.state.inputValue,
      'order-status': 'Cancelled'
    });
    // }
    // else {
    //   console.log('error');
    // }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      inputValue: event.target.value,
    });
  }
  componentDidMount = async () => {
    this.getId();
    this.setState({loaded: true});
    this.getDatabaseItems();
  }

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Your Orders</h1>
            <p className="subtitle is-5">Review your curent orders</p>
            <TableDisplay tableData={this.state.tableData} />
            <form onSubmit={this.handleDelete}>
              <input
                type="number"
                name="inputValue"
                onChange={this.handleChange}
                value={this.state.inputValue}
              />
              <button type="submit">Cancel Order</button>
            </form>
          </div>
        </section>
      </Fragment>
    );
  }
}
