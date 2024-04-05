import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

class CartDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: this.props.tableData
    };
  }

  deleteCartItem = (id) => {
    console.log('deleteCartItem:' + id);
    this.props.onDeleteItem(id);
  }

  sendOrder = async () => {
    const orderID = uuidv4();

    await axios.put('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orders',
      {
        id: orderID,
        orderdate: new Date().toString(),
        'order-status': 'pending',
        userid: this.state,
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

    for (const [key, value] of this.props.tableData) {

      const uid = uuidv4();
      console.log(key);
      
      await axios.put(
        'https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orderitem',
        {
          id: uid,
          itemID: value.name,
          quantity: value.quantity,
          orderid: orderID,
          price: value.quantity * value.price
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

  }

  render() {
    const items = Array.from(this.props.tableData.entries());
    console.log(items);
    if (items.length === 0) {
      return (
        <div>
          <h1>Your cart is empty</h1>
        </div>
      );
    }

    return (
      <div>
        {/* <h1>{this.props.tableData.size}</h1> */}
        <table style={{ width: '100%', border: 'none' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map(([itemKey, item]) =>
              (
                <tr key={itemKey}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price * item.quantity}</td>
                  <button onClick={(e) => { e.preventDefault(); this.deleteCartItem(itemKey); }}>
                    x
                  </button>
                </tr>
              ))}
          </tbody>
        </table>
        <button onClick={(e) => { e.preventDefault(); this.sendOrder(); }}>
          Send Order
        </button>
      </div >
    );
  }
}

export default CartDisplay;
