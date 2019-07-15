import axios from 'axios';
import TENKAI_API_URL from 'env.js';

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
            self.props.handleNotification("general_fail", "error");
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
        self.props.handleNotification("general_fail", "error");
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
        self.props.handleNotification("general_fail", "error");
    });
}

function deleteRelease(id, self) {
    if (self.state.itemToDelete != undefined) {
        self.props.handleLoading(true);
        axios.delete(TENKAI_API_URL + "/releases/" + id)
            .then(response => {
                retrieveReleases(self.state.selectedChart.value, self);
                self.props.handleLoading(false);
            }).catch(error => {
                self.props.handleLoading(false);
                console.log(error.message);
                self.props.handleNotification("general_fail", "error");
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
        self.setState({ releases: [...self.state.releases, data] });
    }).catch(error => {
        console.log(error.message);
        self.props.handleNotification("general_fail", "error");
    });

    self.setState(() => ({
        showInsertUpdateForm: false,
        editItem: {},
        editMode: false
    })
    );

}

function retrieveDependencies(releaseId, self) {
    self.props.handleLoading(true);
    let url = `/dependencies?releaseId=${releaseId}`;
    console.log(url);
    axios.get(TENKAI_API_URL + url).then(response => {
        console.log(response.data.dependencies);
        self.setState({ list: response.data.dependencies });
        self.props.handleLoading(false);
    }).catch(error => {
        self.props.handleLoading(false);
        console.log(error.message);
        self.props.handleNotification("general_fail", "error");
    });
}

function saveDependency(data, self) {

    let uri = "";
    if (self.state.editMode) {
        uri = '/dependencies/edit';
    } else {
        uri = '/dependencies';
    }
    console.log(data);
    axios.post(TENKAI_API_URL + uri, data)
        .then(res => {
            self.setState({ list: [...self.state.list, data] });
        }).catch(error => {
            console.log(error.message);
            self.props.handleNotification("general_fail", "error");
        });

    self.setState(() => ({
        showInsertUpdateForm: false,
        editItem: {},
        editMode: false
    })
    );

}

function deleteDependency(id, self) {
    if (self.state.itemToDelete != undefined) {
        axios.delete(TENKAI_API_URL + "/dependencies/" + id)
            .then(retrieveDependencies(self.state.releaseId, self)).catch(error => {
                console.log(error.message);
                self.props.handleNotification("general_fail", "error");
            });
    }
    self.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
}


function retrieveDependency(chartName, tag, self) {
    axios.post(TENKAI_API_URL + "/analyse", { chartName, tag })
        .then(result => {
            const data = result.data; 
            console.log(result.data);
            self.setState({ list: {...self.state.data, data }});
        }).catch(error => {
            console.log(error.message);

        });
}

export {
    retriveRepo, retrieveCharts, retrieveReleases,
    saveReleases, retrieveDependencies, saveDependency,
    deleteDependency, deleteRelease, retrieveDependency
};
