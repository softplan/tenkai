import React, { Component } from "react";
import { Graph } from 'react-d3-graph';
import { retrieveDependency } from 'client-api/apicall.jsx';
import queryString from 'query-string';

class DepGraph extends Component {

    state = {
        data : {
            nodes: [{id:"default"}],
            links: [],
        }
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
        const entries = Object.entries(this.state.charts)
        for (const [chartName, versionObject] of entries) {
            retrieveDependency(chartName, versionObject.value, this)    
        }
    }

    render() {

       const { data } = this.state;

        const myConfig = {
          "automaticRearrangeAfterDropNode": true,
          "collapsible": true,
          "directed": true,
          "focusAnimationDuration": 0.75,
          "focusZoom": 1,
          "height": 400,
          "highlightDegree": 2,
          "highlightOpacity": 0.2,
          "linkHighlightBehavior": true,
          "maxZoom": 12,
          "minZoom": 0.05,
          "nodeHighlightBehavior": true,
          "panAndZoom": false,
          "staticGraph": false,
          "width": 800,
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
            <Graph
                id="graph-id"
                data={data}
                config={myConfig}
                onClickNode={onClickNode}
                onRightClickNode={onRightClickNode}
                onClickGraph={onClickGraph}
                onClickLink={onClickLink}
                onRightClickLink={onRightClickLink}
                onMouseOverNode={onMouseOverNode}
                onMouseOutNode={onMouseOutNode}
                onMouseOverLink={onMouseOverLink}
                onMouseOutLink={onMouseOutLink}
            />
            </div>

        )

    }
}

export default DepGraph;
