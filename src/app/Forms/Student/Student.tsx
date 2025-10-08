'use client';

import studentPOST from '../../api/studentPOST.api';
import { studentGET } from '../../api/studentGET.api';
import { roomsGET } from '../../api/roomGET.api';
import styles from './Student.module.css';
import { useEffect, useState } from 'react';

interface RoomData {
  roomId: string;
  students: string[];
}

export default function StudentSignUp() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
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
        const roomListRaw = await roomsGET();

        const roomList: RoomData[] = (roomListRaw || []).map((arr: string[]) => ({
          roomId: arr[0],
          students: arr.slice(1),
        }));

        setRooms(roomList);

        const hasPdfs = data.pdfs?.length === 3;
        setUploaded(hasPdfs);
      } catch (err) {
        console.error('Failed to fetch room data:', err);
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
    formData.append('room', String(student.room));

    try {
      const response = await studentPOST(formData);
      setStatus('Submission successful!');
      setUploaded(true);
      console.log('Success:', response);
    } catch (err) {
      setStatus('Submission failed.');
      console.error('Error:', err);
    }
  };

  // Group by bus + gender
  const groupedByBus: Record<string, { M: RoomData[]; F: RoomData[] }> = {};
  rooms.forEach((r) => {
    const match = r.roomId.match(/^(\d+)([MF])(\d+)$/);
    if (!match) return;
    const [_, busNum, gender] = match;
    if (!groupedByBus[busNum]) groupedByBus[busNum] = { M: [], F: [] };
    groupedByBus[busNum][gender].push(r);
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Village Robotics 9289 Sign Up</h2>

      {uploaded && (
        <p className={styles.status}>
          You have previously uploaded PDFs. You may upload again to replace them.
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formLayout}>
          <div className={styles.busContainer}>
            {Object.entries(groupedByBus).map(([busNum, genders]) => (
              <fieldset key={busNum} className={styles.busFieldset}>
                <legend>Bus {busNum}</legend>
                <div className={styles.genderContainer}>
                  {(['M', 'F'] as const).map((gender) => (
                    genders[gender].length > 0 && (
                      <fieldset key={gender} className={styles.genderFieldset}>
                        <legend>{gender === 'M' ? 'Male Rooms' : 'Female Rooms'}</legend>
                        {genders[gender].map((room) => {
                          const isFull = room.students.length >= 2;
                          return (
                            <label
                              key={room.roomId}
                              className={`${styles.radioOption} ${isFull ? styles.fullRoom : ''}`}
                            >
                              <input
                                type="radio"
                                name="room_select"
                                value={room.roomId}
                                checked={selectedRoom === room.roomId}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                disabled={isFull}
                                required
                              />
                              <span className={styles.radioLabel}>
                                {room.roomId} – {room.students.length}/2 filled
                              </span>
                              {room.students.length > 0 && (
                                <ul className={styles.occupantsList}>
                                  {room.students.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              )}
                            </label>
                          );
                        })}
                      </fieldset>
                    )
                  ))}
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