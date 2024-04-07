import React, { Component } from 'react';
import { Alert } from '@chakra-ui/react';
import FormErrors from '../FormErrors';
import Validate from '../../lib/formValidation';

class LogIn extends Component {
  state = {
    username: '',
    password: '',
    loginfail: this.props.loginFailure,
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    // AWS Cognito integration here
    try {
      await this.props.handleLogIn(this.state.username, this.state.password);
      // this.props.history.push('/');
    }catch(error) {
      let err = null;
      !error.message ? err = { 'message': error } : err = error;
      console.log(this.props.errors.message);

      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  alertFail = () => {
    if (this.props.loginFailure) {
      return (
        <Alert status="error">
          <p>{this.props.errMessage}</p>
        </Alert>
      );
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove('is-danger');
  };

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Log in</h1>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input 
                  className="input" 
                  type="text"
                  id="username"
                  aria-describedby="usernameHelp"
                  placeholder="Enter Email"
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input 
                  className="input" 
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <a href="/forgotpassword">Forgot password?</a>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Login
                </button>
              </p>
              <br />
              {this.alertFail()}
    
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default LogIn;