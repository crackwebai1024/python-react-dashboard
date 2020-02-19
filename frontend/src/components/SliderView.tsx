import React from "react";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";

function SliderView({
  selectedSalary,
  setSelectedSalary,
  handleSliderChange
}: any) {
  const valuetext = (value: any) => {
    return `$ ${parseInt(value).toLocaleString("en-US")}`;
  };

  function ValueLabelComponent(props: any) {
    const { children, open, value } = props;

    return (
      <Tooltip
        open={open}
        enterTouchDelay={0}
        placement="bottom"
        title={"$" + value.toLocaleString()}
      >
        {children}
      </Tooltip>
    );
  }

  ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired
  };

  return (
    <div
      style={{
        backgroundColor: "#f3f3f3",
        borderRadius: 25,
        margin: 25,
        padding: 25
      }}
    >
      <h4 style={{ textAlign: "center" }}>
        What do people making ${selectedSalary.toLocaleString()} spend in a
        week?
      </h4>
      <Slider
        ValueLabelComponent={ValueLabelComponent}
        value={selectedSalary}
        onChange={handleSliderChange}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-always"
        step={10000}
        defaultValue={50000}
        max={250000}
        // marks={marks}
        valueLabelDisplay="on"
      />
    </div>
  );
}

export default SliderView;
