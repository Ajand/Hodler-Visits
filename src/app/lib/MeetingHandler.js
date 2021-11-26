import peer from "./protooClient";

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

export const StartMeeting = (meetingId) => {
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

export const JoinMeeting = (meetingId) => {
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

export const ExitMeeting = (meetingId, target) => {
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

export const JoinStage = (meetingId, target) => {
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

export const LeaveStage = (meetingId, target) => {
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

export const RaiseHand = (meetingId) => {
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

export const ToggleMedia = (meetingId, variant) => {
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
