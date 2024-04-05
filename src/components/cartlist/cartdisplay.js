import React, { Component } from 'react';
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
      </div >
    );
  }
}

export default CartDisplay;
