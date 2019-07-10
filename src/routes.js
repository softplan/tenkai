import Enviroments from "views/Environments";
import Deployment from "views/Deployment";
import Config from "views/Config";
import Variables from "views/Variables";
import VariablesWizard from "views/VariablesWizard";
import Microservices from "views/Microservices";
import Dependencies from "views/Dependencies";

/*
import Dashboard from "views/Dashboard";
*/

const dashboardRoutes = [
  {
    path: "/microservices",
    name: "Releases",
    icon: "pe-7s-tools",
    component: Microservices,
    layout: "/admin",
    menu: true
  },
  {
    path: "/microservices-deps",
    name: "Dependencies",
    icon: "pe-7s-tools",
    component: Dependencies,
    layout: "/admin",
    menu: false
  },
  {
    path: "/environments",
    name: "Environments",
    icon: "pe-7s-server",
    component: Enviroments,
    layout: "/admin",
    menu: true
  },
  {
    path: "/environments-envvars",
    name: "Variables",
    icon: "pe-7s-server",
    component: Variables,
    layout: "/admin",
    menu: false
  },
  {
    path: "/deployment",
    name: "Deployment",
    icon: "pe-7s-news-paper",
    component: Deployment,
    layout: "/admin",
    menu: true
  },
  {
    path: "/deployment-wvars",
    name: "Deployment Variables Review ",
    icon: "pe-7s-news-paper",
    component: VariablesWizard,
    layout: "/admin",
    menu: false
  },
  {
    path: "/config",
    name: "Helm Repo",
    icon: "pe-7s-config",
    component: Config,
    layout: "/admin",
    menu: true
  }
  
];

/*
const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin",
    menu: true
  },
  {
    path: "/microservices",
    name: "Microservices",
    icon: "pe-7s-tools",
    component: Microservices,
    layout: "/admin",
    menu: true
  },
  {
    path: "/microservices-deps",
    name: "Dependencies",
    icon: "pe-7s-tools",
    component: Dependencies,
    layout: "/admin",
    menu: false
  },

  {
    path: "/environments",
    name: "Environments",
    icon: "pe-7s-server",
    component: Enviroments,
    layout: "/admin",
    menu: true
  },
  {
    path: "/environments-envvars",
    name: "Variables",
    icon: "pe-7s-server",
    component: Variables,
    layout: "/admin",
    menu: false
  },
  {
    path: "/deployment",
    name: "Deployment",
    icon: "pe-7s-news-paper",
    component: Deployment,
    layout: "/admin",
    menu: true
  },
  {
    path: "/deployment-wvars",
    name: "Deployment Variables Review ",
    icon: "pe-7s-news-paper",
    component: VariablesWizard,
    layout: "/admin",
    menu: false
  },
  {
    path: "/management",
    name: "Management",
    icon: "pe-7s-science",
    component: Management,
    layout: "/admin",
    menu: true
  },
  {
    path: "/config",
    name: "Config",
    icon: "pe-7s-config",
    component: Config,
    layout: "/admin",
    menu: true
  }
  
];
*/

export default dashboardRoutes;
