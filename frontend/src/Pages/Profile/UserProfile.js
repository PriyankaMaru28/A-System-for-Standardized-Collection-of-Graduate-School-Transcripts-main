import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Table, Tag, Space } from 'antd';
import {CloudDownloadOutlined,ToolOutlined} from '@ant-design/icons';
import AppLayout from  '../../AppLayout';
import '../../App.css'
import {Dropdown,DropdownButton} from 'react-bootstrap';

const columns = [
  {
    title: 'Course ID',
    dataIndex: 'courseID',
    key: 'courseID',
  },
  {
    title: 'Course Name',
    dataIndex: 'courseName',
    key: 'courseName',
  },
  {
    title: 'Faculty',
    dataIndex: 'coursedept',
    key: 'coursedept',
  },
  
  {
    title: 'Grade',
    dataIndex: 'grade',
    key: 'grade',
  }
]

class UserProfile extends React.Component {
  constructor(props) {
    super(props)    
    this.state = { 
      userProfile : {fname:'',lname:'',email:'',sid:''}, 
      appDetails: {
        workExpDetails: {  workField: null, role:null, monthsOfExp: null, companyName: null,
          description: null, workStart : null ,workEnd:null },
        transcriptDetails : {country:null, uniName: null, gradeType: null,averageGrade : null, academicStanding: null,
                averageClassGrade:null, courses: [] },
        degreeDetails: {  country:null,uniName:null, uniRankWorld:null,uniRankCountry:null,uniRankLink:null,
            otherRankWorld:null,otherRankCountry:null, otherRankLink:null,degreeLevel:null,program: null, degreeStart:null,degreeEnd:null , overallGrade:null},
        programDetails:{program:null,dept:null,route:null,intake:null, term: null,
                        overall:null,analytical:null,quantitative:null,verbalReasoning:null,
                        ept:null,eptOverall:null,eptSpeaking:null,eptWriting:null,eptListening:null,eptReading:null}
      }
      }
    }
 
   componentDidMount(){   
   let session = JSON.parse(Cookies.get("session"))
    var user = session.user;var id;
    axios.defaults.headers.common["Authorization"] =  session.token;
    id = window.location.href.split("/")[4];
    
    axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
    axios.get('/getUser/'+ id).then( (response) => { this.setState({userProfile: response.data.userProfile})})
    axios.get('/getSubmittedApplication/'+ id).then( (response) => {
      let workData = response.data.appDetails.workExp, transData =response.data.appDetails.transcript;
      let  degreeData = response.data.appDetails.degree , programData = response.data.appDetails.program;
      let  newDetails= {
        workExpDetails: {  workField: workData.field, role:workData.role, monthsOfExp: workData.monthsofExperince, companyName: workData.company,
          description: workData.description, workStart : workData.startDate ,workEnd:workData.startDate },
        transcriptDetails : {country:transData.country, uniName: transData.universityName, gradeType: transData.gradeType,
                  averageGrade : transData.averageGrade, academicStanding: transData.academicStanding,
                averageClassGrade:transData.averageClassGrade, courses: transData.courses },
        degreeDetails: {  country:degreeData.country,uniName:degreeData.universityName, uniRankWorld:degreeData.uniRankWorld,uniRankCountry:degreeData.uniRankCountry,uniRankLink:degreeData.uniRankLink,
            otherRankWorld:degreeData.otherRankWorld,otherRankCountry:degreeData.otherRankCountry, otherRankLink:degreeData.otherRankLink,degreeLevel:degreeData.degreeLevel,program: degreeData.program, 
            degreeStart:degreeData.startDate,degreeEnd:degreeData.endDate , overallGrade:degreeData.overallGrade},
        programDetails:{program:programData.program,dept:programData.dept,route:programData.route,intake:programData.intakeYear, term: programData.intakeTerm,
                        overall:programData.overall,analytical:programData.analytical,quantitative:programData.quantitative,verbalReasoning:programData.verbalReasoning,
                        ept:programData.ept,eptOverall:programData.eptOverall,eptSpeaking:programData.eptSpeaking,eptWriting:programData.eptWriting,eptListening:programData.eptListening,eptReading:programData.eptReading}
      }

      var d = new Date(degreeData.startDate)
     this.setState({appDetails : newDetails });
    })     
  }

