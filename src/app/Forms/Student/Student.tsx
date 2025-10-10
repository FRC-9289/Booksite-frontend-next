'use client';

import studentPOST from '../../api/studentPOST.api';
import { studentGET } from '../../api/studentGET.api';
import { roomsGET, roomGET } from '../../api/roomGET.api';
import styles from './Student.module.css';
import { useEffect, useState } from 'react';

interface RoomData {
  roomId: string;
  students: string[];
}

const BUS_COUNT = 3;
const ROOMS_PER_GENDER = 3;
const MAX_ROOM_CAPACITY = 2;

export default function StudentSignUp() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [status, setStatus] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const name = localStorage.getItem('userName') || 'Unknown';
        const email = localStorage.getItem('userEmail');
        if (!email) return console.error('No email found in localStorage');

        // Fetch student info
        const studentData = await studentGET(name, email, '10');
        setUploaded(studentData.pdfs?.length === 3 || false);
        if (studentData.room) setSelectedRoom(studentData.room);

        // Fetch all room IDs
        const roomIds = await roomsGET();

        // Fetch students for each room
        const roomsWithStudents: RoomData[] = await Promise.all(
          roomIds.map(async (roomId) => ({ roomId, students: await roomGET(roomId) }))
        );
        setRooms(roomsWithStudents);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = localStorage.getItem('userName') || 'Unknown';

    const formData = new FormData(e.currentTarget);
    formData.append('name', name);
    formData.append('email', localStorage.getItem('userEmail') || '');
    formData.append('room', selectedRoom);
    formData.append('grade', grade);

    try {
      const res = await studentPOST(formData);
      const subId = res.submissionId;
      alert(`Submission successful! Your submission ID is ${subId}`);
      setStatus('Submission successful!');
      setUploaded(true);
    } catch (err) {
      console.error(err);
      setStatus('Submission failed.');
    }
  };

  // Pre-generate bus/gender/room grid
  const groupedByBus: Record<string, { M: RoomData[]; F: RoomData[] }> = {};
  for (let bus = 1; bus <= BUS_COUNT; bus++) {
    groupedByBus[String(bus)] = { M: [], F: [] };
    for (const gender of ['M', 'F'] as const) {
      for (let roomNum = 1; roomNum <= ROOMS_PER_GENDER; roomNum++) {
        const roomId = `${bus}${gender}${roomNum}`;
        const existing = rooms.find((r) => r.roomId === roomId);
        groupedByBus[String(bus)][gender].push(existing || { roomId, students: [] });
      }
    }
  }

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
                    <fieldset key={gender} className={styles.genderFieldset}>
                      <legend>{gender === 'M' ? 'Male Rooms' : 'Female Rooms'}</legend>

                      <div className={styles.radioGroup}>
                        {genders[gender].map((room) => {
                          const isFull = room.students.length >= MAX_ROOM_CAPACITY;
                          return (
                            <div
                              key={room.roomId}
                              className={`${styles.radioOption} ${isFull ? styles.fullRoom : ''}`}
                            >
                              <input
                                type="radio"
                                name="room_select"
                                id={`radio-${room.roomId}`}
                                value={room.roomId}
                                checked={selectedRoom === room.roomId}
                                onChange={() => setSelectedRoom(room.roomId)}
                                disabled={isFull}
                                required
                                className={styles.radioInput}
                              />
                              <label htmlFor={`radio-${room.roomId}`} className={styles.radioLabel}>
                                Room {room.roomId[2]} – {room.students.length}/{MAX_ROOM_CAPACITY} filled
                              </label>
                              {room.students.length > 0 && (
                                <ul className={styles.occupantsList}>
                                  {room.students.map((s, i) => (
                                    <li key={i}>{s} ({i+1})</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </fieldset>
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
            <fieldset className={styles.fileUploadFieldset}>
              <legend>Grade</legend>
                <div className={styles.fileInputGroup}>
                  <label>Grade</label>
                  <select name="grade" required onChange={(e) => setGrade(e.target.value)} value={grade}>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
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
