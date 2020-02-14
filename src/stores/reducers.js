import dependency from './dependency/reducer';
import product from './product/reducer';
import productRelease from './productRelease/reducer';
import productReleaseService from './productReleaseService/reducer';
import solution from './solution/reducer';
import solutionChart from './solutionChart/reducer';
import user from './user/reducer';
import environment from './environment/reducer';
import valueRule from './valueRule/reducer';
import variableRule from './variableRule/reducer';
import simpleDeploy from './simpleDeploy/reducer';
import spinner from './spinner/reducer';
import { reducer as notifications } from 'react-notification-system-redux';
import compareEnv from './compareEnv/reducer';
import securityOperation from './securityOperation/reducer';
import master from './master/reducer';

export {
  notifications,
  dependency,
  product,
  productRelease,
  productReleaseService,
  solution,
  solutionChart,
  user,
  environment,
  valueRule,
  variableRule,
  simpleDeploy,
  spinner,
  compareEnv,
  securityOperation,
  master
};
