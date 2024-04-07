import React, { Component, Fragment } from 'react';
import { Auth } from 'aws-amplify';
import { Box, Button, Heading, Text, Td, Th, Tr, Thead, Tbody, Table } from '@chakra-ui/react';
import axios from 'axios';

export default class Photos extends Component {
  state = {
    response: '',
    filelist: '',
    user: '',
    loaded: false,
    pr: '',
    tableData: [],
    inputValue:'',
  };
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getId = () => {
    Auth.currentAuthenticatedUser()
      .then(user => {this.setState({user: user.username,});})
      .catch(err => console.log(err));
  }
  async getDatabaseItems() {
    await axios.get('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orders'
    ).then(response => {
      // console.log(currentUserId);
      this.setState({
        tableData: response.data
          .filter(item => this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' || item.userid === this.state.user)
          .map(item => ({
            id: item.id,
            status: item['order-status'],
            userid:item.userid,
            orderdate: item.orderdate,
            ...(this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' ? { userid: item.userid  } : {})
          }))
      });
    });
  }
  async handleCancelOrder(orderId) {
    try {
      console.log(orderId);
      const payload = {
        'id': orderId.toString(), // Ensure orderId is a string
        'order-status': 'Cancelled'
      };

      await axios.patch('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orders', payload);

      // Refresh the list of orders after cancellation
      await this.getDatabaseItems();
    } catch (error) {
      console.log(error);
    }
  }
  async handleDelete() {
    // event.preventDefault();
    // //console.log(this.state.inputValue);
    // //console.log(value);
    // let itemid;
    // await axios.get(`https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.como/rders/${this.state.inputValue}`
    // ).then(response => {
    //   itemid = response.data.item.userid;
    // });
    // if (itemid === this.state.user) {
    await axios.patch('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/orders', {
      'id': this.state.inputValue,
      'order-status': 'Cancelled'
    });
    // }
    // else {
    //   console.log('error');
    // }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      inputValue: event.target.value,
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
        <Box p="4" borderRadius="lg" width="90%" maxW="800px" margin="0 auto">
          <Heading as="h1" size="xl" mb="4">
            Your Orders
          </Heading>
          <Text fontSize="lg" mb="4">
            Review your current orders
          </Text>
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="gray" borderRadius="md" borderWidth="1px" borderColor="gray.200">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Order ID</Th>
                  {this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' && (
                    <Th>User ID</Th>
                  )}
                  <Th>Status</Th>
                  <Th>Order Date</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {this.state.tableData.map(order => (
                  <Tr key={order.id}>
                    <Td>{order.id}</Td>
                    {this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' && (
                      <Td>{order.userid}</Td>
                    )}
                    <Td>{order.status}</Td>
                    <Td>{order.orderdate}</Td>
                    <Td>
                      <Button colorScheme="red" size="sm" onClick={() => this.handleCancelOrder(order.id)}>
                        Cancel Order
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Fragment>
    );
  }
}
