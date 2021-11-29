/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

import EventCard from "../components/EventCard";
import MeetingScreen from "../components/EventPlayer/MeetingScreen";

import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { useParams } from "react-router-dom";

import Loading from "../components/Loading";

const EVENT = gql`
  query event($id: ID!) {
    event(id: $id) {
      topic
      objectives
      startDate
      endDate
      isGated
      status
      _id
      stagers
      onlineUsers {
        displayName
        _id
        username
        avatar
      }
      poll {
        eventId
        onlyHodler
        body
        options
        weights {
          isWeighted
          want1
          want2
          want3
        }
        votes {
          voter
          weight
          option
        }
      }
    }
  }
`;

const CHANGE_EVENT_STATUS = gql`
  mutation changeEventStatus($eventId: ID!, $status: String!) {
    changeEventStatus(eventId: $eventId, status: $status)
  }
`;

const EVENT_STATUS_CHANGED = gql`
  subscription eventStatusChanged {
    eventStatusChanged
  }
`;

const EventDetails = ({ me }) => {
  const { id } = useParams();

  const [inMeeting, setInMeeting] = useState(true);

  const eventStatusChanged = useSubscription(EVENT_STATUS_CHANGED);
  const [changeEventStatus] = useMutation(CHANGE_EVENT_STATUS);

  const { data, loading, refetch } = useQuery(EVENT, {
    variables: { id },
  });

  useEffect(() => {
    refetch();
    console.log(data?.event?.stagers)
  }, [eventStatusChanged.data, refetch]);

  if (loading)
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 7em);
        `}
      >
        <Loading />
      </div>
    );

  // Need something to show infos
  // Something to control the event

  if (inMeeting) return <MeetingScreen ev={data.event} me={me} />;

  const renderController = () => {
    if (me.role === "MODERATOR" && data.event.status === "WAITING")
      return (
        <Paper
          css={css`
            padding: 2em;
            margin: 1em;
          `}
        >
          <Typography variant="body2">
            You are the moderator and meeting has not been started yet. Do you
            want to start the meeting?
          </Typography>
          <Button
            css={css`
              margin-top: 1em;
            `}
            variant="contained"
            color="primary"
            onClick={() => {
              changeEventStatus({
                variables: {
                  eventId: id,
                  status: "STARTED",
                },
              })
                .then(() => {
                  // GO TO MEETING PAGE
                  //refetch()
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Start The Meeting
          </Button>
        </Paper>
      );

    if (data.event.status === "WAITING") {
      return (
        <Paper
          css={css`
            padding: 2em;
            margin: 1em;
          `}
        >
          <Typography variant="body2">
            Event Has not been started yet.
          </Typography>
        </Paper>
      );
    }

    if (data.event.status === "WAITING") {
      return (
        <Paper
          css={css`
            padding: 2em;
            margin: 1em;
          `}
        >
          <Typography variant="body2">
            Event Has not been started yet.
          </Typography>
        </Paper>
      );
    }

    if (data.event.status === "STARTED") {
      return (
        <Paper
          css={css`
            padding: 2em;
            margin: 1em;
          `}
        >
          <Typography variant="body2">
            Meeting is running. Wanna join the event?
          </Typography>
          <Button
            css={css`
              margin-top: 1em;
            `}
            variant="contained"
            color="primary"
            onClick={() => {
              setInMeeting(true);
            }}
          >
            Join The Meeting
          </Button>
        </Paper>
      );
    }

    if (data.event.status === "FINISHED") {
      return (
        <Paper
          css={css`
            padding: 2em;
            margin: 1em;
          `}
        >
          <Typography variant="body2">Event Has been finished.</Typography>
        </Paper>
      );
    }
  };

  return (
    <div>
      <Grid
        container
        spacing={0}
        css={css`
          padding: 1em 1em;
        `}
      >
        <Grid item md={6} lg={4}>
          <EventCard item={data.event} />
        </Grid>
        <Grid item md={6} lg={4}>
          {renderController()}
        </Grid>
      </Grid>

      {/*<EventPlayer />*/}
    </div>
  );
};

export default EventDetails;
