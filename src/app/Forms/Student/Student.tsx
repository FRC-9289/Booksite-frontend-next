'use client';

import studentPOST from '../../api/studentPOST.api';
import { studentGET } from '../../api/studentGET.api';
import { roomGET, roomsGET } from '../../api/roomGET.api';
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

        const data = await studentGET(email);
        let roomList = (await roomsGET()) || [];

        if (!roomList.length) {
          console.warn('No rooms received from backend, using fallback list.');
          roomList = [
            '1M1', '1M2', '1F1', '1F2',
            '2M1', '2F1',
            '3M1', '3F1'
          ];
        }

        setRooms(roomList);

        const hasPdfs = data.pdfs?.length === 3;
        setUploaded(hasPdfs);
        console.log('Uploaded:', hasPdfs);
      } catch (err) {
        console.error('Failed to fetch room data:', err);

        setRooms([
          '1M1', '1M2', '1F1', '1F2',
          '2M1', '2F1',
          '3M1', '3F1'
        ]);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = localStorage.getItem('userEmail');
    if (!email) {
      setStatus('Missing email. Please log in again.');
      return;
    }

    const formData = new FormData(e.currentTarget);

    const pdfs: Blob[] = [];
    for (let i = 1; i <= 3; i++) {
      const file = formData.get(`file${i}`);
      if (file instanceof Blob) {
        pdfs.push(file);
      }
    }


    const student = {
      email,
      room: selectedRoom,
      pdfs,
    };

    formData.append('email', student.email);
    formData.append('name', localStorage.getItem('userName') || 'Unknown');
    if (student.room !== undefined) formData.append('room', String(student.room));

    try {
      const response = await studentPOST(formData);
      setStatus('Submission successful!');
      console.log('Success:', response.message);
      alert(`SUMBISSION ID (REMEBMER): ${response.submissionId}`);
      setUploaded(true);
    } catch (err) {
      setStatus('Submission failed.');
      console.error('Error:', err);
    }
  };

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

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formLayout}>
          <div className={styles.busContainer}>
            {Object.entries(groupedByBus).map(([busNum, genders]) => (
              <fieldset key={busNum} className={styles.busFieldset}>
                <legend>Bus {busNum}</legend>

                <div className={styles.genderContainer}>
                  {genders.M.length > 0 && (
                    <fieldset className={styles.genderFieldset}>
                      <legend>Male Rooms</legend>
                      {genders.M.map((roomId) => (
                        <label key={roomId} className={styles.radioOption}>
                          <input
                            type="radio"
                            name="room_select"
                            value={roomId}
                            checked={selectedRoom === roomId}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            required
                          />
                          <span className={styles.radioLabel}>{roomId.replace(/[0-9]/, '').replace('M', 'Male ').replace('F', 'Female ')}</span>
                        </label>
                      ))}
                    </fieldset>
                  )}

                  {genders.F.length > 0 && (
                    <fieldset className={styles.genderFieldset}>
                      <legend>Female Rooms</legend>
                      {genders.F.map((roomId) => (
                        <label key={roomId} className={styles.radioOption}>
                          <input
                            type="radio"
                            name="room_select"
                            value={roomId}
                            checked={selectedRoom === roomId}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            required
                          />
                          <span className={styles.radioLabel}>{roomId.replace(/[0-9]/, '').replace('M', 'Male ').replace('F', 'Female ')}</span>
                        </label>
                      ))}
                    </fieldset>
                  )}
                </div>
              </fieldset>
            ))}
          </div>

          <div className={styles.fileUploadContainer}>
            <fieldset className={styles.fileUploadFieldset}>
              <legend>Upload Required PDFs</legend>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.fileInputGroup}>
                  <label htmlFor={`file${i}`}>PDF {i}:</label>
                  <input
                    type="file"
                    id={`file${i}`}
                    name={`file${i}`}
                    accept="application/pdf"
                    required
                  />
                </div>
              ))}
            </fieldset>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Sign Up / Update
        </button>
        <p className={styles.status}>{status}</p>
      </form>
    </div>
  );
}
//Wolfram121