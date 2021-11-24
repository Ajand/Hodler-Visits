/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";

import EventList from "../components/EventList";

const EventManager = () => {
  const history = useHistory();
  return (
    <div
      css={css`
        margin-top: 2em;
        padding: 2em;
      `}
    >
      <Button
        color="primary"
        variant="contained"
        onClick={() => history.push("/create-event")}
        css={css`
            margin-bottom: 2em;
        `}
      >
        Create New Event
      </Button>
      <EventList />
    </div>
  );
};

export default EventManager;
