import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <Navbar inverse>
        <Navbar.Header>
            <Navbar.Brand>
               <Link to="/">
                    React Cafienne
                </Link>
            </Navbar.Brand>
        </Navbar.Header>
    </Navbar>
  );
}

export default Navigation;