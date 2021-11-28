/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";

import PacmanLoader from "react-spinners/PacmanLoader";

const Loading = () => {
  const theme = useTheme();

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <PacmanLoader color={theme.palette.primary.main} size={60} />
    </div>
  );
};

export default Loading;
