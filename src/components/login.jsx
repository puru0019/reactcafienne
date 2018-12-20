import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Loginuser } from '../actions/authAction';

const Login = (props) => {
    const email = handleInputForm('');
    const password = handleInputForm('');
    const handleSubmit = (e) => {
        e.preventDefault();

        const newUser = {
            email,
            password,
        }
        //Loginuser(newUser);
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-4">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" {...email} className="form-control" />
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

export default connect(null, { Loginuser })(Login);