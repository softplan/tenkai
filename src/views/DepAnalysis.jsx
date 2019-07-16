import React, { Component } from "react";
import { Graph } from 'react-d3-graph';
import { retrieveDependency } from 'client-api/apicall.jsx';
import Button from "components/CustomButton/CustomButton.jsx";



class DepAnalysis extends Component {

    state = {
        data : {
            nodes: [{ id: 'pd-api' }, { id: 'pd-frontend' }, { id: 'pdf-signer-api' }, {id: 'pd-multibase-api'}],
            links: [{ source: 'pd-frontend', target: 'pd-api' }, 
                    { source: 'pd-api', target: 'pdf-signer-api' },
                    { source: 'pd-api', target: 'pd-multibase-api' },
                ]
        }
    }

    componentDidMount() {

    }

    analyse() {
        console.log("aqui");
        retrieveDependency("saj6/pd-frontend", "latest", this)
        console.log(this.state.data);
    }

    render() {

       const { data } = this.state;

        const myConfig = {
            "automaticRearrangeAfterDropNode": false,
            "collapsible": true,
            "directed": true,
            "focusAnimationDuration": 0.75,
            "focusZoom": 1,
            "height": 600,
            "highlightDegree": 1,
            "highlightOpacity": 1,
            "linkHighlightBehavior": false,
            "maxZoom": 8,
            "minZoom": 0.1,
            "nodeHighlightBehavior": true,
            "panAndZoom": true,
            "staticGraph": false,
            "width": 1000,
            "d3": {
              "alphaTarget": 0.05,
              "gravity": -100,
              "linkLength": 100,
              "linkStrength": 1
            },
            "node": {
              "color": "#d3d3d3",
              "fontColor": "black",
              "fontSize": 16,
              "fontWeight": "normal",
              "highlightColor": "SAME",
              "highlightFontSize": 8,
              "highlightFontWeight": "normal",
              "highlightStrokeColor": "SAME",
              "highlightStrokeWidth": "SAME",
              "labelProperty": "id",
              "mouseCursor": "pointer",
              "opacity": 1,
              "renderLabel": true,
              "size": 200,
              "strokeColor": "none",
              "strokeWidth": 1.5,
              "svg": "",
              "symbolType": "circle"
            },
            "link": {
              "color": "#d3d3d3",
              "fontColor": "black",
              "fontSize": 8,
              "fontWeight": "normal",
              "highlightColor": "#d3d3d3",
              "highlightFontSize": 8,
              "highlightFontWeight": "normal",
              "labelProperty": "label",
              "mouseCursor": "pointer",
              "opacity": 1,
              "renderLabel": false,
              "semanticStrokeWidth": false,
              "strokeWidth": 1.5
            }
          }        

        // graph event callbacks
        const onClickGraph = function () {
            
        };

        const onClickNode = function (nodeId) {

        };

        const onDoubleClickNode = function (nodeId) {
            
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
            <Button className="pull-right" variant="primary" onClick={this.analyse.bind(this)}>Aqui</Button>
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

export default DepAnalysis;
