import React from 'react';
import {Redirect} from 'react-router-dom';

import Cookies from "js-cookie";

const Logout = () => {
  //window.sessionStorage.clear();
  Cookies.remove("session");
  Cookies.set("loggedIn", {
    loggedIn: false
  });
  return(

    <Redirect to='/' />
  )
}

export default Logout