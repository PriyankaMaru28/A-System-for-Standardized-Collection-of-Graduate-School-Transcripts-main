import React, { useState } from "react";
import axios from "axios";
import { PlusCircleOutlined } from '@ant-design/icons';
import { Form, Col, Container, Row } from 'react-bootstrap';
import { Table, Tag, Space, Modal } from 'antd';
import countryList from 'react-select-country-list';
import { Steps, Button, message } from 'antd';
import { ProgressBar } from "react-step-progress-bar";
import Cookies from 'js-cookie'
import * as _ from 'lodash';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


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
    dataIndex: 'courseFaculty',
    key: 'courseFaculty',
  },

  {
    title: 'Grade',
    dataIndex: 'courseGrade',
    key: 'courseGrade',
  }
]


class Transcript extends React.Component {

  constructor(props) {
    super(props)
    this.options = countryList().getData()
    this.state = {
      modalVisible: false,
      gradingSchemes: [],
      options: this.options,
      country: this.props.transcriptDetails.country,
      uniName: this.props.transcriptDetails.uniName,
      gradeType: this.props.transcriptDetails.gradeType,
      averageGrade: this.props.transcriptDetails.averageGrade,
      academicStanding: this.props.transcriptDetails.academicStanding,
      averageClassGrade: this.props.transcriptDetails.averageClassGrade,
      courses: this.props.transcriptDetails.courses,
      courseID: '', courseName: '', courseFaculty: '', courseGrade: '',
      showA: false,
      showB: false,
      showC: false,
      degreeId: this.props.degreeId,
      nextdisabled: true,
      appId: this.props.appId,
      term: this.props.term,
      intake: this.props.intake,
      transcriptId: null
    }
  }

  openModal = () => { this.setState({ modalVisible: true }) }
  closeModal = () => { this.setState({ modalVisible: false }) }

  courseAddHandle = () => {
    let course = {
      courseID: this.state.courseID, courseName: this.state.courseName,
      courseFaculty: this.state.courseFaculty, courseGrade: this.state.courseGrade
    }
    this.setState({ courses: [...this.state.courses, course], courseID: '', courseName: '', courseFaculty: '', courseGrade: '' })
  }

  onClickHandle = (val) => {

    if (_.isEmpty(this.state.courses) || _.isEmpty(this.state.uniName) || _.isEmpty(this.state.gradeType) || _.isEmpty(this.state.averageGrade) ||
      _.isEmpty(this.state.academicStanding)) {

      message.error('Please fill the required details')
    } else {
      var appId = sessionStorage.getItem("appId");
      var degreeId = sessionStorage.getItem("degreeId")
      let details = {
        country: this.state.country, uniName: this.state.uniName, gradeType: this.state.gradeType,
        averageGrade: this.state.averageGrade, academicStanding: this.state.academicStanding,
        averageClassGrade: this.state.averageClassGrade, courses: this.state.courses,
        appId: appId,
        degreeId: degreeId

      }
      this.handleSaveContinue()
      if (val === 'next') { this.props.transcriptNext(details) }
      else { this.props.transcriptPrev(details) }
      this.props.getTranscriptId(this.state.transcriptId)
    }
  }

  handleSaveContinue = () => {

    if (_.isEmpty(this.state.courses) || _.isEmpty(this.state.uniName) || _.isEmpty(this.state.gradeType) || _.isEmpty(this.state.averageGrade) ||
      _.isEmpty(this.state.academicStanding)) {

      message.error('Please fill the required details')

    } else {
      var appId = sessionStorage.getItem("appId");
      var degreeId = sessionStorage.getItem("degreeId")
      let details = {
        country: this.state.country, uniName: this.state.uniName, gradeType: this.state.gradeType,
        averageGrade: this.state.averageGrade, academicStanding: this.state.academicStanding,
        averageClassGrade: this.state.averageClassGrade, courses: this.state.courses, appId: appId,
        degreeId: degreeId, term: this.state.term, intake: this.state.intake

      }
      axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;

      axios.post('/saveTranscriptDetails', details).then((response) => {
        console.log("response data", response.data)
        if (response.data) {
          message.success('Transcript details successfully saved')
          this.setState({
            appId: response.data.applicationId,
            degreeId: response.data.degreeId,
            transcriptId: response.data.transcriptId,
            nextdisabled: false
          })
          sessionStorage.setItem("transcriptId", response.data.transcriptId)

        }
      })

    }
  }

