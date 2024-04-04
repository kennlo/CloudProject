import React, { Component, Fragment } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import TableDisplay from '../table/TableDisplay';

export default class ItemList extends Component {
  //instance variables
  state = {
    response: '',
    filelist: '',
    user: '',
    loaded: false,
    tableData: [],
  };

  componentDidMount = () => {
    Auth.currentAuthenticatedUser()
      .then(user => { this.setState({ user: user.username, }); })
      .catch(err => console.log(err));
    this.setState({loaded: true});
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
          }))
      });
    });
  }

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Items</h1>
            <p className="subtitle is-5">All the items available.</p>
            <TableDisplay tableData={this.state.tableData} />
          </div>
        </section>
      </Fragment>
    );
  }
}