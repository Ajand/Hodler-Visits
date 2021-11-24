/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { useRef, useEffect } from 'react'
import { css, useTheme } from '@emotion/react'
import Typography from '@mui/material/Typography'

import useUserMedia from './useUserMedia'

const MediaActions = () => {
    const theme = useTheme()

    const videoRef = useRef(null)

    const constraints = {
        video: true,
        audio: false
    };
    
    const onError = (e) => alert(e);
    
    const userStream = useUserMedia(constraints, onError);

    useEffect(() => {
        console.log(userStream)
        if(userStream) {
            videoRef.current.srcObject = userStream
        }
    }, [userStream])


    return (
        <div css={css`
            display: inline-block;
            background: ${theme.palette.primary.main}
        `}>
            <video autoPlay ref={videoRef} />
            <div>
                <div></div>
            </div>
        </div>
    )
}

export default MediaActions