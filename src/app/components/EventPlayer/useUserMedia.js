import { useEffect, useState } from "react";

const useUserMedia = (constraints, errorCallback = () => undefined) => {
  const [stream, setStream] = useState();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(setStream)
      .catch(errorCallback);
  }, []);

  return stream;
};

export default useUserMedia