import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Route from 'react-router-dom/Route';
import Landing from './components/landing.jsx';
import Navigation from './components/Navbar.jsx';
import Login from './components/login.jsx';
import jwt_decode from 'jwt-decode';
import { setAuthToken } from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authAction';
import { getRepositoryList } from './actions/repositoryListAction';
import Landing1 from './components/workflow/landing1.jsx';

const token = localStorage.getItem('cafienne-auth');
if(token) {
    setAuthToken(token);
    const decoded = jwt_decode(token);
    store.dispatch(setCurrentUser(decoded));
    store.dispatch(getRepositoryList(token));
    const currentTime = Date.now()/1000;
    if(decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/';
    }
}


const App = () => {
    
    return (
        <Provider store={store}>
            <Router>
                <div>
                    <Navigation />
                    <div className="container">
                        <Route path='/' exact component={Login}/>
                        <Route path='/landing' exact component={Landing}/>
                        <Route path='/landing1' exact component={Landing1}/>
                    </div>
                </div>
            </Router>
        </Provider>
    )
}

export default App;

ReactDOM.render(<App />, document.getElementById("app"));


