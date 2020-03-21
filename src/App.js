import React, { useCallback, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import "./styles_chart.css";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  Crosshair
} from "react-vis";

import { IconTemperature, IconHumidity, IconPhoto, IconTime } from "./Icons";

import "./App.css";

function App() {
  return (
    <Router>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Topbar />
        <Box display="flex" justifyContent="flex-start" mb={5}>
          <Box p={1}>
            <Link to="/">Résumé</Link>
          </Box>
          <Box p={1}>
            <Link to="/stats">Statistiques détaillées</Link>
          </Box>
          <Box p={1}>
            <Link to="/calendar">Calendrier</Link>
          </Box>
          <Box p={1}>
            <Link to="/gallery">Gallerie</Link>
          </Box>
        </Box>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <OverviewPage />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
}

function Topbar() {
  return (
    <Box display="flex" justifyContent="flex-start">
      <h1>Monitoring</h1>
    </Box>
  );
}

const useStylesForOverviewGrid = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: "800px"
  },
  card: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

function OverviewPage() {
  const classes = useStylesForOverviewGrid();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Summary date="Aujourd'hui" />
        </Grid>
        <Grid item xs={6}>
          <Summary date="19/03" minimal={true} />
        </Grid>
        <Grid item xs={6}>
          <Summary date="18/03" minimal={true} />
        </Grid>
        <Grid item xs={12}>
          <Graph
            title="Semaine 3"
            caption="évolution de l'humidité et de la température en fonction du temps"
          />
        </Grid>
      </Grid>
    </div>
  );
}

function Graph({ title, caption }) {
  const dateFormat = {
    // weekday: "long",
    month: "long",
    day: "numeric"
  };

  // const generateRandomTemperatures = days =>
  //  generateData(days, () => 20 + Math.floor(Math.random() * 15));

  const [closestPoint, setClosestPoint] = React.useState(null);
  const [chartData, setChartData] = React.useState([]);

  const hoverGraph = useCallback((val, info) => {
    setClosestPoint(val);
  }, []);

  const mouseoutGraph = useCallback(() => {
    setClosestPoint(null);
  }, []);

  const generateData = useCallback((days, randomFn) => {
    const today = Date.now();
    const timestampDates = [];

    for (let k = 0; k < days; k++) {
      timestampDates.unshift(today - 86400000 * k);
    }

    const realDates = timestampDates.reduce((acc, value) => {
      return [...acc, new Date(value)];
    }, []);

    const data = [];

    for (let date of realDates) {
      data.push({
        x: date,
        y: randomFn()
      });
    }

    return data;
  }, []);

  const generateRandomHumidity = useCallback(
    days => generateData(days, () => 30 + Math.floor(Math.random() * 70)),
    [generateData]
  );

  useEffect(() => {
    setChartData(generateRandomHumidity(30));
  }, [generateRandomHumidity]);

  return (
    <Paper>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        style={{
          position: "absolute",
          transform: "translateY(-75%)",
          marginLeft: "20px"
        }}
      >
        {title}
      </Button>
      <XYPlot
        xType="time"
        height={300}
        width={700}
        animation={true}
        onMouseLeave={mouseoutGraph}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis title="Temps" tickTotal={6} />
        <YAxis title="Humidité (%)" />
        <LineSeries data={chartData} onNearestXY={hoverGraph} color="teal" />

        {closestPoint ? (
          <Crosshair values={[closestPoint]}>
            <div
              style={{ background: "black", padding: "10px", width: "100px" }}
            >
              <h3 style={{ textAlign: "center" }}>
                {new Date(closestPoint.x).toLocaleDateString(
                  "fr-FR",
                  dateFormat
                )}
              </h3>
              <p>
                {<IconHumidity solid={true} />} humidité: {closestPoint.y}%
              </p>
            </div>
          </Crosshair>
        ) : null}
      </XYPlot>

      <Box p={2} pb={4} textAlign="center">
        <Typography>{caption}</Typography>
      </Box>
    </Paper>
  );
}

function Summary({ minimal, date }) {
  const scale = minimal ? 0.8 : 1;

  return (
    <Paper style={{ transform: "scale(" + scale + ")" }}>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        style={{
          position: "absolute",
          transform: "translateY(-75%)",
          marginLeft: "20px"
        }}
      >
        {date}
      </Button>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        p={1}
        m={1}
      >
        <SummaryStat
          icon={<IconTemperature />}
          value="30.4°C"
          caption="min: 23°C max: 33°C"
        />
        <SummaryStat
          icon={<IconHumidity />}
          value="68.7%"
          caption="min: 54% max: 73%"
        />
        {minimal ? null : (
          <SummaryStat icon={<IconTime />} value="10h28" caption="20/03/2020" />
        )}
        {minimal ? null : (
          <SummaryStat
            icon={<IconPhoto />}
            value="23"
            caption="photos prises"
          />
        )}
      </Box>
    </Paper>
  );
}

function SummaryStat({ icon, value, caption }) {
  return (
    <Box p={1} m={1} display="flex" flexDirection="column" alignItems="center">
      <Box>
        <Typography variant="h2">{icon}</Typography>
      </Box>
      <Box p={2}>
        <Typography variant="h4">{value}</Typography>
      </Box>
      <Box>
        <small>{caption}</small>
      </Box>
    </Box>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default App;
