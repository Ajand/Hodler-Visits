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

const WANNA_CONSUME = gql`
  mutation wannaConsume($stager: ID!) {
    wannaConsume(stager: $stager)
  }
`;

const JOIN_STAGE = gql`
  mutation joinStage {
    joinStage
  }
`;

const EventPlayer = ({ userStream, me, ev }) => {
  const [device, setDevice] = useState(null);
  const [deviceLoaded, setDeviceLoaded] = useState(false);
  const [consumers, setConsumers] = useState(new Map());

  const [startSession] = useMutation(START_SESSION);
  const [getRTPCap] = useMutation(GET_RTP_CAP);
  const [connectSendTransport] = useMutation(CONNECT_SEND_TRANSPORT);
  const [produce] = useMutation(PRODUCE);
  const [joinStage] = useMutation(JOIN_STAGE);

  const [wannaConsume] = useMutation(WANNA_CONSUME);

  useEffect(() => {
    const dev = new mediasoupClient.Device();
    setDevice(dev);

    getRTPCap()
      .then(({ data }) => JSON.parse(data.getRTPCap))
      .then((routerRtpCapabilities) => {
        // create a device
        return dev.load({ routerRtpCapabilities });
        // load
        // device can produce
      })
      .then((dev) => {
        setDeviceLoaded(true);
      })
      .catch((err) => console.log(err));
  }, []);
  //
  //  console.log(device);
  //

  const meetingStatus = useQuery(MEETING_STATUS);
  const changeSubscription = useSubscription(CHANGE_STATUS);

  useEffect(() => {
    if (device?.loaded && meetingStatus.data?.meetingStatus == "started") {
      console.log(ev.stagers, "From consuming system");
      ev.stagers.filter((stager) => stager != me._id).forEach((stager) => {
        // Check whether the consumer Exist
        if (![...consumers.keys()].includes(stager)) {
          console.log("Lets add the stager: ", stager);
          wannaConsume({ variables: { stager: stager } })
            .then((res) => console.log(`Wanna Consume result`, res))
            .catch((err) => console.log(err));
        } else {
          console.log("Stager already exists: ", stager);
        }
        // If not try to make it exist
        // -> In the process listen for changes
        // -> Mute Video, Audio - flip
      });
      // First Let's Create An API TO send these to Server
      /* ;*/
    }
  }, [device, deviceLoaded, meetingStatus, ev.stagers]);

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
            joinStage()
              .then(async ({ data }) => {
                const transportOptions = JSON.parse(
                  JSON.parse(data.joinStage).transportParams
                );

                const sendTransport =
                  device.createSendTransport(transportOptions);

                sendTransport.on("connect", (params, callback, errback) => {
                  console.log("transport connected: ", transportOptions.id);
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
        <Button onClick={() => startSession().then((msg) => console.log(msg))}>
          Start Session
        </Button>
      ) : (
        <div>Device is loaded</div>
      )}

      {/* <MediaActions />*/}
    </div>
  );
};

export default EventPlayer;
