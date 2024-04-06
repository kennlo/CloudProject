import React, { Component } from 'react';
import { Box, Table, Tbody, Td, Th, Thead, Tr, Tfoot } from '@chakra-ui/react';
import { orderID, orderdate, items, totalCost } from './cartdisplay';

class OrderSummary extends Component {

  state = { id: 0 }
  constructor(props) {
    super(props);
    this.state = {
      id: orderID,
      date: orderdate,
      itemlist: items,
      cost: totalCost
    };
  }

  render() {
    console.log(this.state.id);
    console.log(this.state.date);
    console.log(this.state.itemlist);

    return (
      <div>
        <h1 style={{ fontSize: '36px', textAlign: 'center' }}> Thank you for your order</h1>
        <h2 style={{ fontSize: '20px', textAlign: 'center' }}> Order ID: {this.state.id}</h2>
        <h3 style={{ fontSize: '20px', textAlign: 'center' }}> Date of Transaction: {this.state.date}</h3>
        <Box>
          <h4 style={{ fontSize: '20px'}}>Item Purchased</h4>
          <Table variant="striped" colorScheme="black">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Quantity</Th>
                <Th>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map(([itemKey, item]) => (
                <Tr key={itemKey}>
                  <Td>{item.name}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>{item.price * item.quantity}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                Total Cost: {this.state.cost}
              </Tr>
            </Tfoot>
          </Table>
        </Box>
      </div>
    );
  }
}

export default OrderSummary;