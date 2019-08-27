import axios from 'axios';
import TENKAI_API_URL from 'env.js';

function handlerError(self, response) {
    if (response !== undefined) {
        self.props.handleNotification("custom", "error", response.data);
    } else {
        self.props.handleNotification("deployment_fail", "error");
    }
}

function retriveRepo(self) {
    axios.get(TENKAI_API_URL + '/repositories')
        .then(response => {
            var arr = [];
            for (var x = 0; x < response.data.repositories.length; x++) {
                var element = response.data.repositories[x];
                arr.push({ value: element.name, label: element.name });
            }
            self.setState({ repositories: arr });
        }).catch(error => {
            console.log(error.message);
            handlerError(self, error.response);
        });
}

function retrieveCharts(repo, self) {
    self.props.handleLoading(true);
    let url = "/charts/" + repo + "?all=false";
    axios.get(TENKAI_API_URL + url).then(response => {
        var arr = [];
        for (var x = 0; x < response.data.charts.length; x++) {
            var element = response.data.charts[x];
            arr.push({ value: element.name, label: element.name });
        }
        self.setState({ charts: arr });
        self.props.handleLoading(false);
    }).catch(error => {
        self.props.handleLoading(false);
        console.log(error.message);
        handlerError(self, error.response);
    });
}

function retrieveReleases(chartName, self) {
    self.props.handleLoading(true);
    let url = `/releases?chartName=${chartName}`;
    axios.get(TENKAI_API_URL + url).then(response => {
        self.setState({ releases: response.data.releases });
        self.props.handleLoading(false);
    }).catch(error => {
        self.props.handleLoading(false);
        console.log(error.message);
        handlerError(self, error.response);
    });
}

function retrieveReleasesWithCallBack(chartName, self, callback) {
    self.props.handleLoading(true);
    let url = `/releases?chartName=${chartName}`;
    axios.get(TENKAI_API_URL + url).then(response => {
        callback(chartName, response.data.releases, self);
        self.props.handleLoading(false);
    }).catch(error => {
        self.props.handleLoading(false);
        console.log(error.message);
        handlerError(self, error.response);
    });
}


function deleteRelease(id, self) {
    if (self.state.itemToDelete !== undefined) {
        self.props.handleLoading(true);
        axios.delete(TENKAI_API_URL + "/releases/" + id)
            .then(response => {
                retrieveReleases(self.state.selectedChart.value, self);
                self.props.handleLoading(false);
            }).catch(error => {
                self.props.handleLoading(false);
                console.log(error.message);
                handlerError(self, error.response);
            });
    }
    self.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
}


function saveReleases(data, self) {

    let uri = "";
    if (self.state.editMode) {
        uri = '/releases/edit';
    } else {
        uri = '/releases';
    }

    axios.post(TENKAI_API_URL + uri, data).then(res => {
        retrieveReleases(self.state.selectedChart.value, self);
    }).catch(error => {
        console.log(error.message);
        handlerError(self, error.response);
    });

    self.setState(() => ({
        showInsertUpdateForm: false,
        editItem: {},
        editMode: false
    })
    );

}

function saveUsers(data, self, onSuccess) {

    let uri = '/users/createOrUpdate';

    axios.post(TENKAI_API_URL + uri, data).then(res => {
        onSuccess(self);
    }).catch(error => {
        console.log(error.message);
        handlerError(self, error.response);
    });

    self.setState(() => ({
        showInsertUpdateForm: false,
        editItem: {},
        editMode: false
    }));

}

function retrieveDependencies(releaseId, self) {
    self.props.handleLoading(true);
    let url = `/dependencies?releaseId=${releaseId}`;
    axios.get(TENKAI_API_URL + url).then(response => {
        self.setState({ list: response.data.dependencies });
        self.props.handleLoading(false);
    }).catch(error => {
        self.props.handleLoading(false);
        handlerError(self, error.response);
    });
}


function multipleInstall(payload, self) {
    self.props.handleLoading(true);
    axios.post(TENKAI_API_URL + '/multipleInstall', payload).then(() => {
        self.props.handleNotification("deployment_ok", "success");
        self.props.handleLoading(false);
    }).catch(error => {
        self.props.handleLoading(false);
        handlerError(self, error.response);
    });
  } 

function saveDependency(data, self) {

    let uri = "";
    if (self.state.editMode) {
        uri = '/dependencies/edit';
    } else {
        uri = '/dependencies';
    }
    axios.post(TENKAI_API_URL + uri, data)
        .then(res => {
            retrieveDependencies(self.state.releaseId, self)
        }).catch(error => {
            console.log(error.message);
            handlerError(self, error.response);
        });

    self.setState(() => ({
        showInsertUpdateForm: false,
        editItem: {},
        editMode: false
    })
    );

}

