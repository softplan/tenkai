import axios from "axios";
import TENKAI_API_URL from "env.js";

function retrieveProductVersions(id, self, cb) {
  let url = `/productVersions?productId=${id}`;
  axios
    .get(TENKAI_API_URL + url)
    .then(response => {
      let list = [];
      list = response.data.list;
      self.setState({ list: list });
      if (cb !== undefined) {
        cb(self);
      }
    })
    .catch(error => {
      console.log(error.message);
      self.props.handleNotification("general_fail", "error");
    });
}

function retrieveProductVersionServices(id, self, cb) {
  let url = `/productVersionServices?productVersionId=${id}`;
  axios
    .get(TENKAI_API_URL + url)
    .then(response => {
      let list = [];
      list = response.data.list;
      self.setState({ list: list });
      if (cb !== undefined) {
        cb(self);
      }
    })
    .catch(error => {
      console.log(error.message);
      self.props.handleNotification("general_fail", "error");
    });
}

function saveProductRelease(data, self, callback) {
  let uri = "";
  if (self.state.editMode) {
    uri = "/productVersions/edit";
  } else {
    uri = "/productVersions";
  }

  axios
    .post(TENKAI_API_URL + uri, data)
    .then(res => {
      if (callback !== undefined) {
        callback(self);
      }
    })
    .catch(error => {
      console.log(error.message);
      self.props.handleNotification("general_fail", "error");
    });
}

function saveProductVersionService(data, self, callback) {
  let uri = "";
  if (self.state.editMode) {
    uri = "/productVersionServices/edit";
  } else {
    uri = "/productVersionServices";
  }

  axios
    .post(TENKAI_API_URL + uri, data)
    .then(res => {
      if (callback !== undefined) {
        callback(self);
      }
    })
    .catch(error => {
      console.log(error.message);
      self.props.handleNotification("general_fail", "error");
    });
}

export {
  saveProductRelease,
  retrieveProductVersions,
  saveProductVersionService,
  retrieveProductVersionServices
};
