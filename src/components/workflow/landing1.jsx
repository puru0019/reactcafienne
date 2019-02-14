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
import ReactLoading from "react-loading";
import { Button, Modal, Glyphicon, Tab, Row, Col, Nav, NavItem, Panel, Table } from 'react-bootstrap';
import Coworker1 from './Coworker1.jsx';
import HeaderColor1 from './HeaderColor1.jsx';
import CoworkerInformation from './CoworkerInformation.jsx';
import BillingInformation from './BillingInformation.jsx';
import axios from 'axios';
import PartnerInformation from './PartnerInformation.jsx';
import PartnerLabel from './PartnerLabel .jsx';
import isEmpty from '../../utils/isEmpty.js';
import { filterTasks } from '../../utils/getActiveTab';

const getFinalTabStatus = data => {
    return data.filter(item => item.currentState === "Completed").length === 6
}

const enhance = compose(
    withState('showSpinner', 'setSpinner', false),
    withState('activeTab', 'setActiveTab', '1'),
    withState('taskDetails', 'setTaskDetails'),
    withState('tasks', 'setTasks'),
    withState('showTable', 'setShowTable', false),
    withState('showModal', 'setModalStatus', false),
    withPropsOnChange(['tasks'], ({ tasks }) => {
        return {
            finalTabStatus: isEmpty(tasks) ? false : getFinalTabStatus(tasks),
        }
    }),
    withHandlers({
        handleTab: ({ setActiveTab, activeTab, setTaskDetails, setSpinner }) => async(task, tab) => {
            if(activeTab !== tab) {
                setSpinner(true);
                setActiveTab(tab);
            }
            const response = await axios.get(`/api/tasks/${task.id}`);
            setTaskDetails(response.data._2);
            
        },
        handleFinalTab: ({ setActiveTab, activeTab }) => async(tab) => {
            if(activeTab !== tab) {
                setActiveTab(tab)
            }
        },
        showTasks: ({ setShowTable, showTable }) => () => {
            setShowTable(!showTable);
        }
    }),
    lifecycle({
        async componentDidMount() {
            const response = await axios.get('/api/cases/user?numberOfResults=1');
            this.props.setTasks(filterTasks(response.data._2[0].planitems));
        }
    }),
);

const Landing1 = enhance(({ 
    activeTab,
    handleTab,
    handleFinalTab,
    tasks,
    taskDetails, 
    setActiveTab, 
    setTaskDetails, 
    setTasks, 
    showTasks,
    showTable, 
    showModal, 
    setModalStatus,
    setSpinner,
    showSpinner,
    finalTabStatus,
}) => {
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
                        <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td><a href="#" onClick={()=> setModalStatus(!showModal)}>Partner on-boarding</a></td>
                            <td>Internal</td>
                            <td>{finalTabStatus ? 'Closed': 'Open'}</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Task 2</td>
                            <td>Financial Reporting</td>
                            <td>Open</td>
                        </tr>

                    </tbody>
                </Table>
            }
            </Col>
        </Row>
        <Modal show={showModal} onHide={()=>setModalStatus(false)}>
            <Modal.Header>
                <Modal.Title>Welcome to Partner OnBoarding</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tab.Container id="left-tabs-example" activekey={activeTab} onSelect={(key)=>setActiveTab(key)}>
                    <Row className="clearfix">
                        <Col sm={5}>
                            <Nav bsStyle="pills" stacked>
                            {
                                tasks && tasks.map((task) =>
                                task.type === 'HumanTask' &&
                                <NavItem key={task.sortOrder} eventKey={task.sortOrder} onClick={() => handleTab(task,task.sortOrder) } disabled={task.currentState === 'Available'}>
                                    {/* { task.currentState === "Completed" && <Glyphicon glyph="ok" className="custom-complete"/> } */}
                                    <label>{task.name}</label>
                                </NavItem>
                                )
                            }
                            {
                                tasks && tasks.map((task) => 
                                task.name === "Final Update" &&
                                <NavItem key={task.sortOrder} eventKey={task.sortOrder} onClick={() => handleFinalTab(task.sortOrder) } disabled={task.currentState === 'Available'}>
                                    {/* { task.currentState === "Completed" && <Glyphicon glyph="ok" className="custom-complete" />} */}
                                    <label>{task.name}</label>
                                </NavItem>
                                )
                            }
                            </Nav>
                        </Col>
                        <Col sm={7}>
                            { showSpinner && <ReactLoading type="spin" color="#337ab7" className="custom-spinner"/>}
                            <Tab.Content unmountOnExit={true} animation>
                                <Tab.Pane eventKey={1} unmountOnExit={true}>
                                {
                                    taskDetails && taskDetails.taskName === "Partner Information" && <PartnerInformation taskDetails={taskDetails} setTaskDetails={setTaskDetails} setTasks={setTasks} setSpinner={setSpinner} />
                                }
                                </Tab.Pane>
                                <Tab.Pane eventKey={2} unmountOnExit={true}>
                                    {
                                        taskDetails && taskDetails.taskName === "Co-Workers" && 
                                        <Coworker1 
                                        taskDetails={taskDetails} 
                                        setTaskDetails={setTaskDetails} 
                                        setTasks={setTasks} 
                                        setSpinner={setSpinner}
                                        />
                                    }
                                </Tab.Pane>
                                {
                                <Tab.Pane eventKey={3} unmountOnExit={true}>
                                    {
                                        taskDetails && taskDetails.taskName === "Co-Worker Information" && <CoworkerInformation taskDetails={taskDetails} setTaskDetails={setTaskDetails} setTasks={setTasks} setSpinner={setSpinner} />
                                    }
                                </Tab.Pane>
                                }
                                <Tab.Pane eventKey={4} unmountOnExit={true}>
                                {
                                    taskDetails && taskDetails.taskName === "Billing Information" && <BillingInformation taskDetails={taskDetails} setTaskDetails={setTaskDetails} setTasks={setTasks} setSpinner={setSpinner} />
                                }
                                </Tab.Pane>
                                <Tab.Pane eventKey={5} unmountOnExit={true}>
                                {
                                    taskDetails && taskDetails.taskName === "Header Color" && <HeaderColor1 taskDetails={taskDetails} setTaskDetails={setTaskDetails} setTasks={setTasks} setSpinner={setSpinner} />
                                }
                                </Tab.Pane>
                                <Tab.Pane eventKey={6} unmountOnExit={true}>
                                {
                                    taskDetails && taskDetails.taskName === "Partner Labels" && 
                                    <PartnerLabel
                                    taskDetails={taskDetails} 
                                    setTaskDetails={setTaskDetails} 
                                    setTasks={setTasks} 
                                    setSpinner={setSpinner} />
                                }
                                </Tab.Pane>
                                <Tab.Pane eventKey={7} unmountOnExit={true}>
                                    <div className="custom-complete1">
                                        <Glyphicon glyph="ok" className="custom-font" />
                                    </div>
                                    <label className="custom-label">
                                        Congrats you have finished 60% profile. Go to partner setting to complete your profile
                                    </label>
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