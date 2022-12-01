import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Table, Tag, Space, Button, message } from 'antd';
import '../../App.css'
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import moment from "moment";
import { ProgressBar } from "react-step-progress-bar";
import ReCAPTCHA from "react-google-recaptcha";

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

class Summary extends React.Component {

  constructor(props) {
    super(props)
    this.captchaToken = React.createRef();
    this.state = {
      percent: 75,
      nextdisabled: false,
      prevdisabled: false,
      complete: false,
      isVerified: false,
      appDetails: {
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
          otherRankWorld: null, otherRankCountry: null, otherRankLink: null, degreeLevel: null, program: null, degreeStart: null, degreeEnd: null, overallGrade: null
        },
        programDetails: {
          program: null, dept: null, route: null, intake: null, term: null,
          overall: null, analytical: null, quantitative: null, verbalReasoning: null,
          ept: null, eptOverall: null, eptSpeaking: null, eptWriting: null, eptListening: null, eptReading: null
        }
      }
    }
  }


  componentDidMount() {
    let session = JSON.parse(Cookies.get("session"))
    var user = session.user; var id;
    console.log(user.id)
    axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
    axios.get('/getSubmittedApplication/' + user.id).then((response) => {
      console.log(response.data.appDetails)
      let workData = response.data.appDetails.workExp, transData = response.data.appDetails.transcript;
      let degreeData = response.data.appDetails.degree, programData = response.data.appDetails.program;
      let newDetails = {
        workExpDetails: {
          workField: workData.field, role: workData.role, monthsOfExp: workData.monthsofExperince, companyName: workData.company,
          description: workData.description, workStart: workData.startDate, workEnd: workData.startDate
        },
        transcriptDetails: {
          country: transData.country, uniName: transData.universityName, gradeType: transData.gradeType,
          averageGrade: transData.averageGrade, academicStanding: transData.academicStanding,
          averageClassGrade: transData.averageClassGrade, courses: transData.courses
        },
        degreeDetails: {
          country: degreeData.country, uniName: degreeData.universityName, uniRankWorld: degreeData.uniRankWorld, uniRankCountry: degreeData.uniRankCountry, uniRankLink: degreeData.uniRankLink,
          otherRankWorld: degreeData.otherRankWorld, otherRankCountry: degreeData.otherRankCountry, otherRankLink: degreeData.otherRankLink, degreeLevel: degreeData.degreeLevel, program: degreeData.program,
          degreeStart: degreeData.startDate, degreeEnd: degreeData.endDate, overallGrade: degreeData.overallGrade
        },
        programDetails: {
          program: programData.program, dept: programData.dept, route: programData.route, intake: programData.intakeYear, term: programData.intakeTerm,
          overall: programData.overall, analytical: programData.analytical, quantitative: programData.quantitative, verbalReasoning: programData.verbalReasoning,
          ept: programData.ept, eptOverall: programData.eptOverall, eptSpeaking: programData.eptSpeaking, eptWriting: programData.eptWriting, eptListening: programData.eptListening, eptReading: programData.eptReading
        }
      }
      this.setState({ appDetails: newDetails });
    })
  }

  submitHandle = () => {
    this.props.onSubmitHandle();
    this.setState({
      percent: 100,
      complete: true,
      prevdisabled: true,
      nextdisabled: true,
      isVerified: false
    })

    message.success('Processing complete!');

  }

  recaptcha_fun = async () => {
    alert(`google recaptcha clicked ${this.captchaToken.current.getValue()}`)
    const captchaToken = this.captchaToken.current.getValue();
    const YOUR_PRIVATE_KEY = '6LeRwTsjAAAAAL6oIwYSxJON96x7krwJXBglqKpX'

    // Call Google's API to get score
    const res = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${YOUR_PRIVATE_KEY}&response=${captchaToken}`
    );

    // Extract result from the API response
    if (res.data.success) {
      console.log('Valid');
    } else {
      console.log('Invalid');
    }


    this.setState({
      isVerified: true
    })
  }




  render() {
    let session = JSON.parse(Cookies.get("session"))
    var user = session.user
    const app = this.state.appDetails
    return (
      <div>
        <ProgressBar percent={this.state.percent} filledBackground="linear-gradient(to right, #fefb72, #f0bb31)" />
        <br />
        <div>
          <Button className='center prevbtn' style={{ marginTop: '22em' }} disabled={this.state.prevdisabled} onClick={() => { this.props.SummaryPrevHandle(this.state.appDetails) }}> Previous</Button>
        </div>
        <Container className='studDiv'>
          <div style={{ width: '100%' }}>
            {(app != {} && user.role == 'student') &&
              <>
                <h3 style={{ 'text-align': 'center' }}> Application Details </h3>
                <div className='borderShadow'>
                  <h5 className='heading'>Program Details</h5>
                  <br />
                  <p>
                    <span className='dataHeading'>Progam:</span> <span className='data'>{app.programDetails.program}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Department:</span> <span className='data'>{app.programDetails.dept}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Route:</span> <span className='data'>{app.programDetails.route}</span>
                    <br />
                    <span className='dataHeading'>Intake Year:</span> <span className='data'>{app.programDetails.intake}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Intake Term:</span> <span className='data'>{app.programDetails.term}</span>
                    <br /><br />
                  </p>
                  {app.programDetails.overall && app.programDetails.verbalReasoning && app.programDetails.quantitative && app.programDetails.analytical &&
                    <p>
                      <h6 className='sideHeading'>Gre Scores:</h6>

                      <span className='dataHeading'>Overall:</span> <span className='data'>{app.programDetails.overall}</span>&nbsp; &nbsp;
                      <span className='dataHeading'>Verbal Reasoning:</span> <span className='data'>{app.programDetails.verbalReasoning}</span>
                      <span className='dataHeading'>Quantitative Reasoning:</span> <span className='data'>{app.programDetails.quantitative}</span>&nbsp; &nbsp;
                      <span className='dataHeading'>Analytical Writing:</span> <span className='data'>{app.programDetails.analytical}</span>

                    </p>
                  }
                  <p>
                    <h6 className='sideHeading'>{app.programDetails.ept} Scores:</h6>

                    <span className='dataHeading'>Overall:</span> <span className='data'>{app.programDetails.eptOverall}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Listening:</span> <span className='data'>{app.programDetails.eptListening}</span>
                    <span className='dataHeading'>Speaking:</span> <span className='data'>{app.programDetails.eptSpeaking}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Reading:</span> <span className='data'>{app.programDetails.eptReading}</span>
                    <span className='dataHeading'>Writing:</span> <span className='data'>{app.programDetails.eptWriting}</span>

                  </p>
                </div>
                <div className='borderShadow'>
                  <h5 className='heading'>University Details</h5>
                  <br />
                  <p>
                    <span className='dataHeading'>University Name:</span> <span className='data'>{app.degreeDetails.uniName}&nbsp; &nbsp; </span>
                    <span className='dataHeading'>Country:</span> <span className='data'>{app.degreeDetails.country}&nbsp; &nbsp;</span>
                    <br />
                    <span className='dataHeading'>Degree:</span> <span className='data'>{app.degreeDetails.degreeLevel}&nbsp; &nbsp;</span>
                    <span className='dataHeading'>Program:</span> <span className='data'>{app.degreeDetails.program}&nbsp; &nbsp;</span>
                    <span className='dataHeading'>From:</span> <span className='data'>{moment(app.degreeDetails.degreeStart).utc().format('YYYY-MM-DD')}&nbsp; &nbsp;</span>
                    <span className='dataHeading'>To:</span> <span className='data'>{moment(app.degreeDetails.degreeEnd).utc().format('YYYY-MM-DD')}&nbsp; &nbsp;</span>

                    <br />
                  </p>
                  <p>
                    <h6 className='sideHeading'>University Rankings</h6>
                    {app.degreeDetails.uniRankWorld && <><span className='dataHeading'>UniRank World Ranking:</span> <span className='data'>{app.degreeDetails.uniRankWorld}</span>&nbsp; &nbsp;</>}
                    {app.degreeDetails.uniRankCountry && <><span className='dataHeading'>UniRank Country Ranking:</span> <span className='data'>{app.degreeDetails.uniRankCountry}</span>&nbsp; &nbsp;</>}
                    {app.degreeDetails.uniRankLink && <><span className='dataHeading'>Link:</span> <span className='data'>{app.degreeDetails.uniRankLink}</span></>}
                    <br />
                    {app.degreeDetails.otherRankWorld && <><span className='dataHeading'>Webometrics / Other World Ranking:</span> <span className='data'>{app.degreeDetails.otherRankWorld}</span>&nbsp; &nbsp;</>}
                    {app.degreeDetails.otherRankCountry && <><span className='dataHeading'>Webometrics / Other Country Ranking:</span> <span className='data'>{app.degreeDetails.otherRankCountry}</span>&nbsp; &nbsp;</>}
                    {app.degreeDetails.otherRankLink && <><span className='dataHeading'>Link:</span> <span className='data'>{app.degreeDetails.otherRankLink}</span></>}
                    <br />
                  </p>
                </div>
                <div className='borderShadow'>
                  <h5 className='heading' >Transcript Details</h5>
                  <br />
                  <p>
                    <span className='dataHeading'>University Name:</span> <span className='data'>{app.transcriptDetails.uniName}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Country:</span> <span className='data'>{app.transcriptDetails.country}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Grading Scheme:</span> <span className='data'>{app.transcriptDetails.gradeType}</span>
                    <br />
                    <span className='dataHeading'>Final Grade Average:</span> <span className='data'>{app.transcriptDetails.averageGrade}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Academic Standing:</span> <span className='data'>{app.transcriptDetails.academicStanding}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Final Grade Scale:</span> <span className='data'>{app.transcriptDetails.averageClassGrade}</span>
                    <br />
                  </p>
                  <Table columns={columns} dataSource={app.transcriptDetails.courses} />

                </div>
                <div className='borderShadow'>
                  <h5 className='heading' >Work Experience</h5>
                  <br />
                  <p>
                    <span className='dataHeading'>Company Name:</span> <span className='data'>{app.workExpDetails.companyName}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Field:</span> <span className='data'>{app.workExpDetails.workField}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>Role:</span> <span className='data'>{app.workExpDetails.role}</span>
                    <br />
                    <span className='dataHeading'>Months of Experince:</span> <span className='data'>{app.workExpDetails.monthsOfExp}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>From:</span> <span className='data'>{app.workExpDetails.workStart}</span>&nbsp; &nbsp;
                    <span className='dataHeading'>To:</span> <span className='data'>{app.workExpDetails.workEnd}</span>
                    <br />
                    <span className='dataHeading'>Description:</span> <span className='data'>{app.workExpDetails.description}</span>
                  </p>
                </div>
              </>
            }

            <div>

            </div>
          </div>
        </Container>
        <div>
          {/**
               * Shift the code to sign in page
               */}
          {/* <ReCAPTCHA
                    className='center recaptchabtn'
                    sitekey={'6LeRwTsjAAAAAIH41r4yFq5-bo3dheymEgp6XNuS'} 
                    ref={this.captchaToken}
                    onChange={()=>{this.recaptcha_fun()}}
                    style={{ display: "inline-block",marginTop: '18em' }}
                    size="invisible"
              /> */}
          <Button type="primary" className='center nextbtn' style={{ marginTop: '22em' }} disabled={this.state.nextdisabled} onClick={() => this.submitHandle()}>Submit</Button>

        </div>
      </div>
    );
  }
}

export default Summary;
