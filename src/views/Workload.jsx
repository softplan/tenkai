import React, { Component } from "react";
import {
    Tabs, Tab, PanelGroup, Panel, ButtonToolbar
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { listHelmDeploymentsByEnvironment, getReleaseHistory } from 'client-api/apicall.jsx';
import { ReleasePanel } from 'components/Workload/ReleasePanel.jsx';

class Workload extends Component {

    state = {
        list: [],
        historyList: [],
    }

    componentDidMount() {
        listHelmDeploymentsByEnvironment(this, this.props.selectedEnvironment.value, function (self, res) {
            self.setState({ list: res.data.Releases });
        });
    }

    showReleaseHistory(releaseName) {
        console.log(releaseName);
        getReleaseHistory(this, this.props.selectedEnvironment.value, releaseName, function(self, res) {
            console.log(res.data);
            self.setState({historyList: res.data});
        });
    }

    render() {

        const items = this.state.list.map((item, key) =>
            <ReleasePanel eventKey={key} 
                key={key} 
                item={item}
                showReleaseHistory={this.showReleaseHistory.bind(this)}
                historyList={this.state.historyList} />
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
                    <p>Not implemented yet</p>
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
