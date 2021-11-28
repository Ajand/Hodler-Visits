/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { gql, useMutation } from "@apollo/client";

import Sidebar from "./Sidebar";
import EventPlayer from ".";
import MediaActions from "./MediaActions";

import useUserMedia from "./useUserMedia";

import Conference from "./Conference";

const CONNECT_TO_EVENT = gql`
  mutation connectToEvent {
    connectToEvent
  }
`;
const DISCONNECT_FROM_EVENT = gql`
  mutation disconnectFromEvent {
    disconnectFromEvent
  }
`;

const MeetingScreen = ({ ev, me }) => {
  const constraints = {
    video: false,
    audio: true,
  };

  const onError = (e) => console.log(e);

  const userStream = useUserMedia(constraints, onError);

  const [connectToEvent] = useMutation(CONNECT_TO_EVENT);
  const [disconnectFromEvent] = useMutation(DISCONNECT_FROM_EVENT);

  useEffect(() => {
    connectToEvent();

    return () => disconnectFromEvent();
  }, []);

  const conference = null;

  return (
    <Grid
      container
      spacing={0}
      css={css`
        padding: 1em 1em;
      `}
    >
      <Grid item md={6} lg={9}>
        <Grid
          container
          spacing={4}
          css={css`
            align-items: center;
            padding: 2em;
          `}
        >
          {userStream && <EventPlayer userStream={userStream} />}
        </Grid>
      </Grid>
      <Grid item md={6} lg={3}>
        <Sidebar ev={ev} me={me} />
      </Grid>
      <MediaActions
        speaker={false}
        onStage={true}
        videoOn={true}
        voiceOn={true}
        userStream={userStream}
        user={me}
      />
    </Grid>
  );
};

export default MeetingScreen;
