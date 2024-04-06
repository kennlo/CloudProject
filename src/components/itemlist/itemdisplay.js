import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import {
  Stack,
  Button,
  Image,
  Box,
  Text,
} from '@chakra-ui/react';


// import { cartMap } from './itemlist';


export class Item{
  constructor( name, price, quantity){
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

}

class ItemDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quantities: {}
    };
    this.SendToCart = this.SendToCart.bind(this);
  }

  componentDidMount = () => {
    Auth.currentAuthenticatedUser()
      .then(user => { this.setState({ user: user.username, }); })
      .catch(err => console.log(err));
  }

  increaseQuantity = (id) => {
    this.setState(prevState => ({
      quantities: {
        ...prevState.quantities,
        [id]: (prevState.quantities[id] || 0) + 1
      }
    }));
  };

  decreaseQuantity = (id) => {
    this.setState(prevState => ({
      quantities: {
        ...prevState.quantities,
        [id]: (prevState.quantities[id] > 0) ? prevState.quantities[id] - 1 : 0
      }
    }));
  };

  SendToCart = (id, name, price, quantity) => {
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
    if(quantity > 0)
      this.props.onAddItem(id, new Item(name, price, quantity));
  }

  render() {
    return (
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px" padding="20px"
        margin={2}>
        {Array.from(this.props.tableData.entries()).map(([key, value]) => (
          <Box key={key} borderWidth="1px" borderRadius="7px" boxShadow="lg" justifyContent="center" overflow="hidden"
            _hover={{
              transition: 'transform .2s',
              transform: 'scale(1.02)',
            }}>
            <Box borderRadius="7px" display="flex" justifyContent="center" overflow="hidden"
            >
              <Image display="flex" src={value.imageURL} alt={value.name} w="200px" height="200px" objectFit="cover" />
            </Box>
            <Box p="3">
              {this.state.user === 'cb2550db-00e0-4210-8be7-61853387898c' && (
                <Text fontSize="sm" color="gray.500" mb="2">ID: {value.id}</Text>
              )}
              <Text fontWeight="bold" fontSize="xl">{value.name}</Text>
              <Text fontSize="lg" mt="2">${value.price}</Text>
              <Stack direction="row" spacing="4" mt="4">
                <Button onClick={() => this.decreaseQuantity(value.id)} colorScheme="gray">
                  -
                </Button>
                <input type="number" value={this.state.quantities[value.id] || 0} style={{ width: '50px', textAlign: 'center' }} readOnly />
                <Button onClick={() => this.increaseQuantity(value.id)} colorScheme="gray">
                  +
                </Button>
              </Stack>
              <Button mt="4" colorScheme="blue" onClick={() => this.SendToCart(value.id, value.name, value.price, this.state.quantities[value.id] || 0)}>
                Add to Cart
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
}

export default ItemDisplay;