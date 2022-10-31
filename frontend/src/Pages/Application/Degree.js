import React from "react";
import axios from "axios";
import {PlusCircleOutlined} from '@ant-design/icons';
import {Form, Col, Container, Row} from 'react-bootstrap';
import countryList from 'react-select-country-list';
import { ProgressBar } from "react-step-progress-bar";
import {Steps, Button ,message} from 'antd';
import * as _ from 'lodash';


class Degree extends React.Component {
    
    constructor(props) {
        super(props)     
        this.options = countryList().getData()
        this.state = {
          options: this.options,
          country:this.props.degreeDetails.country,
          uniName:this.props.degreeDetails.uniName, 
          uniRankWorld:this.props.degreeDetails.uniRankWorld,
          uniRankCountry:this.props.degreeDetails.uniRankCountry,uniRankLink:this.props.degreeDetails.uniRankLink,
          otherRankWorld:this.props.degreeDetails.otherRankWorld,otherRankCountry:this.props.degreeDetails.otherRankCountry, 
          otherRankLink:this.props.degreeDetails.otherRankLink,degreeLevel:this.props.degreeDetails.degreeLevel,
          program: this.props.degreeDetails.program, degreeStart:this.props.degreeDetails.degreeStart,
          degreeEnd:this.props.degreeDetails.degreeEnd, overallGrade:this.props.degreeDetails.overallGrade
      
        }
      }
    

      onClickHandle = (val) =>{


        if (_.isEmpty(this.state.country) || _.isEmpty(this.state.uniName) || _.isEmpty(this.state.degreeLevel) || _.isEmpty(this.state.program)){
            console.log('program',this.state.program , 'dept',this.state.dept,'route', this.state.route ,'ept', this.state.ept , '..intake ..',this.state.intake , '..... ',_.isEmpty(this.state.program) || _.isEmpty(this.state.dept) || _.isEmpty(this.state.route) || _.isEmpty(this.state.intake) || _.isEmpty(this.state.ept))
            
            message.error('Please fill the required values')
        }else {


        let details ={
            country:this.state.country,uniName:this.state.uniName, uniRankWorld:this.state.uniRankWorld,
          uniRankCountry:this.state.uniRankCountry,uniRankLink:this.state.uniRankLink,
          otherRankWorld:this.state.otherRankWorld,otherRankCountry:this.state.otherRankCountry, 
          otherRankLink:this.state.otherRankLink,degreeLevel:this.state.degreeLevel,program: this.state.program, 
          degreeStart:this.state.degreeStart,degreeEnd:this.state.degreeEnd , overallGrade:this.state.overallGrade
      
        }
        console.log('dgere start ..', details.degreeStart, '.. degree end ..', details.degreeEnd)

        if(val === 'next'){this.props.degreeNext(details)}
        else{this.props.degreePrev(details)}


        }


      

    

      }
      

    componentDidMount(){
    }
    render() {
        

        return (
            <>
            <ProgressBar percent={25} filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"/>
            <br/>
            <h5 style ={{textAlign:'center'}}>Degree Details</h5>
            <div className = 'wrapper hideOverflow '>
                <Button className='center prevbtn' onClick={() => this.onClickHandle('prev')}> Previous</Button>
     
                <Container className= 'studDiv ' >
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} sm = {3} controlId="formProgram">
                                <Form.Label>Country</Form.Label>
                                <Form.Control as="select"  className="mr-sm-2" id="inlineFormCustomSelect" custom value = {this.state.country}
                                onChange = {e => this.setState({ country: e.target.value })} >
                                {this.state.options.map((countryy) =>
                                    <option value= {countryy.label} >{countryy.label}</option>
                                    )} 
                                </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} sm = {4} controlId="formProgram">
                                <Form.Label>University Name </Form.Label>
                                <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect"   value = {this.state.uniName}
                                onChange = {e => this.setState({ uniName: e.target.value })}  />             
                            </Form.Group>
                        </Form.Row>
                        
                            <Form.Row>
                                <Form.Group as={Col} sm = {3} controlId="formProgram">
                                    <Form.Label>UniRank World Ranking</Form.Label>
                                    <Form.Control type ="number"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.uniRankWorld}
                                    onChange = {e => this.setState({ uniRankWorld: e.target.value })}  />
                                </Form.Group>
                                <Form.Group as={Col} sm = {3} controlId="formProgram">
                                    <Form.Label>UniRank Country Ranking</Form.Label>
                                    <Form.Control type ="number"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.uniRankCountry}
                                    onChange = {e => this.setState({ uniRankCountry: e.target.value })}  />
                                </Form.Group>
                                <Form.Group as={Col} sm = {3} controlId="formProgram">
                                    <Form.Label>Link to ranking Website</Form.Label>
                                    <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.uniRankLink}
                                    onChange = {e => this.setState({ uniRankLink: e.target.value })}  />
                                </Form.Group>
                                
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} sm = {3} controlId="formProgram">
                                    <Form.Label>Webometrics / Other World Ranking</Form.Label>
                                    <Form.Control type ="number"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.otherRankWorld}
                                    onChange = {e => this.setState({ otherRankWorld: e.target.value })}  />
                                </Form.Group>
                                <Form.Group as={Col} sm = {3} controlId="formProgram">
                                    <Form.Label>Webometrics / Other Country Ranking</Form.Label>
                                    <Form.Control type ="number"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.otherRankCountry}
                                    onChange = {e => this.setState({ otherRankCountry: e.target.value })}  />
                                </Form.Group>
                                <Form.Group as={Col} sm = {3} controlId="formProgram">
                                    <Form.Label>Link to ranking Website</Form.Label>
                                    <Form.Control as="input"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.otherRankLink}
                                    onChange = {e => this.setState({ otherRankLink: e.target.value })}  />
                                </Form.Group>
                                
                            </Form.Row>
                            
                            <Form.Row>
                        <Form.Group as={Col} sm = {2} controlId="formProgram">
                            <Form.Label>Level of Degree</Form.Label>
                            <Form.Control as="select"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.degreeLevel}
                            onChange = {e => this.setState({ degreeLevel: e.target.value })}  >
                                <option value="0">Choose Degree</option>
                                <option value="Bachelor's">Bachelor's</option>
                                <option value="Masters">Masters</option>
                                <option value="Diplamo">Diplamo</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} sm = {2} controlId="formProgram">
                            <Form.Label>Program</Form.Label>
                            <Form.Control as="select"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.program}
                            onChange = {e => this.setState({ program: e.target.value })}  >
                                <option value="0">Choose Program</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Computer Engineering">Computer Engineering</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} sm = {2}>
                        <Form.Label>Program Start</Form.Label>
                            <Form.Control type ="date"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.degreeStart}
                            onChange = {e => this.setState({ degreeStart: e.target.value })}  />
                        </Form.Group>
                        <Form.Group as={Col} sm = {2}>
                        <Form.Label>Program End</Form.Label>
                            <Form.Control type="date"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.degreeEnd}
                            onChange = {e => this.setState({ degreeEnd: e.target.value })}  />
                        </Form.Group>
                        <Form.Group  as={Col} sm = {2}>
                        <Form.Label>Overall Grade</Form.Label>
                            <Form.Control as="input" type ="number"  className="mr-sm-2" id="inlineFormCustomSelect"  value = {this.state.overallGrade}
                            onChange = {e => this.setState({ overallGrade: e.target.value })}  />
                        </Form.Group>
                    </Form.Row>
                    
                        </Form>
                </Container>
                <Button className='center nextbtn'  type="primary" onClick={() => this.onClickHandle('next')}>Next</Button>
            </div>
       </>
        )
}
}
export default Degree;