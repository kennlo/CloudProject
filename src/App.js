import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react';

import './App.css';

import Navbar from './components/Navbar';
// import Home from './components/Home';
import Photos from './components/photos/Photos';
import PhotosAdmin from './components/PhotosAdmin';
import ProfileAdmin from './components/ProfileAdmin';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import Welcome from './components/auth/Welcome';
import Footer from './components/Footer';
import VerifyAccount from './components/auth/VerifyAccount';
import ResendVerification from './components/auth/ResendVerification';
import ItemList from './components/itemlist/itemlist';
import OrderSummary from './components/cartlist/ordersummary';

library.add(faEdit);

const ProtectedRoute = ({ component: Comp, loggedIn, verified, path, ...rest }) => {

  const wrapper = (render) => <Route path={path} {...rest} render={render} />;
  const redirect = (to, error) => wrapper(() => {
    return <Redirect
      to={{
        pathname: to,
        state: {
          prevLocation: path,
          error,
        },
      }}
    />;
  });

  if (!loggedIn) {
    return redirect('/login', 'You need to login first!');
  }

  if (!verified) {
    return redirect('/verify', 'You need to verify your account first!');
  }

  return wrapper((props) => <Comp {...props} />);

};

class App extends Component {

  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    isVerified: false,
    user: null,
    loginFailure: false,
    errorMessage:'',
  }

  handleLogOut = async () => {
    try {
      await Auth.signOut();
      this.setState({
        user: null,
        isAuthenticated: false,
        isAuthenticating: false,
        isVerified: false
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  handleLogIn = async (username, password) => {
    try {
      const user = await Auth.signIn(username, password);
      console.log(user);
      this.setState({
        user: user,
        isAuthenticated: true,
      });
      window.location.href = '/';
    } catch (error) {
      this.setState({ loginFailure: true });
      if (error.code && error.code === 'UserNotConfirmedException') {
        window.location.href = '/verify';
      }
      this.setState({ errorMessage: error.message });
      // console.log(error.message);
    }
  }

  async componentDidMount() {
    try {
      const session = await Auth.currentSession();
      this.setState({
        isAuthenticated: true
      });
      console.log(session);

      const user = await Auth.currentAuthenticatedUser();
      this.setState({
        user
      });

      if (user.attributes.email_verified) {
        this.setState({
          isVerified: true
        });
      }
    } catch (error) {
      if (error !== 'No current user') {
        console.log(error);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  render() {
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
    };
    return (
      <ChakraProvider>
        { !this.state.isAuthenticating && (
          < div className="App">
            <Router>
              <div>
                <Navbar auth={authProps} handleLogOut={this.handleLogOut} />
                <Switch>
                  <Route exact path="/" render={(props) => <ItemList {...props} auth={authProps} />} />
                  {/* <Route exact path="/products" render={(props) => <Products {...props} auth={authProps} />} /> */}
                  <ProtectedRoute path="/photos" loggedIn={this.state.isAuthenticated} verified={this.state.isVerified} component={Photos} />
                  <ProtectedRoute path="/admin" loggedIn={this.state.isAuthenticated} verified={this.state.isVerified} component={PhotosAdmin} />
                  <ProtectedRoute path="/profile" loggedIn={this.state.isAuthenticated} verified={this.state.isVerified} component={ProfileAdmin} />
                  <ProtectedRoute path="/itemlist" loggedIn={this.state.isAuthenticated} verified={this.state.isVerified} component={ItemList} />
                  <ProtectedRoute path="/ordersummary" loggedIn={this.state.isAuthenticated} verified={this.state.isVerified} component={OrderSummary} />
                  <Route exact path="/admin" render={(props) => <PhotosAdmin {...props} auth={authProps} />} />
                  <Route exact path="/login" render={(props) => <LogIn {...props} loginFailure={this.state.loginFailure} errMessage={this.state.errorMessage} auth={authProps} handleLogIn={this.handleLogIn} />} />
                  <Route exact path="/verify" render={(props) => <VerifyAccount {...props} auth={authProps} />} />
                  <Route exact path="/resendverification" render={(props) => <ResendVerification {...props} auth={authProps} />} />
                  <Route exact path="/register" render={(props) => <Register {...props} auth={authProps} />} />
                  <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} auth={authProps} />} />
                  <Route exact path="/forgotpasswordverification" render={(props) => <ForgotPasswordVerification {...props} auth={authProps} />} />
                  <Route exact path="/changepassword" render={(props) => <ChangePassword {...props} auth={authProps} />} />
                  <Route exact path="/changepasswordconfirmation" render={(props) => <ChangePasswordConfirm {...props} auth={authProps} />} />
                  <Route exact path="/welcome" render={(props) => <Welcome {...props} auth={authProps} />} />
                </Switch>
                <Footer />
              </div>
            </Router>
          </div>
        )
        }
      </ChakraProvider>
    );
  }
}

export default App;
