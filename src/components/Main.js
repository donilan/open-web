import React, { Component, PropTypes } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {Link} from 'react-router';

export default class Main extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  };

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
          <Navbar.Collapse>
            <Nav>
              <li><Link to="/generator">Generator</Link></li>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
          {/* this will render the child routes */}
          {this.props.children}
      </div>
    );
  }
}
