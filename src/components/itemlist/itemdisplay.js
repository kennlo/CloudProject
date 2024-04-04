import React, { Component } from 'react';

class ItemDisplay extends Component {

  constructor(props) {
    super(props);
    this.SendToCart = this.SendToCart.bind(this);
  }

  async SendToCart() {
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
  }

  render() {
    return (
      <div className="grid-container" style={{gridTemplateColumns: 'auto auto auto', display: 'inline-grid', rowGap: '50px', columnGap: '50px'}}>
        {Array.from(this.props.tableData.entries()).map(([key, value]) => (
          <tr key={key} className="container" style={{padding: '30px'}}>
            <img src={value.imageURL} alt="Item Image" width="100" height="100" />
            <td style={{padding: '0 10px'}}>
              <body>
                ID: {value.id}
              </body>
              <body style={{width: '100px', wordWrap: 'break-word'}}>
                Name: {value.name}
              </body>
              <body>
                Price: {value.price}
              </body>
              <button onClick={(e) => { e.preventDefault(); this.SendToCart();}}>
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