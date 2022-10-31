import React from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";
import "./login.css";
import axios from "axios";
import LoginLayout from "./LoginLayout";


class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      page: "form",
      errorMsg: "",
    };
  }
  validateEmail = () => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.state.email).toLowerCase());
  };
  resetPassword = () => {
    if (!this.validateEmail())
      {return this.setState({ errorMsg: "EMAIL_INVALID" });}
    axios
      .post("/auth/forgotPassword", { email: this.state.email })
      .then((response) => {
        console.log('jj')
        console.log(response.data)
        if (response.data.ok) 
        {this.setState({ page: "Complete" });}
        else {this.setState({ errorMsg: response.data.errorMsg });}
      })
      .catch((err) => console.log(err));
  };

  setEmail = (e) => this.setState({ email: e });
  
    render(){      
      document.title = "Forgot Password";
      if(this.state.page == 'form'){   
            return (
              <LoginLayout header="Reset Password">
                <Form className="flex-60">
                  <Form.Group>
                    <Form.Label>
                      Enter the email associated with your account
                    </Form.Label>
                    <Form.Control
                      size="lg"
                      type="text"
                      value={this.state.email}
                      placeholder="Enter your email"
                      onChange={(e) => this.setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    type="primary"
                    className="signInBtn"
                    onClick={this.resetPassword}
                  >
                    Request Password Reset
                  </Button>
                  <div className="errorMsg mt-4">{this.state.errorMsg}</div>
                </Form>

                <Link to="/" className="flex-40">
                  Back to Login
                </Link>
              </LoginLayout>
            );
        }
        else if(this.state.page == 'Complete'){
          return(<LoginLayout header = 'Check Email'>
            <Result
        className="flex-60 padding0"
        status="success"
        title={<h4>Please check your email to reset password.</h4>}
        extra={[
          <Button type="primary">
            <Link to="/">Login</Link>
          </Button>,
        ]}
      />
          </LoginLayout>)
       }
  
    
    }
}


export default ForgotPassword;
