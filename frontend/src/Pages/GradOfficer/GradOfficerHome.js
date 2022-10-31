import React from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { Table, Tag, Space } from 'antd';
import {CloudDownloadOutlined,ToolOutlined} from '@ant-design/icons';
import AppLayout from  '../../AppLayout';
import { Redirect, Link } from "react-router-dom";
import {Dropdown,DropdownButton,Button} from 'react-bootstrap';
import Cookies from "js-cookie";
var FileSaver = require('file-saver');

const headers = [
  { label: "Applicant ID", key: "uid" },{ label: "Applicant Name", key: "userName" },{label:'Applicant Email', key: 'userEmail'},
  { label: "Academic Score", key: "score1" }, { label: "Overall Score", key: "score2" },
  { label: "Intake", key: "intake" }
];


const columns = [
    { title: 'Applicant ID', dataIndex: 'uid', key: 'uid',render: text => <Link to = {`/profile/${text}`} >{text}</Link>   },
    { title: 'Applicant Name', dataIndex: 'userName',key: 'userName',    },
    { title: 'Applicant Email', dataIndex: 'userEmail', key: 'userEmail',},
    { title: 'Numeric Academic Score', dataIndex: 'score1', key: 'score1', },
    { title: 'Academic Score',  dataIndex: 'score2',  key: 'score2', },
    { title: 'Intake',  dataIndex: 'intake',  key: 'intake', }
  ]


class GradOfficerHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scoreData : []
    }
  }


getExcel = () =>{
  axios.defaults.headers.common["Authorization"] =  JSON.parse(Cookies.get("session")).token;
  axios.get('/getExcel', { responseType: 'arraybuffer' 
    })
    .then((response) => {
      
      var  fileName = 'studentDetails.xlsx';
    
      var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, fileName);
    });
}


  componentDidMount(){        
    axios.defaults.headers.common["Authorization"] =  JSON.parse(Cookies.get("session")).token;
     axios.get('/getStudentScores').then( (response) => {
      let arr =[]
      for(var i of response.data.scoreData){arr.push(i)}
      this.setState({ scoreData: arr });
    });
  }
  render() {
    return (
<AppLayout>
<DropdownButton id="dropdown-item-button" title="Intake" size="sm">
<Dropdown.Item as="button">Fall 2020</Dropdown.Item>
  <Dropdown.Item as="button">Winter 2020</Dropdown.Item>
  <Dropdown.Item as="button">Fall 2021</Dropdown.Item>
  <Dropdown.Item as="button">Winter 2022</Dropdown.Item>
  <Dropdown.Item as="button">Fall 2022</Dropdown.Item>
</DropdownButton>
<div style ={{display: 'inline'}}>
 <a href='/gradRequests'> <ToolOutlined style={{float:'right',padding: '5px'}} /></a>
 {/* <CSVLink
  data={this.state.scoreData}
  filename={"my-file.csv"}
  headers={headers}
  
  target="_blank"
><CloudDownloadOutlined  style={{float:'right',padding: '5px'}} />
</CSVLink> */}
<Button size='2' className = 'secondary' style={{float:'right',padding: '5px'}} onClick = {() => this.getExcel()}><CloudDownloadOutlined  style={{float:'right',padding: '5px'}} /></Button>
  </div>

<Table columns={columns} dataSource={this.state.scoreData} />
</AppLayout>
    )}

}

export default GradOfficerHome;

