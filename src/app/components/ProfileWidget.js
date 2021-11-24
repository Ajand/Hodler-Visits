/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Paper, Typography, Avatar, useTheme, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useMutation, gql } from "@apollo/client";

import UserRank from "./UserRanks";

const REFETCH_ROLE = gql`
  mutation refetchRole {
    refetchRole
  }
`;

const ProfileWidget = ({ onEdit, me, refetch }) => {
  const theme = useTheme();

  const [refetchRole] = useMutation(REFETCH_ROLE);

  return (
    <Paper
      css={css`
        padding: 4em 3em;
        display: inline-block;
        position: relative;
      `}
    >
      <IconButton
        css={css`
          position: absolute;
          top: 0.5em;
          right: 0.5em;
        `}
        onClick={onEdit}
      >
        <Edit />
      </IconButton>
      <div
        css={css`
          margin-bottom: 1em;
          display: flex;
          justify-content: center;
        `}
      >
        <Avatar
          css={css`
            width: 120px;
            height: 120px;
          `}
          src={
            me.avatar ? `${process.env.REACT_APP_FILE_URL}/${me.avatar}` : ""
          }
        />
      </div>
      <Typography
        css={css`
          margin-bottom: 1em;
          text-align: center;
          color: ${theme.palette.primary.main};
        `}
        variant="h5"
      >
        {me.displayName}
      </Typography>
      <Typography
        css={css`
          margin-bottom: 0.5em;
          text-align: center;
        `}
        variant="body1"
      >
        @{me.username}
        -{" "}
        <UserRank
          rank={me.role}
          onClick={() =>
            refetchRole()
              .then(() => refetch())
              .catch((err) => console.log(err))
          }
        />
      </Typography>
      <Typography
        css={css`
          margin-bottom: 1em;
          text-align: center;
        `}
        variant="body2"
      >
        {me.addresses[0].substr(0, 5)}...
        {me.addresses[0].substr(
          me.addresses[0].length - 5,
          me.addresses[0].length
        )}
      </Typography>
    </Paper>
  );
};

export default ProfileWidget;
