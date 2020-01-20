import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import {
  Button,
  Row,
  Col,
  Card,
  Form,
  FormLabel,
  FormGroup,
  FormControl
} from 'react-bootstrap';
import * as simpleDeployActions from 'stores/simpleDeploy/actions';
import * as simpleDeploySelectors from 'stores/simpleDeploy/reducer';

class SimpleDeploy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRepository: {}
    };
  }

  componentDidMount() {
    this.props.dispatch(simpleDeployActions.loadRepositories());
  }

  handleRepositoryChange = selectedRepository => {
    this.props.dispatch(
      simpleDeployActions.selectRepository(selectedRepository)
    );
    this.props.dispatch(
      simpleDeployActions.loadCharts(selectedRepository.value, false)
    );
  };

  handleChartChange = selectedChart => {
    this.props.dispatch(simpleDeployActions.selectChart(selectedChart));

    const envId = this.props.selectedEnvironment.value;
    const chart = selectedChart.value;
    this.props.dispatch(
      simpleDeployActions.loadVariables(
        envId,
        chart,
        this.loadDockerTagsCallback
      )
    );
  };

  loadDockerTagsCallback = () => {
    const image = this.props.simpleDeploy.variables.find(
      e => e.name === 'image.repository'
    );

    if (image !== undefined) {
      this.props.dispatch(simpleDeployActions.loadDockerTags(image.value));
    }
  };

  handleAllVersions = event => {
    const allVersions = event.target.checked;
    const selectedRepository = this.props.simpleDeploy.selectedRepository;
    this.props.dispatch(
      simpleDeployActions.loadCharts(selectedRepository.value, allVersions)
    );
  };

  handleContainerTagChange = selectedTag => {
    this.props.dispatch(simpleDeployActions.selectTag(selectedTag));
  };

  findImage() {
    let image = '';
    if (!!this.props.simpleDeploy.variables) {
      let imageVar = this.props.simpleDeploy.variables.find(
        e => e.name === 'image.repository'
      );
      if (!!imageVar) {
        image = imageVar.value;
      }
    }
    return image;
  }

  getReleaseName(chartName) {
    let releaseName = '';
    let splited = chartName.split('/');
    if (splited.length > 1) {
      releaseName = splited[1];
    } else {
      releaseName = chartName;
    }
    return releaseName;
  }

  getChartVersion(chartName) {
    let chartVersion = '';
    let splited = chartName.split(' - ');
    if (splited.length > 1) {
      chartVersion = splited[1];
    }
    return chartVersion;
  }

  handleDeploy = () => {
    const chartName = this.props.simpleDeploy.selectedChart.value;
    const dockerTag = this.props.simpleDeploy.selectedTag.value;
    const envId = this.props.selectedEnvironment.value;

    this.props.dispatch(
      simpleDeployActions.saveVariables(
        chartName,
        dockerTag,
        envId,
        this.install
      )
    );
  };

  install = () => {
    const chartName = this.props.simpleDeploy.selectedChart.value;
    const releaseName = this.getReleaseName(chartName);
    const envId = this.props.selectedEnvironment.value;
    const chartVersion = this.getChartVersion(
      this.props.simpleDeploy.selectedChart.label
    );

    this.props.dispatch(
      simpleDeployActions.install(envId, releaseName, chartName, chartVersion)
    );
  };

  filterDockerTagsByCurrentRelease = () => {
    const selectedEnvId = this.props.selectedEnvironment.value;
    const selectedEnv = this.props.environments.find(
      e => e.value === selectedEnvId
    );

    if (
      !!selectedEnv &&
      !!selectedEnv.currentRelease &&
      selectedEnv.currentRelease !== '' &&
      !!this.props.simpleDeploy.dockerTags
    ) {
      return this.props.simpleDeploy.dockerTags.filter(e =>
        e.value.startsWith(selectedEnv.currentRelease)
      );
    }
    return this.props.simpleDeploy.dockerTags;
  };

  render() {
    return (
      <Card>
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <FormLabel>Repository</FormLabel>
                  <Select
                    value={this.props.simpleDeploy.selectedRepository}
                    onChange={this.handleRepositoryChange}
                    options={this.props.simpleDeploy.repositories}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={7}>
                <FormGroup>
                  <FormLabel>Chart</FormLabel>
                  <Select
                    value={this.props.simpleDeploy.selectedChart}
                    onChange={this.handleChartChange}
                    options={this.props.simpleDeploy.charts}
                  />
                  <Form.Check
                    id="allVersions"
                    type="switch"
                    inline
                    checked={this.props.simpleDeploy.allVersions}
                    onChange={this.handleAllVersions}
                    label="Show all chart versions"
                  ></Form.Check>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={7}>
                <FormGroup>
                  <FormLabel>Container image</FormLabel>
                  <FormControl
                    name="image"
                    readOnly={true}
                    type="text"
                    bsPrefix="form-control"
                    value={this.findImage()}
                  />
                </FormGroup>
              </Col>
              <Col xs={5}>
                <FormGroup>
                  <FormLabel>Container Tag</FormLabel>
                  <Select
                    value={this.props.simpleDeploy.selectedTag}
                    onChange={this.handleContainerTagChange}
                    options={this.filterDockerTagsByCurrentRelease()}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button variant="primary" onClick={this.handleDeploy.bind(this)}>
              Deploy
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  simpleDeploy: simpleDeploySelectors.getSimpleDeploy(state),
  loading: simpleDeploySelectors.getLoading(state),
  error: simpleDeploySelectors.getError(state)
});

export default connect(mapStateToProps)(SimpleDeploy);
