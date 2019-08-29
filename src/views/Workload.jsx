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


class Workload extends Component {
    
    state = {
        list: [],
        inputFilter: "",
        podInputFilter: "",
        serviceInputFilter: "",
        podList: [],
        serviceList: [],
        onShowCopyModal: false,
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
        }, 25000);
    }

    onCloseCopyModal() {
        this.setState({ onShowCopyModal: false});
    }
    
    async onConfirmCopyModal(item) {
        promote(this, this.props.selectedEnvironment.value, item.value);
        this.setState({ onShowCopyModal: false});
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



            <Tabs defaultActiveKey="helm" id="workload-tab" onSelect={this.onTabSelect.bind(this)}>
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
                                            onClick={this.showConfirmCopyModal.bind(this)}><i className="pe-7s-smile" />
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
            </Tabs>

        );
    }
}

export default Workload;
