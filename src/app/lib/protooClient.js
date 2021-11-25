import protooClient from "protoo-client";

const transport = new protooClient.WebSocketTransport(
  process.env.REACT_APP_PROTOO
);

const peer = new protooClient.Peer(transport);

peer.on("open", () => {
  console.log("peer is open");
});

peer.on("failed", () => {
  console.log("peer has failed");
});

peer.on("disconnected", () => {
  console.log("peer has failed");
});

peer.on("close", () => {
  console.log("peer has close");
});

peer.on("notification", () => {
  console.log("peer has notification");
});

peer.on("request", () => {
  console.log("peer has request");
});

export default peer;
