import React from "react";
import axios from "axios";
import {PlusCircleOutlined} from '@ant-design/icons';
import {Form, Col, Container, Row} from 'react-bootstrap';
import {Steps, Button ,message} from 'antd';
import { ProgressBar } from "react-step-progress-bar";
import * as _ from 'lodash';
import Summary from '../Summary/Summary';
import { Route } from 'react-router-dom';
import moment from 'moment';
import Cookies from "js-cookie";
import Spinner from 'react-bootstrap/Spinner';


class WorkExp extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {          
            workField:this.props.workExpDetails.workField ,
            role:this.props.workExpDetails.role, 
            monthsOfExp: this.props.workExpDetails.monthsOfExp, companyName: this.props.workExpDetails.companyName,
            description: this.props.workExpDetails.description, workStart : this.props.workExpDetails.workStart , workEnd:this.props.workExpDetails.workEnd,
            percent:75,
            complete: false,
            appId: this.props.appId,
            nextdisabled:true,
            degreeId: this.props.degreeId,
            transcriptId : this.props.transcriptId,
            workId:null
          }
      }

      onClickHandle = (val) =>{
        let workDetails 
        if(_.isEmpty(this.state.workField) || _.isEmpty(this.state.role) || _.isEmpty(this.state.companyName) ||
        _.isEmpty(this.state.companyName ) || _.isEmpty(this.state.workStart ) || _.isEmpty(this.state.workEnd )){
          message.error('Please fill in the required details');
    
        }else {
        var appId = sessionStorage.getItem("appId");
          var degreeId = sessionStorage.getItem("degreeId");
          var transcriptId = sessionStorage.getItem("transcriptId");
          var workId = sessionStorage.getItem("workId")
    
           workDetails = {
            workField:this.state.workField , 
            role:this.state.role, 
            monthsOfExp: this.state.monthsOfExp, 
            companyName: this.state.companyName,
            description: this.state.description,  
            workStart:this.state.workStart ,
            workEnd : this.state.workEnd ,
            appId:appId, degreeId:degreeId, 
            transcriptId:transcriptId,workId : workId
           }

           this.handleSaveContinue()
           this.props.getWorkId(this.state.workId)

            if(val === 'next'){
              setTimeout(()=>{
                this.props.workExpNext(workDetails)
              },10000)}
            else{this.props.workExpPrev(workDetails)}
          }
            
          
      }

      handleSaveContinue = () => {
        let workDetails 
        if(_.isEmpty(this.state.workField) || _.isEmpty(this.state.role) || _.isEmpty(this.state.companyName) ||
        _.isEmpty(this.state.companyName ) || _.isEmpty(this.state.workStart ) || _.isEmpty(this.state.workEnd )){
          message.error('Please fill in the required details');
    
        }else {
          var appId = sessionStorage.getItem("appId");
          var degreeId = sessionStorage.getItem("degreeId");
          var transcriptId = sessionStorage.getItem("transcriptId");
          workDetails = {workField:this.state.workField , role:this.state.role, monthsOfExp: this.state.monthsOfExp, companyName: this.state.companyName,
          description: this.state.description,  workStart:this.state.workStart ,workEnd : this.state.workEnd , appID: appId,  degreeID: degreeId,
          transcriptID : transcriptId}

          axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
          axios.post('/saveWorkDetails',workDetails).then((response)=>{
              console.log("response data",response.data)
              if(response.data){
                  message.success('Work details successfully saved')
                  this.setState({
                      appId : response.data.applicationId,
                      degreeId: response.data.degreeId,
                      transcriptId : response.data.transcriptId,
                      workId: response.data.workId,
                      nextdisabled:false
                  })
                  sessionStorage.setItem("workId",response.data.workId)
              }
          })
        }

      }



    getdates = (enddate) =>{
     let startDate = _.split(this.state.workStart, '-')
     let  endDate = _.split(enddate, '-')
     let diff= moment(enddate).diff(moment(this.state.workStart), 'months', true)
      this.setState({ workEnd: enddate, monthsOfExp : diff.toFixed(2)});
  }


    render() {
    
        return (
            <div>
              <ProgressBar percent={this.state.percent} filledBackground="linear-gradient(to right, #fefb72, #f0bb31)" />
              <br/>
              <h5 style ={{textAlign:'center'}}>Work Experience Details</h5>
              <div className = 'wrapper hideOverflow '>
                <Button className='center prevbtn' onClick={() => this.onClickHandle('prev') }> Previous</Button>                
                <Container className= 'studDiv ' >                   
                    <Form>
                      <Form.Row>
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>* Company Name</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.companyName}
                          onChange = {e => this.setState({ companyName : e.target.value })} />              
                          </Form.Group>
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>* Work Field</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.workField}
                          onChange = {e => this.setState({ workField : e.target.value })} />              
                          </Form.Group>
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>* Role</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.role}
                          onChange = {e => this.setState({ role : e.target.value })} />              
                          </Form.Group>
                      </Form.Row>
                      <Form.Row>
                          
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>From</Form.Label>
                          <Form.Control type ="date"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.workStart}
                          onChange = {e => this.setState({ workStart : e.target.value })} />     
                          </Form.Group> 
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>To</Form.Label>
                          <Form.Control type ="date"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.workEnd}
                          onChange = {e => this.getdates(e.target.value)} />     
                          </Form.Group> 
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>* Months of Experience</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.monthsOfExp} disabled/>              
                          </Form.Group>
                      </Form.Row>
                      <Form.Row>
                          <Form.Group as={Col} sm = {5} controlId="formProgram">
                          <Form.Label>* Description</Form.Label>
                          <Form.Control as="textarea"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.description}
                          onChange = {e => this.setState({ description : e.target.value })} />              
                          </Form.Group>
                      </Form.Row>
                      
                    </Form>
                  </Container>
            <Button  className='center nextbtn'  type="primary" onClick={() => this.onClickHandle('next')}> Next</Button>
            </div>
            </div>
        )
    }
}


export default WorkExp;
