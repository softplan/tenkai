import React, { Component } from "react";
import {
    Tabs, Tab, PanelGroup, Row,  Col, FormGroup, ControlLabel, FormControl
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { listHelmDeploymentsByEnvironment, listPods } from 'client-api/apicall.jsx';
import { ReleasePanel } from 'components/Workload/ReleasePanel.jsx';
import { PodPanel } from 'components/Workload/PodPanel.jsx';

class Workload extends Component {

    state = {
        list: [],
        inputFilter: "",
        podInputFilter: "",
        podList: [],
    }

    listPods() {
        listPods(this, this.props.selectedEnvironment.value, function (self, res) {
            console.log(res.data);
            if (res !== undefined && res.data !== null) {
                self.setState({ podList: res.data.pods });
            } else {
                self.setState({ podList: [] });
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
        if (tabName === 'helm') {
            this.listDeploymentsByEnv();
            return
        } 
        
        if (tabName === "pods") {
            this.listPods();
        }
        
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
                <Tab eventKey="helm" title="Helm Releases">
                    <Card
                        title=""
                        content={
                            <div>


                                <Row>
                                <Col xs={4}>
                                    <FormGroup>
                                    <ControlLabel>Release Search</ControlLabel>
                                    <FormControl
                                        value={this.state.inputFilter}
                                        onChange={this.onChangeInputHandler.bind(this)}
                                        style={{ width: '100%' }} type="text"
                                        aria-label="Search"></FormControl>
                                    </FormGroup>
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
                                        list={this.state.podList.filter(d => this.state.podInputFilter === '' || d.name.includes(this.state.podInputFilter))}
                                    />
                                </Col>

                                </Row>
                            </div>

                        } />
                </Tab>
                <Tab eventKey="services" title="Services">
                    <p>Not implemented yet</p>
                </Tab>
                <Tab eventKey="vs" title="Virtual Services">
                    <p>Not implemented yet</p>
                </Tab>
                <Tab eventKey="dr" title="Destination Rules">
                    <p>Not implemented yet</p>
                </Tab>
            </Tabs>

        );
    }
}

export default Workload;
