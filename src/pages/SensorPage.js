/* global Accelerometer, GravitySensor, Gyroscope, AbsoluteOrientationSensor */
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const colors = {
  x: "#8884d8",
  y: "#82ca9d",
  z: "#ffc658",
  w: "#f54242",
  pitch: "#8884d8",
  roll: "#82ca9d",
  yaw: "#ffc658",
};

const useSensors = () => {
  const [sensorData, setSensorData] = useState({
    accelerometer: { data: {}, max: {}, min: {} },
    gravity: { data: {}, max: {}, min: {} },
    gyroscope: { data: {}, max: {}, min: {} },
    inclinometer: { data: {}, max: {}, min: {} },
    orientation: { data: {}, max: {}, min: {} },
  });
  const [chartData, setChartData] = useState({
    accelerometer: [],
    gravity: [],
    gyroscope: [],
    inclinometer: [],
    orientation: [],
  });

  const updateMaxMin = (sensorType, newData) => {
    const updated = { ...sensorData[sensorType] };
    Object.keys(newData).forEach((key) => {
      updated.max[key] = Math.max(
        sensorData[sensorType].max[key] || -Infinity,
        newData[key]
      );
      updated.min[key] = Math.min(
        sensorData[sensorType].min[key] || Infinity,
        newData[key]
      );
    });
    updated.data = newData;
    setSensorData((prevData) => ({ ...prevData, [sensorType]: updated }));
  };

  const addToChartData = (sensorType, newData) => {
    setChartData((currentData) => {
      const newDataPoint = { ...newData, timestamp: new Date().getTime() };
      const updatedData = [...currentData[sensorType], newDataPoint];
      return {
        ...currentData,
        [sensorType]:
          updatedData.length > 100 ? updatedData.slice(-100) : updatedData,
      };
    });
  };

  useEffect(() => {
    const sensorsCleanup = [];

    const handleOrientationEvent = (event) => {
      const { alpha, beta, gamma } = event; // alpha: yaw, beta: pitch, gamma: roll
      const data = {
        pitch: beta,
        roll: gamma,
        yaw: alpha,
      };
      updateMaxMin("inclinometer", data);
      addToChartData("inclinometer", data);
    };

    window.addEventListener("deviceorientation", handleOrientationEvent);
    sensorsCleanup.push(() =>
      window.removeEventListener("deviceorientation", handleOrientationEvent)
    );

    if ("Accelerometer" in window) {
      const accelerometer = new Accelerometer({ frequency: 60 });
      accelerometer.addEventListener("reading", () => {
        const data = {
          x: accelerometer.x / 9.8,
          y: accelerometer.y / 9.8,
          z: accelerometer.z / 9.8,
        };
        updateMaxMin("accelerometer", data);
        addToChartData("accelerometer", data);
      });
      accelerometer.start();
      sensorsCleanup.push(() => accelerometer.stop());
    }

    if ("GravitySensor" in window) {
      const gravitySensor = new GravitySensor({ frequency: 60 });
      gravitySensor.addEventListener("reading", () => {
        const data = {
          x: gravitySensor.x / 9.8,
          y: gravitySensor.y / 9.8,
          z: gravitySensor.z / 9.8,
        };
        updateMaxMin("gravity", data);
        addToChartData("gravity", data);
      });
      gravitySensor.start();
      sensorsCleanup.push(() => gravitySensor.stop());
    }

    if ("Gyroscope" in window) {
      const gyroscope = new Gyroscope({ frequency: 60 });
      gyroscope.addEventListener("reading", () => {
        const data = {
          x: gyroscope.x,
          y: gyroscope.y,
          z: gyroscope.z,
        };
        updateMaxMin("gyroscope", data);
        addToChartData("gyroscope", data);
      });
      gyroscope.start();
      sensorsCleanup.push(() => gyroscope.stop());
    }

    if ("AbsoluteOrientationSensor" in window) {
      const orientationSensor = new AbsoluteOrientationSensor({
        frequency: 60,
      });
      orientationSensor.addEventListener("reading", () => {
        const [x, y, z, w] = orientationSensor.quaternion;
        const data = { x, y, z, w };
        updateMaxMin("orientation", data);
        addToChartData("orientation", data);
      });
      orientationSensor.start();
      sensorsCleanup.push(() => orientationSensor.stop());
    }

    return () => sensorsCleanup.forEach((cleanup) => cleanup());
  }, []);

  return { sensorData, chartData };
};

const SensorChart = ({ data, colors }) => {
  return (
    <LineChart width={400} height={200} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" hide={true} />
      <YAxis />
      <Tooltip />
      {Object.keys(data[0] || {})
        .filter((key) => key !== "timestamp")
        .map((axis) => (
          <Line
            key={axis}
            type="monotone"
            dataKey={axis}
            stroke={colors[axis]}
          />
        ))}
    </LineChart>
  );
};

const SensorPage = () => {
  const { sensorData, chartData } = useSensors();

  return (
    <Grid container spacing={2} style={{ padding: 20 }}>
      {Object.entries(sensorData).map(([sensorType, { data, max, min }]) => (
        <Grid item xs={12} md={6} lg={4} key={sensorType}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                {sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}
              </Typography>
              {Object.entries(data).map(([key, value]) => (
                <Typography key={key} style={{ color: colors[key] }}>
                  {`${key.toUpperCase()}: ${value.toFixed(4)} (Max: ${max[
                    key
                  ].toFixed(4)}, Min: ${min[key].toFixed(4)})`}
                </Typography>
              ))}
              {chartData[sensorType].length > 0 && (
                <SensorChart
                  data={chartData[sensorType]}
                  sensorType={sensorType}
                  colors={colors}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SensorPage;
