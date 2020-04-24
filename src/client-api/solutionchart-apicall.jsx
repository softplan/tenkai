import axios from 'axios';
import { TENKAI_API_URL } from 'env.js';

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
      self.props.handleNotification('general_fail', 'error');
    });
}

export { retrieveSolutionChart };
