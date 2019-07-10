import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup, ControlLabel, Table, Button
} from "react-bootstrap";
import { thReleaseArray, tdReleaseArray } from "variables/Variables.jsx";
import Select from 'react-select';

import { Card } from "components/Card/Card.jsx";
import { ReleaseForm } from "components/Microservices/ReleaseForm.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import TENKAI_API_URL from 'env.js';


class Microservices extends Component {

    state = {
        selectedChart: null,
        showInsertUpdateForm: false,
        charts: [],
        repositories: [],
        selectedRepository: {},
        releases: [],
        editMode: false,
        editItem: {},
    }

    componentDidMount() {
        this.getRepos();
    }

    handleRepositoryChange = (selectedRepository) => {
        this.setState({ selectedRepository });
        this.getCharts(selectedRepository.value);
    }

    handleChartChange = (selectedChart) => {
        this.setState({ selectedChart }, () => {
            this.getReleases(selectedChart.value);
        });
    }

    getRepos() {
        axios.get(TENKAI_API_URL + '/repositories')
            .then(response => {
                var arr = [];
                for (var x = 0; x < response.data.repositories.length; x++) {
                    var element = response.data.repositories[x];
                    arr.push({ value: element.name, label: element.name });
                }
                this.setState({ repositories: arr });
            }).catch(error => {
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });
    }

    getCharts(repo) {
        this.props.handleLoading(true);
        let url = "/charts/" + repo + "?all=false";
        axios.get(TENKAI_API_URL + url).then(response => {
            var arr = [];
            for (var x = 0; x < response.data.charts.length; x++) {
                var element = response.data.charts[x];
                arr.push({ value: element.name, label: element.name });
            }
            this.setState({ charts: arr });
            this.props.handleLoading(false);
        }).catch(error => {
            this.props.handleLoading(false);
            console.log(error.message);
            this.props.handleNotification("general_fail", "error");
        });
    }

    getReleases(chartName) {
        this.props.handleLoading(true);
        let url = `/releases?chartName=${chartName}`;
        axios.get(TENKAI_API_URL + url).then(response => {
            this.setState({ releases: response.data.releases });
            this.props.handleLoading(false);
        }).catch(error => {
            this.props.handleLoading(false);
            console.log(error.message);
            this.props.handleNotification("general_fail", "error");
        });
    }

    handleDependenciesClick(e) {
        this.props.history.push('/admin/microservices-deps');
    }

    handleNewReleaseClick(e) {
        this.setState({ showInsertUpdateForm: true });
    }

    handleCancelReleaseClick(e) {
        this.setState({ showInsertUpdateForm: false });
    }

    onSaveClick(data) {
        if (this.state.editMode) {
            console.log("edit")
            this.save(data, '/releases/edit')
        } else {
            console.log("new")
            this.save(data, '/releases')
        }
    }

    save(data, uri) {
        data.chartName = this.state.selectedChart.value;
        console.log(data);

        axios.post(TENKAI_API_URL + uri,  data )
            .then(res => {
                this.setState({ releases: [...this.state.releases, data] });
            }).catch(error => {
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });
        this.setState(() => ({
            showInsertUpdateForm: false,
            editItem: {},
            editMode: false
        }));

    }

    render() {

        const { selectedChart } = this.state;
        const { selectedRepository } = this.state;

        const items = this.state.releases.map((item, key) =>
            <tr key={key} >
                <td>{item.release}</td>
                <td><a href="#/"><FontAwesomeIcon icon="minus-circle" /></a></td>
                <td><a href="#/"><FontAwesomeIcon icon="edit" onClick={this.handleDependenciesClick.bind(this)} /></a></td>                
            </tr>

        );

        return (
            <div className="content">
                <Grid fluid>

                    <Row>
                        <Col md={12}>
                            <Card
                                title=""
                                content={
                                    <form>

                                        <FormGroup>
                                            <ControlLabel>Repository</ControlLabel>
                                            <Select value={selectedRepository} onChange={this.handleRepositoryChange} options={this.state.repositories} />
                                        </FormGroup>

                                        <FormGroup>
                                            <ControlLabel>Helm Chart</ControlLabel>
                                            <Select value={selectedChart} onChange={this.handleChartChange} options={this.state.charts} />
                                        </FormGroup>

                                        <Button className="pull-right" variant="primary" onClick={this.handleNewReleaseClick.bind(this)}>New Release</Button>

                                        <div className="clearfix" />
                                    </form>

                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            {this.state.showInsertUpdateForm ?
                                <ReleaseForm 
                                editMode={this.state.editMode} 
                                editItem={this.state.editItem} 
                                saveClick={this.onSaveClick.bind(this)} 
                                cancelClick={this.handleCancelReleaseClick.bind(this)}/> : null
                            }
                        </Col>
                    </Row>

                    <Row>

                        <Col md={12}>

                            <Card
                                title="Releases"
                                category="Version number"
                                content={
                                    <div>
                                        <Table bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th>Release</th>
                                                    <th>Delete</th>
                                                    <th>Dependencies</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items}
                                            </tbody>
                                        </Table>
                                    </div>

                                }
                            />

                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Microservices;
