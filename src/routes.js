import Enviroments from 'views/Environments';
import Deployment from 'views/Deployment';
import Config from 'views/Config';
import Variables from 'views/Variables';
import VariablesWizard from 'views/VariablesWizard';
import Dependencies from 'views/Dependencies';
import DepAnalysis from 'views/DepAnalysis';
import DepGraph from 'views/DepGraph';
import User from 'views/user/User';
import Workload from 'views/Workload';
import BlueGreenWizard from 'views/BlueGreenWizard';
import DockerRepo from 'views/DockerRepo';
import Product from 'views/product/Product';
import GlobalConfig from 'views/GlobalConfig';
import ProductRelease from 'views/productRelease/ProductRelease';
import ProductReleaseService from 'views/productReleaseService/ProductReleaseService';
import VariablesNotUsed from 'views/VariablesNotUsed';
import VariableRule from 'views/variableRule/VariableRule';
import ValueRule from 'views/valueRule/ValueRule';
import CompareEnv from 'views/compareEnv/CompareEnv';
import SecurityOperation from 'views/securityOperation/SecurityOperation';
import Deploy from 'views/deploy/Deploy';

const dashboardRoutes = [
  {
    path: '/deployment',
    name: 'Deployment',
    icon: 'pe-7s-pendrive',
    component: Deployment,
    layout: '/admin',
    menu: true,
    role: 'tenkai-user'
  },
  {
    path: '/workload',
    name: 'Workload',
    icon: 'pe-7s-share',
    component: Workload,
    layout: '/admin',
    menu: true,
    role: 'tenkai-user'
  },
  {
    path: '/product',
    name: 'Product',
    icon: 'pe-7s-box2',
    component: Product,
    layout: '/admin',
    menu: true,
    role: 'tenkai-admin'
  },
  {
    path: '/environments',
    name: 'Environments',
    icon: 'pe-7s-server',
    component: Enviroments,
    layout: '/admin',
    menu: true,
    role: 'tenkai-user'
  },  
  {
    path: '/admin-master',
    name: 'Admin',
    icon: 'pe-7s-news-paper',
    component: null,
    layout: '/admin',
    menu: true,
    role: 'tenkai-admin',
    submenu: [
      {
        path: '/variable-rule',
        name: 'Validation Rules',
        icon: 'pe-7s-check',
        component: VariableRule,
        layout: '/admin',
        menu: true,
        role: 'tenkai-admin'
      },
      {
        path: '/dockerRepo',
        name: 'Docker Repo',
        icon: 'pe-7s-albums',
        component: DockerRepo,
        layout: '/admin',
        menu: true,
        role: 'tenkai-admin'
      },
      {
        path: '/globalConfig',
        name: 'Settings',
        icon: 'pe-7s-settings',
        component: GlobalConfig,
        layout: '/admin',
        menu: true,
        role: 'tenkai-admin'
      }
    ]
  },
  {
    path: '/deployment-wvars',
    name: 'Deployment Variables Review ',
    icon: 'pe-7s-news-paper',
    component: VariablesWizard,
    layout: '/admin',
    menu: false,
    role: 'tenkai-user'
  },
  {
    path: '/deployment-depanalysis',
    name: 'Dependency Analysis',
    icon: 'pepe-7s-news-paper',
    component: DepAnalysis,
    layout: '/admin',
    menu: false,
    role: 'tenkai-user'
  },
  {
    path: '/deployment-depgraph',
    name: 'Dependency Analysis Graph',
    icon: 'pepe-7s-news-paper',
    component: DepGraph,
    layout: '/admin',
    menu: false,
    role: 'tenkai-user'
  },

  {
    path: '/environments-envvars',
    name: 'Variables',
    icon: 'pe-7s-server',
    component: Variables,
    layout: '/admin',
    menu: false,
    role: 'tenkai-user'
  },
  {
    path: '/product-version',
    name: 'Product',
    icon: 'pe-7s-umbrella',
    component: ProductRelease,
    layout: '/admin',
    menu: false,
    role: 'tenkai-admin'
  },
  {
    path: '/product-version-service',
    name: 'Product',
    icon: 'pe-7s-umbrella',
    component: ProductReleaseService,
    layout: '/admin',
    menu: false,
    role: 'tenkai-admin'
  },
  {
    path: '/microservices-deps',
    name: 'Dependencies',
    icon: 'pe-7s-tools',
    component: Dependencies,
    layout: '/admin',
    menu: false,
    role: 'tenkai-admin'
  },
  {
    path: '/blueGreenWizard',
    name: 'Blue Green Wizard',
    icon: 'pe-7s-shuffle',
    component: BlueGreenWizard,
    layout: '/admin',
    menu: false,
    role: 'tenkai-admin'
  },
  {
    path: '/value-rule',
    name: 'Value Rules',
    icon: 'pe-7s-check',
    component: ValueRule,
    layout: '/admin',
    menu: false,
    role: 'tenkai-user'
  },
  {
    path: '/variablesNotUsed',
    name: 'Settings',
    icon: 'pe-7s-config',
    component: VariablesNotUsed,
    layout: '/admin',
    menu: false,
    role: 'tenkai-admin'
  },
  {
    path: '/util-master',
    name: 'Util',
    icon: 'pe-7s-config',
    component: null,
    layout: '/admin',
    menu: true,
    role: 'tenkai-admin',
    submenu: [
      {
        path: '/config',
        name: 'Helm Repo',
        icon: 'pe-7s-helm',
        component: Config,
        layout: '/admin',
        menu: true,
        role: 'tenkai-user'
      },
      {
        path: '/compareEnv',
        name: 'Compare Envs',
        icon: 'pe-7s-way',
        component: CompareEnv,
        layout: '/admin',
        menu: true,
        role: 'tenkai-admin'
      }
    ]
  },
  {
    path: '/security-master',
    name: 'Security',
    icon: 'pe-7s-news-paper',
    component: null,
    layout: '/admin',
    menu: true,
    role: 'tenkai-admin',
    submenu: [
      {
        path: '/admin',
        name: 'User Authorization',
        icon: 'pe-7s-add-user',
        component: User,
        layout: '/admin',
        menu: true,
        role: 'tenkai-admin'
      },
      {
        path: '/security-operation',
        name: 'Security Operations',
        icon: 'pe-7s-note2',
        component: SecurityOperation,
        layout: '/admin',
        menu: true,
        role: 'tenkai-admin'
      }
    ]
  },
  {
    path: '/deploy',
    name: 'Deploy',
    icon: 'pe-7s-news-paper',
    component: Deploy,
    layout: '/admin',
    menu: false,
    role: 'tenkai-user'
  }
];

export default dashboardRoutes;
