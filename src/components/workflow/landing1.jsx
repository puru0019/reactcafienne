import React from 'react';
import { connect } from 'react-redux';
import {
    compose,
    withProps,
    setDisplayName,
    withState,
    withHandlers,
    withPropsOnChange,
    lifecycle,
    pure,
} from  'recompose';
import { Button, Modal, Glyphicon, Tab, Row, Col, Nav, NavItem, Panel, Table } from 'react-bootstrap';
import Coworker1 from './Coworker1.jsx';
import HeaderColor1 from './HeaderColor1.jsx';
import CoworkerInformation from './CoworkerInformation.jsx';
import BillingInformation from './BillingInformation.jsx';
import axios from 'axios';
import PartnerInformation from './PartnerInformation.jsx';
import PartnerLabel from './PartnerLabel .jsx';

const enhance = compose(
    withState('activeTab', 'setActiveTab', '1'),
    withState('taskDetails', 'setTaskDetails'),
    withState('tasks', 'setTasks'),
    withState('showTable', 'setShowTable', false),
    withState('showModal', 'setModalStatus', false),
    withHandlers({
        handleTab: ({ setActiveTab, activeTab, setTaskDetails }) => async(task, tab) => {
            
            if(activeTab !== tab) {
                setActiveTab(tab);
            }
            const response = await axios.get(`/api/tasks/${task.id}`);
            setTaskDetails(response.data._2);
            
        },
        showTasks: ({ setShowTable, showTable }) => () => {
            setShowTable(!showTable);
        }
    }),
    lifecycle({
        async componentDidMount() {
            const response = await axios.get('/api/cases/user?numberOfResults=1');
            console.log(response);
            this.props.setTasks(response.data._2[0].planitems);
        },
    }),
    pure,
);

const Landing1 = enhance(({ activeTab, handleTab, tasks, taskDetails, setActiveTab, setTaskDetails, setTasks, showTasks, showTable, showModal, setModalStatus}) => {

    return (
        <div>
         <Row>
            <Col sm={4}>
                <Panel bsStyle="primary">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Task Managment</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <div className="pa">
                            <Panel.Toggle componentClass="a" onClick={() => showTasks()}>My Tasks</Panel.Toggle>
                        </div>
                        <div className="pa">
                            <Panel.Toggle componentClass="a" disabled={true}>All Tasks</Panel.Toggle>
                        </div>
                    </Panel.Body>
                </Panel>
            </Col>
            <Col sm={8}>
            {
                showTable && <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Task</th>
                        <th>Task Category</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td><a href="#" onClick={()=> setModalStatus(!showModal)}>Partner on-boarding</a></td>
                            <td>Internal</td>
                            <td>2-Feb-2019</td>
                            <td>Open</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Task 2</td>
                            <td>Financial Reporting</td>
                            <td>19-Mar-2019</td>
                            <td>Open</td>
                        </tr>

                    </tbody>
                </Table>
            }
            </Col>
        </Row>
        <Modal show={showModal} onHide={()=>setModalStatus(false)}>
            <Modal.Header>
                <Modal.Title>Partner OnBoarding</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tab.Container id="left-tabs-example" activekey={activeTab} onSelect={(key)=>setActiveTab(key)}>
                    <Row className="clearfix">
                        <Col sm={4}>
                            <Nav bsStyle="pills" stacked>
                            {
                                tasks && tasks.map((task,key) =>
                                task.type === 'HumanTask' &&
                                <NavItem key={key} eventKey={key} onClick={() => handleTab(task,key) } disabled={task.currentState === 'Available'}>
                                    <label>{task.name}</label>
                                </NavItem>
                                )
                            }
                            </Nav>
                        </Col>
                        <Col sm={8}>
                            <Tab.Content unmountOnExit={true} animation>
                                    <Tab.Pane eventKey={3} unmountOnExit={true}>
                                    {
                                        taskDetails && taskDetails.taskName === "Co-Workers" && <Coworker1 taskDetails={taskDetails} setTaskDetails={setTaskDetails} setTasks={setTasks}/>
                                    }
                                </Tab.Pane>
                                <Tab.Pane eventKey={5} unmountOnExit={true}>
                                {
                                    taskDetails && taskDetails.taskName === "Co-Worker Information" && <CoworkerInformation taskDetails={taskDetails} setTaskDetails={setTaskDetails} />
                                }
                                </Tab.Pane> 
                                <Tab.Pane eventKey={6} unmountOnExit={true}>
                                {
                                    taskDetails && taskDetails.taskName === "Billing Information" && <BillingInformation taskDetails={taskDetails} setTaskDetails={setTaskDetails} />
                                }
                                </Tab.Pane>
                                <Tab.Pane eventKey={8} unmountOnExit={true}>
                                {
                                    taskDetails && taskDetails.taskName === "Partner Information" && <PartnerInformation taskDetails={taskDetails} setTaskDetails={setTaskDetails} />
                                }
                                </Tab.Pane>
                                <Tab.Pane eventKey={9} unmountOnExit={true}>
                                {
                                    taskDetails && taskDetails.taskName === "Header Color" && <HeaderColor1 taskDetails={taskDetails} setTaskDetails={setTaskDetails}/>
                                }
                                </Tab.Pane>
                                <Tab.Pane eventKey={10} unmountOnExit={true}>
                                {
                                    taskDetails && taskDetails.taskName === "Partner Labels" && <PartnerLabel taskDetails={taskDetails} setTaskDetails={setTaskDetails}/>
                                }
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=> setModalStatus(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
            
        </div>
    )

});

export default Landing1;