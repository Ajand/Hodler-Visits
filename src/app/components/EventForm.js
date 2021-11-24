/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";
import DateAdapter from "@mui/lab/AdapterMoment";
import moment from "moment";

import { useMutation, gql } from "@apollo/client";

const steps = ["Configure Event", "Configure POAP"];

const CREATE_EVENT = gql`
  mutation createEvent(
    $topic: String!
    $objectives: String!
    $startDate: String!
    $endDate: String!
    $isGated: Boolean
    $poaps: [String]
  ) {
    createEvent(
      topic: $topic
      objectives: $objectives
      startDate: $startDate
      endDate: $endDate
      isGated: $isGated
      poaps: $poaps
    ) {
      _id
    }
  }
`;

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);

  const [topic, setTopic] = useState("");
  const [objectives, setObjectives] = useState("");
  const [isGated, setIsGated] = useState(false);
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [poaps, setPoaps] = useState("");

  const [createEvent] = useMutation(CREATE_EVENT);

  const parseLinks = () => {
    if (!poaps) return [];
    return poaps.split(" ");
  };

  const renderProperForm = () => {
    if (activeStep === 0) {
      return (
        <Grid container spacing={0}>
          <Grid
            css={css`
              margin-bottom: 1em;
            `}
            item
            md={8}
          >
            <TextField
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              label="Event Topic"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid
            css={css`
              margin-bottom: 1em;
            `}
            item
            md={4}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              <Typography
                css={css`
                  display: inline-block;
                  margin-right: 1em;
                  text-align: center;
                `}
                variant="body2"
              >
                Is Gated?
              </Typography>
              <Checkbox
                checked={isGated}
                onChange={() => setIsGated(!isGated)}
                defaultChecked
                color="primary"
              />
            </div>
          </Grid>
          <Grid
            css={css`
              margin-bottom: 1em;
            `}
            item
            md={12}
          >
            <TextField
              label="Event Objectives"
              multiline
              variant="filled"
              fullWidth
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
            />
          </Grid>
          <Grid
            css={css`
              margin-bottom: 1em;
            `}
            item
            md={8}
          >
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                label="Event Date"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField variant="filled" fullWidth {...params} />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid
            css={css`
              margin-bottom: 1em;
              padding-left: 1em;
            `}
            item
            md={2}
          >
            <LocalizationProvider dateAdapter={DateAdapter}>
              <TimePicker
                label="From"
                value={startTime}
                onChange={(newValue) => {
                  setStartTime(newValue);
                }}
                renderInput={(params) => (
                  <TextField variant="filled" fullWidth {...params} />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid
            css={css`
              margin-bottom: 1em;
              padding-left: 1em;
            `}
            item
            md={2}
          >
            <LocalizationProvider dateAdapter={DateAdapter}>
              <TimePicker
                label="Till"
                value={endTime}
                onChange={(newValue) => {
                  setEndTime(newValue);
                }}
                renderInput={(params) => (
                  <TextField variant="filled" fullWidth {...params} />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container spacing={0}>
        <Grid
          css={css`
            margin-bottom: 1em;
            padding-left: 0.5em;
          `}
          item
          md={12}
        >
          <TextField
            label="POAP Links"
            value={poaps}
            onChange={(e) => setPoaps(e.target.value)}
            variant="filled"
            fullWidth
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ width: "80%" }}>
      <Paper
        css={css`
          padding: 2em;
        `}
      >
        <Stepper
          css={css`
            margin-bottom: 1em;
          `}
          activeStep={activeStep}
        >
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Divider
          css={css`
            margin-bottom: 1em;
          `}
        />
        {renderProperForm()}
        <Divider
          css={css`
            margin-bottom: 1em;
          `}
        />
        <div
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <Button
            onClick={() => setActiveStep(0)}
            disabled={activeStep === 0}
            variant="text"
            color="primary"
          >
            Back
          </Button>
          <div
            css={css`
              display: inline-block;
            `}
          >
            <Button
              disabled={
                activeStep === 1 ||
                !topic ||
                !objectives ||
                !date ||
                !startTime ||
                !endTime
              }
              css={css`
                margin-right: 1em;
              `}
              variant="text"
              color="primary"
              onClick={() => setActiveStep(1)}
            >
              Next
            </Button>
            <Button
              disabled={activeStep === 0 || parseLinks().length == 0}
              variant="contained"
              color="primary"
              onClick={() => {
                const input = {
                  topic,
                  objectives,
                  startDate: moment(
                    `${moment(date).format("YYYY:MM:DD")} ${moment(
                      startTime
                    ).format("hh:mm")}`,
                    "YYYY:MM:DD hh:mm"
                  ).toISOString(),
                  endDate: moment(
                    `${moment(date).format("YYYY:MM:DD")} ${moment(
                      endTime
                    ).format("hh:mm")}`,
                    "YYYY:MM:DD hh:mm"
                  ).toISOString(),
                  poaps: parseLinks(),
                };

                createEvent({ variables: { ...input } })
                  .then((event) => console.log(event))
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Paper>
    </Box>
  );
}
