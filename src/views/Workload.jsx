import React, { Component } from "react";
import {
    Tabs, Tab, PanelGroup, Panel, ButtonToolbar
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { listHelmDeploymentsByEnvironment } from 'client-api/apicall.jsx';
import Button from "components/CustomButton/CustomButton.jsx";

class Workload extends Component {

    state = {
        list: [],
    }

    componentDidMount() {
        listHelmDeploymentsByEnvironment(this, this.props.selectedEnvironment.value, function (self, res) {
            console.log(res.data.Releases);
            self.setState({ list: res.data.Releases });
        });
    }

    render() {

        const items = this.state.list.map((item, key) =>

            <Panel eventKey={key} key={key}>
                <Panel.Heading>
                    <Panel.Title toggle>{item.Name} - revision {item.Revision}</Panel.Title>
                </Panel.Heading>
                <Panel.Body collapsible>
                    <p>Chart: {item.Chart}</p>
                    <p>Updated: {item.Updated}</p>
                    <p>Status: {item.Status}</p>



                    <ButtonToolbar>

                        <Button className="btn btn-primary" bsSize="sm" 
                        ><i className="pe-7s-info"/>
                            {" "}Show History</Button>

                        <Button className="btn btn-danger" bsSize="sm" 
                        ><i className="pe-7s-less"/>
                            {" "}Delete</Button>

                            <Button className="btn btn-danger" bsSize="sm" 
                        ><i className="pe-7s-trash"/>
                            {" "}Purge</Button>

                    </ButtonToolbar>




                </Panel.Body>
            </Panel>

        );



        return (

            <Tabs defaultActiveKey="main" id="workload-tab">
                <Tab eventKey="helm" title="Helm Releases">
                    <Card
                        title=""
                        content={
                            <div>
                                <PanelGroup accordion id="workload-accordion">
                                    {items}
                                </PanelGroup>
                            </div>

                        } />


                </Tab>
                <Tab eventKey="pods" title="Pods">

                </Tab>
                <Tab eventKey="services" title="Services">

                </Tab>
                <Tab eventKey="vs" title="Virtual Services">

                </Tab>
                <Tab eventKey="dr" title="Destination Rules">

                </Tab>
                <Tab eventKey="pv" title="Persistent Volumes">

                </Tab>
                <Tab eventKey="pvc" title="Persistent Volumes Claim">

                </Tab>
            </Tabs>

        );
    }
}

export default Workload;
