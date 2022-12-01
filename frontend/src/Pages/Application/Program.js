import React, { useState } from "react";
import axios from "axios";
import {PlusCircleOutlined} from '@ant-design/icons';
import {Modal,message} from 'antd'
import {Form,Col, Container, Row,Button} from 'react-bootstrap';
import Cookies from "js-cookie";
import * as _ from 'lodash';

import "react-step-progress-bar/styles.css";
import { ProgressBar } from "react-step-progress-bar";

class Program extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            validated : false,
            appId:this.props.appId,
            nextdisabled:true,
            program: this.props.programDetails.program, 
            dept:this.props.programDetails.dept,route:this.props.programDetails.route,
            intake:this.props.programDetails.intake, term: this.props.programDetails.term,
            overall:this.props.programDetails.overall,analytical:this.props.programDetails.analytical,
            quantitative:this.props.programDetails.quantitative,verbalReasoning:this.props.programDetails.verbalReasoning,
            ept:this.props.programDetails.ept,eptOverall:this.props.programDetails.eptOverall,eptSpeaking:this.props.programDetails.eptSpeaking,
            eptWriting:this.props.programDetails.eptWriting,eptListening:this.props.programDetails.eptListening,eptReading:this.props.programDetails.eptReading,
            
        }         
            
        }

        openModal =() =>{ this.setState({modalVisible:true})   }
      
        closeModal =() =>{ this.setState({modalVisible:false}) } 

      

      handleSaveContinue = () =>{
        console.log('inside save and continue',this.state)
        const appID = sessionStorage.getItem("appId") === "undefined" ? null : sessionStorage.getItem("appId");
        if (!_.isEmpty(this.state.program) && !_.isEmpty(this.state.dept) && !_.isEmpty(this.state.route) && !_.isEmpty(this.state.intake) && !_.isEmpty(this.state.ept)){
        let details = {program: this.state.program,  
            dept:this.state.dept,
            route:this.state.route,
            intake:this.state.intake, 
            term: this.state.term,            
            overall:this.state.overall,
            analytical:this.state.analytical,
            quantitative:this.state.quantitative,
            verbalReasoning:this.state.verbalReasoning,
            ept:this.state.ept,
            eptOverall:this.state.eptOverall,
            eptSpeaking:this.state.eptSpeaking,
            eptWriting:this.state.eptWriting,eptListening:this.state.eptListening,eptReading:this.state.eptReading, appID: appID, appId : this.state.appId
     
        }
        axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
        axios.post('/saveProgramDetail',details).then((response)=>{
            console.log("response data",response.data)
            if(response.data){
                message.success('Program details successfully saved')
                this.setState({
                    appId : response.data.applicationId,
                    nextdisabled:false
                })

                sessionStorage.setItem("appId",response.data.applicationId)
                this.props.getAppId(response.data.applicationId)
            }
        })
    }else {
        message.error('Please fill the required values')
    }

      }

      handleNext = (event) => {

        if (_.isEmpty(this.state.program) || _.isEmpty(this.state.dept) || _.isEmpty(this.state.route) || _.isEmpty(this.state.intake) || _.isEmpty(this.state.ept)){
            console.log('program',this.state.program , 'dept',this.state.dept,'route', this.state.route ,'ept', this.state.ept , '..intake ..',this.state.intake , '..... ',_.isEmpty(this.state.program) || _.isEmpty(this.state.dept) || _.isEmpty(this.state.route) || _.isEmpty(this.state.intake) || _.isEmpty(this.state.ept))
            
            message.error('Please fill the required values')
        }else {
          let details = {program: this.state.program,  
            dept:this.state.dept,
            route:this.state.route,
            intake:this.state.intake, 
            term: this.state.term,            
            overall:this.state.overall,
            analytical:this.state.analytical,
            quantitative:this.state.quantitative,
            verbalReasoning:this.state.verbalReasoning,
            ept:this.state.ept,
            eptOverall:this.state.eptOverall,
            eptSpeaking:this.state.eptSpeaking,
            eptWriting:this.state.eptWriting,eptListening:this.state.eptListening,eptReading:this.state.eptReading,appId: this.state.appId
     
        }
        this.handleSaveContinue();
          this.props.programNext(details)
          this.props.getTerm(this.state.term)
          this.props.getIntake(this.state.intake)
         
    }
      }

    render() {
        const vals = this.state
        
        return (
         <>
            <ProgressBar percent={0} filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"/>
            <br/>
            <h5 style ={{textAlign:'center'}}>Program Details</h5>
            <div className = 'wrapper hideOverflow '>
                <Container className= 'studDiv '>
                    <Form id ='programform' sm = {5} width = '50%'  >
                        <Form.Row>
                            <Form.Group as={Col} sm = {2} controlId="formProgram">
                                <Form.Label>* Program</Form.Label>
                                <Form.Control as="select" required className="mr-sm-2" id="inlineFormCustomSelect" custom value={this.state.program}
                    onChange={e => this.setState({ program: e.target.value })}>
                                    <option value="0">Choose Program</option>
                                    <option value="Master of Science">Master of Science</option>
                                    <option value="Master of Applied Science">Master of Applied Science</option>
                                    <option value="3"></option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} sm = {2} controlId="formGridPassword">
                                <Form.Label>* Department</Form.Label>
                                <Form.Control as="select" required className="mr-sm-2" id="inlineFormCustomSelect" custom value={this.state.dept}
                    onChange={e => this.setState({ dept: e.target.value })}>
                                    <option value="0">Choose Faculty</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Computer Engineering">Computer Engineering</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} sm = {2} controlId="formGridPassword">
                                <Form.Label>* Route</Form.Label>
                                <Form.Control as="select"  className="mr-sm-2" id="inlineFormCustomSelect" custom value={this.state.route}
                    onChange={e => this.setState({ route: e.target.value })}>
                                    <option value="0">Choose Route</option>
                                    <option value="Course Based">Course Based</option>
                                    <option value="Thesis">Thesis</option>
                                    <option value="MAI">Masters in AI</option>
                                </Form.Control>
                            </Form.Group>
                        
                            <Form.Group as={Col} sm ={2} controlId="formGridPassword">
                                <Form.Label>* Intake</Form.Label>
                                <Form.Control as="select"  className="mr-sm-2" id="inlineFormCustomSelect" custom value={this.state.intake}
                    onChange={e => this.setState({ intake: e.target.value })}>
                                    <option value="0">Choose Intake</option>
                                    <option value="2020">2020</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>

                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} sm = {2} controlId="formGridPassword">
                                <Form.Label>* Term</Form.Label>
                                <Form.Control as="select"  className="mr-sm-2" id="inlineFormCustomSelect" custom value={this.state.term}
                    onChange={e => this.setState({ term: e.target.value })}>
                                    <option value="0">Choose Term</option>
                                    <option value="Fall">Fall</option>
                                    <option value="Winter">Winter</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} sm = {2} controlId="formProgram" >
                                <Form.Label>GRE Overall Score</Form.Label>
                                <Form.Control type="number"  className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.overall}
                    onChange={e => this.setState({ overall: e.target.value })}/>
                            </Form.Group>
                            <Form.Group as={Col} sm = {2} controlId="formProgram">
                                <Form.Label>GRE Verbal Reasoning</Form.Label>
                                <Form.Control type="number"  className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.verbalReasoning}
                    onChange={e => this.setState({ verbalReasoning: e.target.value })} />
                            </Form.Group>
                            <Form.Group as={Col} sm = {2} controlId="formProgram">
                                <Form.Label>GRE Analytical Writing</Form.Label>
                                <Form.Control type="number"  className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.analytical}
                    onChange={e => this.setState({ analytical: e.target.value })} />
                            </Form.Group>
                            <Form.Group as={Col} sm = {3} controlId="formProgram">
                                <Form.Label>GRE Quantitative Reasoning</Form.Label>
                                <Form.Control type="number"  className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.quantitative}
                    onChange={e => this.setState({ quantitative: e.target.value })} />
                            </Form.Group>
                    
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} sm = {3} controlId="formProgram">
                                <Form.Label>* English Language Proficiency Exam</Form.Label>
                                <Form.Control as="select"  className="mr-sm-2" id="inlineFormCustomSelect" custom value={this.state.ept}
                    onChange={e => this.setState({ ept: e.target.value })}>
                                    <option value="0">Choose Program</option>                       
                                    <option value="IELTS">IELTS</option>
                                    <option value="TOEFL">TOEFL</option>
                                    <option value="PTE">PTE Academic</option>
                                    <option value="CELPIP">CELPIP</option>
                                    <option value="Other">Other</option>
                                </Form.Control>
                                </Form.Group>
                                
                                { (this.state.ept !== null ) && <><Form.Group as={Col} sm = {2} controlId="formProgram" >
                                <Form.Label>{this.state.ept} Overall Score</Form.Label>
                                <Form.Control as="input"  type="number" step="0.1" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.eptOverall}
                    onChange={e => this.setState({ eptOverall: e.target.value })}/>
                            </Form.Group>
                            <Form.Group as={Col} sm = {2} controlId="formProgram" >
                                <Form.Label>{this.state.ept} Writing Score</Form.Label>
                                <Form.Control as="input"  type="number" step="0.1" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.eptWriting}
                    onChange={e => this.setState({ eptWriting: e.target.value })}/>
                            </Form.Group>
                            <Form.Group as={Col} sm = {2} controlId="formProgram" >
                                <Form.Label>{this.state.ept} Speaking Score</Form.Label>
                                <Form.Control as="input" type="number"  step="0.1" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.eptSpeaking}
                    onChange={e => this.setState({ eptSpeaking: e.target.value })}/>
                            </Form.Group>
                            <Form.Group as={Col} sm = {2} controlId="formProgram" >
                                <Form.Label>{this.state.ept} Reading Score</Form.Label>
                                <Form.Control as="input"  type="number" step="0.1" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.eptReading}
                    onChange={e => this.setState({ eptReading: e.target.value })}/>
                            </Form.Group>
                            <Form.Group as={Col} sm = {2} controlId="formProgram" >
                                <Form.Label>{this.state.ept} Listening Score</Form.Label>
                                <Form.Control as="input" type="number" step="0.1" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.eptListening}
                    onChange={e => this.setState({ eptListening: e.target.value })}/>
                            </Form.Group>
                                </> 
                                }
                            { (this.state.ept === null  || this.state.ept === 'Other') &&
                                <>
                                <Form.Group as={Col} sm = {6} controlId="formProgram" >
                                <Form.Label>Couldn't find your test?</Form.Label>
                                <p className = 'text30'><Button className = 'text30' onClick = {()=> this.openModal()}>Click here</Button> to request for adding a new English language proficiency exam</p> 
                            </Form.Group> </>}
                        </Form.Row>
                    </Form>
                </Container>
                <Button  className='center nextbtn' type = 'primary' onClick ={() =>this.handleNext()}
                 >
               Next
            </Button>
            </div>
            <EptModal visibility = {this.state.modalVisible} onClose={() => this.closeModal()}></EptModal>
         </>
        )
    }

}

const EptModal = ({ visibility, onClose}) => {
        const [description,setDescription] = useState("");
        const submit = ()=>{
            if(description == ''){message.error('Please add description')}
            else{
            axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
            axios.post('/addEPT',{'description':description}).then((response)=>{
                console.log(response)
                if(response.data.ok){message.success('Request sent to Graduate office')}
            })
            onClose()
             }
        }
        return(
        <Modal title='Request to add EPT'  visible={visibility}  onCancel={onClose} onOk = {submit}>
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

export {Program} ;