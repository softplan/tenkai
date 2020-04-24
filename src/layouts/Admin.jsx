import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Route, Switch } from 'react-router-dom';
import NotificationSystem from 'react-notification-system';

import AdminNavbar from 'components/Navbars/AdminNavbar';
import Footer from 'components/Footer/Footer';
import Sidebar from 'components/Sidebar/Sidebar';

import { style } from 'variables/Variables.jsx';
import routes from 'routes.js';
import image from 'assets/img/sidebar-8.jpg';
import 'assets/css/custom.css';
import Keycloak from 'keycloak-js';
import axios from 'axios';
import { TENKAI_API_URL } from 'env.js';
import NotificationContainer from 'components/Notification/NotificationContainer';
import Spinner from 'components/Spinner/Spinner';
import * as utils from 'utils/sort';
import * as actions from 'stores/master/actions';
import * as selectors from 'stores/master/reducer';


class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingCount: 0,
      keycloak: null,
      authenticated: false,
      loading: false,
      _notificationSystem: null,
      image: image,
      color: 'black',
      hasImage: true,
      fixedClasses: 'dropdown show-dropdown open',
      environmentList: [],
      selectedEnvironment: {},
      selectedChartsToDeploy: []
    };

    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
      this.state.keycloak = keycloak;
      this.state.authenticated = authenticated;
      this.state._notificationSystem = this.refs.notificationSystem;
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${keycloak.token}`;
      this.getEnvironments();
    });
  }

  async getUserRole(environmentId) {
     await this.props.dispatch(actions.loadRole(this.state.keycloak.idTokenParsed.email, environmentId));
  }

  handleEnvironmentChange = selectedEnvironment => {
    this.setState({ selectedEnvironment }, () => {

      window.localStorage.setItem(
        'currentEnvironment',
        JSON.stringify(selectedEnvironment)
      );

      this.props.history.push({
        pathname: '/admin/deployment'
      });
      this.getUserRole(selectedEnvironment.value);
    });
  };

  getEnvironments() {
    axios
      .get(TENKAI_API_URL + '/environments')
      .then(response => {
        var arr = [];
        let sortedEnvs = response.data.Envs.sort((a, b) =>
          utils.sort(a.name, b.name)
        );
        for (var x = 0; x < sortedEnvs.length; x++) {
          var element = sortedEnvs[x];
          arr.push({
            value: element.ID,
            label: element.name,
            productVersion: element.productVersion,
            currentRelease: element.currentRelease
          });
        }
        this.setState({ environmentList: arr }, () => {
          if (arr.length > 0) {
            let localEnvironment = JSON.parse(
              window.localStorage.getItem('currentEnvironment')
            );

            if (localEnvironment !== null) {
              this.setState({ selectedEnvironment: localEnvironment }, () => {
                this.getUserRole(localEnvironment.value);
              });
            } else {
              this.setState({ selectedEnvironment: arr[0] }, () => {
                this.getUserRole(arr[0].value);
              });
            }
          }
        });
      })
      .catch(error => {
        console.log(error);
        if (error.response !== undefined) {
          this.handleNotification('custom', 'error', error.response.data);
        } else {
          this.handleNotification('deployment_fail', 'error');
        }
      });
  }

  handleLoading = value => {
    if (value) {
      this.setState({
        loading: true,
        loadingCount: this.state.loadingCount + 1
      });
    } else {
      let theCount = this.state.loadingCount - 1;
      if (theCount <= 0) {
        this.setState({ loading: false, loadingCount: 0 });
      } else {
        this.setState({ loadingCount: theCount });
      }
    }
    //
  };

  handleNotification = (type, level, message) => {
    switch (type) {
      case 'custom':
        this.state._notificationSystem.addNotification({
          title: <span data-notify="icon" className="pe-7s-gift" />,
          message: <div>{message}</div>,
          level: level,
          position: 'tr',
          autoDismiss: 15
        });
        break;
      case 'deployment_ok':
        this.state._notificationSystem.addNotification({
          title: <span data-notify="icon" className="pe-7s-gift" />,
          message: (
            <div>
              Deployment <b>successful</b>.<br />
              Use "kubectl get [kind]" to check it
            </div>
          ),
          level: level,
          position: 'tr',
          autoDismiss: 15
        });
        break;
      case 'deployment_fail':
        this.state._notificationSystem.addNotification({
          title: <span data-notify="icon" className="pe-7s-gift" />,
          message: (
            <div>
              :( Deployment <b>failed</b>!!!
            </div>
          ),
          level: level,
          position: 'tr',
          autoDismiss: 15
        });
        break;
      case 'fail':
        this.state._notificationSystem.addNotification({
          title: <span data-notify="icon" className="pe-7s-gift" />,
          message: (
            <div>
              :( Something wrong has happend <b>I'm sorry</b>!!!
            </div>
          ),
          level: level,
          position: 'tr',
          autoDismiss: 15
        });
        break;
      case 'general_fail':
        this.state._notificationSystem.addNotification({
          title: <span data-notify="icon" className="pe-7s-gift" />,
          message: (
            <div>
              :( I am sorry,an unexpectect <b>error</b> ocurred!
            </div>
          ),
          level: level,
          position: 'tr',
          autoDismiss: 15
        });
        break;
      default:
        break;
    }
  };

  updateSelectedChartsToDeploy(selectedChartsToDeploy, callback) {
    this.setState({ selectedChartsToDeploy }, () => {
      if (callback !== undefined) {
        callback();
      }
    });
  }

  handleNotificationClick = position => {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = 'success';
        break;
      case 2:
        level = 'warning';
        break;
      case 3:
        level = 'error';
        break;
      case 4:
        level = 'info';
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: <div>Demo Message</div>,
      level: level,
      position: position,
      autoDismiss: 15
    });
  };

  hasEnvironmentPolicy = policy => {
    let result = false;
    if (this.props.master.role !== undefined) {
      if (
        this.props.master.role.policies !== undefined &&
        this.props.master.role.policies.length > 0) {
        for (let x = 0; x < this.props.master.role.policies.length; x++) {
          if (this.props.master.role.policies[x] === policy) {
            result = true;
            break;
          }
        }
      }
    }
    return result;
  };

  getRoutes = routes => {
    return routes.map((prop, key) => {
      let auth = this.state.keycloak.hasRealmRole(prop.role);
      if (prop.layout === '/admin' && auth) {

        if (prop.submenu !== undefined) {
          return prop.submenu.map((prop, key) => {
            return (
              <Route
              path={prop.layout + prop.path}
              render={props => (
                <prop.component
                  {...props}
                  handleClick={this.handleNotificationClick}
                  handleNotification={this.handleNotification}
                  handleLoading={this.handleLoading}
                  keycloak={this.state.keycloak}
                  hasEnvironmentPolicy={this.hasEnvironmentPolicy.bind(this)}
                  environments={this.state.environmentList}
                  selectedEnvironment={this.state.selectedEnvironment}
                  selectedChartsToDeploy={this.state.selectedChartsToDeploy}
                  updateSelectedChartsToDeploy={this.updateSelectedChartsToDeploy.bind(
                    this
                  )}
                />
              )}
              key={key}
            />
            );
          });

        } else {
          return (
            <Route
              path={prop.layout + prop.path}
              render={props => (
                <prop.component
                  {...props}
                  handleClick={this.handleNotificationClick}
                  handleNotification={this.handleNotification}
                  handleLoading={this.handleLoading}
                  keycloak={this.state.keycloak}
                  hasEnvironmentPolicy={this.hasEnvironmentPolicy.bind(this)}
                  environments={this.state.environmentList}
                  selectedEnvironment={this.state.selectedEnvironment}
                  selectedChartsToDeploy={this.state.selectedChartsToDeploy}
                  updateSelectedChartsToDeploy={this.updateSelectedChartsToDeploy.bind(
                    this
                  )}
                />
              )}
              key={key}
            />
          );
        }

      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return 'Brand';
  };
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleHasImage = hasImage => {
    this.setState({ hasImage: hasImage });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === 'dropdown') {
      this.setState({ fixedClasses: 'dropdown show-dropdown open' });
    } else {
      this.setState({ fixedClasses: 'dropdown' });
    }
  };

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf('nav-open') !== -1
    ) {
      document.documentElement.classList.toggle('nav-open');
    }
    if (e.history.action === 'PUSH') {
      //console.log('aqui PUSH');
      //document.documentElement.scrollTop = 0;
      //document.scrollingElement.scrollTop = 0;
      //this.refs.mainPanel.scrollTop = 0;
    }
  }
  render() {
    let loadingDiv;
    if (this.state.loading) {
      loadingDiv = <div className="loading"></div>;
    } else {
      loadingDiv = <div></div>;
    }

    if (this.state.keycloak) {
      if (this.state.authenticated)
        {return (
          <div className="wrapper">
            <NotificationSystem ref="notificationSystem" style={style} />
            <NotificationContainer />

            <Sidebar
              {...this.props}
              routes={routes}
              image={this.state.image}
              color={this.state.color}
              hasImage={this.state.hasImage}
              keycloak={this.state.keycloak}
            />

            <div id="main-panel" className="main-panel" ref="mainPanel">
              {loadingDiv}
              <Spinner />
              <AdminNavbar
                {...this.props}
                brandText={this.getBrandText(this.props.location.pathname)}
                keycloak={this.state.keycloak}
                history={this.props.history}
                environments={this.state.environmentList}
                selectedEnvironment={this.state.selectedEnvironment}
                handleEnvironmentChange={this.handleEnvironmentChange.bind(
                  this
                )}
              />
              <Switch>{this.getRoutes(routes)}</Switch>
              <Footer />
            </div>
          </div>
        );}
      else {return <div>Unable to authenticate!</div>;}
    }
    return (
      <div>
        <NotificationSystem ref="notificationSystem" style={style} />
        <NotificationContainer />
        Initializing Keycloak...
      </div>
    );
  }
}

//export default Admin;

const mapStateToProps = state => ({
  master: selectors.getState(state)
});

export default connect(mapStateToProps)(Admin);
