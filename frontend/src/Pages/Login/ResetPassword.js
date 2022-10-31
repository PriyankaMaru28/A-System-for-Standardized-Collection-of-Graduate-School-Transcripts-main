import React from "react";
import LoginLayout from "./LoginLayout";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";
import axios from "axios";
import { Form } from "react-bootstrap";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorMsg: "",
      id: null,
      password1: "",
      password2: "",
    };
  }

  componentDidMount = () => {
    let id = window.location.href.split("/")[4];

    let token = window.location.href.split("/")[5];
    axios
      .get("/auth/resetPassword/" + id + "/" + token)
      .then((response) => {
        if (response.data.authenticated)
          this.setState({ error: false, id: response.data.id });
        else this.setState({ error: true, errorMsg: response.data.errorMsg });
      })
      .catch((err) => console.log(err));
  };

  updatePassword = (key, value) => this.setState({ [key]: value });

  sendResetPassword = () => {
    if (this.state.password1 !== this.state.password2)
      return this.setState({ errorMsg: "Passwords entered do not match." });
    let data = {
      password: this.state.password1,
      id: this.state.id,
    }
    axios
      .post("/auth/resetPassword",data )
      .then((response) => {
        if (response.data.ok) return this.setState({ page: "Complete" });
        else {
          if (response.data.error === "SAMEPASS")
            return this.setState({
              errorMsg:
                "New password cannot be the same as the old password. Please try again.",
            });
          else
            return this.setState({
              error: true,
              errorMsg: response.data.error,
            });
        }
      });
    return;
  };

  render() {
    if (this.state.page === "Complete")
      return (
        <LoginLayout header="Update Password">
          <Result
            className="flex-60 padding0"
            status="success"
            title={<h4>Your password has been reset.</h4>}
            extra={[
              <Button type="primary">
                <Link to="/">Login</Link>
              </Button>,
            ]}
          />
        </LoginLayout>
      );
   
    else if (this.state.error)
      return (
        <LoginLayout header="Update Password">
          <Result
            status="error"
            title={<h4 className="errorMessage">{this.state.errorMsg}</h4>}
          >
            <Button type="primary">
              <Link to="/" className="flex-40">
                Back to Login
              </Link>
            </Button>
          </Result>
        </LoginLayout>
      );
    else {
      return (
        <LoginLayout header="Update Password">
          <div className="flex-60">
            <Form>
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  placeholder="New Password"
                  type="password"
                  onChange={(e) =>
                    this.updatePassword("password1", e.target.value)
                  }
                  value={this.state.password1}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  placeholder="Confirm New Password"
                  type="password"
                  onChange={(e) =>
                    this.updatePassword("password2", e.target.value)
                  }
                  value={this.state.password2}
                />
              </Form.Group>
              <Button
                type="primary"
                className={" signInBtn"}
                onClick={this.sendResetPassword}
              >
                Update Password
              </Button>
              <div className="errorMessage">{this.state.errorMsg}</div>
            </Form>
          </div>
          <Link to="/" className="flex-40">
            Back to Login
          </Link>
        </LoginLayout>
      );
    }
  }
}

export default ResetPassword;
