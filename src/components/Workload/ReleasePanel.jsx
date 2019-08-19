import React, { Component } from "react";
import {
    Panel, ButtonToolbar, Table
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";


export class ReleasePanel extends Component {
  render() {

    const historyList = this.props.historyList.map((item, key) =>
        <tr key={key}>
            <td>{item.revision}</td>
            <td>{item.updated}</td>
            <td>{item.status}</td>
            <td><i className="pe-7s-back-2"/></td>
            <td><i className="pe-7s-note2"/></td>
        </tr>
    );

    return (

        <Panel eventKey={this.props.eventKey}>
        <Panel.Heading>
            <Panel.Title toggle>{this.props.item.Name} - revision {this.props.item.Revision}</Panel.Title>
        </Panel.Heading>
        <Panel.Body collapsible>
            <p>Chart: {this.props.item.Chart}</p>
            <p>Updated: {this.props.item.Updated}</p>
            <p>Status: {this.props.item.Status}</p>

            <ButtonToolbar>
                <Button className="btn btn-primary" bsSize="sm" onClick={this.props.showReleaseHistory.bind(this, this.props.item.Name)}>
                    <i className="pe-7s-info"/>{" "}Show History
                </Button>
                <Button className="btn btn-danger" bsSize="sm">
                    <i className="pe-7s-less"/>{" "}Delete
                </Button>
                <Button className="btn btn-danger" bsSize="sm">
                    <i className="pe-7s-trash"/>{" "}Purge
                </Button>
            </ButtonToolbar>


            <Table responsive >
                <thead>
                    <tr>
                    <th>Revision</th>
                    <th>Updated</th>
                    <th>Status</th>
                    <th>Rollback</th>
                    <th>Inspect</th>
                    </tr>
                </thead>
                <tbody>
                    {historyList}
                </tbody>
                </Table>
        </Panel.Body>
    </Panel>

    );
  }
}

export default ReleasePanel;

