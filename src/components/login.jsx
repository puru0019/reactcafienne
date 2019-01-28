import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Loginuser } from '../actions/authAction';

const Login = (props) => {
    const username = handleInputForm('');
    const password = handleInputForm('');
    const handleSubmit = (e) => {
        e.preventDefault();

        const newUser = {
            username: username.value,
            password: password.value,
        }
        props.Loginuser(newUser);
    }
    useEffect(() => {
        if( props.auth.isAuthenticated ) {
            props.history.push('/landing1')
        } else {
            props.history.push('/')
        }
    }, [props.auth.isAuthenticated]);
    
    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-4">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="form-group">
                            <label>username:</label>
                            <input type="text" {...username} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input type="password" {...password} className="form-control" />
                        </div>
                        <button className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const handleInputForm = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    function handleChange(e) {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: handleChange,
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { Loginuser })(Login);