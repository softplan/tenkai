/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from 'assets/img/ninja.png';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      submenu: new Map()
    };
  }

  setColapsed = value => {
    let submenu = this.state.submenu;
    for (let [k] of submenu) {
      if (k !== value) {
        submenu.set(k, false);
      }
    }
    if (submenu.get(value) === undefined) {
      submenu.set(value, true);
    } else {
      submenu.set(value, !submenu.get(value));
    }
    this.setState({ submenu: submenu });
  };

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  render() {
    const sidebarBackground = {
      backgroundImage: 'url(' + this.props.image + ')'
    };
    return (
      <div
        id="sidebar"
        className="sidebar"
        data-color={this.props.color}
        data-image={this.props.image}
      >
        {this.props.hasImage ? (
          <div className="sidebar-background" style={sidebarBackground} />
        ) : null}
        <div className="logo">
          <a href="# " className="simple-text logo-mini">
            <div className="logo-img">
              <img src={logo} alt="logo_image" />
            </div>
          </a>
          <a href="# " className="simple-text logo-normal">
            Tenkai
          </a>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            {this.props.routes.map((prop, key) => {
              if (
                !prop.redirect &&
                prop.menu &&
                this.props.keycloak.hasRealmRole(prop.role)
              ) {
                if (!!prop.submenu && this.props.keycloak.hasRealmRole(prop.role)) {
                  const valuex = this.state.submenu.get(prop.path);

                  const subitems = prop.submenu.map((submenu, key) => {
                    if (this.props.keycloak.hasRealmRole(submenu.role)) {
                      return (
                        <li
                          key={key}
                          className={this.activeRoute(
                            submenu.layout + submenu.path
                          )}
                        >
                          <NavLink
                            to={submenu.layout + submenu.path}
                            className="nav-link"
                            activeClassName="active"
                          >
                            <i className={submenu.icon} />
                            <p>{submenu.name}</p>
                          </NavLink>
                        </li>
                      );
                    }
                    return ""
                  });

                  return (
                    <li key={key}>
                      <a
                        className="nav-link "
                        onClick={event => {
                          event.preventDefault();
                          this.setColapsed(prop.path);
                        }}
                        href="# "
                      >
                        <i className={prop.icon} />
                        <p>
                          {prop.name}
                          <i
                            className={
                              !valuex ? 'fa fa-caret-down' : 'fa fa-caret-up'
                            }
                          ></i>
                        </p>
                      </a>
                      <ul className={!valuex ? 'collapse' : ''}>{subitems}</ul>
                    </li>
                  );
                } else {
                  return (
                    <li
                      className={this.activeRoute(prop.layout + prop.path)}
                      key={key}
                    >
                      <NavLink
                        to={prop.layout + prop.path}
                        className="nav-link"
                        activeClassName="active"
                      >
                        <i className={prop.icon} />
                        <p>{prop.name}</p>
                      </NavLink>
                    </li>
                  );
                }
              }

              return null;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
