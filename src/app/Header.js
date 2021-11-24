/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import { Home } from "@mui/icons-material";
import { useHistory } from 'react-router-dom'

import { ethers } from "ethers";

import { useMutation, gql } from "@apollo/client";
import client from "./client";

const GET_NONCE = gql`
  mutation getNonce($address: String!) {
    getNonce(address: $address)
  }
`;

const GET_TOKEN = gql`
  mutation getToken($address: String!, $signature: String!) {
    getToken(address: $address, signature: $signature)
  }
`;

export default function MenuAppBar({ me, loading }) {

  const history = useHistory()

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [getNonce] = useMutation(GET_NONCE);
  const [getToken] = useMutation(GET_TOKEN);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Badger
          </Typography>
          {me ? (
            <div>
              {me && me.setted && (
                <IconButton onClick={() => history.push('/')} css={css`margin-right: 0.5em`}>
                  <Home />
                </IconButton>
              )}
              <Button
                color="inherit"
                onClick={() => {
                  localStorage.setItem("hodler-visits-token", "");
                  client.resetStore();
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                var account;
                var signer;
                var address;
                window.ethereum
                  .request({ method: "eth_requestAccounts" })
                  .then((accounts) => {
                    account = accounts[0];
                    const provider = new ethers.providers.Web3Provider(
                      window.ethereum
                    );
                    // The Metamask plugin also allows signing transactions to
                    // send ether and pay to change state within the blockchain.
                    // For this, you need the account signer...
                    signer = provider.getSigner();
                    return signer.getAddress();

                    //return signer.signMessage("Sign into JPEG Sniper");
                  })
                  .then((addr) => {
                    address = addr;
                    return getNonce({
                      variables: {
                        address,
                      },
                    });
                  })
                  .then(({ data }) => {
                    const nonce = data.getNonce;
                    return signer.signMessage(nonce);
                  })
                  .then((signature) => {
                    return getToken({
                      variables: {
                        address,
                        signature,
                      },
                    });
                  })
                  .then(({ data }) => {
                    const token = data.getToken;

                    localStorage.setItem("hodler-visits-token", token);
                    client.resetStore();
                  })
                  .catch((err) => console.log(err));
              }}
            >
              Signin
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
