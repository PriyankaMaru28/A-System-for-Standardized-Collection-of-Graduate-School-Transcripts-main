import React,{useState} from "react";
import axios from "axios";
import {PlusCircleOutlined} from '@ant-design/icons';
import {Form, Col, Container, Row} from 'react-bootstrap';
import { Table, Tag, Space, Modal } from 'antd';
import countryList from 'react-select-country-list';
import {Steps, Button ,message} from 'antd';
import { ProgressBar } from "react-step-progress-bar";
import Cookies from 'js-cookie'
import * as _ from 'lodash';


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
      gradingSchemes : [],
      options: this.options,
      country:this.props.transcriptDetails.country, 
      uniName: this.props.transcriptDetails.uniName, 
      gradeType: this.props.transcriptDetails.gradeType,
      averageGrade : this.props.transcriptDetails.averageGrade, 
      academicStanding: this.props.transcriptDetails.academicStanding,
      averageClassGrade:this.props.transcriptDetails.averageClassGrade, 
      courses: this.props.transcriptDetails.courses,
      courseID:'', courseName : '', courseFaculty:'', courseGrade: ''
    }
  }

  openModal =() =>{ this.setState({modalVisible:true})   }      
  closeModal =() =>{ this.setState({modalVisible:false}) } 

  courseAddHandle = () =>{
    let course = {
      courseID:this.state.courseID, courseName : this.state.courseName, 
      courseFaculty:this.state.courseFaculty, courseGrade: this.state.courseGrade }
      //this.courseid =''
      this.setState({courses:[...this.state.courses, course], courseID:'', courseName : '', courseFaculty:'', courseGrade: '' })
  }

  onClickHandle= (val) => {

    if(_.isEmpty(this.state.courses) || _.isEmpty(this.state.uniName) || _.isEmpty(this.state.gradeType) || _.isEmpty(this.state.averageGrade) ||
    _.isEmpty(this.state.academicStanding )){

      message.error('Please fill the required details')

    }else{
    let details = {
      country:this.state.country, uniName: this.state.uniName, gradeType: this.state.gradeType,
      averageGrade : this.state.averageGrade, academicStanding: this.state.academicStanding,
      averageClassGrade:this.state.averageClassGrade, courses: this.state.courses

    }
    if(val === 'next'){ this.props.transcriptNext(details)}
    else{this.props.transcriptPrev(details)}
  }
  }

    componentDidMount= () => { 
    axios.get('/api/getGradingSchemes').then( (response) => {
      this.setState({ gradingSchemes: response.data.gradingSchemelist  });
    });
  }
    render() {
      //const courseAdd = !(this.state.courseID != '' && this.state.courseName != ''&&
      //this.state.courseFaculty != '' && this.state.courseGrade != '')
        return (
            <div>
              
              <ProgressBar percent={50} filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"/>
              <br/>
              <h5 style ={{textAlign:'center'}}>Transcript Details</h5>
              <div className = 'wrapper hideOverflow '>
                <Button className='center prevbtn' onClick={() => this.onClickHandle('prev')}>Previous</Button>
              
                <Container className= 'studDiv ' >
                    <Form>
                      <Form.Row>
                          <Form.Group as={Col} sm = {2} controlId="formProgram">
                          <Form.Label>Country</Form.Label>
                          <Form.Control as="select"  className="mr-sm-2" id="inlineFormCustomSelect" custom>
                          {this.state.options.map((country) =>
                              <option value= {_.isEmpty(country.value) ? this.props.country : country.value } >{country.label}</option>
                              )} 
                          </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} sm = {4} controlId="formProgram">
                                  <Form.Label >University Name</Form.Label>
                                  <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.uniName}
                          onChange = {e => this.setState({ uniName : e.target.value })}  />
                          </Form.Group>
                          <Form.Group as={Col} sm = {2} controlId="formProgram">
                                  <Form.Label > Grading Scheme</Form.Label>
                                  <Form.Control as="select"  className="mr-sm-2" id="inlineFormCustomSelect" custom value={this.state.gradeType}
                onChange={e => this.setState({ gradeType: e.target.value })}>
                              <option value ='0' >Choose Type</option>
                              {this.state.gradingSchemes.map((scheme) =>
                              <option value= {scheme.gradingSchemeTable} >{scheme.schemName}</option>
                              )} 
                              <option value= 'Other' >Other</option>
                          </Form.Control>
                          </Form.Group>
                          { (this.state.gradeType === null  || this.state.gradeType === 'Other') &&
                          <>
                          <Form.Group as={Col} sm = {6} controlId="formProgram" >
                          <Form.Label>Couldn't find your grading scheme?</Form.Label>
                          <p className = 'text30'><Button className = 'text30' onClick = {()=> this.openModal()}>Click here</Button> to request for adding a new grading scheme</p> 
                      </Form.Group> </>}
                      
                      
                      </Form.Row>
                      <Form.Row>
                      <Form.Group as={Col} sm = {3} controlId="formProgram">
                                  <Form.Label >Average Grade</Form.Label>
                                  <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.averageGrade}
                          onChange = {e => this.setState({ averageGrade : e.target.value })}  />

                          </Form.Group>
                          <Form.Group as={Col} sm = {3}>
                          <Form.Label>Academic Standing</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.academicStanding}
                          onChange = {e => this.setState({ academicStanding : e.target.value })}  />
                      </Form.Group>
                      <Form.Group as={Col} sm = {3}>
                          <Form.Label>Average Class Grade</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.averageClassGrade}
                          onChange = {e => this.setState({ averageClassGrade : e.target.value })}  />
                      </Form.Group>
                      </Form.Row>
                      <Form.Row>
                          <Form.Group as={Col} sm = {2} controlId="formProgram">
                                  <Form.Label >Course ID</Form.Label>
                                  <Form.Control type ="text"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.courseID}
                          onChange = {e => this.setState({ courseID : e.target.value })}  />
                          </Form.Group>
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                                  <Form.Label >Course Name</Form.Label>
                                  <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.courseName}
                          onChange = {e => this.setState({ courseName : e.target.value })}  />
                          </Form.Group>
                          <Form.Group as={Col} sm = {2} controlId="formProgram">
                                  <Form.Label >Faculty</Form.Label>
                                  <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.courseFaculty}
                          onChange = {e => this.setState({ courseFaculty : e.target.value })}  />
                          </Form.Group>
                          <Form.Group as={Col} sm = {2} controlId="formProgram">
                                  <Form.Label >Grade</Form.Label>
                                  <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.courseGrade}
                          onChange = {e => this.setState({ courseGrade : e.target.value })}  />
                          </Form.Group>
                          <br/>
                          <Form.Group as={Col} sm = {2} controlId="formProgram">
                                  <Form.Label >Add</Form.Label> 
                                  <p >  <Button  >                      
                                <PlusCircleOutlined className="mr-sm-2" onClick = {() => this.courseAddHandle()} />
                                </Button> </p>
                        </Form.Group>
                  </Form.Row>
                    </Form>
                    <Table columns={columns} dataSource={this.state.courses}   />
                </Container>
            
                <Button  className='center nextbtn'  type="primary" onClick={() => this.onClickHandle('next')}> Next</Button>
              </div>
            <GradingSchemeModal visibility= {this.state.modalVisible} onClose={() => this.closeModal()}></GradingSchemeModal>
  
            </div>
        )
    }
}


const GradingSchemeModal = ({ visibility, onClose}) => {
  const [description,setDescription] = useState("");
  const submit = ()=>{
      if(description == ''){message.error('Please add description')}
      else{
      axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
      axios.post('/addGradingScheme',{'description':description}).then((response)=>{
          console.log(response)
          if(response.data.ok){message.success('Request sent to Graduate office')}
      })
      onClose()
       }
  }
  return(
  <Modal title='Request to add new Grading Scheme'  visible={visibility}  onCancel={onClose} onOk = {submit}>
     <Container>
         <Form>
         <Form.Row>
          <Form.Group as={Col} sm = {7} controlId="formProgram" >
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea"  className="mr-sm-2" id="inlineFormCustomSelect" value={description}
    onChange={e => setDescription(e.target.value )}/>
           </Form.Group>
           </Form.Row>
         </Form>
     </Container>
</Modal>
  )

}

export default Transcript;