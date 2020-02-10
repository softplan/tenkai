import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { FormGroup, FormLabel, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import {
  retrieveCharts,
  getTagsOfImage,
  getDockerImageFromHelmChart,
  getDefaultRepo
} from 'client-api/apicall.jsx';
import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export class EditProductReleaseService extends Component {
  state = {
    formData: {
      productVersionId: '',
      serviceName: '',
      dockerImageTag: ''
    },
    charts: [],
    repositories: [],
    selectedRepository: {},
    selectedChart: {},
    selectedTag: {},
    allVersions: false
  };

  componentDidMount() {
    this.getRepos();
    if (this.props.editMode) {
      this.setState(() => ({
        formData: this.props.editItem,
        allVersions: true
      }));
    } else {
      this.setState(() => ({
        formData: {},
        allVersions: false
      }));
    }
  }

  getRepos() {
    axios
      .get(TENKAI_API_URL + '/repositories')
      .then(response => {
        var arr = [];
        for (var x = 0; x < response.data.repositories.length; x++) {
          var element = response.data.repositories[x];
          arr.push({ value: element.name, label: element.name });
        }
        this.setState({ repositories: arr }, () => {
          getDefaultRepo(this, self => {
            for (let x = 0; x < this.state.repositories.length; x++) {
              if (self.state.repositories[x].value === self.state.defaultRepo) {
                self.handleRepositoryChange(this.state.repositories[x]);
                break;
              }
            }
          });
        });
      })
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  handleChange = event => {
    const { value, name } = event.target;
    this.setState(state => ({
      formData: {
        ...state.formData,
        [name]: value
      }
    }));
  };

  saveClick = event => {
    event.preventDefault();
    const data = this.state.formData;
    data.serviceName = this.state.selectedChart.value;
    this.props.saveClick(data);
  };

  chartCallback = (self, charts) => {
    if (self.props.editItem) {
      for (let x = 0; x < charts.length; x++) {
        let element = charts[x];
        let chartNameVersion = element.name + ' - ' + element.chartVersion;
        if (chartNameVersion === self.props.editItem.serviceName) {
          const selectedChart = {
            value: chartNameVersion,
            label: chartNameVersion
          };
          self.handleChartChange(selectedChart);
        }
      }
    }
  };

  tagCallback = (self, tags) => {
    if (self.props.editItem) {
      tags.forEach(tag => {
        if (tag.tag === self.props.editItem.dockerImageTag) {
          const selectedTag = {
            value: tag.tag,
            label: tag.tag
          };
          self.setState({ selectedTag });
        }
      });
    }
  };

  handleRepositoryChange = selectedRepository => {
    this.setState({ selectedRepository });

    if (this.props.editMode) {
      retrieveCharts(this, selectedRepository.value, true, this.chartCallback);
      this.setState(() => ({
        allVersions: true
      }));
    } else {
      retrieveCharts(this, selectedRepository.value, false, this.chartCallback);
    }
  };

  async retrieveTagsOfImage(imageName, callback) {
    getTagsOfImage(this, imageName, (self, data) => {
      var arr = [];
      if (data.tags != null) {
        for (var x = 0; x < data.tags.length; x++) {
          var element = data.tags[x];
          arr.push({ value: element.tag, label: element.tag });
        }
      }
      this.setState({ tags: arr });

      if (callback) {
        callback(this, data.tags);
      }
    });
  }

  handleChartChange = selectedChart => {
    this.setState({ selectedChart });

    let payload = {
      chartName: this.getChartName(selectedChart.value),
      chartVersion: this.getChartVersion(selectedChart.value)
    };
    getDockerImageFromHelmChart(this, payload, (self, dockerImage) => {
      if (dockerImage) {
        this.retrieveTagsOfImage(dockerImage, this.tagCallback);
      }
    });
  };

  handleContainerTagChange = selectedTag => {
    this.setState(state => ({
      formData: {
        ...state.formData,
        dockerImageTag: selectedTag.value
      },
      selectedTag: selectedTag
    }));
  };

  handleAllVersions = event => {
    this.setState({ allVersions: event.target.checked });
    const { selectedRepository } = this.state;
    retrieveCharts(
      this,
      selectedRepository.value,
      event.target.checked,
      this.chartCallback
    );
  };

  getChartName(chartNameWithVersion) {
    return chartNameWithVersion.split(' - ')[0];
  }

  getChartVersion(chartNameWithVersion) {
    return chartNameWithVersion.split(' - ')[1];
  }

  render() {
    const { editMode } = this.props;
    const { selectedChart } = this.state;
    const { selectedRepository } = this.state;
    const { selectedTag } = this.state;
    const { allVersions } = this.state;

    return (
      <div>
        <CardTenkai
          title={editMode ? 'Edit Chart Association' : 'New Chart Association'}
          content={
            <form>
              <FormGroup>
                <FormLabel>Repository</FormLabel>
                <Select
                  value={selectedRepository}
                  onChange={this.handleRepositoryChange}
                  options={this.state.repositories}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Helm Chart</FormLabel>
                <Select
                  value={selectedChart}
                  onChange={this.handleChartChange}
                  options={this.state.charts}
                />
                <Form.Check
                  id="allVersions"
                  type="switch"
                  inline
                  checked={allVersions}
                  onChange={this.handleAllVersions}
                  label="Show all versions"
                ></Form.Check>
              </FormGroup>

              <FormGroup>
                <FormLabel>Docker Image Tag</FormLabel>
                <Select
                  value={selectedTag}
                  onChange={this.handleContainerTagChange}
                  options={this.state.tags}
                />
              </FormGroup>

              <div className="btn-toolbar">
                <div className="btn-group">
                  <Button variant="info" type="button" onClick={this.saveClick}>
                    Save
                  </Button>
                </div>
                <div className="btn-group">
                  <Button
                    variant="info"
                    type="button"
                    onClick={this.props.cancelClick}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          }
        />
      </div>
    );
  }
}

export default EditProductReleaseService;
