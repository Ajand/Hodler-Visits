/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";

import EventList from "../components/EventList";
import JsSIP from 'jssip'

const EventManager = () => {
  const socket = new JsSIP.WebSocketInterface(process.env.REACT_APP_WS_ADDRESS)
  var configuration = {
    sockets  : [ socket ],
    uri      : 'sip:alice@example.com',
    password : 'superpassword'
  };

  var ua = new JsSIP.UA(configuration);


  ua.on('connected', function(e){ /* Your code here */ });

  ua.on('disconnected', function(e){ /* Your code here */ });
  
  ua.on('registered', function(e){ /* Your code here */ });

  ua.start();

  var eventHandlers = {
    'progress': function(e) {
      console.log('call is in progress');
    },
    'failed': function(e) {
      console.log('call failed with cause: '+ e.data.cause);
    },
    'ended': function(e) {
      console.log('call ended with cause: '+ e.data.cause);
    },
    'confirmed': function(e) {
      console.log('call confirmed');
    }
  };

  var options = {
    'eventHandlers'    : eventHandlers,
    'mediaConstraints' : { 'audio': true, 'video': true }
  };
  

  var session = ua.call('sip:bob@example.com', options);


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
