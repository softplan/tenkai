import React, { Component } from "react";
import { Graph } from 'react-d3-graph';
import { retrieveDependency } from 'client-api/apicall.jsx';
import queryString from 'query-string';
import {
    Tabs, Tab, ButtonToolbar, Row, Col
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import HelmVariables from "components/Deployment/HelmVariables.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card } from "components/Card/Card.jsx";
import { multipleInstall } from "client-api/apicall.jsx"
import CopyModal from "components/Modal/CopyModal.jsx";

class DepGraph extends Component {

    state = {
        data: {
            nodes: [{ id: "default" }],
            links: [],
        },
        tabs: [],
        onShowCopyModal: false,
    }

    constructor(props) {
        super(props);
        const values = queryString.parse(props.location.search);
        this.state.envId = values.environment;
        this.state.charts = props.location.state.charts;
        this.state.environmentName = props.location.state.environmentName;
        console.log(props.location.state.environmentName);
    }

    componentDidMount() {
        let environmentId = parseInt(this.state.envId);
        const entries = Object.entries(this.state.charts)
        for (const [chartName, versionObject] of entries) {
            retrieveDependency(environmentId, chartName, versionObject.value, this)
        }
    }

    onCloseCopyModal() {
        this.setState({ onShowCopyModal: false, chartToManipulate: "" });
      }
    
      async onConfirmCopyModal(item) {
        await this.refs[this.state.chartToManipulate].listVariables(item.value);
        this.setState({ onShowCopyModal: false, chartToManipulate: "" });
      }
    
      showConfirmCopyModal(ref) {
        this.setState({ onShowCopyModal: true, chartToManipulate: ref });
      }
    

    onTabClose(index) {
        console.log(index);
        let arr = this.state.tabs;
        arr.splice(index, 1);
        this.setState({ tabs: [] }, () => { this.setState({ tabs: arr }, () => { console.log(this.state.tabs) }) });
    }

    onInstallUpdateChartClick(chartName) {
        let payload={deployables:[]};
        this.refs["h" + chartName].save( (list) => {
            for (let x = 0; x < list.length; x++) {
              let data = list[x];
              payload.deployables.push(data);
            }
            multipleInstall(payload, this);
        });
    }

    onSaveVariablesClick(chartName) {
        this.props.handleLoading(true);
        this.refs["h" + chartName].save((data) => {});
        this.props.handleLoading(false);
    }

    getConfigMap(value) {
        let configMapName = value + "-global-configmap";
        var n = configMapName.indexOf("/");
        configMapName = configMapName.substring(n + 1);
        return configMapName
    }


    onInstallUpdateAllClick() {
        let payload={deployables:[]};
        const totalCharts = this.state.data.nodes.length;
        for (let x = 0; x < totalCharts; x++) {
            let scope = this.state.data.nodes[x].id.substring(0, this.state.data.nodes[x].id.indexOf(":"));
            
            var n = scope.indexOf("/");
            let installPayload = {};
            installPayload.name = scope.substring(n + 1);
            installPayload.chart = scope;
            installPayload.environmentId = parseInt(this.state.envId);
            payload.deployables.push(installPayload);

            let installPayloadConfigMap = {};
            installPayloadConfigMap.name = this.getConfigMap(scope.substring(n + 1))
            installPayloadConfigMap.chart = "saj6/dotnet-global-variables";
            installPayloadConfigMap.environmentId = parseInt(this.state.envId);
            payload.deployables.push(installPayloadConfigMap);

        }
        console.log(payload.deployables);
        multipleInstall(payload, this);
    }

    render() {
        
        const { data } = this.state;

        const myConfig = {
            "automaticRearrangeAfterDropNode": true,
            "collapsible": true,
            "directed": true,
            "focusAnimationDuration": 0.75,
            "focusZoom": 1,
            "width": window.innerWidth - 280,
            "height": 800,
            "highlightDegree": 2,
            "highlightOpacity": 0.2,
            "linkHighlightBehavior": true,
            "maxZoom": 12,
            "minZoom": 0.05,
            "nodeHighlightBehavior": true,
            "panAndZoom": false,
            "staticGraph": false,
            "d3": {
                "alphaTarget": 0.05,
                "gravity": -250,
                "linkLength": 120,
                "linkStrength": 2
            },
            "node": {
                "color": "#d3d3d3",
                "fontColor": "black",
                "fontSize": 10,
                "fontWeight": "normal",
                "highlightColor": "red",
                "highlightFontSize": 14,
                "highlightFontWeight": "bold",
                "highlightStrokeColor": "red",
                "highlightStrokeWidth": 1.5,
                "mouseCursor": "crosshair",
                "opacity": 0.9,
                "renderLabel": true,
                "size": 200,
                "strokeColor": "none",
                "strokeWidth": 1.5,
                "svg": "",
                "symbolType": "circle"
            },
            "link": {
                "color": "lightgray",
                "fontColor": "black",
                "fontSize": 8,
                "fontWeight": "normal",
                "highlightColor": "red",
                "highlightFontSize": 8,
                "highlightFontWeight": "normal",
                "labelProperty": "label",
                "mouseCursor": "pointer",
                "opacity": 1,
                "renderLabel": false,
                "semanticStrokeWidth": true,
                "strokeWidth": 3
            }
        }


        // graph event callbacks
        const onClickGraph = function () {

        };

        const onClickNode = function (nodeId) {
            const chartName = nodeId.substring(0, nodeId.indexOf(":"));
            const chartVersion = "";

            console.log(chartName);
            console.log(chartVersion);

            this.setState(state => {
                const list = state.tabs.push(nodeId);
                return {
                    list,
                    value: '',
                }
            }, () => { 
                
                this.refs["h" + chartName].getVariables(chartName, chartVersion);
            
            });

        };

        const onRightClickNode = function (event, nodeId) {

        };

        const onMouseOverNode = function (nodeId) {

        };

        const onMouseOutNode = function (nodeId) {

        };

        const onClickLink = function (source, target) {

        };

        const onRightClickLink = function (event, source, target) {

        };

        const onMouseOverLink = function (source, target) {

        };

        const onMouseOutLink = function (source, target) {

        };

        return (
            <div>
                <Tabs defaultActiveKey="main" id="uncontrolled-tab-example">
                    <Tab eventKey="main" title="Dependency Analysis">
                        <Row>
                            <Col md={12}>
                            <Card
                                title=""
                                content={
                                    <div>

                                    <CopyModal
                                        onShow={this.state.onShowCopyModal}
                                        onClose={this.onCloseCopyModal.bind(this)}
                                        title="Copy config from another environment" subTitle="Select environment" 
                                        onConfirm={this.onConfirmCopyModal.bind(this)}
                                        environments={this.props.environments}>
                                    </CopyModal>
                                      
                                        <ButtonToolbar>
                                            <Button bsStyle="primary"
                                                fill
                                                pullRight
                                                type="button"
                                                onClick={this.onInstallUpdateAllClick.bind(this)}>Install/Update All</Button>
                                        </ButtonToolbar>

                                        <div className="clearfix" />
                                    </div>
                                }
                            />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>


                        <Graph
                            id="graph-id"
                            data={data}
                            config={myConfig}
                            onClickNode={onClickNode.bind(this)}
                            onRightClickNode={onRightClickNode}
                            onClickGraph={onClickGraph}
                            onClickLink={onClickLink}
                            onRightClickLink={onRightClickLink}
                            onMouseOverNode={onMouseOverNode}
                            onMouseOutNode={onMouseOutNode}
                            onMouseOverLink={onMouseOverLink}
                            onMouseOutLink={onMouseOutLink} />

                            </Col>
                        </Row>

                    </Tab>
                    {this.state.tabs.map((value, index) => {

                        const chartName = value.substring(0, value.indexOf(":"));
                        const chartVersion = "";

                        return <Tab key={index} eventKey={chartName} title={<span>{chartName}{" "}
                            <FontAwesomeIcon onClick={this.onTabClose.bind(this, index)} icon="window-close" /></span>}>

                            <div>
                                <Card
                                    title=""
                                    content={
                                        <div>
                                            <ButtonToolbar>
                                                <h3>Environment: {this.state.environmentName}</h3>
                                                <Button bsStyle="primary"
                                                    fill
                                                    pullRight
                                                    type="button"
                                                    onClick={this.onInstallUpdateChartClick.bind(this, chartName)}
                                                >Install/Update</Button>

                                                <Button bsStyle="info"
                                                    fill
                                                    pullRight
                                                    type="button"
                                                    onClick={this.onSaveVariablesClick.bind(this, chartName)}
                                                >Save Variables</Button>

                                            </ButtonToolbar>

                                            <div className="clearfix" />
                                        </div>
                                    }
                                />
                            </div>


                            <div >
                                <HelmVariables handleLoading={this.props.handleLoading}
                                    copyVariables={this.showConfirmCopyModal.bind(this)}
                                    handleNotification={this.props.handleNotification}
                                    key={index} chartName={chartName}
                                    chartVersion={chartVersion}
                                    xref={"h" + chartName}
                                    ref={"h" + chartName}
                                    envId={this.state.envId} />




                            </div>

                        </Tab>

                    })}
                </Tabs>

            </div>

        )

    }
}

export default DepGraph;
