/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Avatar,
  useTheme,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

import { useMutation, gql } from "@apollo/client";

const COMPLETE_PROFILE = gql`
  mutation completeProfile(
    $avatar: Upload!
    $displayName: String!
    $username: String!
  ) {
    completeProfile(
      avatar: $avatar
      displayName: $displayName
      username: $username
    )
  }
`;

const EDIT_PROFILE = gql`
  mutation editProfile(
    $avatar: Upload!
    $displayName: String!
    $username: String!
  ) {
    editProfile(avatar: $avatar, displayName: $displayName, username: $username)
  }
`;

const ProfileWidget = ({ onCancel, noCancel, me, refetch }) => {
  const theme = useTheme();

  const [completeProfile] = useMutation(COMPLETE_PROFILE);
  const [editProfile] = useMutation(EDIT_PROFILE);

  const [defaultAvatar, setDefaultAvatar] = useState(
    me.avatar ? `${process.env.REACT_APP_FILE_URL}/${me.avatar}` : ""
  );
  const [username, setUsername] = useState(me.username);
  const [displayName, setDN] = useState(me.displayName);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  useEffect(() => {
    setDefaultAvatar(
      me.avatar ? `${process.env.REACT_APP_FILE_URL}/${me.avatar}` : ""
    );
  }, [me.avatar]);

  return (
    <Paper
      css={css`
        padding: 2em 2em;
        display: inline-block;
        position: relative;
        width: 25em;
      `}
    >
      <div
        css={css`
          margin-bottom: 2em;
          display: flex;
          justify-content: center;
          cursor: pointer;
        `}
      >
        <input
          css={css`
            display: none;
          `}
          type="file"
          id="me-avatar"
          onChange={(e) => setSelectedAvatar(e.target.files[0])}
        />
        <label htmlFor="me-avatar">
          <Avatar
            css={css`
              width: 120px;
              height: 120px;
            `}
            src={
              selectedAvatar
                ? URL.createObjectURL(selectedAvatar)
                : defaultAvatar
                ? defaultAvatar
                : null
            }
          />
        </label>
      </div>
      <div
        css={css`
          margin-bottom: 1em;
          text-align: center;
        `}
      >
        <TextField
          value={displayName}
          onChange={(e) => setDN(e.target.value)}
          label="Display Name"
          fullWidth
          variant="filled"
        />
      </div>
      <div
        css={css`
          margin-bottom: 1em;
          text-align: center;
        `}
      >
        <TextField
          label="Username"
          fullWidth
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div
        css={css`
          margin-bottom: 1em;
          text-align: center;
          display: flex;
          justify-content: space-between;
        `}
      >
        {noCancel ? (
          <Button
            disabled={!displayName || !username}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              completeProfile({
                variables: {
                  avatar: selectedAvatar,
                  username,
                  displayName,
                },
              })
                .then(() => {
                  refetch();
                  onCancel()
                })
                .catch((err) => {
                  // TODO better error handling
                  console.log(err);
                });
            }}
          >
            Complete Profile
          </Button>
        ) : (
          <>
            <div
              css={css`
                width: 48%;
                display: inline-block;
              `}
            >
              <Button
                onClick={() => {
                  editProfile({
                    variables: {
                      avatar: selectedAvatar,
                      username,
                      displayName,
                    },
                  })
                    .then(() => {
                      refetch();
                      onCancel()
                    })
                    .catch((err) => {
                      // TODO better error handling
                      console.log(err);
                    });
                }}
                fullWidth
                variant="contained"
                color="primary"
              >
                Change Info
              </Button>
            </div>
            <div
              css={css`
                width: 48%;
                display: inline-block;
              `}
            >
              <Button
                onClick={onCancel}
                fullWidth
                variant="outlined"
                color="primary"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </Paper>
  );
};

export default ProfileWidget;
