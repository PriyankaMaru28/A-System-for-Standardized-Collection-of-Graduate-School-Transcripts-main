import React from "react";
import axios from "axios";
import { PlusCircleOutlined } from '@ant-design/icons';
import { Form, Col, Container, Row } from 'react-bootstrap';
import countryList from 'react-select-country-list';
import { ProgressBar } from "react-step-progress-bar";
import { Steps, Button, message } from 'antd';
import * as _ from 'lodash';
import moment from 'moment';
import Cookies from "js-cookie";

class Degree extends React.Component {

    constructor(props) {
        super(props)
        this.options = countryList().getData()
        this.state = {
            options: this.options,
            country: this.props.degreeDetails.country,
            uniName: this.props.degreeDetails.uniName,
            uniRankWorld: this.props.degreeDetails.uniRankWorld,
            uniRankCountry: this.props.degreeDetails.uniRankCountry, uniRankLink: this.props.degreeDetails.uniRankLink,
            otherRankWorld: this.props.degreeDetails.otherRankWorld, otherRankCountry: this.props.degreeDetails.otherRankCountry,
            otherRankLink: this.props.degreeDetails.otherRankLink, degreeLevel: this.props.degreeDetails.degreeLevel,
            program: this.props.degreeDetails.program, degreeStart: this.props.degreeDetails.degreeStart,
            degreeEnd: this.props.degreeDetails.degreeEnd,
            appId: this.props.appId,
            nextdisabled: true,
            degreeId: null

        }
    }


    onClickHandle = (val) => {

        const appId = parseInt(sessionStorage.getItem("appId"));
        const degreeId = sessionStorage.getItem("degreeId")

        if (_.isEmpty(this.state.country) || _.isEmpty(this.state.uniName) || _.isEmpty(this.state.degreeLevel) || _.isEmpty(this.state.program) || _.isEmpty(this.state.degreeStart) || _.isEmpty(this.state.degreeEnd) || _.isEmpty(this.state.uniRankWorld) || _.isEmpty(this.state.uniRankCountry)) {
            console.log('program', this.state.program, 'dept', this.state.dept, 'route', this.state.route, 'ept', this.state.ept, '..intake ..', this.state.intake, '..... ', _.isEmpty(this.state.program) || _.isEmpty(this.state.dept) || _.isEmpty(this.state.route) || _.isEmpty(this.state.intake) || _.isEmpty(this.state.ept))

            message.error('Please fill the required values')
        } else {
            let details = {
                country: this.state.country, uniName: this.state.uniName, uniRankWorld: this.state.uniRankWorld,
                uniRankCountry: this.state.uniRankCountry, uniRankLink: this.state.uniRankLink,
                otherRankWorld: this.state.otherRankWorld, otherRankCountry: this.state.otherRankCountry,
                otherRankLink: this.state.otherRankLink, degreeLevel: this.state.degreeLevel, program: this.state.program,
                degreeStart: this.state.degreeStart, degreeEnd: this.state.degreeEnd, appId: appId, degreeId: degreeId
            }

            this.handleSaveContinue()

            if (val === 'next') { this.props.degreeNext(details) }
            else { this.props.degreePrev(details) }

            this.props.getDegreeId(this.state.degreeId)
        }
    }



    handleSaveContinue = () => {

        const appId = parseInt(sessionStorage.getItem("appId"));


        if (_.isEmpty(this.state.country) || _.isEmpty(this.state.uniName) || _.isEmpty(this.state.degreeLevel) || _.isEmpty(this.state.program)) {
            console.log('program', this.state.program, 'dept', this.state.dept, 'route', this.state.route, 'ept', this.state.ept, '..intake ..', this.state.intake, '..... ', _.isEmpty(this.state.program) || _.isEmpty(this.state.dept) || _.isEmpty(this.state.route) || _.isEmpty(this.state.intake) || _.isEmpty(this.state.ept))

            message.error('Please fill the required values')
        } else {
            let details = {
                country: this.state.country, uniName: this.state.uniName, uniRankWorld: this.state.uniRankWorld,
                uniRankCountry: this.state.uniRankCountry, uniRankLink: this.state.uniRankLink,
                otherRankWorld: this.state.otherRankWorld, otherRankCountry: this.state.otherRankCountry,
                otherRankLink: this.state.otherRankLink, degreeLevel: this.state.degreeLevel, program: this.state.program,
                degreeStart: this.state.degreeStart, degreeEnd: this.state.degreeEnd, appId: appId

            }
            console.log('dgere start ..', details.degreeStart, '.. degree end ..', details.degreeEnd)

            axios.defaults.headers.common["Authorization"] = JSON.parse(Cookies.get("session")).token;
            axios.post('/saveDegreeDetails', details).then((response) => {
                console.log("response data", response.data)
                if (response.data) {
                    console.log("degree details response...", response.data)
                    message.success('Degree details successfully saved')
                    // this.setState({
                    //     appId : response.data.applicationId,
                    //     degreeId: response.data.degreeId,
                    //     nextdisabled:false
                    // })
                    sessionStorage.setItem("appId", response.data.applicationId)
                    sessionStorage.setItem("degreeId", response.data.degreeId)
                }
            })

        }
    }


