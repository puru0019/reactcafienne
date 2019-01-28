import React , { useState, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { getCurrentCase } from '../actions/repositoryListAction';
import { getCase, getDiscreationaryCase, getCaseDetails } from '../actions/caseAction';
import { loadTask } from '../actions/taskAction';
import ReactLoading from "react-loading";
import { Button, Modal, Glyphicon, Tab, Row, Col, Nav, NavItem, Panel } from 'react-bootstrap';
import DynamicForm from './formContainer.jsx';
import HeaderForm from './headerForm.jsx';
import  isEmpty from '../utils/isEmpty';
import TestForm from './testForm.jsx';
import Coworker from './Coworker.jsx';
import TestFile1 from './TestFile1.jsx';
import TestFile2 from './TestFile2.jsx';
import Formcomponent from './formContainer1.jsx';


const RenderCaseList = ({ currentCase, getCurrentCase, getDiscreationaryCase, getCase, caseinstanceId, setModalStatus, getCaseDetails }) => {
    const [caseName, setCaseName] = useState('PartnerOnboarding1');
    const [showSpinner, setSpinner] = useState(false);

    const createCase = (e) => {
        e.preventDefault();
        setSpinner(true);
        getCase(`${caseName}.xml`, caseName);
        setTimeout(() => {
            setSpinner(false);
        },1500);
    }

    const handleCase = (e, id) => {
        e.preventDefault();
        getCaseDetails(id);
        setModalStatus(true);
    }
    
    useEffect(() => {
        getCurrentCase(1); 
        caseinstanceId && getDiscreationaryCase(caseinstanceId);
    }, [caseinstanceId]);

    return (
        <div className="row">
            { showSpinner && <ReactLoading type="spin" color="#337ab7" className="custom-spinner"/>}
            <div className="col-xs-9">
                {
                    isEmpty(currentCase) &&
                    <Button bsStyle="primary" onClick={(e) => createCase(e)}>Start Case</Button>
                }
                {
                    !isEmpty(currentCase) &&
                    <Panel bsStyle="primary" className="mtl">
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">All Tasks</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <div className="row">
                                <div className="col-xs-9">
                                    {currentCase.definition}
                                </div>
                                <div className="col-xs-3">
                                    <Button bsStyle="primary" onClick={(e) => createCase(e)}>Start Case</Button>
                                </div>
                            </div>
                        </Panel.Body>
                    </Panel>
                }
            </div>
        </div>
    )
}

const Landing = ({ planItems, loadTask, formSchema, ...restProps }) => {
    const [modalStatus, setModalStatus] = useState(false);
    const [activeKey, setActiveKey] = useState("first");
    const handleTask = (e, taskid) => {
        e.preventDefault();
        loadTask(taskid);
    }
    
    return (
        <React.Fragment>
            <RenderCaseList setModalStatus={setModalStatus} {...restProps}/>
            <div className="static-modal">
                <Modal show={modalStatus} onHide={()=>setModalStatus(false)}>
                    <Modal.Header>
                        <Modal.Title>Partner OnBoarding</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Tab.Container id="left-tabs-example" activekey={activeKey} onSelect={(key)=>setActiveKey(key)}>
                            <Row className="clearfix">
                                <Col sm={4}>
                                    <Nav bsStyle="pills" stacked>
                                    {
                                       planItems && planItems.map((item,key) =>
                                       item.type === 'HumanTask' &&
                                       <NavItem key={key} eventKey={key} onClick={(e) => handleTask(e,item.id) }>
                                            {
                                                item.currentState === 'Completed' && 
                                                <Glyphicon glyph="ok" />
                                            }
                                            <label>{item.name}</label>
                                            
                                       </NavItem>
                                       )
                                    }
                                    </Nav>
                                </Col>
                                <Col sm={8}>
                                    <Tab.Content animation>
                                         <Tab.Pane eventKey={3} unmountOnExit={true}>
                                            <Coworker />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey={5} unmountOnExit={true}>
                                            <TestFile2 />
                                        </Tab.Pane> 
                                        <Tab.Pane eventKey={6} mountOnEnter={true} unmountOnExit={true}>
                                            <Formcomponent />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey={8} mountOnEnter={true} unmountOnExit={true}>
                                            <Formcomponent />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey={9} mountOnEnter={true} unmountOnExit={true}>
                                            <TestForm />
                                        </Tab.Pane>
                                        {/* <Tab.Pane eventKey={10} unmountOnExit={true}>
                                            <DynamicForm />
                                        </Tab.Pane> */}
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Modal.Body> 
                    <Modal.Footer>
                        <Button onClick={()=>setModalStatus(false)}>close</Button>
                        <Button bsStyle="primary" onClick={()=>setActiveKey(activeKey)}>Next</Button>
                    </Modal.Footer>                   
                </Modal>
            </div>
            </React.Fragment>
    );
}

const mapStateToProps = ({ cases, caseDetails, plan, task }) => ({
    cases: cases.caselist,
    currentCase: cases.currentCase,
    caseinstanceId: caseDetails.caseInstanceId,
    name: caseDetails.name,
    planItems: plan.planitems,
    taskdetails: task,
    formSchema: task.taskModel
});

export default connect(mapStateToProps, { getCurrentCase, getCase, getDiscreationaryCase, getCaseDetails, loadTask })(memo(Landing));