/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { gql, useSubscription, useMutation, useQuery } from "@apollo/client";

import * as mediasoupClient from "mediasoup-client";
import useUserMedia from "./useUserMedia";

import Loading from "../Loading";

import MediaActions from "./MediaActions";
import Sidebar from "./Sidebar";

const MEETING_STATUS = gql`
  query meetingStatus {
    meetingStatus
  }
`;

const CHANGE_STATUS = gql`
  subscription changeStatus {
    changeStatus
  }
`;

const START_SESSION = gql`
  mutation startSession {
    startSession
  }
`;

const GET_RTP_CAP = gql`
  mutation getRTPCap {
    getRTPCap
  }
`;

const CREATE_SEND_TRANSPORT = gql`
  mutation createSendTransport {
    createSendTransport
  }
`;

const CONNECT_SEND_TRANSPORT = gql`
  mutation connectSendTransport($transportId: String!, $params: String!) {
    connectSendTransport(transportId: $transportId, params: $params)
  }
`;

const PRODUCE = gql`
  mutation produce($transportId: String!, $params: String!) {
    produce(transportId: $transportId, params: $params)
  }
`;

const EventPlayer = ({ userStream }) => {
  const [device, setDevice] = useState(null);
  const [deviceLoaded, setDeviceLoaded] = useState(false);

  const [startSession] = useMutation(START_SESSION);
  const [getRTPCap] = useMutation(GET_RTP_CAP);
  const [createSendTransport] = useMutation(CREATE_SEND_TRANSPORT);
  const [connectSendTransport] = useMutation(CONNECT_SEND_TRANSPORT);
  const [produce] = useMutation(PRODUCE);

  useEffect(() => {
    setDevice(new mediasoupClient.Device());
  }, []);
  //
  //  console.log(device);
  //
  const meetingStatus = useQuery(MEETING_STATUS);
  const changeSubscription = useSubscription(CHANGE_STATUS);

  useEffect(() => {
    meetingStatus.refetch();
  }, [changeSubscription.data]);

  if (meetingStatus.loading)
    return (
      <div
        css={css`
          height: 100vh;
        `}
      >
        <Loading />
      </div>
    );

  if (deviceLoaded)
    return (
      <div>
        <Button
          onClick={() => {
            createSendTransport()
              .then(async ({ data }) => {
                //  console.log(data.createSendTransport)

                console.log(JSON.parse(data.createSendTransport));

                const transportOptions = JSON.parse(
                  JSON.parse(data.createSendTransport).transportParams
                );

                console.log(transportOptions)

                const sendTransport =
                  device.createSendTransport(transportOptions);

                sendTransport.on("connect", (params, callback, errback) => {
                  console.log(
                    "transport connected: ",
                    transportOptions.id
                  );
                  connectSendTransport({
                    variables: {
                      transportId: transportOptions.id,
                      params: JSON.stringify(params),
                    },
                  })
                    .then((r) => {
                      callback();
                    })
                    .catch((err) => errback());
                });

                sendTransport.on("produce", (params, callback, errback) => {
                  console.log("transport produce: ", params, {
                    transportId: transportOptions.id,
                    params: JSON.stringify(params),
                  });

                  produce({
                    variables: {
                      transportId: transportOptions.id,
                      params: JSON.stringify(params),
                    },
                  })
                    .then(({ data }) => {
                      callback({ id: data.produce });
                    })
                    .catch((err) => errback());
                });

                const audioTrack = userStream.getAudioTracks()[0];
                const videoTrack = userStream.getVideoTracks()[0];

                sendTransport
                  .produce({
                    track: audioTrack,
                  })
                  .then((prod) => console.log(prod))
                  .catch((err) => console.log(err));

                sendTransport
                  .produce({
                    track: videoTrack,
                    encodings: [
                      { maxBitrate: 100000 },
                      { maxBitrate: 300000 },
                      { maxBitrate: 900000 },
                    ],
                    codecOptions: {
                      videoGoogleStartBitrate: 1000,
                    },
                  })
                  .then((prod) => console.log(prod))
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          }}
        >
          CREATE SEND TRANSPORT
        </Button>
      </div>
    );

  return (
    <div>
      {meetingStatus.data.meetingStatus === "offline" ? (
        <Button
          onClick={() =>
            startSession()
              .then((msg) => getRTPCap())
              .then(({ data }) => JSON.parse(data.getRTPCap))
              .then((routerRtpCapabilities) => {
                console.log(routerRtpCapabilities);
                // create a device
                return device.load({ routerRtpCapabilities });
                // load
                // device can produce
              })
              .then((dev) => {
                setDeviceLoaded(true);
              })
              .catch((err) => console.log(err))
          }
        >
          Start Session
        </Button>
      ) : (
        <Button
          onClick={() =>
            getRTPCap()
              .then(({ data }) => JSON.parse(data.getRTPCap))
              .then((routerRtpCapabilities) => {
                console.log(routerRtpCapabilities);
                // create a device
                return device.load({ routerRtpCapabilities });
                // load
                // device can produce
              })
              .then((dev) => {
                setDeviceLoaded(true);
              })
              .catch((err) => console.log(err))
          }
        >
          Join Session
        </Button>
      )}

      {/* <MediaActions />*/}
    </div>
  );
};

export default EventPlayer;
