import axios from "axios";
import TENKAI_API_URL from "env.js";

function retrieveSolutionChart(id, self, cb) {
  let url = `/solutionCharts?solutionId=${id}`;
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

function saveSolutionChart(data, self) {
  let uri = "";
  if (self.state.editMode) {
    uri = "/solutionCharts/edit";
  } else {
    uri = "/solutionCharts";
  }

  axios
    .post(TENKAI_API_URL + uri, data)
    .then(res => {
      retrieveSolutionChart(self.state.solutionId, self);
    })
    .catch(error => {
      console.log(error.message);
      self.props.handleNotification("general_fail", "error");
    });

  self.setState(() => ({
    showInsertUpdateForm: false,
    editItem: {},
    editMode: false
  }));
}

function deleteSolutionChart(id, self) {
  if (self.state.itemToDelete !== undefined) {
    axios
      .delete(TENKAI_API_URL + "/solutionCharts/" + id)
      .then(retrieveSolutionChart(self.state.solutionId, self))
      .catch(error => {
        console.log(error.message);
        self.props.handleNotification("general_fail", "error");
      });
  }
  self.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
}

export { retrieveSolutionChart, saveSolutionChart, deleteSolutionChart };
