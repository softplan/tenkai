import Enviroments from "views/Environments";
import Deployment from "views/Deployment";
import Config from "views/Config";
import Variables from "views/Variables";
import VariablesWizard from "views/VariablesWizard";
import Microservices from "views/Microservices";
import Dependencies from "views/Dependencies";
import DepAnalysis from "views/DepAnalysis";
import DepGraph from "views/DepGraph";
import Solution from "views/Solution";
import SolutionChart from "views/SolutionChart";
import DeploySolution from "views/DeploySolution";
import Users from "views/Users";
import Workload from "views/Workload";
import BlueGreenWizard from "views/BlueGreenWizard";
import DockerRepo from "views/DockerRepo";
import Product from "views/Product";
import GlobalConfig from "views/GlobalConfig";
import ProductRelease from "views/ProductReleases";
import ProductReleaseService from "views/ProductReleaseService";
import VariablesNotUsed from "views/VariablesNotUsed";

const dashboardRoutes = [
  {
    path: "/deployment",
    name: "Deployment",
    icon: "pe-7s-news-paper",
    component: Deployment,
    layout: "/admin",
    menu: true,
    role: "tenkai-user"
  },
  {
    path: "/workload",
    name: "Workload",
    icon: "pe-7s-share",
    component: Workload,
    layout: "/admin",
    menu: true,
    role: "tenkai-user"
  },
  {
    path: "/deployment-wvars",
    name: "Deployment Variables Review ",
    icon: "pe-7s-news-paper",
    component: VariablesWizard,
    layout: "/admin",
    menu: false,
    role: "tenkai-user"
  },
  {
    path: "/deployment-depanalysis",
    name: "Dependency Analysis",
    icon: "pepe-7s-news-paper",
    component: DepAnalysis,
    layout: "/admin",
    menu: false,
    role: "tenkai-user"
  },
  {
    path: "/deployment-depgraph",
    name: "Dependency Analysis Graph",
    icon: "pepe-7s-news-paper",
    component: DepGraph,
    layout: "/admin",
    menu: false,
    role: "tenkai-user"
  },
  {
    path: "/environments",
    name: "Environments",
    icon: "pe-7s-server",
    component: Enviroments,
    layout: "/admin",
    menu: true,
    role: "tenkai-user"
  },
  {
    path: "/environments-envvars",
    name: "Variables",
    icon: "pe-7s-server",
    component: Variables,
    layout: "/admin",
    menu: false,
    role: "tenkai-user"
  },
  {
    path: "/config",
    name: "Helm Repo",
    icon: "pe-7s-config",
    component: Config,
    layout: "/admin",
    menu: true,
    role: "tenkai-user"
  },
  {
    path: "/dockerRepo",
    name: "Docker Repo",
    icon: "pe-7s-albums",
    component: DockerRepo,
    layout: "/admin",
    menu: true,
    role: "tenkai-admin"
  },
  {
    path: "/product",
    name: "Product",
    icon: "pe-7s-umbrella",
    component: Product,
    layout: "/admin",
    menu: true,
    role: "tenkai-beta"
  },
  {
    path: "/product-version",
    name: "Product",
    icon: "pe-7s-umbrella",
    component: ProductRelease,
    layout: "/admin",
    menu: false,
    role: "tenkai-user"
  },
  {
    path: "/product-version-service",
    name: "Product",
    icon: "pe-7s-umbrella",
    component: ProductReleaseService,
    layout: "/admin",
    menu: false,
    role: "tenkai-user"
  },
  {
    path: "/solution",
    name: "Solution",
    icon: "pe-7s-umbrella",
    component: Solution,
    layout: "/admin",
    menu: true,
    role: "tenkai-user"
  },
  {
    path: "/solution-deps",
    name: "Solution",
    icon: "pe-7s-umbrella",
    component: SolutionChart,
    layout: "/admin",
    menu: false,
    role: "tenkai-user"
  },
  {
    path: "/solution-deploy",
    name: "Solution",
    icon: "pe-7s-umbrella",
    component: DeploySolution,
    layout: "/admin",
    menu: false,
    role: "tenkai-user"
  },
  {
    path: "/microservices",
    name: "Releases",
    icon: "pe-7s-tools",
    component: Microservices,
    layout: "/admin",
    menu: true,
    role: "tenkai-user"
  },
  {
    path: "/microservices-deps",
    name: "Dependencies",
    icon: "pe-7s-tools",
    component: Dependencies,
    layout: "/admin",
    menu: false,
    role: "tenkai-user"
  },
  {
    path: "/admin",
    name: "Users Permissions",
    icon: "pe-7s-culture",
    component: Users,
    layout: "/admin",
    menu: true,
    role: "tenkai-admin"
  },
  {
    path: "/blueGreenWizard",
    name: "Blue Green Wizard",
    icon: "pe-7s-shuffle",
    component: BlueGreenWizard,
    layout: "/admin",
    menu: false,
    role: "tenkai-admin"
  },
  {
    path: "/globalConfig",
    name: "Settings",
    icon: "pe-7s-settings",
    component: GlobalConfig,
    layout: "/admin",
    menu: true,
    role: "tenkai-admin"
  },
  {
    path: "/variablesNotUsed",
    name: "Settings",
    icon: "pe-7s-settings",
    component: VariablesNotUsed,
    layout: "/admin",
    menu: false,
    role: "tenkai-admin"
  }
];

export default dashboardRoutes;
