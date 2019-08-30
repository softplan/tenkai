import React, { Component } from "react";
import {
    Tabs, Tab, PanelGroup, Row, Col, FormGroup, ControlLabel, FormControl, ButtonToolbar
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { listHelmDeploymentsByEnvironment, listPods, listServices, promote } from 'client-api/apicall.jsx';
import { ReleasePanel } from 'components/Workload/ReleasePanel.jsx';
import { PodPanel } from 'components/Workload/PodPanel.jsx';
import { ServicePanel } from 'components/Workload/ServicePanel.jsx';
import Button from "components/CustomButton/CustomButton.jsx";
import CopyModal from "components/Modal/CopyModal.jsx";
import EditModal from "components/Modal/EditModal";


class Workload extends Component {
    
    state = {
        list: [],
        inputFilter: "",
        podInputFilter: "",
        serviceInputFilter: "",
        podList: [],
        serviceList: [],
        onShowCopyModal: false,
        onShowConfirmModal: false,
        targetEnvToPromote: {},
        confirmInput: "",
    }

    componentDidMount() {
        console.log(this.props.selectedEnvironment.value);
        this.listDeploymentsByEnv();
        this.listPods();
        this.listServices();
        this.timer = setInterval(() => 
        { 
            this.listPods();
            this.listDeploymentsByEnv();
            this.listServices();
        }, 10000);
    }

    onCloseCopyModal() {
        this.setState({ onShowCopyModal: false});
    }
    
    async onConfirmCopyModal(item) {
        this.setState({ onShowCopyModal: false, onShowConfirmModal: true, targetEnvToPromote: item});
    }

    async doPromote() {
        if (this.state.confirmInput === this.state.targetEnvToPromote.label) {
            promote(this, this.props.selectedEnvironment.value, this.state.targetEnvToPromote.value);
            this.setState({ onShowConfirmModal: false, targetEnvToPromote: {} });
        }
    }
    
    showConfirmCopyModal(ref) {
        this.setState({ onShowCopyModal: true});
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    listPods() {
        listPods(this, this.props.selectedEnvironment.value, function (self, res) {
            if (res !== undefined && res.data !== null) {
                self.setState({ podList: res.data.pods });
            } else {
                self.setState({ podList: [] });
            }
        });
    }


    listServices() {
        listServices(this, this.props.selectedEnvironment.value, function (self, res) {
            if (res !== undefined && res.data !== null) {
                self.setState({ serviceList: res.data.services });
            } else {
                self.setState({ serviceList: [] });
            }
        });
    }

    listDeploymentsByEnv() {
        listHelmDeploymentsByEnvironment(this, this.props.selectedEnvironment.value, function (self, res) {
            if (res !== undefined && res.data !== null) {
                self.setState({ list: res.data.Releases });
            } else {
                self.setState({ list: [] });
            }
        });
    }

    onTabSelect(tabName) {
        

    }

    onChangeInputHandler(e) {
        this.setState({
            inputFilter: e.target.value,
        })
    }

    onChangePodInputHandler(e) {
        this.setState({
            podInputFilter: e.target.value,
        })
    }

    onChangeServiceInputHandler(e) {
        this.setState({
            serviceInputFilter: e.target.value,
        })
    }

    onCloseConfirmModal() {
        this.setState({ onShowConfirmModal: false, targetEnvToPromote: {} });
    }

    handleConfirmInputChange(e) {
        let value = e.target.value;
        this.setState({confirmInput: value});
    }

    
    render() {

        const items = this.state.list.filter(d => this.state.inputFilter === '' || d.Name.includes(this.state.inputFilter)).map((item, key) =>
            <ReleasePanel eventKey={key}
                key={key}
                item={item}
                selectedEnvironment={this.props.selectedEnvironment}
                handleLoading={this.props.handleLoading}
                handleNotification={this.props.handleNotification}
                historyList={this.state.historyList}
                onTabSelect={this.onTabSelect.bind(this)}
                refresh={this.listDeploymentsByEnv.bind(this)}
            />
        );

        return (

            <Tabs defaultActiveKey="pods" id="workload-tab" onSelect={this.onTabSelect.bind(this)}>
                <Tab eventKey="pods" title="Pods">
                    <Card
                        title=""
                        content={
                            <div>


                                <Row>
                                    <Col xs={4}>
                                        <FormGroup>
                                            <ControlLabel>Pod Search</ControlLabel>
                                            <FormControl
                                                value={this.state.podInputFilter}
                                                onChange={this.onChangePodInputHandler.bind(this)}
                                                style={{ width: '100%' }} type="text"
                                                aria-label="Search"></FormControl>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <PodPanel
                                            selectedEnvironment={this.props.selectedEnvironment}
                                            handleLoading={this.props.handleLoading}
                                            handleNotification={this.props.handleNotification}
                                            list={this.state.podList.filter(d => this.state.podInputFilter === '' || d.name.includes(this.state.podInputFilter))}
                                        />
                                    </Col>

                                </Row>
                            </div>

                        } />
                </Tab>
                <Tab eventKey="services" title="Services">

                    <Card
                        title=""
                        content={
                            <div>


                                <Row>
                                    <Col xs={4}>
                                        <FormGroup>
                                            <ControlLabel>Service Search</ControlLabel>
                                            <FormControl
                                                value={this.state.serviceInputFilter}
                                                onChange={this.onChangeServiceInputHandler.bind(this)}
                                                style={{ width: '100%' }} type="text"
                                                aria-label="Search"></FormControl>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <ServicePanel
                                            selectedEnvironment={this.props.selectedEnvironment}
                                            handleLoading={this.props.handleLoading}
                                            handleNotification={this.props.handleNotification}
                                            list={this.state.serviceList.filter(d => this.state.serviceInputFilter === '' || d.name.includes(this.state.serviceInputFilter))}
                                        />
                                    </Col>

                                </Row>
                            </div>

                        } />

                </Tab>

                <Tab eventKey="helm" title="Helm Releases">
                    <Card
                        title=""
                        content={
                            <div>
                                <CopyModal
                                    onShow={this.state.onShowCopyModal}
                                    onClose={this.onCloseCopyModal.bind(this)}
                                    title="Select target environment (it will be destroyed)" 
                                    onConfirm={this.onConfirmCopyModal.bind(this)}
                                    environments={this.props.environments}
                                    onlyMyEnvironments={true}>
                                </CopyModal>       

                                <EditModal
                                    title="Confirm"
                                    header={true}
                                    onShow={this.state.onShowConfirmModal}
                                    onClose={this.onCloseConfirmModal.bind(this)}
                                    form={
                                        <div>
                                            <p>This is a <b>dangerous</b> operation, target environment <b> {this.state.targetEnvToPromote.label}  </b> within all variables will be destroyed!</p>
                                            <p>Please, enter the target environment name to confirm!</p>
                                            <input text name="confirmInput" value={this.state.confirmInput} onChange={this.handleConfirmInputChange.bind(this)}/>
                                            <hr/>
                                            <ButtonToolbar>
                                                <Button className="btn btn-danger btn-fill" bsSize="sm"  disabled={this.state.confirmInput !== this.state.targetEnvToPromote.label}
                                                    onClick={this.doPromote.bind(this)}><i className="pe-7s-smile" 
                                                    />
                                                {" "}Confirm</Button>
                                                <Button className="btn btn-info btn-fill" bsSize="sm" 
                                                    onClick={this.onCloseConfirmModal.bind(this)}><i className="pe-7s-smile" />
                                                {" "}Cancel</Button>

                                            </ButtonToolbar>


                                                
                                        </div>
                                    } 
                                />                                                             
                                

                                <Row>
                                    <Col xs={8}>
                                        <FormGroup>
                                            <ControlLabel>Release Search</ControlLabel>
                                            <FormControl
                                                value={this.state.inputFilter}
                                                onChange={this.onChangeInputHandler.bind(this)}
                                                style={{ width: '100%' }} type="text"
                                                aria-label="Search"></FormControl>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={4}>
                                    <ButtonToolbar>
                                        <Button className="btn btn-danger btn-fill pull-right" bsSize="sm" 
                                            onClick={this.showConfirmCopyModal.bind(this)}
                                            disabled={!this.props.keycloak.hasRealmRole("tenkai-admin")}>
                                            <i className="pe-7s-smile" />
                                        {" "}Copy Releases to another namespace</Button>
                                    </ButtonToolbar>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>

                                        <PanelGroup accordion id="workload-accordion">
                                            {items}
                                        </PanelGroup>
                                    </Col>

                                </Row>
                            </div>

                        } />


                </Tab>


            </Tabs>

        );
    }
}

export default Workload;
