import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import { Button } from "antd";
import "./login.css";
import axios from "axios";
import LoginLayout from "./LoginLayout";
import Cookies from "js-cookie";


function LoginPage() {
  document.title = "Login";
  const [screen, setScreen] = useState("Form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setError] = useState("");
  
  const login = () => {
       
    axios.post("/auth/login", {
        crossdomain: true,
        email: email,
        password: password,
      }).then(function (response) {
        if (response.data.ok) {
                   Cookies.set("session", {
            token : response.data.token,
            user: response.data.user
          });
          Cookies.set("loggedIn", {
            loggedIn: true
          });
          setScreen('Home')
        }
        else{
          setError(response.data.errorMsg)
        }
      })
     
     
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };
  const getSignupPage = () => {
    setScreen("loadSignup");
  };

  if (screen === "Form") {
    return (
      <LoginLayout header="Sign In">
        <div className= ''>
        <Form >
          <Form.Group>
            <Form.Label>Your Email</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
          </Form.Group>
          <Form.Group className="text-right">
            <Link id="recoverpassword" to="/forgotPassword" className="link">
              Forgot your password?
            </Link>
          </Form.Group>
          <Button type="primary" className={" signInBtn"} onClick={login}>
            Sign In
          </Button>
          
        </Form>
        <div className="flex-30 caption mt-4 signuphere">
          Don't have an account?{" "}
          <Link to ='/signup'>
            Sign Up
          </Link>
        </div>
        </div>
      </LoginLayout>
    );
  }
  switch (screen) {
  
    
    case "Home": {
      return <Redirect to="/home" />;
    }
    
  }
}

export default LoginPage;
