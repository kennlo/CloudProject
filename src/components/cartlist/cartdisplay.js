import React, { Component } from 'react';
import { Box, Button, Table, Tbody, Td, Th, Thead, Tr, Tfoot } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Link } from 'react-router-dom';

export var orderID;
export var items;
export var orderdate;
export var totalCost;

class CartDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: this.props.tableData,
      user: this.props.userid
    };
  }

  deleteCartItem = (id) => {
    console.log('deleteCartItem:' + id);
    this.props.onDeleteItem(id);
  }

  generateID() {
    orderID = uuidv4();
    orderdate = new Date().toString();
  }

  calculateTotalCost() {
    let price = 0;

    for (const value of this.props.tableData.values()) {
      price += value.quantity * value.price;
    }

    return price;
  }

  sendOrder = async () => {

    await axios.put('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orders',
      {
        id: orderID,
        orderdate: new Date().toString(),
        'order-status': 'pending',
        userid: this.props.userid,
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
    items = Array.from(this.props.tableData.entries());
    totalCost = this.calculateTotalCost();

    console.log(items);
    if (items.length === 0) {
      return (
        <div>
          <h1>Your cart is empty</h1>
        </div>
      );
    }

    return (
      <Box>
        <Table variant="simple" colorScheme="black">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Quantity</Th>
              <Th>Price</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map(([itemKey, item]) => (
              <Tr key={itemKey}>
                <Td>{item.name}</Td>
                <Td>{item.quantity}</Td>
                <Td>{item.price * item.quantity}</Td>
                <Td>
                  <Button colorScheme="red" onClick={() => this.deleteCartItem(itemKey)}>
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              Total Cost: {totalCost}
            </Tr>
          </Tfoot>
        </Table>
        <Button mt={4} colorScheme="green" onClick={() => { this.generateID(); this.sendOrder(); }}>
          <Link to={{ pathname: '/ordersummary', state: { orderID, orderdate, items, totalCost } }}>
            Send Order
          </Link>
        </Button>
      </Box>
    );
  }
}

export default CartDisplay;
