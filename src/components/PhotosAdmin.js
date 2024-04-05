import React, { Component, Fragment } from 'react';
import {Auth} from 'aws-amplify';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';

export default class PhotosAdmin extends Component {

  state = {
    response: '',
    loaded: 'false',
    uploading: 'false',
    user:'',
  };

  componentDidMount = () => {
    Auth.currentAuthenticatedUser()
      .then(user => {this.setState({user: user.username,});})
      .catch(err => console.log(err));
  }  
  constructor(props) {
    super(props);
    this.state = {
      itemname: '',
      amount:'',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
  async handleSubmit(event) {
    event.preventDefault();
    const { user} = this.state;
    const uid = uuidv4();
    await axios.put(
      'https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orders',
      {
        id: uid,
        'order-id': String(new Date().getTime()),
        orderdate: new Date().toString(),
        'order-status': 'pending',
        userid: user,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(res => {
      console.log(res);
    })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <label>Item Name:</label>
          <input
            type="text"
            name="itemname"
            onChange={this.handleChange}
            value={this.state.itemname}
          />

          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            onChange={this.handleChange}
            value={this.state.amount}
          />

          <button type="submit">Send</button>
        </form>
      </Fragment>
    );
  }

}
