/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";

import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";

import Loading from "../Loading";

import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";

const OnlineUsers = ({ users }) => {
  return (
    <>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {users.map((user) => (
          <ListItem key={user._id}>
            <ListItemAvatar>
              <Avatar
                src={
                  user.avatar
                    ? `${process.env.REACT_APP_FILE_URL}/${user.avatar}`
                    : "/badger.png"
                }
              />
            </ListItemAvatar>
            <ListItemText
              primary={user.displayName}
              secondary={user.username}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

const MESSAGES = gql`
  query messages($eventId: ID!) {
    messages(eventId: $eventId) {
      _id
      sender {
        displayName
        avatar
        username
      }
      body
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($eventId: ID!, $body: String!) {
    sendMessage(eventId: $eventId, body: $body) {
      sender {
        displayName
        avatar
        username
      }
      body
      createdAt
    }
  }
`;

const MESSAGE_SENTED = gql`
  subscription messageSented {
    messageSented
  }
`;

const ChatWidget = ({ messages, ev }) => {
  const theme = useTheme();

  const [body, setBody] = useState("");

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const { data, loading, error } = messages;

  if (loading) return <Loading />;

  return (
    <div>
      <div
        css={css`
          margin-bottom: 0.5em;
        `}
      >
        <TextField
          value={body}
          onChange={(e) => setBody(e.target.value)}
          label="Message"
          fullWidth
          multiline
        />
        <Button
          css={css`
            margin-top: 0.5em;
          `}
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            sendMessage({
              variables: {
                eventId: ev._id,
                body,
              },
            })
              .then(() => {
                messages.refetch();
                setBody("");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
          disabled={!body}
        >
          Send Message
        </Button>
      </div>
      <Divider />
      <div>
        {[...data.messages].reverse().map((message) => (
          <div key={message._id}>
            <div
              css={css`
                margin-bottom: 0.5em;
              `}
            >
              <div
                css={css`
                  display: flex;
                  margin-top: 1em;
                  margin-bottom: 0.5em;
                  align-items: center;
                `}
              >
                <Avatar
                  css={css`
                    display: inline-block;
                    width: 50px;
                    height: 50px;
                    textalign: center;
                  `}
                  src={
                    message.sender.avatar
                      ? `${process.env.REACT_APP_FILE_URL}/${message.sender.avatar}`
                      : "/badger.png"
                  }
                />
                <div
                  css={css`
                    display: inline-block;
                    margin-left: 0.5em;
                  `}
                >
                  <Typography
                    css={css`
                      color: ${theme.palette.primary.main};
                    `}
                    variant="h6"
                  >
                    {message.sender.displayName}
                  </Typography>
                  <Typography variant="body1">
                    @{message.sender.username} -{" "}
                    {moment(Number(message.createdAt)).fromNow()}
                  </Typography>
                </div>
              </div>
              <Typography variant="body2">{message.body}</Typography>
            </div>
            <Divider />
          </div>
        ))}
      </div>
    </div>
  );
};

const CREATE_POLL = gql`
  mutation createPoll(
    $eventId: ID!
    $isWeighted: Boolean
    $want1Weight: Int
    $want2Weight: Int
    $want3Weight: Int
    $onlyHodler: Boolean
    $options: [String]
    $body: String!
  ) {
    createPoll(
      eventId: $eventId
      isWeighted: $isWeighted
      want1Weight: $want1Weight
      want2Weight: $want2Weight
      want3Weight: $want3Weight
      onlyHodler: $onlyHodler
      options: $options
      body: $body
    ) {
      eventId
    }
  }
`;

const PollCreator = ({ ev }) => {
  const [body, setBody] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [onlyHodler, setOnlyHodler] = useState(false);
  const [weighted, setWeighted] = useState(false);
  const [want1Weight, setWant1Weight] = useState(1);
  const [want2Weight, setWant2Weight] = useState(1);
  const [want3Weight, setWant3Weight] = useState(1);


  const [createPoll] = useMutation(CREATE_POLL);

  return (
    <div>
      <div>
        <TextField
          variant="filled"
          fullWidth
          css={css`
            margin-bottom: 1em;
          `}
          label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {options.map((option, index) => (
          <div
            key={index}
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <div
              css={css`
                width: calc(100% - 50px);
                display: inline-block;
              `}
            >
              <TextField
                variant="filled"
                label={`Option ${index + 1}`}
                fullWidth
                css={css`
                  margin-bottom: 0.5em;
                `}
                size="small"
                value={option}
                onChange={(e) =>
                  setOptions(
                    options.map((op, i) => {
                      if (i !== index) return op;
                      return e.target.value;
                    })
                  )
                }
              />
            </div>

            <div>
              <IconButton
                onClick={() =>
                  setOptions(
                    options.filter((op, i) => {
                      if (i !== index) return true;
                      return false;
                    })
                  )
                }
                disabled={options.length < 3}
              >
                <Close />
              </IconButton>
            </div>
          </div>
        ))}
        <div>
          <Button
            onClick={() => setOptions([...options, ""])}
            variant="outlined"
            css={css`
              margin-bottom: 1em;
            `}
          >
            Add Option
          </Button>
        </div>
        <div
          css={css`
            display: flex;
            align-items: center;
            margin-bottom: 0.5em;
          `}
        >
          <Typography variant="body1">Only Hodler</Typography>{" "}
          <Checkbox
            value={onlyHodler}
            onChange={() => setOnlyHodler(!onlyHodler)}
            css={css`
              margin-left: 1em;
            `}
          />
        </div>
        <div
          css={css`
            display: flex;
            align-items: center;
            margin-bottom: 0.5em;
          `}
        >
          <Typography variant="body1">Weighted</Typography>{" "}
          <Checkbox
            value={weighted}
            onChange={() => setWeighted(!weighted)}
            css={css`
              margin-left: 1em;
            `}
          />
        </div>
        {weighted && (
          <div>
            <TextField
              variant="filled"
              label={`Want1 Weight`}
              fullWidth
              css={css`
                margin-bottom: 0.5em;
              `}
              size="small"
              value={want1Weight}
              onChange={(e) => setWant1Weight(e.target.value)}
            />
            <TextField
              variant="filled"
              label={`Want2 Weight`}
              fullWidth
              css={css`
                margin-bottom: 0.5em;
              `}
              size="small"
              value={want2Weight}
              onChange={(e) => setWant2Weight(e.target.value)}
            />
            <TextField
              variant="filled"
              label={`Want3 Weight`}
              fullWidth
              css={css`
                margin-bottom: 0.5em;
              `}
              size="small"
              value={want3Weight}
              onChange={(e) => setWant3Weight(e.target.value)}
            />
          </div>
        )}
      </div>
      <Button
        css={css`
          margin-top: 1em;
        `}
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => {
          createPoll({
            variables: {
              eventId: ev._id,
              isWeighted: weighted,
              want1Weight: Number(want1Weight),
              want2Weight: Number(want2Weight),
              want3Weight: Number(want3Weight),
              onlyHodler,
              body,
              options,
            },
          })
            .then(() => {
              console.log("Poll Created");
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        Create Poll
      </Button>
    </div>
  );
};

const VOTE = gql`
  mutation vote($eventId: ID!, $option: Int!) {
    vote(eventId: $eventId, option: $option) {
      url
    }
  }
`;

const PollVoter = ({ poll, ev }) => {
  const [selected, setSelected] = useState(null);

  const [vote] = useMutation(VOTE);

  return (
    <div>
      <Typography
        css={css`
          margin-bottom: 1em;
        `}
        variant="body1"
      >
        {poll.body}
      </Typography>

      {poll.options.map((option, index) => (
        <div
          key={option}
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Radio
            css={css`
              margin-right: 1em;
            `}
            checked={selected === index}
            onClick={() => setSelected(index)}
          />{" "}
          <Typography variant="body2">{option}</Typography>
        </div>
      ))}
      <Button
        onClick={() => {
          vote({ variables: { eventId: ev._id, option: selected } })
            .then(({ data }) =>
              alert(`Congrats, You've got a new POAP. Url is: ${data.vote.url}`)
            )
            .catch((err) => console.log(err));
        }}
        css={css`
          margin-top: 1em;
        `}
        fullWidth
        variant="contained"
        color="primary"
      >
        Submit Vote
      </Button>
    </div>
  );
};

const PollResult = ({ poll }) => {
  const results = poll.votes.reduce(
    (pV, cV) => {
      var nD;

      if (poll.weights.isWeighted) {
        nD = { ...pV, totalWeight: pV.totalWeight + cV.weight };
        nD[cV.option] = (nD[cV.option] ? nD[cV.option] : 0) + cV.weight;
      } else {
        nD = { ...pV, totalWeight: pV.totalWeight + 1 };
        nD[cV.option] = (nD[cV.option] ? nD[cV.option] : 0) + 1;
      }
      return nD;
    },
    {
      totalWeight: 0,
      body: poll.body,
    }
  );

  return (
    <div>
      <Typography
        css={css`
          margin-bottom: 1em;
        `}
        variant="body1"
      >
        {poll.body}
      </Typography>
      {poll.options.map((option, index) => (
        <Typography
          key={option}
          css={css`
            margin-bottom: 0.5em;
          `}
          variant="h6"
        >
          {option} -{" "}
          {parseInt(
            ((results[index] ? results[index] : 0) * 100) / results.totalWeight
          )}
          %
        </Typography>
      ))}
    </div>
  );
};

const PollManager = ({ ev, me }) => {
  if (!ev.poll && me.role === "MODERATOR") return <PollCreator />;
  if (!ev.poll)
    return <Typography variant="body1">There is no poll yet.</Typography>;
  if (ev.poll.votes.find((vote) => vote.voter == me._id))
    return <PollResult poll={ev.poll} />;

  return <PollVoter poll={ev.poll} ev={ev} />;
};

const Sidebar = ({ ev, me }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const messages = useQuery(MESSAGES, {
    variables: { eventId: ev._id },
  });
  const messageSub = useSubscription(MESSAGE_SENTED);

  useEffect(() => {
    messages.refetch();
  }, [messageSub.data]);

  return (
    <Paper
      css={css`
        height: 80vh;
        overflow: hidden;
      `}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={(e, v) => {
            setSelectedTab(v);
          }}
          aria-label="Sidebar Tab"
          centered
        >
          <Tab label="Poll" />
          <Tab label="Online Users" />
          <Tab label="Messages" />
        </Tabs>
      </Box>
      <div
        css={css`
          padding: 1em;
          overflow-y: auto;
          height: 100%;
          padding-bottom: 5em;
        `}
      >
        {selectedTab === 0 && <PollManager ev={ev} me={me} />}
        {selectedTab === 1 && <OnlineUsers users={ev.onlineUsers} />}
        {selectedTab === 2 && <ChatWidget ev={ev} messages={messages} />}
      </div>
    </Paper>
  );
};

export default Sidebar;
