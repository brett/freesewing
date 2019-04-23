import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  sliderStep,
  roundMm,
  roundMmUp,
  roundMmDown,
  formatMm
} from "../utils";
import FormFieldSlider from "../FormFieldSlider";
import OptionPreamble from "../OptionPreamble";

const PatternOptionMillimeter = props => {
  const [value, setValue] = useState(props.dflt);
  const [previousValue, setPreviousValue] = useState(props.dflt);

  const update = (name, newValue, evt) => {
    newValue = roundMm(newValue, props.units);
    // Sometimes, when sliding, the rapid succession of updates
    // causes a weird timing issue to result in a value that is NaN.
    // If that's the case, just ignore this update and keep the
    // previous one instead
    if (!isNaN(newValue)) {
      setValue(newValue);
      if (evt.type !== "mousemove") props.updateValue(props.name, newValue);
    } else {
      if (evt.type !== "mousemove") props.updateValue(props.name, value);
    }
  };

  const reset = () => {
    setValue(props.dflt);
    props.updateValue(props.name, props.dflt);
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    left: {
      flexGrow: 1,
      margin: "0 0.5rem"
    },
    right: { margin: "0 0.5rem" }
  };

  return (
    <div className="pattern-option millimeter">
      <OptionPreamble
        dflt={props.dflt}
        value={value}
        desc={props.desc}
        title={props.title}
        id={"po-mm-" + props.name}
        displayValue={formatMm(value, props.units)}
        reset={reset}
        showHelp={() =>
          props.triggerAction("showHelp", {
            type: "patternOption",
            value: props.name
          })
        }
      />
      <FormFieldSlider
        name={props.name}
        value={value}
        min={roundMmUp(props.min, props.units)}
        max={roundMmDown(props.max, props.units)}
        step={sliderStep[props.units]}
        onChange={update}
        label={"po-mm-" + props.name}
        updateValue={update}
      />
    </div>
  );
};

PatternOptionMillimeter.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  updateValue: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  dflt: PropTypes.number.isRequired,
  title: PropTypes.node.isRequired,
  desc: PropTypes.node.isRequired,
  units: PropTypes.oneOf(["metric", "imperial"]).isRequired
};

PatternOptionMillimeter.defaultProps = {
  min: 0,
  max: 100,
  title: false,
  desc: false
};

export default PatternOptionMillimeter;
