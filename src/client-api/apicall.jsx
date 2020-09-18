import axios from 'axios';
import { TENKAI_API_URL, TENKAI_DOCKER_API_URL } from 'env.js';

function handlerError(self, response) {
  if (response !== undefined) {
    self.props.handleNotification('custom', 'error', response.data);
  } else {
    self.props.handleNotification('fail', 'error');
  }
}

function retriveRepo(self) {
  axios
    .get(TENKAI_API_URL + '/repositories')
    .then(response => {
      var arr = [];
      for (var x = 0; x < response.data.repositories.length; x++) {
        var element = response.data.repositories[x];
        arr.push({ value: element.name, label: element.name });
      }
      self.setState({ repositories: arr });
    })
    .catch(error => {
      console.log(error.message);
      handlerError(self, error.response);
    });
}

function retrieveNotes(serviceName, self, callback) {
  const encodedServiceName = encodeURIComponent(serviceName);
  axios
    .get(TENKAI_API_URL + `/notes?serviceName=${encodedServiceName}`)
    .then(response => {
      self.setState({ notesValue: response.text });
      if (callback) {
        callback(self, response);
      }
    })
    .catch(error => {
      console.log(error.message);
      handlerError(self, error.response);
    });
}

function saveNotes(data, self, onSuccess) {
  let uri = '/notes';
  axios
    .post(TENKAI_API_URL + uri, data)
    .then(res => {
      if (onSuccess !== undefined) {
        onSuccess(self);
      }
    })
    .catch(error => {
      console.log(error.message);
      handlerError(self, error.response);
    });
}

function retrieveCharts(self, repo, allVersions, callback) {
  self.props.handleLoading(true);
  let url = '/charts/' + repo + '?all=' + allVersions;
  axios
    .get(TENKAI_API_URL + url)
    .then(response => {
      let arr = [];
      for (let x = 0; x < response.data.charts.length; x++) {
        let element = response.data.charts[x];
        let nameVersion = element.name + ' - ' + element.chartVersion;
        arr.push({ value: nameVersion, label: nameVersion });
      }
      self.setState({ charts: arr });
      if (callback) {
        callback(self, response.data.charts);
      }
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      console.log(error.message);
      handlerError(self, error.response);
    });
}

function retrieveSettings(list, self, callback) {
  self.props.handleLoading(true);
  let url = '/getSettingList';
  axios
    .post(TENKAI_API_URL + url, list)
    .then(response => {
      if (callback !== undefined) {
        callback(response.data, self);
      }
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      console.log(error.message);
      handlerError(self, error.response);
    });
}

function getVariablesNotUsed(envId, self, callback) {
  self.props.handleLoading(true);
  let url = `/getVariablesNotUsed/${envId}`;

  axios
    .get(TENKAI_API_URL + url)
    .then(response => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(response.data, self);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      console.log(error.message);
      handlerError(self, error.response);
    });
}

function retrieveReleases(chartName, self) {
  self.props.handleLoading(true);
  let url = `/releases?chartName=${chartName}`;
  axios
    .get(TENKAI_API_URL + url)
    .then(response => {
      self.setState({ releases: response.data.releases });
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      console.log(error.message);
      handlerError(self, error.response);
    });
}

function retrieveReleasesWithCallBack(chartName, self, callback) {
  self.props.handleLoading(true);
  let url = `/releases?chartName=${chartName}`;
  axios
    .get(TENKAI_API_URL + url)
    .then(response => {
      callback(chartName, response.data.releases, self);
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      console.log(error.message);
      handlerError(self, error.response);
    });
}

function deleteRelease(id, self) {
  if (self.state.itemToDelete !== undefined) {
    self.props.handleLoading(true);
    axios
      .delete(TENKAI_API_URL + '/releases/' + id)
      .then(response => {
        retrieveReleases(self.state.selectedChart.value, self);
        self.props.handleLoading(false);
      })
      .catch(error => {
        self.props.handleLoading(false);
        console.log(error.message);
        handlerError(self, error.response);
      });
  }
  self.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
}

function saveReleases(data, self) {
  let uri = '';
  if (self.state.editMode) {
    uri = '/releases/edit';
  } else {
    uri = '/releases';
  }

  axios
    .post(TENKAI_API_URL + uri, data)
    .then(res => {
      retrieveReleases(self.state.selectedChart.value, self);
    })
    .catch(error => {
      console.log(error.message);
      handlerError(self, error.response);
    });

  self.setState(() => ({
    showInsertUpdateForm: false,
    editItem: {},
    editMode: false
  }));
}

function saveSettings(data, self, onSuccess) {
  let uri = '/settings';
  axios
    .post(TENKAI_API_URL + uri, data)
    .then(res => {
      if (onSuccess !== undefined) {
        onSuccess(self);
      }
    })
    .catch(error => {
      console.log(error.message);
      handlerError(self, error.response);
    });

  self.setState(() => ({
    showInsertUpdateForm: false,
    editItem: {},
    editMode: false
  }));
}

