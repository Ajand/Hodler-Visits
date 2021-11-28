/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Grid from "@mui/material/Grid";
import { gql, useQuery } from "@apollo/client";

import EventCard from "../components/EventCard";

import Loading from "../components/Loading";

const EVENTS = gql`
  query events {
    events {
      topic
      objectives
      startDate
      endDate
      isGated
      _id
    }
  }
`;

const Events = () => {
  const { data, loading } = useQuery(EVENTS);

  if (loading) return <div  css={css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 7em);
`}><Loading /></div>;


  return (
    <div>
      <Grid
        container
        spacing={0}
        css={css`
          padding: 1em 1em;
        `}
      >
        {data.events.map((ev) => (
          <Grid key={ev._id} item md={6} lg={4}>
            <EventCard item={ev} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Events;
