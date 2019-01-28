import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { logoutUser } from '../actions/authAction';

const Navigation = (props) => {
  const [value, setValue] = useState(props.auth.isAuthenticated);

  const handleClick = (e) => {
      e.preventDefault();
      setValue(false);
      props.logoutUser();
      window.location.href = '/'
  }

  useEffect(() => {
    setValue(props.auth.isAuthenticated);
}, [props.auth.isAuthenticated]);

  return (
    <Navbar inverse>
        <Navbar.Header>
            <Navbar.Brand>
               <Link to="/">
                    React Cafienne
                </Link>
            </Navbar.Brand>
        </Navbar.Header>
        { value &&
            <Nav pullRight>
                <NavItem eventKey={1} href="#" onClick={e=>handleClick(e)}>
                    logout
                </NavItem>
            </Nav>
        }
    </Navbar>
  );
}

const mapStateToPorps = state => ({
    auth: state.auth
});

export default connect(mapStateToPorps, { logoutUser })(Navigation);