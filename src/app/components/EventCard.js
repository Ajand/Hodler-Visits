/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useHistory } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

import moment from "moment";
import Avatar from "@mui/material/Avatar";

const EventObject = {
  topic: "Here is this",
  objectives: `In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without`,
  poapImage: "https://poap.gallery/icons/poap_dark.png",
  startAt: new Date(),
  endAt: new Date(),
};

const EventCard = ({ item }) => {
  const history = useHistory();

  const objectivesParser = (objectives) => {
    if (objectives.length < 143) return objectives;
    return `${objectives.substr(0, 140)}...`;
  };

  return (
    <Paper
      css={css`
        padding: 1em;
        margin: 1em;
        position: relative;
        cursor: pointer;
      `}
      onClick={() => history.push(`/event/${item._id}`)}
    >
      <div
        css={css`
          margin-bottom: 1em;
          display: flex;
          align-items: center;
        `}
      >
        <Typography
          css={css`
            display: inline-block;
            margin-right: 0.5em;
          `}
          variant="h5"
        >
          {item.topic}
        </Typography>
        <Chip color="primary" label="Gated" size="small" />
      </div>
      <div
        css={css`
          margin-bottom: 1em;
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <Typography variant="body1">
          {moment(Number(item.startDate)).format("DD/MM/YYYY HH:mm")}
        </Typography>
        <Typography variant="body1">
          {moment(Number(item.endDate)).diff(Number(item.startDate)) /
            (60 * 1000)}{" "}
          min
        </Typography>
      </div>
      <Typography
        css={css`
          width: 80%;
        `}
        variant="body2"
      >
        {objectivesParser(item.objectives)}
      </Typography>
      {/*<img
        src={EventObject.poapImage}
        css={css`
          width: 60px;
          position: absolute;
          right: -16px;
          bottom: -8px;
        `}
      />*/}
    </Paper>
  );
};

export default EventCard;
