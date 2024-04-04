import React, { Component } from 'react';
export default class Navbar extends Component {

  render() {
    const { user, isAuthenticated } = this.props.auth;

    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <img src="5891-cat-sus.png" width="112" height="28" alt="aws logo" />
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a href="/" className="navbar-item">
              Home
            </a>
            <a href="/photos" className="navbar-item">
              Current Orders
            </a>
            <a href="/admin" className="navbar-item">
              Menu
            </a>
            <a href="/profile" className="navbar-item">
              Profile
            </a>
            <a href="/itemlist" className="navbar-item">
              All Menu Items
            </a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              {isAuthenticated && user && (
                <p>
                  Email: {user.attributes.email}
                </p>
              )}
              <div className="buttons">
                {!isAuthenticated && (
                  <div>
                    <a href="/register" className="button is-primary">
                      <strong>Register</strong>
                    </a>
                    <a href="/login" className="button is-light">
                      Log in
                    </a>
                  </div>
                )}
                {isAuthenticated && (
                  <a href="/" onClick={(e) => { e.preventDefault(); this.props.handleLogOut(); }} className="button is-light">
                    Log out
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
