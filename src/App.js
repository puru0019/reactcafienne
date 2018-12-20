import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Route from 'react-router-dom/Route';
import Landing from './components/landing.jsx';
import Navigation from './components/Navbar.jsx';
import Login from './components/login.jsx';

const App = () => {
    
    return (
        <Provider store={store}>
            <Router>
                <div className="home">
                    <Navigation />
                    <Route path='/' exact component={Login}/>
                    <Route path='/landing' exact component={Landing}/>
                </div>
            </Router>
        </Provider>
    )
}

export default App;

ReactDOM.render(<App />, document.getElementById("app"));


