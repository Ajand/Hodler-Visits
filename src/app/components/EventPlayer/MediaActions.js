/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { useRef, useEffect, useState } from "react";
import { css, useTheme } from "@emotion/react";
import Typography from "@mui/material/Typography";
import { IconButton, Button, Icon, Avatar } from "@mui/material";
import {
  VolumeUp,
  VolumeOff,
  ArrowUpward,
  ArrowDownward,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";

import useUserMedia from "./useUserMedia";

const MediaActions = ({
  user,
  userStream,
  speaker = false,
  onStage = false,
  videoOn = false,
  voiceOn = false,
  leaveStage = () => {},
}) => {
  const theme = useTheme();

  const [minimize, setMinimize] = useState(false);

  const videoRef = useRef(null);

  const constraints = {
    video: true,
    audio: false,
  };

  const onError = (e) => alert(e);

  // const userStream = useUserMedia(constraints, onError);

  useEffect(() => {
    if (userStream && videoRef.current) {
      videoRef.current.srcObject = userStream;
    }
  }, [userStream]);


  return (
    <>
      <div
        css={(theme) => css`
          position: absolute;
          width: 25%;
          bottom: 42px;
          right: 25px;
          padding: 4px;
          background: ${theme.palette.primary.main};
          z-index: 50;
          border-radius: 4px 4px 0 0;
          display: ${minimize && "none"};
        `}
      >
        {userStream &&
        userStream.getTracks().find((track) => track.kind === "video") ? (
          <div>
            <video
              ref={videoRef}
              autoPlay
              css={css`
                width: 100%;
                height: 100%;
                border-radius: 4px 4px 0 0;
              `}
              muted
            />
          </div>
        ) : (
          <div
            css={css`
              height: 200px;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <Avatar
              css={css`
                height: 150px;
                width: 150px;
              `}
              src={
                user.avatar
                  ? `${process.env.REACT_APP_FILE_URL}/${user.avatar}`
                  : "/badger.png"
              }
            />
          </div>
        )}
      </div>
      <div
        css={css`
          display: flex;
          background: ${theme.palette.primary.main};
          position: absolute;
          bottom: 0px;
          width: 100%;
          right: 0;
          justify-content: space-between;
          padding: 0.25em;
          z-index: 100;
        `}
      >
        <div>
          {onStage ? (
            <Button color="error">Leave Stage</Button>
          ) : speaker ? (
            <Button color="error">Raise Hand</Button>
          ) : (
            <Button color="error">Join Stage</Button>
          )}
        </div>
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 1em;
          `}
        >
          {onStage ? (
            <div>
              <IconButton
                css={css`
                  margin-right: 0.2em;
                `}
                color="secondary"
              >
                {!videoOn ? <Videocam /> : <VideocamOff />}
              </IconButton>
              <IconButton
                css={css`
                  margin-right: 0.2em;
                `}
                color="secondary"
              >
                {voiceOn ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
              <IconButton
                onClick={() => setMinimize(!minimize)}
                color="secondary"
              >
                {minimize ? <ArrowUpward /> : <ArrowDownward />}
              </IconButton>
            </div>
          ) : (
            <Typography
              css={css`
                color: #121212;
              `}
              variant="body1"
            >
              {speaker
                ? "You're a speaker, feel free to join the stage"
                : "Raise your hand to join the stage."}
            </Typography>
          )}
        </div>
      </div>
    </>
  );
};

export default MediaActions;
