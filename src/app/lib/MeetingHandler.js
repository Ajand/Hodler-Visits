import protooClient from "protoo-client";
import { useEffect, useState } from "react";

/**
 * Room Data Structure
 * 
    {
        name: "meetingName",
        createdAt: Date,
        creator: Peer,
        Audiences: [Username],
        Stagers: []
    }

 */

export default (username) => {
  const [connected, setConnected] = useState(false);

  const transport = new protooClient.WebSocketTransport(
    `${process.env.REACT_APP_PROTOO}/?username=${username}`
  );

  const peer = new protooClient.Peer(transport);


  peer.on("open", () => {
    console.log('connection opened')
  });

  peer.on("connected", () => {
    console.log("connected");
  });

  peer.on("failed", () => {
    setConnected(false);
  });

  peer.on("disconnected", () => {
    setConnected(false);
  });

  peer.on("close", () => {
    setConnected(false);
  });

  peer.on("notification", (notif) => {
    console.log("peer has notification", notif);
  });

  peer.on("request", () => {
    console.log("peer has request");
  });

  const StartMeeting = (meetingId) => {
    // Will Create A meeting,
    // Only Moderators could do it
    //  Will notify Others that the meeting is created
    peer
      .request("startMeeting", { meetingId })
      .then((d) => {
        console.log(d, "create meeting response");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const JoinMeeting = (meetingId) => {
    // Will join to a meeting that is created
    // If the meeting does not exist will throw an error
    peer
      .request("joinMeeting", { meetingId })
      .then((d) => {
        console.log(d, "join meeting response");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ExitMeeting = (meetingId, target) => {
    // Will exit the meeting
    // If it's not in the meeting it will do nothing
    peer
      .request("exitMeeting", { meetingId })
      .then((d) => {
        console.log(d, "exit meeting response");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const JoinStage = (meetingId, target) => {
    // Will join the stage
    // It could be configurable -> Only moderator could do it | Speakers can also do it
    peer
      .request("joinStage", { meetingId, target })
      .then((d) => {
        console.log(d, "joinStage meeting response");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const LeaveStage = (meetingId, target) => {
    // Will leave the stage
    // Moderators could use it for anyone
    // Others could use it for themselves
    peer
      .request("leaveStage", { meetingId, target })
      .then((d) => {
        console.log(d, "leaveStage meeting response");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const RaiseHand = (meetingId) => {
    // Will notify moderators that someone wants to come to stage
    // Only if there is no raise hand yet
    peer
      .request("raiseHand", { meetingId })
      .then((d) => {
        console.log(d, "raiseHand meeting response");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ToggleMedia = (meetingId, variant) => {
    // Will turn off the audio of stager
    peer
      .request("toggleMedia", { meetingId, variant })
      .then((d) => {
        console.log(d, "toggleMedia meeting response");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return {
    peer,
    connected,
    StartMeeting,
    JoinMeeting,
    ExitMeeting,
    JoinStage,
    LeaveStage,
    RaiseHand,
    ToggleMedia,
  };
};
