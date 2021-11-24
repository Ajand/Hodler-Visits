/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import { useHistory } from "react-router-dom";

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
      status
    }
  }
`;
const rows = [1, 2, 3, 4, 5];

export default function BasicTable() {
  const { data, loading } = useQuery(EVENTS);

  const history = useHistory();

  if (loading)
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 7em);
        `}
      >
        <Loading />
      </div>
    );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Event Topic</TableCell>
            <TableCell align="center">Start At</TableCell>
            <TableCell align="center">Duration</TableCell>
            <TableCell align="center">Is Gated</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.events.map((ev) => (
            <TableRow
              key={ev._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => history.push(`/event/${ev._id}`)}
              css={css`cursor: pointer`}
            >
              <TableCell align="center">{ev.topic}</TableCell>
              <TableCell align="center">
                {" "}
                {moment(Number(ev.startDate)).format("DD/MM/YYYY HH:mm")}
              </TableCell>
              <TableCell align="center">
                {" "}
                {moment(Number(ev.endDate)).diff(Number(ev.startDate)) /
                  (60 * 1000)}{" "}
                min
              </TableCell>
              <TableCell align="center">
                <Checkbox checked={ev.isGated} />
              </TableCell>
              <TableCell align="center">
                {ev.status === "WAITING" && (
                  <Button color="primary">Cancel Event</Button>
                )}
                {ev.status === "FINISHED" && (
                  <Button color="primary" variant="outlined">
                    Archive Event
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
