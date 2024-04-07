import React, { Component, Fragment } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import {
  Flex, Box, Heading, Text, Input, Button, FormControl, FormLabel,
} from '@chakra-ui/react';
import ItemDisplay from '../itemlist/itemdisplay';
import CartDisplay from '../cartlist/cartdisplay';


export default class ItemList extends Component {
  //instance variables
  state = {
    response: '',
    filelist: '',
    user: '',
    loaded: false,
    tableData: [],
    imageURL: '',
    name: '',
    price: '',
    id: '',
    items: new Map(),
  };

  componentDidMount = () => {
    Auth.currentAuthenticatedUser()
      .then(user => { this.setState({ user: user.username, }); })
      .catch(err => console.log(err));
    this.setState({ loaded: true });
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
            imageURL: item.imageURL,
          }))
      });
    });
  }

  constructor(props) {
    super(props);
    this.handleSend = this.handleSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleDeleteCartItem = this.handleDeleteCartItem.bind(this);
  }

  async handleSend() {
    await axios.put('https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/items',
      {
        id: String(new Date().getTime()),
        price: this.state.price,
        name: this.state.name,
        imageURL: this.state.imageURL,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(res => {
      console.log(res);
      window.location.reload();
    });
  }

  handleAddItem = (key, value) => {
    this.setState(prevState => {
      const newItems = new Map(prevState.items);
      newItems.set(key, value);
      return { items: newItems };
    });
  };

  handleDeleteCartItem = (key) => {
    {
      this.setState(prevState => {
        const newItems = new Map(prevState.items);
        newItems.delete(key);
        return { items: newItems };
      });
    }
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

  async handleDelete() {
    await axios.delete(`https://hb8pt1nnyd.execute-api.us-east-1.amazonaws.com/items/${this.state.id}`,
      {
        id: this.state.id,
      });
    window.location.reload();
  }

  render() {
    return (
      <Fragment>
        <Flex>
          <Box width="70%" p="4">
            <Box as="section" className="section">
              {/* <div className="container">
                <h1>Items</h1>
                <p className="subtitle is-5">All the items available.</p>
                <TableDisplay tableData={this.state.tableData} />
              </div> */}
              <Box className="container">
                <Heading as="h1" size="lg">Items</Heading>
                <Text className="subtitle" fontSize="md">All the items available.</Text>
                <ItemDisplay tableData={this.state.tableData} onAddItem={this.handleAddItem} />
              </Box>
              {this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' && (
                <Fragment>
                  <Box as="div" className="container">
                    <Heading as="h1" size="lg">Add Item to Inventory</Heading>
                    <FormControl>
                      <FormLabel>Image URL</FormLabel>
                      <Input type="string" name="imageURL" onChange={this.handleChange} value={this.state.imageURL} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input type="string" name="name" onChange={this.handleChange} value={this.state.name} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Price</FormLabel>
                      <Input type="number" name="price" onChange={this.handleChange} value={this.state.price} />
                    </FormControl>
                    <Button colorScheme="blue" mt="4" onClick={this.handleSend}>Add Item</Button>
                  </Box>
                  <Box as="div" className="container">
                    <Heading as="h1" size="lg">Delete Item from Inventory</Heading>
                    <FormControl>
                      <FormLabel>Item ID</FormLabel>
                      <Input type="string" name="id" onChange={this.handleChange} value={this.state.id} />
                    </FormControl>
                    <Button colorScheme="red" mt="4" onClick={this.handleDelete}>Delete Item</Button>
                  </Box>
                </Fragment>
              )}
            </Box>
          </Box>
          <Box width="30%" borderLeft="2px solid black">
            <Box as="section" className="section" p="4">
              <Box className='container'>
                <Heading as="h1" size="lg" borderBottom="2px solid black">Cart</Heading>
                <CartDisplay userid={this.state.user} tableData={this.state.items} onDeleteItem={this.handleDeleteCartItem} />
              </Box>
            </Box>
          </Box>
        </Flex>
      </Fragment>
    );
  }
}