function deleteDependency(id, self) {
    if (self.state.itemToDelete !== undefined) {
        axios.delete(TENKAI_API_URL + "/dependencies/" + id)
            .then(retrieveDependencies(self.state.releaseId, self)).catch(error => {
                console.log(error.message);
                handlerError(self, error.response);
            });
    }
    self.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
}


function retrieveDependency(environmentId, chartName, tag, self) {
    axios.post(TENKAI_API_URL + "/analyse", { environmentId, chartName, tag })
        .then(result => {
            const data = result.data; 
            self.setState( {data: data });
        }).catch(error => {
            console.log(error.message);
            handlerError(self, error.response);
        });
}


function getAllEnvironments(self, callback) {
    axios.get(TENKAI_API_URL + '/environments/all')
    .then(response => self.setState({ envs: response.data.Envs }, () => {
        if (callback !== undefined) {
            callback(self);
        }
    }))
    .catch(error => {
        handlerError(self, error.response);
    });

}

function getDefaultRepo(self, callback) {
    self.props.handleLoading(true);
    axios.get(TENKAI_API_URL + "/repo/default")
    .then(res => {
      self.setState({defaultRepo: res.data.value});
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self);
      }
    }).catch(error => {
      self.props.handleLoading(false);
      self.props.handleNotification("general_fail", "error");
    });
}


function listHelmDeploymentsByEnvironment(self, id, callback) {
    self.props.handleLoading(true);
    axios.get(TENKAI_API_URL + `/listHelmDeploymentsByEnvironment/${id}`)
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    }).catch(error => {
      self.props.handleLoading(false);
      console.log("error: " + error);
      //self.props.handleNotification("general_fail", "error");
    });

}

function listPods(self, id, callback) {
    self.props.handleLoading(true);
    axios.get(TENKAI_API_URL + `/listPods/${id}`)
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    }).catch(error => {
      self.props.handleLoading(false);
      console.log("error: " + error);
      //self.props.handleNotification("general_fail", "error");
    });
}

function listServices(self, id, callback) {
    self.props.handleLoading(true);
    axios.get(TENKAI_API_URL + `/listServices/${id}`)
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    }).catch(error => {
      self.props.handleLoading(false);
      console.log("error: " + error);
      //self.props.handleNotification("general_fail", "error");
    });
}


function getReleaseHistory(self, environmentID, releaseName, callback) {
    self.props.handleLoading(true);
    axios.post(TENKAI_API_URL + `/listReleaseHistory`, {environmentID, releaseName})
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    }).catch(error => {
      self.props.handleLoading(false);
      self.props.handleNotification("general_fail", "error");
    });    
}

function getRevisionYaml(self, environmentID, releaseName, revision, callback) {
    self.props.handleLoading(true);
    axios.post(TENKAI_API_URL + `/revision`, {environmentID, releaseName, revision})
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    }).catch(error => {
      self.props.handleLoading(false);
      self.props.handleNotification("general_fail", "error");
    });    
}



function rollbackHelmRelease(self, environmentID, item, callback) {
    self.props.handleLoading(true);
    axios.post(TENKAI_API_URL + `/rollback`, {environmentID: environmentID, releaseName: item.releaseName, revision: item.revision})
    .then(res => {
      self.props.handleLoading(false);
      if (callback !== undefined) {
        callback(self, res);
      }
    }).catch(error => {
      self.props.handleLoading(false);
      self.props.handleNotification("general_fail", "error");
    });        
}

function deleteHelmRelease(self, environmentID, releaseName, callback) {
    self.props.handleLoading(true);
    let purge = true
    axios.delete(TENKAI_API_URL + `/deleteHelmRelease?environmentID=${environmentID}&releaseName=${releaseName}&purge=${purge}`)
    .then(res =>
        {
            self.props.handleLoading(false);
            if (callback !== undefined) {
              callback(self, res);
            }
        }
    ).catch(error => {
      self.props.handleLoading(false);
      self.props.handleNotification("general_fail", "error");
    });    
}

function deletePod(self, environmentID, podName, callback) {
    self.props.handleLoading(true);
    axios.delete(TENKAI_API_URL + `/deletePod?environmentID=${environmentID}&podName=${podName}`)
    .then(res =>
        {
            self.props.handleLoading(false);
            if (callback !== undefined) {
              callback(self, res);
            }
        }
    ).catch(error => {
      self.props.handleLoading(false);
      self.props.handleNotification("general_fail", "error");
    });    
}

export {
    retriveRepo, retrieveCharts, retrieveReleases,
    saveReleases, retrieveDependencies, saveDependency,
    deleteDependency, deleteRelease, retrieveDependency, retrieveReleasesWithCallBack, 
    multipleInstall, getAllEnvironments, saveUsers, getDefaultRepo, listHelmDeploymentsByEnvironment,
    getReleaseHistory, deleteHelmRelease, getRevisionYaml, rollbackHelmRelease, listPods, deletePod,
    listServices

};
