import React from "react";
import axios from "axios";
import {Program }from './Program';
import Degree from './Degree';
import Transcript from './Transcripts';
import WorkExp from './WorkExp';
import Cookies from "js-cookie";
import AppLayout from  '../../AppLayout'
import {Steps, Button ,message} from 'antd';
const { Step } = Steps;




  class StudentHome extends React.Component {

    constructor(props) {
      super(props)
      
      this.state = {
        setProgram: true,setDegree:false,setTranscript:false,setWorkExp:false,
        workExpDetails: {  workField: null, role:null, monthsOfExp: null, companyName: null,
          description: null, workStart : null ,workEnd:null},
        transcriptDetails : {country:null, uniName: null, gradeType: null,averageGrade : null, academicStanding: null,
                averageClassGrade:null, courses: [] },
        degreeDetails: {  country:null,uniName:null, uniRankWorld:null,uniRankCountry:null,uniRankLink:null,
            otherRankWorld:null,otherRankCountry:null, otherRankLink:null,degreeLevel:null,program: null, degreeStart:null,degreeEnd:null , overallGrade:null},
        programDetails:{program:null,dept:null,route:null,intake:null, term: null,
                        overall:null,analytical:null,quantitative:null,verbalReasoning:null,
                        ept:null,eptOverall:null,eptSpeaking:null,eptWriting:null,eptListening:null,eptReading:null}
      }
    }
   
    //Handling next and prev buttons and updating data
    programNextHandle = (newDetails) =>{this.setState({programDetails:newDetails,setProgram:false,setDegree: true,setTranscript:false,setWorkExp:false})}
    degreePrevHandle = (newDetails) => {this.setState({degreeDetails:newDetails,setProgram: true, setDegree:false,setTranscript:false,setWorkExp:false}) }
    degreeNextHandle = (newDetails) =>{this.setState({degreeDetails:newDetails,setProgram:false,setDegree:false,setTranscript: true,setWorkExp: false})}
    transcriptPrevHandle = (newDetails) =>{this.setState({transcriptDetails:newDetails,setProgram:false,setDegree: true,setTranscript:false,setWorkExp:false})}
    transcriptNextHandle = (newDetails) =>{this.setState({transcriptDetails:newDetails,setProgram:false,setDegree:false,setTranscript:false,setWorkExp: true})}
    workExpPrevHandle = (newDetails) =>{this.setState({workExpDetails:newDetails ,setProgram:false,setDegree:false,setTranscript: true,setWorkExp: false})}
  
    //Handling application submission

    onSubmitHandle = (newDetails) =>{     
      this.setState({workExpDetails:newDetails} , async () => {                
      await this.submitapp()
       });
    }
    
    submitapp = () =>{
      axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
      axios.post('/submitStudApplication',this.state).then((response) => {})   
    }


    render() {
     
      
    return (
      <>
      <AppLayout>
      {this.state.setProgram && <Program programNext = {this.programNextHandle} programDetails = {this.state.programDetails}></Program>}
      {this.state.setDegree && <Degree degreePrev={this.degreePrevHandle} degreeNext ={this.degreeNextHandle}  degreeDetails = {this.state.degreeDetails}></Degree>}
      {this.state.setTranscript && <Transcript transcriptPrev={this.transcriptPrevHandle} transcriptNext={this.transcriptNextHandle} transcriptDetails = {this.state.transcriptDetails}></Transcript>}
      {this.state.setWorkExp &&<WorkExp workExpPrev = {this.workExpPrevHandle} onSubmitHandle = {this.onSubmitHandle} workExpDetails = {this.state.workExpDetails}></WorkExp>}
        </AppLayout>
        </>
  );
};
  }


export default StudentHome;