function multipleInstall(payload, self) {
  self.props.handleLoading(true);
  axios
    .post(TENKAI_API_URL + '/multipleInstall', payload)
    .then(() => {
      self.props.handleNotification('deployment_ok', 'success');
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function getHelmCommand(payload, self, callback) {
  self.props.handleLoading(true);
  axios
    .post(TENKAI_API_URL + '/getHelmCommand', payload)
    .then(data => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(data);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function retrieveDependency(environmentId, chartName, tag, self) {
  axios
    .post(TENKAI_API_URL + '/analyse', { environmentId, chartName, tag })
    .then(result => {
      const data = result.data;
      self.setState({ data: data });
    })
    .catch(error => {
      console.log(error.message);
      handlerError(self, error.response);
    });
}

function getAllEnvironments(self, callback) {
  axios
    .get(TENKAI_API_URL + '/environments/all')
    .then(response => {
      if (callback !== undefined) {
        callback(response.data.Envs);
      }
    })
    .catch(error => {
      handlerError(self, error.response);
    });
}

function getDefaultRepo(self, callback) {
  self.props.handleLoading(true);
  axios
    .get(TENKAI_API_URL + '/repo/default')
    .then(res => {
      self.setState({ defaultRepo: res.data.value });
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function listHelmDeploymentsByEnvironment(self, id, callback) {
  self.props.handleLoading(true);
  axios
    .get(TENKAI_API_URL + `/listHelmDeploymentsByEnvironment/${id}`)
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      console.log('error: ' + error);
      //self.props.handleNotification("general_fail", "error");
    });
}

function listPods(self, id, callback) {
  self.props.handleLoading(true);
  axios
    .get(TENKAI_API_URL + `/listPods/${id}`)
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      console.log('error: ' + error);
      //self.props.handleNotification("general_fail", "error");
    });
}

function listEndpoints(self, id, callback) {
  self.props.handleLoading(true);
  axios
    .get(TENKAI_API_URL + `/getVirtualServices?environmentID=${id}`)
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      console.log('error: ' + error);
    });
}

function listServices(self, id, callback) {
  self.props.handleLoading(true);
  axios
    .get(TENKAI_API_URL + `/listServices/${id}`)
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      console.log('error: ' + error);
      //self.props.handleNotification("general_fail", "error");
    });
}

function getReleaseHistory(self, environmentID, releaseName, callback) {
  self.props.handleLoading(true);
  axios
    .post(TENKAI_API_URL + '/listReleaseHistory', {
      environmentID,
      releaseName
    })
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function getRevisionYaml(self, environmentID, releaseName, revision, callback) {
  self.props.handleLoading(true);
  axios
    .post(TENKAI_API_URL + '/revision', {
      environmentID,
      releaseName,
      revision
    })
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function rollbackHelmRelease(self, environmentID, item, callback) {
  self.props.handleLoading(true);
  axios
    .post(TENKAI_API_URL + '/rollback', {
      environmentID: environmentID,
      releaseName: item.releaseName,
      revision: item.revision
    })
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function deleteHelmRelease(self, environmentID, releaseName, callback) {
  self.props.handleLoading(true);
  let purge = true;
  axios
    .delete(
      TENKAI_API_URL +
        `/deleteHelmRelease?environmentID=${environmentID}&releaseName=${releaseName}&purge=${purge}`
    )
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function deletePod(self, environmentID, podName, callback) {
  self.props.handleLoading(true);
  axios
    .delete(
      TENKAI_API_URL +
        `/deletePod?environmentID=${environmentID}&podName=${podName}`
    )
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function promote(self, srcEnvID, targetEnvID, full) {
  self.props.handleLoading(true);
  let url =
    TENKAI_API_URL + `/promote?srcEnvID=${srcEnvID}&targetEnvID=${targetEnvID}`;
  if (full) {
    url = url + '&mode=full';
  } else {
    url = url + '&mode=workload';
  }
  axios
    .get(url)
    .then(res => {
      self.props.handleNotification('custom', 'success', 'Done!');
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function getTagsOfImage(self, imageName, callback) {
  self.props.handleLoading(true);
  let url = TENKAI_DOCKER_API_URL + '/listDockerTags';
  axios
    .post(url, { imageName })
    .then(res => {
      if (callback !== undefined) {
        callback(self, res.data);
      }
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

function getDockerImageFromHelmChart(self, payload, callback) {
  self.props.handleLoading(true);

  let url = TENKAI_API_URL + '/getChartVariables';

  axios
    .post(url, payload)
    .then(res => {
      if (callback !== undefined) {
        callback(self, res.data.image.repository);
      }
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

async function validateVariables(self, envId, chartName, callback) {
  self.props.handleLoading(true);
  await axios
    .post(TENKAI_API_URL + '/validateVariables', {
      environmentId: envId,
      scope: chartName
    })
    .then(response => {
      callback(response.data.InvalidVariables);
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

async function validateEnvVars(self, envId, callback) {
  self.props.handleLoading(true);
  await axios
    .post(TENKAI_API_URL + '/validateEnvVars/' + envId)
    .then(response => {
      callback(response.data.InvalidVariables);
      self.props.handleLoading(false);
    })
    .catch(error => {
      self.props.handleLoading(false);
      handlerError(self, error.response);
    });
}

export {
  retriveRepo,
  retrieveNotes,
  saveNotes,
  retrieveCharts,
  retrieveReleases,
  saveReleases,
  deleteRelease,
  retrieveDependency,
  retrieveReleasesWithCallBack,
  multipleInstall,
  getAllEnvironments,
  getDefaultRepo,
  listHelmDeploymentsByEnvironment,
  getReleaseHistory,
  deleteHelmRelease,
  getRevisionYaml,
  rollbackHelmRelease,
  listPods,
  deletePod,
  listServices,
  promote,
  getTagsOfImage,
  saveSettings,
  retrieveSettings,
  getVariablesNotUsed,
  getDockerImageFromHelmChart,
  getHelmCommand,
  listEndpoints,
  validateVariables,
  validateEnvVars
};
