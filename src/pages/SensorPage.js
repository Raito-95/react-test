/* global Accelerometer, GravitySensor, Gyroscope, AbsoluteOrientationSensor */
import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useTheme,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const getColors = (mode) => ({
  x: mode === "dark" ? "#8884d8" : "#0000ff",
  y: mode === "dark" ? "#82ca9d" : "#008000",
  z: mode === "dark" ? "#ffc658" : "#ffcc00",
  w: mode === "dark" ? "#f54242" : "#ff0000",
  pitch: mode === "dark" ? "#8884d8" : "#0000ff",
  roll: mode === "dark" ? "#82ca9d" : "#008000",
  yaw: mode === "dark" ? "#ffc658" : "#ffcc00",
  compass: mode === "dark" ? "#8884d8" : "#0000ff",
});

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
      return { ...currentData, [sensorType]: dataToDisplay };
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
        const inclinometerData = { pitch: beta, roll: gamma, yaw: alpha };
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
        const orientation = new AbsoluteOrientationSensor({ frequency: 60 });
        orientation.addEventListener("reading", () => {
          const [x, y, z, w] = orientation.quaternion;
          const orientationData = { x, y, z, w };
          updateMaxMin("orientation", orientationData);
          addToChartData("orientation", orientationData);
        });
        orientation.start();
        sensorsCleanup.push(() => orientation.stop());
      } catch (err) {
        setError(
          "AbsoluteOrientationSensor not supported or permission denied"
        );
      }
    }

    return () => sensorsCleanup.forEach((cleanup) => cleanup());
  }, [updateMaxMin, addToChartData]);

  return { sensorData, chartData, error };
};

const SensorChart = ({ data, colors }) => (
  <Box sx={{ height: 250 }}>
    <ResponsiveContainer width="100%" height="100%">
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
              strokeWidth={3}
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

const HeaderSection = ({ error }) => (
  <Grid item xs={12}>
    <Card sx={{ height: 450 }}>
      <CardContent>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

const SensorSection = ({ sensorData, chartData }) => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  return (
    <>
      {Object.entries(sensorData).map(([sensorType, { data, max, min }]) => (
        <Grid item xs={12} md={6} lg={4} key={sensorType}>
          <Card sx={{ height: 500, mb: 4 }}>
            <Box sx={{ height: 200, overflow: "auto", p: 2 }}>
              <Typography variant="h5" component="h2">
                {sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}
              </Typography>
              {Object.entries(data)
                .filter(([_, value]) => value !== null && value !== undefined)
                .map(([key, value]) => (
                  <Typography key={key} style={{ color: colors[key] }}>
                    {`${key.toUpperCase()}: ${value.toFixed(4)} (Max: ${max[
                      key
                    ]?.toFixed(4)}, Min: ${min[key]?.toFixed(4)})`}
                  </Typography>
                ))}
            </Box>
            <SensorChart data={chartData[sensorType]} colors={colors} />
          </Card>
        </Grid>
      ))}
    </>
  );
};

const SensorPage = () => {
  const { sensorData, chartData, error } = useSensors();

  return (
    <Grid container spacing={4} sx={{ py: 4, px: 2 }}>
      {error ? (
        <HeaderSection error={error} />
      ) : (
        <SensorSection sensorData={sensorData} chartData={chartData} />
      )}
    </Grid>
  );
};

export default SensorPage;
