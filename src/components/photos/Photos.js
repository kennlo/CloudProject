import React, { Component, Fragment } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import TableDisplay from '../table/TableDisplay';

export default class Photos extends Component {

  state = {
    response: '',
    filelist: '',
    cognitoSub: '',
    loaded: false,
    pr: '',
    tableData: [],
  };

  getId = () => {
    Auth.currentAuthenticatedUser()
      .then(response => {
        // console.log(response.id)
        this.setState({cognitoSub: response.id});
      });
  }
  async getDatabaseItems() {
    await axios.get('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orders'
    ).then(response => {
      console.log(response.data[0].amount);
      this.setState({
        tableData: response.data.map(item => ({
          name: item['item-name'],
          amount: item.amount,
          status: item['order-status']
        }))
      });
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
          </div>
        </section>
      </Fragment>
    );
  }
}
