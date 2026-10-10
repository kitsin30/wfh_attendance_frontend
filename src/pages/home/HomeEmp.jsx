import { useEffect, useRef, useState } from 'react'
import './HomeEmp.css';
import Navbar from '../../components/navbar/Navbar';
import { API_URL } from '../../config/Parameter';

const HomeEmp = () => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  const [attendanceAction, setAttendanceAction] = useState(null);

  const userId = localStorage.getItem("userId");

  const todayDate = new Date();

  useEffect(() => {
    try {
      const fetchUserAttendance = async () => {
        const response = await fetch(`${API_URL}/attendance/get-specific-user`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();

        if(!response.ok){
          console.log("false");
          alert(data.message);
          return;
        }
        setCheckIn(data.startAttendTms);
        setCheckOut(data.endAttendTms);
      };

      fetchUserAttendance();
    } catch (error) {
      console.error(error);
      alert(error);
    }

  }, [userId]);

  const openCamera = async (action) => {
    try {
      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
        });

      videoRef.current.srcObject = mediaStream;

      setStream(mediaStream);
      setAttendanceAction(action);
      setCameraOpen(true);
    } catch (error) {
      console.error(error);
      alert('Unable to access camera');
    }
  };

  const handleTakePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    canvas.toBlob(async (blob) => {
      if (!blob) {
        return;
      }

      const photo = new File(
        [blob],
        `${attendanceAction}.jpg`,
        {
          type: 'image/jpeg',
        },
      );

      await submitAttendance(photo);
    }, 'image/jpeg');
  };

  // Submit either check-in or check-out
  const submitAttendance = async (photo) => {
    const formData = new FormData();

    formData.append('userId', userId);
    formData.append('photo', photo);

    try {
      const endpoint =
        attendanceAction === 'check-in'
          ? '/attendance/check-in'
          : '/attendance/check-out';

      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(
        attendanceAction === 'check-in'
          ? 'Check in successful'
          : 'Check out successful',
      );

      // Stop camera
      stream?.getTracks().forEach(
        (track) => track.stop(),
      );

      setStream(null);
      setCameraOpen(false);
      setAttendanceAction(null);

    } catch (error) {
      console.error(error);
      alert('Attendance failed');
    }
  };

  return (
    <div className='home-page'>
      <Navbar />
      <h1>Today's WFH Attendance </h1>
      <h2>Date: {todayDate.toLocaleDateString()}</h2>
      <div>
        <p>Check In:{' '}{checkIn ?? '--:--'}</p>
        <p>Check Out:{' '}{checkOut ?? '--:--'}</p>
      </div>

      {!cameraOpen && (<>
          <button disabled={checkIn !== null} onClick={() => openCamera('check-in')}>Check In</button>

          <button disabled={checkIn === null || checkOut !== null} onClick={() => openCamera('check-out')}>Check Out</button>
        </>
      )}

      {cameraOpen && (
        <div>
          <h3>
            {attendanceAction === 'check-in'
              ? 'Take Check In Photo'
              : 'Take Check Out Photo'}
          </h3>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="400"
          />

          <br />

          <button onClick={handleTakePhoto}>
            Take Photo
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default HomeEmp