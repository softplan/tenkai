import React from "react";
import { Button } from "react-bootstrap";
import cx from "classnames";
import PropTypes from "prop-types";

const CustomButton = ({ fill, simple, pullRight, round, block, ...rest }) => {
  const btnClasses = cx({
    "btn-fill": fill,
    "btn-simple": simple,
    "pull-right": pullRight,
    "btn-block": block,
    "btn-round": round
  });

  return <Button className={btnClasses} {...rest} />;
};

CustomButton.propTypes = {
  fill: PropTypes.bool,
  simple: PropTypes.bool,
  pullRight: PropTypes.bool,
  block: PropTypes.bool,
  round: PropTypes.bool
};

export default CustomButton;
