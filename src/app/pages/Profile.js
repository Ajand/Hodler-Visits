/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { useHistory } from 'react-router-dom'


import ProfileWidget from "../components/ProfileWidget";
import ProfileForm from "../components/ProfileForm";



const ProfilePage = ({refetch, me}) => {

  useEffect(() => {
    if(!me) {
      history.push('/')
    }
    if(me && !me.setted) {
      setIsNotSetted(true)
    }
  }, [me])

  const [isNotSetted, setIsNotSetted] = useState(false)
  const [isEdit, setIsEdit] = useState(false);

  const history = useHistory()

  const onEdit = () => {
    setIsEdit(true);
  };

  const onCancel = () => {
    setIsEdit(false);
  };

  if(isNotSetted) {
   return  <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 7em);
      `}
    >
        <ProfileForm onCancel={onCancel} noCancel me={me} refetch={refetch} />
    </div>
  }

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 7em);
      `}
    >
      {isEdit ? (
        <ProfileForm onCancel={onCancel} me={me} refetch={refetch}  />
      ) : (
        <ProfileWidget onEdit={onEdit} me={me} refetch={refetch} />
      )}
    </div>
  );
};

export default ProfilePage;
