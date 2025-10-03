'use client';

import studentsend from '../../api/studentsend.api';
import getstudent from '../../api/getstudent.api';
import styles from './Student.module.css';
import { useEffect, useState } from 'react';

export default function StudentSignUp() {
  const [rooms, setRooms] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          console.error('No email found in localStorage');
          return;
        }

        const data = await getstudent(email);
        setRooms(data.openRooms || []);

        setUploaded(data.student && data.student.pdfs && data.student.pdfs.length === 3);
        console.log('Uploaded:', data.student && data.student.pdfs && data.student.pdfs.length === 3);
      } catch (err) {
        console.error('Failed to fetch room data:', err);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append('room_select', selectedRoom);

    try {
      const response = await studentsend(formData);
      setStatus('Submission successful!');
      console.log('Success:', response);
      setUploaded(true);
    } catch (err) {
      setStatus('Submission failed.');
      console.error('Error:', err);
    }
  };

  // Group rooms by bus and gender
  const groupedByBus: Record<string, { M: string[]; F: string[] }> = {};
  rooms.forEach((room) => {
    const match = room.match(/^(\d+)([MF])(\d+)$/);
    if (!match) return;
    const [_, busNum, gender] = match;
    if (!groupedByBus[busNum]) groupedByBus[busNum] = { M: [], F: [] };
    groupedByBus[busNum][gender].push(room);
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Village Robotics 9289 Sign Up</h2>

      {uploaded ? (
        <p className={styles.status}>You have already uploaded your PDFs.</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {Object.entries(groupedByBus).map(([busNum, genders]) => (
            <fieldset key={busNum} className={styles.busFieldset}>
              <legend>Bus {busNum}</legend>

              {genders.M.length > 0 && (
                <fieldset className={styles.genderFieldset}>
                  <legend>Male Rooms</legend>
                  {genders.M.map((roomId) => (
                    <div key={roomId} className={styles.radioGroup}>
                      <input
                        type="radio"
                        id={roomId}
                        name="room_select"
                        value={roomId}
                        checked={selectedRoom === roomId}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        required
                      />
                      <label htmlFor={roomId}>{roomId}</label>
                    </div>
                  ))}
                </fieldset>
              )}

              {genders.F.length > 0 && (
                <fieldset className={styles.genderFieldset}>
                  <legend>Female Rooms</legend>
                  {genders.F.map((roomId) => (
                    <div key={roomId} className={styles.radioGroup}>
                      <input
                        type="radio"
                        id={roomId}
                        name="room_select"
                        value={roomId}
                        checked={selectedRoom === roomId}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        required
                      />
                      <label htmlFor={roomId}>{roomId}</label>
                    </div>
                  ))}
                </fieldset>
              )}
            </fieldset>
          ))}

          <fieldset className={styles.fileUploadFieldset}>
            <legend>Upload Required PDFs</legend>

            <div className={styles.fileInputGroup}>
              <label htmlFor="file1">PDF 1:</label>
              <input
                type="file"
                id="file1"
                name="file1"
                accept="application/pdf"
                required
              />
            </div>
            <div className={styles.fileInputGroup}>
              <label htmlFor="file2">PDF 2:</label>
              <input
                type="file"
                id="file2"
                name="file2"
                accept="application/pdf"
                required
              />
            </div>
            <div className={styles.fileInputGroup}>
              <label htmlFor="file3">PDF 3:</label>
              <input
                type="file"
                id="file3"
                name="file3"
                accept="application/pdf"
                required
              />
            </div>
          </fieldset>

          <button type="submit" className={styles.button}>
            Sign Up
          </button>
          <p className={styles.status}>{status}</p>
        </form>
      )}
    </div>
  );
}