    render() {
      let session = JSON.parse(Cookies.get("session"))
      var user = session.user;
      var userProfile = this.state.userProfile
      const app = this.state.appDetails
      return(
          <div>
              <AppLayout>
                <div style={{display:'flex'}}>
                  <div style ={{float : 'left',width:'20%'}}>
                    <img style = {{ height:'100px'}} src ={require('../../images/icons/account-profile.png').default}></img>
                  <div >
                    Name: {userProfile.fname} {userProfile.lname}<br/>
                    Studentid: {userProfile.studentID}<br/>
                    Email: {userProfile.email}
                  </div>
                  </div>
                  <div  style= {{width :'70%'}}>
                   { (app != {}) &&
                    <>
                   <h3 style = {{'text-align': 'center'}}> Application Details </h3>
                   <div className = 'borderShadow'>
                        <h5 className = 'heading'>Program Details</h5>
                        <br/>
                        <p>
                          <span className = 'dataHeading'>Progam:</span> <span className = 'data'>{app.programDetails.program}</span>&nbsp; &nbsp; 
                          <span className = 'dataHeading'>Department:</span> <span className = 'data'>{app.programDetails.dept}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>Route:</span> <span className = 'data'>{app.programDetails.route}</span>
                          <br/>
                          <span className = 'dataHeading'>Intake Year:</span> <span className = 'data'>{app.programDetails.intake}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>Intake Term:</span> <span className = 'data'>{app.programDetails.term}</span>
                          <br/><br/>
                           </p><p>
                        <h6 className ='sideHeading'>Gre Scores:</h6>
                        
                          <span className = 'dataHeading'>Overall:</span> <span className = 'data'>{app.programDetails.overall}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>Verbal Reasoning:</span> <span className = 'data'>{app.programDetails.verbalReasoning}</span>
                          <span className = 'dataHeading'>Quantitative Reasoning:</span> <span className = 'data'>{app.programDetails.quantitative}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>Analytical Writing:</span> <span className = 'data'>{app.programDetails.analytical}</span>
                         
                          </p><p>
                        <h6 className ='sideHeading'>{app.programDetails.ept} Scores:</h6>
                        
                          <span className = 'dataHeading'>Overall:</span> <span className = 'data'>{app.programDetails.eptOverall}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>Listening:</span> <span className = 'data'>{app.programDetails.eptListening}</span>
                          <span className = 'dataHeading'>Speaking:</span> <span className = 'data'>{app.programDetails.eptSpeaking}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>Reading:</span> <span className = 'data'>{app.programDetails.eptReading}</span>
                          <span className = 'dataHeading'>Writing:</span> <span className = 'data'>{app.programDetails.eptWriting}</span>
                         
   
                        
                        </p> 
                   </div>
                   <div className = 'borderShadow'>
                    <h5 className = 'heading'>University Details</h5>
                    <br/>
                    <p>
                          <span className = 'dataHeading'>University Name:</span> <span className = 'data'>{app.degreeDetails.uniName}</span>&nbsp; &nbsp; 
                          <span className = 'dataHeading'>Country:</span> <span className = 'data'>{app.degreeDetails.country}</span>&nbsp; &nbsp;
                          <br/>
                          <span className = 'dataHeading'>Degree:</span> <span className = 'data'>{app.degreeDetails.degreeLevel}</span>&nbsp; &nbsp; 
                          <span className = 'dataHeading'>Program:</span> <span className = 'data'>{app.degreeDetails.program}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>From:</span> <span className = 'data'>{app.degreeDetails.degreeStart}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>To:</span> <span className = 'data'>{app.degreeDetails.degreeEnd}</span>&nbsp; &nbsp;
                         
                          <br/>
                        </p><p>
                        <h6 className ='sideHeading'>Universiy Rankings</h6>
                        
                          <span className = 'dataHeading'>UniRank World Ranking:</span> <span className = 'data'>{app.degreeDetails.uniRankWorld}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>UniRank Country Ranking:</span> <span className = 'data'>{app.degreeDetails.uniRankCountry}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>Link:</span> <span className = 'data'>{app.degreeDetails.uniRankLink}</span>
                          <br/>
                          <span className = 'dataHeading'>Webometrics / Other World Ranking:</span> <span className = 'data'>{app.degreeDetails.otherRankWorld}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>Webometrics / Other Country Ranking:</span> <span className = 'data'>{app.degreeDetails.otherRankCountry}</span>&nbsp; &nbsp;
                          <span className = 'dataHeading'>Link:</span> <span className = 'data'>{app.degreeDetails.otherRankLink}</span>
                          <br/>
                          </p>
                   </div>
                   <div className = 'borderShadow'>
                    <h5  className = 'heading' >Transcript Detials</h5>
                    <br/>
                     <p>
                        <span className = 'dataHeading'>University Name:</span> <span className = 'data'>{app.transcriptDetails.uniName}</span>&nbsp; &nbsp;
                        <span className = 'dataHeading'>Country:</span> <span className = 'data'>{app.transcriptDetails.country}</span>&nbsp; &nbsp;
                        <span className = 'dataHeading'>Grading Scheme:</span> <span className = 'data'>{app.transcriptDetails.gradeType}</span>
                        <br/>
                        <span className = 'dataHeading'>Average of all Grades:</span> <span className = 'data'>{app.transcriptDetails.averageGrade}</span>&nbsp; &nbsp;
                        <span className = 'dataHeading'>Academic Standing:</span> <span className = 'data'>{app.transcriptDetails.academicStanding}</span>&nbsp; &nbsp;
                        <span className = 'dataHeading'>Average Class Grade:</span> <span className = 'data'>{app.transcriptDetails.averageClassGrade}</span>
                        <br/>
                     </p>
                     <Table columns={columns} dataSource={app.transcriptDetails.courses}   /> 
                
                   </div>
                   <div className = 'borderShadow'>
                    <h5  className = 'heading' >Work Eperience</h5>
                    <br/>
                    <p>
                        <span className = 'dataHeading'>Company Name:</span> <span className = 'data'>{app.workExpDetails.companyName}</span>&nbsp; &nbsp;
                        <span className = 'dataHeading'>Feild:</span> <span className = 'data'>{app.workExpDetails.field}</span>&nbsp; &nbsp;
                        <span className = 'dataHeading'>Role:</span> <span className = 'data'>{app.workExpDetails.role}</span>
                        <br/>
                        <span className = 'dataHeading'>Months of Experince:</span> <span className = 'data'>{app.workExpDetails.monthsOfExp}</span>&nbsp; &nbsp;
                        <span className = 'dataHeading'>From:</span> <span className = 'data'>{app.workExpDetails.startDate}</span>&nbsp; &nbsp;
                        <span className = 'dataHeading'>To:</span> <span className = 'data'>{app.workExpDetails.endDate}</span>
                        <br/>
                        <span className = 'dataHeading'>Description:</span> <span className = 'data'>{app.workExpDetails.description}</span>
                        
                        <p></p>
                     </p>
                   </div>
                     
                    </>
                    }

                   <div>
                    
                   </div>
                  </div>
                  </div>
              </AppLayout>
          </div>
      );
    }
  }

  export default UserProfile;