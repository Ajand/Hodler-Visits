/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
//import { useState } from "react";
//import { css } from "@emotion/react";
import { Chip } from "@mui/material";

const ProfilePage = ({ rank, onClick }) => {
  if (rank === "MODERATOR")
    return <Chip color="primary" label="Moderator" size="small" onClick={onClick} />;
  if (rank === "SPEAKER")
    return (
      <Chip color="primary" variant="outlined" label="Speaker" size="small"  onClick={onClick} />
    );
  if (rank === "VOTER")
    return <Chip color="default" label="Voter" size="small"  onClick={onClick} />;
  return (
    <Chip color="default" variant="outlined" label="Listener" size="small"  onClick={onClick} />
  );
};

export default ProfilePage;