  getOverlay = (content) => {

    return (
      <OverlayTrigger
        key={'right'}
        placement={'right'}
        overlay={
          <Tooltip id={`tooltip-right-1`}>
            {content}
          </Tooltip>
        }
      >
        <img style={{ height: '20px' }} src={require('../../images/icons/info_button.png').default} onClick={() => this.setState({
          showA: !this.state.showA
        })}></img>
      </OverlayTrigger>

    )


  }

  componentDidMount = () => {
    axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
    axios.defaults.headers.common["Accept"] = 'application/json';
    axios.defaults.headers.common["Content-Type"] = 'application/json'

    axios.get('/getGradingSchemes').then((response) => {
      this.setState({ gradingSchemes: response.data.gradingSchemelist });
    });
  }
  render() {
    return (
      <div>

        <ProgressBar percent={50} filledBackground="linear-gradient(to right, #fefb72, #f0bb31)" />
        <br />
        <h5 style={{ textAlign: 'center' }}>Transcript Details</h5>
        <div className='wrapper hideOverflow '>
          <Button className='center prevbtn' onClick={() => this.onClickHandle('prev')}>Previous</Button>

          <Container className='studDiv ' >
            <Form>
              <Form.Row>
                <Form.Group as={Col} sm={2} controlId="formProgram">
                  <Form.Label>* Country</Form.Label>
                  <Form.Control as="select" className="mr-sm-2" id="inlineFormCustomSelect" custom>
                    {this.state.options.map((country) =>
                      <option value={_.isEmpty(country.value) ? this.props.country : country.value} >{country.label}</option>
                    )}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} sm={4} controlId="formProgram">
                  <Form.Label >* University Name</Form.Label>
                  <Form.Control as="input" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.uniName}
                    onChange={e => this.setState({ uniName: e.target.value })} />
                </Form.Group>
                <Form.Group as={Col} sm={2} controlId="formProgram">
                  <Form.Label >* Grading Scheme</Form.Label>
                  <Form.Control as="select" className="mr-sm-2" id="inlineFormCustomSelect" custom value={this.state.gradeType}
                    onChange={e => this.setState({ gradeType: e.target.value })}>
                    <option value='0' >Choose Type</option>
                    {this.state.gradingSchemes && this.state.gradingSchemes.map((scheme) =>
                      <option value={scheme.gradingSchemeTable} >{scheme.schemName}</option>
                    )}
                    <option value='Other' >Other</option>
                  </Form.Control>
                </Form.Group>
                {(this.state.gradeType === null || this.state.gradeType === 'Other') &&
                  <>
                    <Form.Group as={Col} sm={6} controlId="formProgram" >
                      <Form.Label>Couldn't find your grading scheme?</Form.Label>
                      <p className='text30'><Button className='text30' onClick={() => this.openModal()}>Click here</Button> to request for adding a new grading scheme</p>
                    </Form.Group> </>}
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} sm={3} controlId="formProgram">
                  <Form.Label >* Final Grade Average
                    {this.getOverlay('This is the final grade obtained as a result of all the courses you have taken and as shown in your transcript, such as final grade, total average, or cumulative GPA')}
                  </Form.Label>
                  <Form.Control as="input" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.averageGrade}
                    onChange={e => this.setState({ averageGrade: e.target.value })} />
                </Form.Group>
                <Form.Group as={Col} sm={3}>
                  <Form.Label>* Final Grade Scale
                    {this.getOverlay('This is the maximum final grade that can be obtained in the program you have taken and as shown in your transcript as final grade, average, or cumulative GPA')}
                  </Form.Label>
                  <Form.Control as="select" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.averageClassGrade}
                    onChange={e => this.setState({ averageClassGrade: e.target.value })}   >
                    <option value="0">Choose Final Grade Scale</option>
                    <option value="0-100">0 to 100 (Maximum)</option>
                    <option value="0-10">0 to 10 (Maximum)</option>
                    <option value="0-20">0 to 20 (Maximum) </option>
                    <option value="0-4.0">0 to 4.0 (GPA)</option>
                    <option value="0-5.0">0 to 5.0 (GPA)</option>
                    <option value="A to F">A to F (Letter grade)</option>
                    <option value="O-F">0 (Outstanding) to F (Fail)</option>
                    <option value="1-5">1 (Highest) to 5 (Lowest)</option>
                  </Form.Control>
                  {/* <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.averageClassGrade}
                          onChange = {e => this.setState({ averageClassGrade : e.target.value })}  /> */}
                </Form.Group>
                <Form.Group as={Col} sm={3}>
                  <Form.Label>* Academic Standing
                    {this.getOverlay('This is the class standing that you have achieved as a function of your final grade, according to the transcript from your institution (if there is no standing granted in your transcript, leave this field blank)')}
                  </Form.Label>
                  <Form.Control as="select" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.academicStanding}
                    onChange={e => this.setState({ academicStanding: e.target.value })}   >
                    <option value="0">Choose Academic Standing</option>
                    <option value="First Class">First Class</option>
                    <option value="Second Class (Upper)">Second Class (Upper)</option>
                    <option value="Second Class">Second Class</option>
                    <option value="Second Class (Lower)">Second Class (Lower)</option>
                    <option value="Third Class">Third Class</option>
                    <option value="N/A">N/A</option>
                  </Form.Control>
                  {/* <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.academicStanding}
                          onChange = {e => this.setState({ academicStanding : e.target.value })}  /> */}
                </Form.Group>

              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} sm={2} controlId="formProgram">
                  <Form.Label >* Course ID</Form.Label>
                  <Form.Control type="text" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.courseID}
                    onChange={e => this.setState({ courseID: e.target.value })} />
                </Form.Group>
                <Form.Group as={Col} sm={3} controlId="formProgram">
                  <Form.Label >* Course Name</Form.Label>
                  <Form.Control as="input" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.courseName}
                    onChange={e => this.setState({ courseName: e.target.value })} />
                </Form.Group>
                <Form.Group as={Col} sm={2} controlId="formProgram">
                  <Form.Label >* Faculty</Form.Label>
                  <Form.Control as="input" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.courseFaculty}
                    onChange={e => this.setState({ courseFaculty: e.target.value })} />
                </Form.Group>
                <Form.Group as={Col} sm={2} controlId="formProgram">
                  <Form.Label >* Grade</Form.Label>
                  <Form.Control as="input" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.courseGrade}
                    onChange={e => this.setState({ courseGrade: e.target.value })} />
                </Form.Group>
                <br />
                <Form.Group as={Col} sm={2} controlId="formProgram">
                  <Form.Label >Add</Form.Label>
                  <p >  <Button  >
                    <PlusCircleOutlined className="mr-sm-2" onClick={() => this.courseAddHandle()} />
                  </Button> </p>
                </Form.Group>
              </Form.Row>
            </Form>
            <Table columns={columns} dataSource={this.state.courses} />
          </Container>

          <Button className='center nextbtn' type="primary" onClick={() => this.onClickHandle('next')}> Next</Button>
        </div>
        <GradingSchemeModal visibility={this.state.modalVisible} onClose={() => this.closeModal()}></GradingSchemeModal>

      </div>
    )
  }
}


const GradingSchemeModal = ({ visibility, onClose }) => {
  const [description, setDescription] = useState("");
  const submit = () => {
    if (description == '') { message.error('Please add description') }
    else {
      axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
      axios.post('/addGradingScheme', { 'description': description }).then((response) => {
        console.log(response)
        if (response.data.ok) { message.success('Request sent to Graduate office') }
      })
      onClose()
    }
  }
  return (
    <Modal title='Request to add new Grading Scheme' visible={visibility} onCancel={onClose} onOk={submit}>
      <Container>
        <Form>
          <Form.Row>
            <Form.Group as={Col} sm={7} controlId="formProgram" >
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" className="mr-sm-2" id="inlineFormCustomSelect" value={description}
                onChange={e => setDescription(e.target.value)} />
            </Form.Group>
          </Form.Row>
        </Form>
      </Container>
    </Modal>
  )

}

export default Transcript;