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

  const [todayDate] = useState(() => new Date());

  const attendanceDate = todayDate.toISOString().split('T')[0];

  const fetchUserAttendance = async () => {
    const empData = {
      userId: userId,
      attendanceDate: attendanceDate
    }
    try {
      const response = await fetch(`${API_URL}/attendance/get-specific-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empData)
      });
      const data = await response.json();

      if (!response.ok) {
        console.log("false");
        return;
      }
      const startAttendTms = data.startAttendTms ? data.startAttendTms.replace('T', ' ').replace('Z', '') : null;

      const endAttendTms = data.endAttendTms ? data.endAttendTms.replace('T', ' ').replace('Z', '') : null;

      setCheckIn(startAttendTms);
      setCheckOut(endAttendTms);
    } catch (error) {
      console.error(error);
      alert(error);
    }

  };

  useEffect(() => {
    const fetchUserAttendance = async () => {
      const empData = {
        userId: userId,
        attendanceDate: attendanceDate
      }
      try {
        const response = await fetch(`${API_URL}/attendance/get-specific-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(empData)
        });
        const data = await response.json();

        if (!response.ok) {
          console.log("false");
          return;
        }
        const startAttendTms = data.startAttendTms ? data.startAttendTms.replace('T', ' ').replace('Z', '') : null;

        const endAttendTms = data.endAttendTms ? data.endAttendTms.replace('T', ' ').replace('Z', '') : null;

        setCheckIn(startAttendTms);
        setCheckOut(endAttendTms);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };
    fetchUserAttendance();
  }, [userId, attendanceDate]);

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !stream) {
      return;
    }

    const video = videoRef.current;
    video.srcObject = stream;

    video.play().catch((error) => {
      console.error('Video playback error:', error);
    });

    return () => {
      video.srcObject = null;
      stream.getTracks().forEach((track) => track.stop());
    };
  }, [cameraOpen, stream]);

  const openCamera = async (action) => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Camera requires HTTPS'
        );
      }

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

      setAttendanceAction(action);
      setStream(mediaStream);
      setCameraOpen(true);
    } catch (error) {
      console.error('Camera error:', error.name, error.message);
      alert(`${error.name}: ${error.message}`);
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
    formData.append('attendanceImage', photo);

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

      fetchUserAttendance();
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
        <div className='home-page-button'>
          <button disabled={checkIn !== null} onClick={() => openCamera('check-in')}>Check In</button>

          <button disabled={checkIn === null || checkOut !== null} onClick={() => openCamera('check-out')}>Check Out</button>
        </div>
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

          <button className='takephoto-button' onClick={handleTakePhoto}>Take Photo</button>
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