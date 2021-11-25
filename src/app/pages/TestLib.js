/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

import {
  CreateRoom,
  JoinRoom,
  ExitRoom,
  JoinStage,
  LeaveStage,
  RaiseHand,
  TurnOffAudio,
  TurnOnAudio,
  TurnOffVideo,
  TurnOnVideo,
} from "../lib/MeetingHandler";

const TestLib = () => {
  return <div>
      <Button onClick={() => CreateRoom()}>Create Room</Button>
  </div>;
};

export default TestLib;
