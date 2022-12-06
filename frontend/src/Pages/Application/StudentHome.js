import React from "react";
import axios from "axios";
import { Program } from './Program';
import Degree from './Degree';
import Transcript from './Transcripts';
import WorkExp from './WorkExp';
import Cookies from "js-cookie";
import AppLayout from '../../AppLayout'
import { Steps, Button, message } from 'antd';
import Profile from "../Profile/Profile";
import Summary from '../Summary/Summary';

class StudentHome extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      appId: null,
      degreeId: null,
      transcriptId: null,
      workId: null,
      term: null,
      intake: null,
      setProgram: true, setDegree: false, setTranscript: false, setWorkExp: false, setSummary: false,
      workExpDetails: {
        workField: null, role: null, monthsOfExp: null, companyName: null,
        description: null, workStart: null, workEnd: null
      },
      transcriptDetails: {
        country: null, uniName: null, gradeType: null, averageGrade: null, academicStanding: null,
        averageClassGrade: null, courses: []
      },
      degreeDetails: {
        country: null, uniName: null, uniRankWorld: null, uniRankCountry: null, uniRankLink: null,
        otherRankWorld: null, otherRankCountry: null, otherRankLink: null, degreeLevel: null, program: null, degreeStart: null, degreeEnd: null, overallGrade: null, appId: null, degreeId: null
      },
      programDetails: {
        program: null, dept: null, route: null, intake: null, term: null,
        overall: null, analytical: null, quantitative: null, verbalReasoning: null,
        ept: null, eptOverall: null, eptSpeaking: null, eptWriting: null, eptListening: null, eptReading: null, appId: null
      },
      summaryDetails: {
        workExpDetails: {
          workField: null, role: null, monthsOfExp: null, companyName: null,
          description: null, workStart: null, workEnd: null
        },
        transcriptDetails: {
          country: null, uniName: null, gradeType: null, averageGrade: null, academicStanding: null,
          averageClassGrade: null, courses: []
        },
        degreeDetails: {
          country: null, uniName: null, uniRankWorld: null, uniRankCountry: null, uniRankLink: null,
          otherRankWorld: null, otherRankCountry: null, otherRankLink: null, degreeLevel: null, program: null, degreeStart: null, degreeEnd: null, overallGrade: null, appId: null, degreeId: null
        },
        programDetails: {
          program: null, dept: null, route: null, intake: null, term: null,
          overall: null, analytical: null, quantitative: null, verbalReasoning: null,
          ept: null, eptOverall: null, eptSpeaking: null, eptWriting: null, eptListening: null, eptReading: null, appId: null
        }
      }
    }
  }

  //Handling next and prev buttons and updating data
  programNextHandle = (newDetails) => { this.setState({ programDetails: newDetails, setProgram: false, setDegree: true, setTranscript: false, setWorkExp: false, setSummary: false }) }
  degreePrevHandle = (newDetails) => { this.setState({ degreeDetails: newDetails, setProgram: true, setDegree: false, setTranscript: false, setWorkExp: false, setSummary: false }) }
  degreeNextHandle = (newDetails) => { this.setState({ degreeDetails: newDetails, setProgram: false, setDegree: false, setTranscript: true, setWorkExp: false, setSummary: false }) }
  transcriptPrevHandle = (newDetails) => { this.setState({ transcriptDetails: newDetails, setProgram: false, setDegree: true, setTranscript: false, setWorkExp: false, setSummary: false }) }
  transcriptNextHandle = (newDetails) => { this.setState({ transcriptDetails: newDetails, setProgram: false, setDegree: false, setTranscript: false, setWorkExp: true, setSummary: false }) }
  workExpPrevHandle = (newDetails) => { this.setState({ workExpDetails: newDetails, setProgram: false, setDegree: false, setTranscript: true, setWorkExp: false, setSummary: false }) }
  workExpNextHandle = (newDetails) => { this.setState({ workExpDetails: newDetails, setProgram: false, setDegree: false, setTranscript: false, setWorkExp: false, setSummary: true }) }
  SummaryPrevHandle = (newDetails) => {
    this.setState({
      summaryDetails: newDetails,
      setProgram: false, setDegree: false, setTranscript: false, setWorkExp: true, setSummary: false
    })
  }


  getAppId = (appId) => {
    console.log("appID", appId)
    this.setState({
      appId: appId
    })
  }


  getDegreeId = (degreeId) => {
    this.setState({
      degreeId: degreeId
    })
  }
  getTranscriptId = (transcriptId) => {
    this.setState({
      transcriptId: transcriptId
    })
  }
  getWorkId = (workId) => {
    this.setState({
      workId: workId
    })
  }

  getTerm = (term) => {
    this.setState({
      term: term
    })

  }

  getIntake = (intake) => {
    this.setState({
      intake: intake
    })
  }


  onSubmitHandle = () => {
    
    setTimeout(() => {
      this.submitapp()
    }, 1000)
    

  }


  submitapp = () => {
    axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
    axios.post('/submitStudApplication', this.state).then((response) => {
     
      if(response.data.ok){
        console.log("App Submitted", response)
        sessionStorage.clear()
      }
    })
  }

  render() {

    return (
      <>
        <AppLayout>
          {this.state.setProgram && <Program appId={this.state.appId} programNext={this.programNextHandle} programDetails={this.state.programDetails} getAppId={this.getAppId} getTerm={this.getTerm} getIntake={this.getIntake}></Program>}
          {this.state.setDegree && <Degree appId={this.state.appId} degreePrev={this.degreePrevHandle} degreeNext={this.degreeNextHandle} degreeDetails={this.state.degreeDetails} getDegreeId={this.getDegreeId}></Degree>}
          {this.state.setTranscript && <Transcript term={this.state.term} intake={this.state.intake} appId={this.state.appId} degreeId={this.state.degreeId} getTranscriptId={this.getTranscriptId} transcriptPrev={this.transcriptPrevHandle} transcriptNext={this.transcriptNextHandle} transcriptDetails={this.state.transcriptDetails}></Transcript>}
          {this.state.setWorkExp && <WorkExp appId={this.state.appId} degreeId={this.state.degreeId} transcriptId={this.state.transcriptId} workExpPrev={this.workExpPrevHandle} workExpNext={this.workExpNextHandle} workExpDetails={this.state.workExpDetails} getWorkId={this.getWorkId}></WorkExp>}
          {this.state.setSummary && <Summary SummaryPrevHandle={this.SummaryPrevHandle} onSubmitHandle={this.onSubmitHandle} />}
        </AppLayout>
      </>
    );
  };
}


export default StudentHome;