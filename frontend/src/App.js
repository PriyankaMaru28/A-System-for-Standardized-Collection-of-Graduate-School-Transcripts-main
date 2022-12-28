import React from "react";
import './App.css';
import { Switch, Route } from "react-router-dom";
import Home from './Pages/Home';
import Requests from './Pages/GradOfficer/Requests';
import Profile from './Pages/Profile/Profile';
import UserProfile from './Pages/Profile/UserProfile'
import Summary from './Pages/Summary/Summary';
import axios from "axios";
import LoginPage from "./Pages/Login/Login";
import Logout from "./Pages/Login/Logout";
import SignupPage from './Pages/Login/Signup';
import ForgotPassword from './Pages/Login/ForgotPassword';
import ResetPassword from './Pages/Login/ResetPassword'
import Cookies from "js-cookie";


class App extends React.Component {
  
  constructor(props) {
    super(props)
    
    this.state = {}
  }

  render() {
    Cookies.set("loggedIn", {
      loggedIn: false
    });
    axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
    // const loc = window.location;
    // axios.defaults.baseURL = `${loc.protocol}//${loc.hostname}${loc.hostname=== 'localhost' ? ':1000' : process.env.BASE_URL}`;

    //axios.defaults.baseURL = process.env.REACT_APP_BASEURL
    // console.log("backend url ", process.env.REACT_APP_BASEURL)
    return (
      <div className="App">
          <Switch>
            <Route exact path={'/'} render={() => <LoginPage callBack={this.updateToken} />}  exact />
            <Route exact path={'/logout'} component={Logout} exact />
            <Route exact path={'/home'} component={Home} />
            <Route exact path={'/gradRequests'} component={Requests} />
            <Route  exact path={'/profile/:id'} component={UserProfile} />            
            <Route exact path={'/profile'} component={Profile} />
            <Route exact path={'/summary'} component={Summary} />
            <Route exact path={'/signup'} component={SignupPage} />            
            <Route exact path={'/forgotPassword'} component={ForgotPassword} />
            <Route exact path={'/recoverPassword/:id/:token'} component={ResetPassword} />
            
          </Switch>
       
      </div>
    );
  }
}

export default App;
