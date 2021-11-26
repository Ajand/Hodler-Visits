/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

import {
  StartMeeting,
  JoinMeeting,
  ExitMeeting,
  JoinStage,
  LeaveStage,
  RaiseHand,
  ToggleMedia,
} from "../lib/MeetingHandler";

const TestLib = () => {
  return <div>
      <Button onClick={() => StartMeeting('123')}>Create Meeting</Button>
      <Button onClick={() => JoinMeeting('123')}>Join Meeting</Button>
      <Button onClick={() => ExitMeeting('123')}>Exit Meeting</Button>
      <Button onClick={() => JoinStage('123')}>Join Stage</Button>
      <Button onClick={() => LeaveStage('123')}>Leave Stage</Button>
      <Button onClick={() => RaiseHand('123')}>Raise Hand</Button>
      <Button onClick={() => ToggleMedia('123')}>ToggleMedia</Button>
  </div>;
};

export default TestLib;
