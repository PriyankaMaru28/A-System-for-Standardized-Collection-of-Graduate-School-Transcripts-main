import React from "react";
import axios from "axios";
import { Table, Tag, Space } from 'antd';
import AppLayout from  '../../AppLayout';
import { Redirect, Link } from "react-router-dom";
import {Dropdown,DropdownButton} from 'react-bootstrap';
import Cookies from 'js-cookie'

const columns = [
    {title: 'Applicant ID',dataIndex: 'uid', key: 'uid',render: text => <Link to = {`/profile/${text}`} >{text}</Link>},
    {title: 'Applicant Name',dataIndex: 'userName',key: 'userName',},
    {title: 'Request', dataIndex: 'requestType', key: 'requestType',},
    {title: 'Description',dataIndex: 'description',key:'description'},
    {title: 'Email',dataIndex: 'userEmail',key:'userEmail'}
  ]
 
  class Requests extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        gradrequests : []
      }
    }
  
    componentDidMount(){        
      axios.defaults.headers.common["Authorization"] =  JSON.parse(Cookies.get("session")).token;
       axios.get('/getAdminRequests').then( (response) => {
        let arr =[]
        for(var i of response.data.gradrequests){arr.push(i)}
        this.setState({ gradrequests: arr });
      });
    }
    render() { return (
<AppLayout>

<Table columns={columns} dataSource={this.state.gradrequests} />
</AppLayout>
    )

}
  }

export default Requests;



