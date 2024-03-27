import React, { useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

/* global Accelerometer, GravitySensor, Gyroscope, AbsoluteOrientationSensor */

const SensorPage = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const erudaScript = document.createElement("script");
      erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda";
      document.body.appendChild(erudaScript);
      erudaScript.onload = () => window.eruda.init();
    }

    const sensorData = {
      accelerometer: {
        max: { x: -Infinity, y: -Infinity, z: -Infinity },
        min: { x: Infinity, y: Infinity, z: Infinity },
      },
      gravity: {
        max: { x: -Infinity, y: -Infinity, z: -Infinity },
        min: { x: Infinity, y: Infinity, z: Infinity },
      },
      gyroscope: {
        max: { x: -Infinity, y: -Infinity, z: -Infinity },
        min: { x: Infinity, y: Infinity, z: Infinity },
      },
      orientation: {
        max: { x: -Infinity, y: -Infinity, z: -Infinity, w: -Infinity },
        min: { x: Infinity, y: Infinity, z: Infinity, w: Infinity },
      },
      inclinometer: {
        max: { pitch: -Infinity, roll: -Infinity, yaw: -Infinity },
        min: { pitch: Infinity, roll: Infinity, yaw: Infinity },
      },
      compass: { max: -Infinity, min: Infinity },
    };

    const updateMaxMin = (sensorType, data) => {
      Object.keys(data).forEach((key) => {
        sensorData[sensorType].max[key] = Math.max(
          sensorData[sensorType].max[key],
          data[key]
        );
        sensorData[sensorType].min[key] = Math.min(
          sensorData[sensorType].min[key],
          data[key]
        );
      });
    };

    const displayData = (elementId, data, unit = "") => {
      const displayText = Object.keys(data)
        .map(
          (key) =>
            `${key.toUpperCase()}: ${data[key].toFixed(
              2
            )}${unit} (Max: ${sensorData[elementId].max[key].toFixed(
              2
            )}${unit}, Min: ${sensorData[elementId].min[key].toFixed(
              2
            )}${unit})`
        )
        .join("<br>");
      document.getElementById(elementId).innerHTML = displayText;
    };

    const sensorsCleanup = [];

    if ("Accelerometer" in window) {
      const accelerometer = new Accelerometer({ frequency: 60 });
      accelerometer.addEventListener("reading", () => {
        const data = {
          x: accelerometer.x / 9.8,
          y: accelerometer.y / 9.8,
          z: accelerometer.z / 9.8,
        };
        updateMaxMin("accelerometer", data);
        displayData("accelerometer", data, " g");
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
        displayData("gravity", data, " g");
      });
      gravitySensor.start();
      sensorsCleanup.push(() => gravitySensor.stop());
    }

    if ("Gyroscope" in window) {
      const gyroscope = new Gyroscope({ frequency: 60 });
      gyroscope.addEventListener("reading", () => {
        const data = { x: gyroscope.x, y: gyroscope.y, z: gyroscope.z };
        updateMaxMin("gyroscope", data);
        displayData("gyroscope", data, " °/s");
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
        displayData("orientation", data);

        const norm = Math.sqrt(x * x + y * y + z * z + w * w);
        const nx = x / norm;
        const ny = y / norm;
        const nz = z / norm;
        const nw = w / norm;

        let pitch = Math.asin(2 * (nw * nx - ny * nz));
        let roll = Math.atan2(2 * (nw * ny + nz * nx), 1 - 2 * (nx * nx + ny * ny));
        let yaw = Math.atan2(2 * (nw * nz + nx * ny), 1 - 2 * (ny * ny + nz * nz));
        pitch = pitch * (180 / Math.PI);
        roll = roll * (180 / Math.PI);
        yaw = yaw * (180 / Math.PI);

        const inclinometerData = { pitch, roll, yaw };

        updateMaxMin("inclinometer", inclinometerData);
        displayData("inclinometer", inclinometerData, "°");
      });
      orientationSensor.start();
      sensorsCleanup.push(() => orientationSensor.stop());
    }

    return () => {
      // Cleanup all sensor listeners when the component unmounts
      sensorsCleanup.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <Grid container spacing={2} style={{ padding: 20 }}>
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Accelerometer
            </Typography>
            <Typography component="p" id="accelerometer">
              Waiting for data...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Gravity Sensor
            </Typography>
            <Typography component="p" id="gravity">
              Waiting for data...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Gyroscope
            </Typography>
            <Typography component="p" id="gyroscope">
              Waiting for data...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Orientation
            </Typography>
            <Typography component="p" id="orientation">
              Waiting for data...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Inclinometer
            </Typography>
            <Typography component="p" id="inclinometer">
              Waiting for data...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SensorPage;
