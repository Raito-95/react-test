/* global Accelerometer, GravitySensor, Gyroscope, AbsoluteOrientationSensor */
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  ResponsiveContainer,
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
  compass: "#8884d8",
};

const useSensors = () => {
  const [sensorData, setSensorData] = useState({
    accelerometer: { data: {}, max: {}, min: {} },
    gravity: { data: {}, max: {}, min: {} },
    compass: { data: {}, max: {}, min: {} },
    gyroscope: { data: {}, max: {}, min: {} },
    inclinometer: { data: {}, max: {}, min: {} },
    orientation: { data: {}, max: {}, min: {} },
  });
  const [chartData, setChartData] = useState({
    accelerometer: [],
    gravity: [],
    compass: [],
    gyroscope: [],
    inclinometer: [],
    orientation: [],
  });
  const [error, setError] = useState(null);

  const updateMaxMin = useCallback((sensorType, newData) => {
    setSensorData((prevData) => {
      const updated = { ...prevData[sensorType] };
      Object.keys(newData).forEach((key) => {
        updated.max[key] = Math.max(
          prevData[sensorType].max[key] || -Infinity,
          newData[key]
        );
        updated.min[key] = Math.min(
          prevData[sensorType].min[key] || Infinity,
          newData[key]
        );
      });
      updated.data = newData;
      return { ...prevData, [sensorType]: updated };
    });
  }, []);

  const addToChartData = useCallback((sensorType, newData) => {
    setChartData((currentData) => {
      const newDataPoint = { ...newData, timestamp: new Date().getTime() };
      const updatedData = [...currentData[sensorType], newDataPoint];
      const maxLength = 100;
      const dataToDisplay =
        updatedData.length > maxLength
          ? updatedData.slice(-maxLength)
          : updatedData;

      return {
        ...currentData,
        [sensorType]: dataToDisplay,
      };
    });
  }, []);

  useEffect(() => {
    const sensorsCleanup = [];

    const handleOrientationEvent = (event) => {
      const { alpha, beta, gamma } = event;
      if (
        typeof alpha === "number" &&
        typeof beta === "number" &&
        typeof gamma === "number"
      ) {
        const compass = 360 - alpha;
        const inclinometerData = {
          pitch: beta,
          roll: gamma,
          yaw: alpha,
        };
        const compassData = { compass };

        updateMaxMin("inclinometer", inclinometerData);
        addToChartData("inclinometer", inclinometerData);
        updateMaxMin("compass", compassData);
        addToChartData("compass", compassData);
      }
    };

    window.addEventListener("deviceorientation", handleOrientationEvent);
    sensorsCleanup.push(() =>
      window.removeEventListener("deviceorientation", handleOrientationEvent)
    );

    if ("Accelerometer" in window) {
      try {
        const accelerometer = new Accelerometer({ frequency: 60 });
        accelerometer.addEventListener("reading", () => {
          const accelerometerData = {
            x: accelerometer.x / 9.8,
            y: accelerometer.y / 9.8,
            z: accelerometer.z / 9.8,
          };
          updateMaxMin("accelerometer", accelerometerData);
          addToChartData("accelerometer", accelerometerData);
        });
        accelerometer.start();
        sensorsCleanup.push(() => accelerometer.stop());
      } catch (err) {
        setError("Accelerometer not supported or permission denied");
      }
    }

    if ("GravitySensor" in window) {
      try {
        const gravity = new GravitySensor({ frequency: 60 });
        gravity.addEventListener("reading", () => {
          const gravityData = {
            x: gravity.x / 9.8,
            y: gravity.y / 9.8,
            z: gravity.z / 9.8,
          };
          updateMaxMin("gravity", gravityData);
          addToChartData("gravity", gravityData);
        });
        gravity.start();
        sensorsCleanup.push(() => gravity.stop());
      } catch (err) {
        setError("GravitySensor not supported or permission denied");
      }
    }

    if ("Gyroscope" in window) {
      try {
        const gyroscope = new Gyroscope({ frequency: 60 });
        gyroscope.addEventListener("reading", () => {
          const gyroscopeData = {
            x: gyroscope.x,
            y: gyroscope.y,
            z: gyroscope.z,
          };
          updateMaxMin("gyroscope", gyroscopeData);
          addToChartData("gyroscope", gyroscopeData);
        });
        gyroscope.start();
        sensorsCleanup.push(() => gyroscope.stop());
      } catch (err) {
        setError("Gyroscope not supported or permission denied");
      }
    }

    if ("AbsoluteOrientationSensor" in window) {
      try {
        const orientation = new AbsoluteOrientationSensor({
          frequency: 60,
        });
        orientation.addEventListener("reading", () => {
          const [x, y, z, w] = orientation.quaternion;
          const orientationData = { x, y, z, w };
          updateMaxMin("orientation", orientationData);
          addToChartData("orientation", orientationData);
        });
        orientation.start();
        sensorsCleanup.push(() => orientation.stop());
      } catch (err) {
        setError("AbsoluteOrientationSensor not supported or permission denied");
      }
    }

    return () => sensorsCleanup.forEach((cleanup) => cleanup());
  }, [updateMaxMin, addToChartData]);

  return { sensorData, chartData, error };
};

const SensorChart = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" hide={true} />
        <YAxis />
        <Tooltip transitionDuration={0} />
        {Object.keys(data[0] || {})
          .filter((key) => key !== "timestamp")
          .map((axis) => (
            <Line
              key={axis}
              type="monotone"
              dataKey={axis}
              stroke={colors[axis]}
              isAnimationActive={false}
              dot={false}
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

const SensorPage = () => {
  const { sensorData, chartData, error } = useSensors();

  return (
    <Grid container spacing={2} style={{ padding: 20 }}>
      {error ? (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : (
        Object.entries(sensorData).map(([sensorType, { data, max, min }]) => (
          <Grid item xs={12} md={6} lg={4} key={sensorType}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}
                </Typography>
                {Object.entries(data)
                  .filter(([key, value]) => value !== null && value !== undefined)
                  .map(([key, value]) => (
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
        ))
      )}
    </Grid>
  );
};

export default SensorPage;
