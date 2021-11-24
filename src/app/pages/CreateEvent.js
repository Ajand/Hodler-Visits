/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";

import EventForm from "../components/EventForm";

const CreateEvent = () => {
  return (
    <div>
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: 2em;
        `}
      >
        <EventForm />
      </div>
    </div>
  );
};

export default CreateEvent;
