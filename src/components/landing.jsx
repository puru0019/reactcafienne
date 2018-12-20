import React , { useState } from 'react';
import { Button, Modal, Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';


const Landing = () => {
    const [modalStatus, setModalStatus] = useState(false);
    const [activeKey, setActiveKey] = useState("first");
    return (
        <React.Fragment>
            <Button bsStyle="success" onClick={()=>setModalStatus(true)}>Partner OnBoarding</Button>
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
                                            <NavItem eventKey="first">Tab 1</NavItem>
                                            <NavItem eventKey="second">Tab 2</NavItem>
                                        </Nav>
                                    </Col>
                                    <Col sm={8}>
                                        <Tab.Content animation>
                                            <Tab.Pane eventKey="first">
                                                <div>Tab 1 content</div>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">
                                                <div>Tab 2 content</div>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </Modal.Body> 
                        <Modal.Footer>
                            <Button onClick={()=>setModalStatus(false)}>close</Button>
                            <Button bsStyle="primary" onClick={()=>setActiveKey("second")}>Next</Button>
                        </Modal.Footer>                   
                    </Modal>
                </div>
            </React.Fragment>
    );
}

export default Landing;