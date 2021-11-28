/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect } from "react";
import  { Button } from '@mui/material'

import useMeetingHandler from "../../../lib/MeetingHandler";

const Conference = ({ conference, me, refetch, ev }) => {
  const handler = useMeetingHandler(me.username);


  return (
    <div
      css={css`
        padding: 2em;
      `}
    >
      <Button onClick={() => handler.StartMeeting(ev._id)}>Start Conference</Button>
    </div>
  );
};

export default Conference;
