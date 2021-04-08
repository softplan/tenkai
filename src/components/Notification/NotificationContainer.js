import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Notifications, {
  success,
  error,
  warning,
  info,
  removeAll
} from 'react-notification-system-redux';
import * as messages from 'components/Notification/defaultMessages';

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleRemoveAll = this.handleRemoveAll.bind(this);
  }

  dispatchNotification(fn, timeout) {
    setTimeout(() => {
      fn(messages.successOpts);
    }, timeout);
  }

  handleClick() {
    const {
      success: successFn,
      error: errorFn,
      warning: warningFn,
      info: infoFn
    } = this.props;

    this.dispatchNotification(successFn, 3);
    this.dispatchNotification(errorFn, 60);
    this.dispatchNotification(warningFn, 30);
    this.dispatchNotification(infoFn, 3);
  }

  handleRemoveAll() {
    this.props.removeAll();
  }

  render() {
    const { notifications } = this.props;

    return (
      <div>
        <Notifications notifications={notifications} />
      </div>
    );
  }
}

NotificationContainer.propTypes = {
  error: PropTypes.func.isRequired,
  info: PropTypes.func.isRequired,
  notifications: PropTypes.array,
  removeAll: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired,
  warning: PropTypes.func.isRequired
};

export default connect(state => ({ notifications: state.notifications }), {
  success,
  error,
  warning,
  info,
  removeAll
})(NotificationContainer);
