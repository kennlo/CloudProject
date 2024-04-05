import React, { Component } from 'react';
class CartDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: this.props.tableData
    };
  }


  render() {
    const items = Array.from(this.props.tableData.entries());
    console.log(items);
    if (items.length === 0) {
      return (
        <div>
          <h1>Your cart is empty</h1>
          <h1>{this.props.tableData.size}</h1>

        </div>
      );
    }

    return (
      <div>
        {/* <h1>{this.props.tableData.size}</h1> */}
        <table style={{ width: '100%', border:'none' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => 
              item[1].quantity > 0 && (
                <tr key={item.id}>
                  <td>{item[1].name}</td>
                  <td>{item[1].quantity}</td>
                  <td>{item[1].price * item[1].quantity}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div >
    );
  }
}

export default CartDisplay;
