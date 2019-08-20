import React, { Component } from "react";
import {
    Tabs, Tab, PanelGroup
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { listHelmDeploymentsByEnvironment } from 'client-api/apicall.jsx';
import { ReleasePanel } from 'components/Workload/ReleasePanel.jsx';

class Workload extends Component {

    state = {
        list: [],
    }

    listDeploymentsByEnv() {
        listHelmDeploymentsByEnvironment(this, this.props.selectedEnvironment.value, function (self, res) {
            console.log(res);
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
        }
    }

    render() {

        const items = this.state.list.map((item, key) =>
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

            <Tabs defaultActiveKey="main" id="workload-tab" onSelect={this.onTabSelect.bind(this)}>
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
