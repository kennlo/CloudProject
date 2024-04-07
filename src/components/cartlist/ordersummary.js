import React, { Component } from 'react';
import { Heading, Box, Table, Tbody, Td, Th, Thead, Tr, Tfoot } from '@chakra-ui/react';
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
      <Box p="4" maxWidth="800px" mx="auto">
        <Heading textAlign="center" fontSize="3xl" mb="6">Thank you for your order</Heading>
        <Box bg="white" p="4" borderRadius="lg" boxShadow="lg" mb="8">
          <Heading fontSize="xl" mb="4">Items Purchased</Heading>
          <Table variant="simple" colorScheme="gray" borderRadius="md" borderWidth="1px" borderColor="gray.200">
            <Thead bg="gray.100">
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
                  <Td>${item.price * item.quantity}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot bg="gray.100">
              <Tr>
                <Th>Total Cost:</Th>
                <Th></Th>
                <Th>${this.state.cost}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </Box>
        <Box textAlign="center">
          <Heading fontSize="xl" mb="4">Thank you for shopping with us!</Heading>
          <p>We hope to see you again soon.</p>
        </Box>
      </Box>
    );
  }
}

export default OrderSummary;