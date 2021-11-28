/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { css } from "@emotion/react";
import { useHistory } from "react-router-dom";

import Header from "./Header";

//import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import EventManager from "./pages/EventManager";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";

import Loading from "./components/Loading";

const ME = gql`
  query me {
    me {
      _id
      username
      displayName
      avatar
      bio
      setted
      createdAt
      updatedAt
      addresses
      followers
      followings
      role
    }
  }
`;

const Routes = () => {
  useEffect(() => {}, []);

  const { data, loading, refetch } = useQuery(ME);

  const history = useHistory();

  //console.log(data, loading, error);

  if (loading)
    return (
      <div
        css={css`
          height: 100vh;
        `}
      >
        <Loading />
      </div>
    );

  if (data && data.me && !data.me.setted) history.push("/profile");

  return (
    <div>
      <Header loading={loading} me={data.me} />
      {data && data.me ? (
        <Switch>
          <Route path="/" exact>
            {data && data.me && data.me.role === "MODERATOR" ? (
              <EventManager />
            ) : (
              <Events />
            )}
          </Route>
          <Route path="/profile" exact>
            <Profile me={data.me} refetch={refetch} />
          </Route>
          <Route path="/create-event" exact>
            <CreateEvent />
          </Route>
          <Route path="/event/:id" exact>
            <EventDetails me={data.me} />
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route path="/">
            <Events />
          </Route>
        </Switch>
      )}
    </div>
  );
};

export default Routes;
