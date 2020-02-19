import React from "react";
import ReactMinimalPieChart from "react-minimal-pie-chart";
import usePlaid from "../hooks/usePlaid";

function ChartHeader(props: any) {
  const { getCategories, chartData } = usePlaid();

  React.useEffect(() => {
    getCategories();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignSelf: "center",
        justifyContent: "center"
      }}
    >
      <ReactMinimalPieChart
        animate
        animationDuration={500}
        animationEasing="ease-out"
        style={{}}
        cx={50}
        cy={50}
        data={chartData}
        // @ts-ignore
        label={({ data, dataIndex }) => data[dataIndex].title}
        labelPosition={110}
        // labelPosition={112}
        labelStyle={{
          padding: 10,
          fontFamily: "sans-serif",
          fontSize: "5px",
          fill: "#121212"
        }}
        // lengthAngle={360}
        lineWidth={50}
        onClick={undefined}
        onMouseOut={undefined}
        onMouseOver={undefined}
        paddingAngle={0}
        radius={40}
        rounded
        startAngle={0}
        viewBoxSize={[200, 200]}
      />
    </div>
  );
}

export default ChartHeader;
