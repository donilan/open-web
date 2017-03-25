import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">II2D</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
        </Navbar>
        {this.props.children}
        <footer className="footer">
          <div className="container">
            <p className="center">
              Copyright © 2016-2017 广州路比信息科技有限公司. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }
}
