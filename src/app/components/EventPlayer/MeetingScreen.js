/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { gql, useMutation } from "@apollo/client";

import Sidebar from "./Sidebar";

import useUserMedia from "./useUserMedia";

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
  const videoRef = useRef(null);
  const videoRef2 = useRef(null);

  const constraints = {
    video: true,
    audio: false,
  };

  const onError = (e) => alert(e);

  const userStream = useUserMedia(constraints, onError);

  useEffect(() => {
    console.log(userStream);
    if (userStream) {
      videoRef.current.srcObject = userStream;
      videoRef2.current.srcObject = userStream;
    }
  }, [userStream]);

  const [connectToEvent] = useMutation(CONNECT_TO_EVENT);
  const [disconnectFromEvent] = useMutation(DISCONNECT_FROM_EVENT);

  useEffect(() => {
    connectToEvent();

    return () => disconnectFromEvent();
  }, []);

  return (
    <Grid
      container
      spacing={0}
      css={css`
        padding: 1em 1em;
      `}
    >
      <Grid item md={6} lg={9}>
        <Grid container spacing={4} css={css`align-items: center`}>
          <Grid item lg={6}>
            <video
              css={css`
                width: 100%;
                border-radius: 1em;
                border: 1px solid #f2a52b;
              `}
              autoPlay
              ref={videoRef}
            />
          </Grid>
          <Grid item lg={6}>
          <video
              css={css`
                width: 100%;
                border-radius: 1em;
                border: 1px solid #f2a52b;
              `}
              autoPlay
              ref={videoRef2}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={6} lg={3}>
        <Sidebar ev={ev} me={me} />
      </Grid>
    </Grid>
  );
};

export default MeetingScreen;
