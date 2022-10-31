import React, { Children } from 'react';
import {Navbar,NavDropdown} from 'react-bootstrap'
import {ToolOutlined ,UserOutlined } from '@ant-design/icons';
import { useHistory,Redirect,Link } from "react-router-dom";
import Cookies from "js-cookie";
import './layout.css';


function AppLayout({children,header=''}){  
  const history = useHistory();
  console.log('app')
  const logged = JSON.parse(Cookies.get("loggedIn"));
  console.log(logged)
  let session = JSON.parse(Cookies.get("session"))
  let id = session.user.id
 
  //console.log(session)
  return(
    <div>
        <div id ='navbardiv'>
        <Navbar   id = 'color-nav'>
    <Navbar.Brand>
      <Link to ='/home'>
      <img src={require("./images/icons/MUN_Logo.png").default}        
        className="d-inline-block align-top"
        alt="MUN logo"
      /></Link></Navbar.Brand>
      
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav" >  
      <NavDropdown title={ <UserOutlined />  }  id="basic-nav-dropdown" className="ml-auto" >
        <NavDropdown.Item ><Link to = '/profile'>Profile</Link></NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Account Settings</NavDropdown.Item>
        <NavDropdown.Item ><Link to = '/logout'>Signout </Link></NavDropdown.Item>
      </NavDropdown>
  </Navbar.Collapse>
</Navbar>
        </div>
        <div id = 'chidrenbody'>
        {children}
        </div>
    </div>
  )

}

export default AppLayout;