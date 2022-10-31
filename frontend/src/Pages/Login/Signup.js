import React, { useState } from "react";
import { Form ,Col} from "react-bootstrap";
import { Redirect, Link  } from "react-router-dom";
import { Button, Result } from "antd";
import "./login.css";
import axios from "axios";
import LoginLayout from "./LoginLayout";
import Cookies from "js-cookie";

function SignupPage() {
  document.title = "Sign Up";
  const [screen, setScreen] = useState("Form");
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [sid, setSid] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setError] = useState("");

  const sendRegister = () => {
    if( password1 == password2){
    axios
      .post("/auth/register", {
        crossdomain: true,
        fname: fname,
        lname: lname,
        email: email,
        sid: sid,
        password: password1,
      })
      .then(function (response) {
        if (response.data.ok) {
          setScreen('complete')
        }
          });
        }
    else{setError('Please make sure your passwords match.')}
        
      }

  if (screen === "Form") {
    return (
      <LoginLayout header="Sign Up">
        <Form className="flex-60">
        <Form.Row>
          <Form.Group as={Col} sm = {6} style={{ display: "inline!important" }}> 
          
          <Form.Label>First Name</Form.Label>          
            <Form.Control
              className="mr-sm-2"
              type="text"
              value={fname}
              placeholder="First Name"
              onChange={(e) => setFname(e.target.value)}
            />
            </Form.Group>
            <Form.Group as={Col} sm = {6}>
            <Form.Label>Last Name</Form.Label>         
            <Form.Control 
              className="mr-sm-2"
              type="text"
              value={lname}
              placeholder="Last Name"
              onChange={(e) => setLname(e.target.value)}
            />
          </Form.Group>
          </Form.Row>
          <Form.Row>
          <Form.Group as={Col} sm = {12}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              size="sm"
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            </Form.Group>
          
          </Form.Row>
           <Form.Row> <Form.Group as={Col} sm = {12}>
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              size="sm"
              type="number"
              value={sid}
              placeholder="Srudent ID"
              onChange={(e) => {
                setSid(e.target.value);
              }}
            />
          </Form.Group>
      </Form.Row>
            <Form.Row>
        <Form.Group as={Col} sm = {6}>
            <Form.Label>Enter Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              value={password1}
              placeholder="Enter your password"
              onChange={(e) => setPassword1(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} sm = {6}>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              value={password2}
              placeholder="Enter your password"
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Form.Group>
         
        </Form.Row>
        <div>
        
          <Form.Group  className="text-right">
            <Link to = '/forgotPassword'>Forgot your password?</Link>
          </Form.Group>
          <Button  type="primary" className={"signInBtn"} onClick={sendRegister}>
            Sign Up
          </Button>
          <p className="errorMsg text30">{errorMessage}</p>            
        </div>
        </Form> 
        <div className="flex-30">
          Already have an account?{" "}
          <Link to = '/'>
            Sign in here
          </Link>
        </div>
      </LoginLayout>
    );
  }
  switch (screen) {
    case "signIn": {
      return <Redirect to="/" />;
    }
    case "verify": {
      return <Verification />;
    }
    case "complete": {
      return <LoginLayout header="Sign up">
      <Result
        className="flex-60 padding0"
        status="success"
        title={<h4>Your account has been created.</h4>}
        extra={[
          <Button type="primary">
            <Link to="/">Login</Link>
          </Button>,
        ]}
      />
    </LoginLayout>;
    }
    default: {
      return <Redirect to="/" />;
    }
  }
}

function Verification() {
  return <div></div>;
}

export default SignupPage;