    getdates = (enddate) => {
        console.log(' start date ..', this.state.degreeStart, '.. end date ..', enddate)
        let startDate = _.split(this.state.degreeStart, '-')
        let endDate = _.split(enddate, '-')

        console.log('strat and end dates...', startDate, '.. end date ...', endDate)
        let diff = moment(enddate).diff(moment(this.state.degreeStart), 'months', true)

        console.log('....diff', diff)
        if (diff >= 6) {

            this.setState({ degreeEnd: enddate });
        } else {
            message.error('Please enter the dates correctly .')
        }
    }


    componentDidMount() {
    }
    render() {

        return (
            <>
                <ProgressBar percent={25} filledBackground="linear-gradient(to right, #fefb72, #f0bb31)" />
                <br />
                <h5 style={{ textAlign: 'center' }}>Degree Details</h5>
                <div className='wrapper hideOverflow '>
                    <Button className='center prevbtn' onClick={() => this.onClickHandle('prev')}> Previous</Button>

                    <Container className='studDiv ' >
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} sm={3} controlId="formProgram">
                                    <Form.Label>* Country</Form.Label>
                                    <Form.Control as="select" className="mr-sm-2" id="inlineFormCustomSelect" custom value={this.state.country}
                                        onChange={e => this.setState({ country: e.target.value })} >
                                        {this.state.options.map((countryy) =>
                                            <option value={countryy.label} >{countryy.label}</option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} sm={4} controlId="formProgram">
                                    <Form.Label>* University Name </Form.Label>
                                    <Form.Control as="input" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.uniName}
                                        onChange={e => this.setState({ uniName: e.target.value })} />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} sm={3} controlId="formProgram">
                                    <Form.Label>* UniRank World Ranking</Form.Label>
                                    <Form.Control type="number" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.uniRankWorld}
                                        onChange={e => this.setState({ uniRankWorld: e.target.value })} />
                                </Form.Group>
                                <Form.Group as={Col} sm={3} controlId="formProgram">
                                    <Form.Label>* UniRank Country Ranking</Form.Label>
                                    <Form.Control type="number" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.uniRankCountry}
                                        onChange={e => this.setState({ uniRankCountry: e.target.value })} />
                                </Form.Group>
                                <Form.Group as={Col} sm={3} controlId="formProgram">
                                    <Form.Label>Link to ranking Website</Form.Label>
                                    <Form.Control as="input" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.uniRankLink}
                                        onChange={e => this.setState({ uniRankLink: e.target.value })} />
                                </Form.Group>

                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} sm={3} controlId="formProgram">
                                    <Form.Label>Webometrics / Other World Ranking</Form.Label>
                                    <Form.Control type="number" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.otherRankWorld}
                                        onChange={e => this.setState({ otherRankWorld: e.target.value })} />
                                </Form.Group>
                                <Form.Group as={Col} sm={3} controlId="formProgram">
                                    <Form.Label>Webometrics / Other Country Ranking</Form.Label>
                                    <Form.Control type="number" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.otherRankCountry}
                                        onChange={e => this.setState({ otherRankCountry: e.target.value })} />
                                </Form.Group>
                                <Form.Group as={Col} sm={3} controlId="formProgram">
                                    <Form.Label>Link to ranking Website</Form.Label>
                                    <Form.Control as="input" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.otherRankLink}
                                        onChange={e => this.setState({ otherRankLink: e.target.value })} />
                                </Form.Group>

                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} sm={2} controlId="formProgram">
                                    <Form.Label>* Level of Degree</Form.Label>
                                    <Form.Control as="select" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.degreeLevel}
                                        onChange={e => this.setState({ degreeLevel: e.target.value })}  >
                                        <option value="0">Choose Degree</option>
                                        <option value="Bachelor's">Bachelor's</option>
                                        <option value="Masters">Masters</option>
                                        <option value="Diploma">Diploma</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} sm={2} controlId="formProgram">
                                    <Form.Label>* Program</Form.Label>
                                    <Form.Control as="select" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.program}
                                        onChange={e => this.setState({ program: e.target.value })}  >
                                        <option value="0">Choose Program</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Accounting">Accounting</option>
                                        <option value="Computer Engineering">Computer Engineering</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} sm={2}>
                                    <Form.Label>* Program Start</Form.Label>
                                    <Form.Control type="date" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.degreeStart}
                                        onChange={e => this.setState({ degreeStart: e.target.value })} />
                                </Form.Group>
                                <Form.Group as={Col} sm={2}>
                                    <Form.Label>* Program End</Form.Label>
                                    <Form.Control type="date" className="mr-sm-2" id="inlineFormCustomSelect" value={this.state.degreeEnd}
                                        onChange={e => { this.getdates(e.target.value) }} />
                                </Form.Group>
                            </Form.Row>

                        </Form>
                    </Container>
                    <Button className='center nextbtn' type="primary" onClick={() => this.onClickHandle('next')}>Next</Button>
                </div>
            </>
        )
    }
}
export default Degree;