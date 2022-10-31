import React from "react";
import axios from "axios";
import {PlusCircleOutlined} from '@ant-design/icons';
import {Form, Col, Container, Row} from 'react-bootstrap';
import {Steps, Button ,message} from 'antd';
import { ProgressBar } from "react-step-progress-bar";
import * as _ from 'lodash';


class WorkExp extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {          
            workField:this.props.workExpDetails.workField ,
            role:this.props.workExpDetails.role, 
            monthsOfExp: this.props.workExpDetails.monthsOfExp, companyName: this.props.workExpDetails.companyName,
            description: this.props.workExpDetails.description, workStart : this.props.workExpDetails.workStart , workEnd:this.props.workExpDetails.workEnd,
            percent:0
          }
      }

      onClickHandle = () =>{
    
          let details = {
            workField:this.state.workField , 
            role:this.state.role, 
            monthsOfExp: this.state.monthsOfExp, 
            companyName: this.state.companyName,
            description: this.state.description,  
            workStart:this.state.workStart ,
            workEnd : this.state.workEnd  }
            this.props.workExpPrev(details)
          
      }

      submitHandle = () => {
        let workDetails 
        if(_.isEmpty(this.state.workField) || _.isEmpty(this.state.role) || _.isEmpty(this.state.monthsOfExp) || _.isEmpty(this.state.companyName) ||
        _.isEmpty(this.state.companyName ) || _.isEmpty(this.state.workStart ) || _.isEmpty(this.state.workEnd )){
          message.error('Please fill in the required details');
    
        }else {
          workDetails = {workField:this.state.workField , role:this.state.role, monthsOfExp: this.state.monthsOfExp, companyName: this.state.companyName,
          description: this.state.description,  workStart:this.state.workStart ,workEnd : this.state.workEnd  }
          //this.props.workExpPrev(details)
        message.success('Processing complete!');
        this.setState({
          percent : 100
        })
        this.props.onSubmitHandle(workDetails);


        }


      }

    render() {
        return (
            <div>
              <ProgressBar percent={this.state.percent} filledBackground="linear-gradient(to right, #fefb72, #f0bb31)" />
              <br/>
              <h5 style ={{textAlign:'center'}}>Work Experience Details</h5>
              <div className = 'wrapper hideOverflow '>
                <Button className='center prevbtn' onClick={() => this.onClickHandle() }> Previous</Button>                
                <Container className= 'studDiv ' >                      
                    <Form>
                      <Form.Row>
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>Company Name</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.companyName}
                          onChange = {e => this.setState({ companyName : e.target.value })} />              
                          </Form.Group>
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>Work Field</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.workField}
                          onChange = {e => this.setState({ workField : e.target.value })} />              
                          </Form.Group>
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>Role</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.role}
                          onChange = {e => this.setState({ role : e.target.value })} />              
                          </Form.Group>
                      </Form.Row>
                      <Form.Row>
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>Months of Experience</Form.Label>
                          <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.monthsOfExp}
                          onChange = {e => this.setState({ monthsOfExp : e.target.value })} />              
                          </Form.Group>
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>From</Form.Label>
                          <Form.Control type ="date"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.workStart}
                          onChange = {e => this.setState({ workStart : e.target.value })} />     
                          </Form.Group> 
                          <Form.Group as={Col} sm = {3} controlId="formProgram">
                          <Form.Label>To</Form.Label>
                          <Form.Control type ="date"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.workEnd}
                          onChange = {e => this.setState({ workEnd : e.target.value })} />     
                          </Form.Group> 
                      </Form.Row>
                      <Form.Row>
                          <Form.Group as={Col} sm = {5} controlId="formProgram">
                          <Form.Label>Description</Form.Label>
                          <Form.Control as="textarea"  className="mr-sm-2" id="inlineFormCustomSelect" value = {this.state.description}
                          onChange = {e => this.setState({ description : e.target.value })} />              
                          </Form.Group>
                      </Form.Row>
                      
                    </Form>
                  </Container>
                <Button type="primary" className='center nextbtn' onClick={() =>this.submitHandle() }>Submit</Button>
            </div>
            </div>
        )
    }
}


export default WorkExp;
