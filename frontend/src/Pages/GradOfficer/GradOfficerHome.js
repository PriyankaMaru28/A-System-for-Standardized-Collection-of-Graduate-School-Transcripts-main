import React from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { Table, Tag, Space } from 'antd';
import { CloudDownloadOutlined, ToolOutlined } from '@ant-design/icons';
import AppLayout from '../../AppLayout';
import { Redirect, Link } from "react-router-dom";
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
import Cookies from "js-cookie";
import * as _ from 'lodash';

var FileSaver = require('file-saver');


const headers = [
  { label: "Applicant ID", key: "uid" }, { label: "Applicant Name", key: "userName" }, { label: 'Applicant Email', key: 'userEmail' },
  { label: "Academic Score", key: "score1" }, { label: "Overall Score", key: "score2" },
  { label: "IntakeTerm", key: "intakeTerm" }, { label: "IntakeYear", key: "intakeYear" }
];


const columns = [
  { title: 'Applicant ID', dataIndex: 'applicationid', key: 'applicationid', render: text => <Link to={`/profile/${text}`} >{text}</Link> },
  { title: 'Applicant Name', dataIndex: 'userName', key: 'userName', },
  { title: 'Applicant Email', dataIndex: 'userEmail', key: 'userEmail', },
  { title: 'Numeric Academic Score', dataIndex: 'score1', key: 'score1', },
  { title: 'Academic Score', dataIndex: 'score2', key: 'score2', },
  { title: 'IntakeTerm', dataIndex: 'intakeTerm', key: 'intakeTerm' },
  { title: 'IntakeYear', dataIndex: 'intakeYear', key: 'intakeYear', }
]


class GradOfficerHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scoreData: [],
      sortedData: [],
      selectedTerm: null,
      selectedYear: null
    }
  }


  getExcel = () => {
    axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
    axios.get('/getExcel', {
      responseType: 'arraybuffer'
    })
      .then((response) => {
        var fileName = 'studentDetails.xlsx';
        var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, fileName);
      });
  }

  getIntake = (year, term) => {
    const scores = this.state.scoreData
    if (year !== null && term !== null) {
      let sort_score = _.filter(scores, (score, i) => {
        return ((scores[i].intakeTerm === term) && (parseInt(scores[i].intakeYear) === year))
      });

      this.setState({
        sortedData: sort_score,
        selectedTerm: term,
        selectedYear: year
      });
    } else {
      this.setState({
        sortedData: scores
      });

    }
  }


  componentDidMount() {
    axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
    axios.post('/getStudentScores').then((response) => {
      console.log("response...")
      console.log(response.data.scoreData)
      this.setState({
        scoreData: response.data.scoreData
      });
    });
  }


  render() {
    return (
      <AppLayout>
        <DropdownButton id="dropdown-item-button" title="Intake" size="sm">
          <Dropdown.Item as="button" onClick={() => this.getIntake('', '')}>Entire List</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2020, "Fall")}>Fall 2020</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2020, "Winter")}>Winter 2020</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2021, "Fall")}>Fall 2021</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2021, "Winter")}>Winter 2021</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2022, "Fall")}>Fall 2022</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2022, "Winter")}>Winter 2022</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2023, "Fall")}>Fall 2023</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2023, "Winter")}>Winter 2023</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2024, "Fall")}>Fall 2024</Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => this.getIntake(2024, "Winter")}>Winter 2024</Dropdown.Item>
        </DropdownButton>
        {(this.state.selectedTerm && this.state.selectedYear) ?
          <span>{this.state.selectedTerm} {this.state.selectedYear} {_.isEmpty(this.state.sortedData) && 'has 0 applicants and so the entire list is displayed'}</span>
          : <span>The entire list is displayed</span>
        }
        <div style={{ display: 'inline' }}>
          <a href='/gradRequests'> <ToolOutlined style={{ float: 'right', padding: '5px' }} /></a>
          <Button size='2' className='secondary' style={{ float: 'right', padding: '5px' }} onClick={() => this.getExcel()}>
            <CloudDownloadOutlined style={{ float: 'right', padding: '5px' }} /></Button>
        </div>
        <Table columns={columns} dataSource={!_.isEmpty(this.state.sortedData) ? this.state.sortedData : this.state.scoreData} />
      </AppLayout>
    )
  }
}

export default GradOfficerHome;

