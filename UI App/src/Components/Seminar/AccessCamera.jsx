import React, { useRef, useEffect, useState } from 'react';
import './AccessCamera.css'; // Import CSS file for styling

const AccessCamera = () => {
  const videoRefLeft = useRef(null);
  const videoRefRight = useRef(null);
  const [displayLeft, setDisplayLeft] = useState(false);
  const [displayRight, setDisplayRight] = useState(false);

  useEffect(() => {
    const constraints = { video: true };

    const startCamera = async () => {
      try {
        // Request access to the user's camera
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // Attach the stream to the video elements
        if (displayLeft && videoRefLeft.current) {
          videoRefLeft.current.srcObject = stream;
        }
        if (displayRight && videoRefRight.current) {
          videoRefRight.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      if (displayLeft && videoRefLeft.current && videoRefLeft.current.srcObject) {
        const stream = videoRefLeft.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (displayRight && videoRefRight.current && videoRefRight.current.srcObject) {
        const stream = videoRefRight.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [displayLeft, displayRight]);


  const handleLeftButtonClick = () => {
    setDisplayLeft(true);
    setDisplayRight(false);
  };

  const handleRightButtonClick = () => {
    setDisplayLeft(false);
    setDisplayRight(true);
  };

  return (
    <div className="camera-container">
      {/* Left half */}
      <div className="cameraFeedLeft" style={{ width: '50%' }}>
        <h1>Camera Feed Left</h1>
        <video ref={videoRefLeft} autoPlay playsInline className='VideoLeft' style={{ display: displayLeft ? 'block' : 'none' }} />
        <button onClick={handleLeftButtonClick}>Display Here</button>
      </div>
      {/* Right half */}
      <div className="cameraFeedRight" style={{ width: '50%' }}>
        <h1>Camera Feed Right</h1>
        <video ref={videoRefRight} autoPlay playsInline className='VideoRight' style={{ display: displayRight ? 'block' : 'none' }} />
        <button onClick={handleRightButtonClick}>Display Here</button>
      </div>
    </div>
  );
};

export default AccessCamera;
