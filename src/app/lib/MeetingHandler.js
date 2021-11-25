import peer from './protooClient'

/**
 * Room Data Structure
 * 
    {
        name: "roomName",
        createdAt: Date,
        creator: Peer,
        Audiences: [Username],
        Stagers: []
    }

 */

export const CreateRoom = () => {
    // Will Create A room, 
    // Only Moderators could do it
    //  Will notify Others that the room is created

    console.log(peer.connected, peer.closed, peer.data)
}

export const JoinRoom = () => {
    // Will join to a room that is created
    // If the room does not exist will throw an error
}

export const ExitRoom = () => {
    // Will exit the room
    // If it's not in the room it will do nothing
}

export const JoinStage = () => {
    // Will join the stage
    // It could be configurable -> Only moderator could do it | Speakers can also do it
}

export const LeaveStage = () => {
    // Will leave the stage
    // Moderators could use it for anyone
    // Others could use it for themselves
}

export const RaiseHand = () => {
    // Will notify moderators that someone wants to come to stage
    // Only if there is no raise hand yet
}

export const TurnOffAudio = () => {
    // Will turn off the audio of stager
}

export const TurnOnAudio = () => {
    // Will turn on the audio of stager
}

export const TurnOffVideo = () => {
    // Will turn off the video of the stager
}

export const TurnOnVideo = () => {
    // Will turn on the video of the stager
}


