'use client';

import { useEffect, useState } from 'react';
import studentPOST from '../../api/studentPOST.api';
import { studentGET } from '../../api/studentGET.api';
import { roomsGET, roomGET } from '../../api/roomGET.api';
import styles from './Student.module.css';

// ✅ Updated to match backend structure
interface StudentInfo {
  name: string;
  status: string;
}

interface RoomData {
  roomId: string;
  students: StudentInfo[];
}

const BUS_COUNT = 3;
const ROOMS_PER_GENDER = 3;
const MAX_ROOM_CAPACITY = 2;

export default function StudentSignUp() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [status, setStatus] = useState('');
  const [grade, setGrade] = useState('10');
  const [loading, setLoading] = useState(false);

  // Fetch student info and rooms whenever grade changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const name = localStorage.getItem('userName') || 'Unknown';
        const email = localStorage.getItem('userEmail');
        if (!email) return console.error('No email found in localStorage');

        // Fetch student info
        const studentData = await studentGET(name, email, grade);
        setUploaded(studentData.pdfs?.length === 3 || false);
        setSelectedRoom(studentData.room || '');

        // Fetch all rooms
        const roomIds = await roomsGET(grade);

        // Fetch students for each room safely
        const roomsWithStudents: RoomData[] = await Promise.all(
          roomIds.map(async (roomId) => {
            try {
              const response = await roomGET(roomId, grade);
              // ✅ Backend returns [{ name, status }], so keep that shape
              return { roomId, students: Array.isArray(response) ? response : [] };
            } catch (err) {
              console.warn(`Failed to fetch students for room ${roomId}:`, err);
              return { roomId, students: [] };
            }
          })
        );

        setRooms(roomsWithStudents);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [grade]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = localStorage.getItem('userName') || 'Unknown';
    const email = localStorage.getItem('userEmail') || '';

    const formData = new FormData(e.currentTarget);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('room', selectedRoom);
    formData.append('grade', grade);

    try {
      const res = await studentPOST(formData);
      alert(`Submission successful! Your submission ID is ${res.submissionId}`);
      setStatus('Submission successful!');
      setUploaded(true);
    } catch (err) {
      console.error(err);
      setStatus('Submission failed.');
    }
  };

  // Group rooms by bus and gender
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
      <h2 className={styles.heading}>Student Sign Up Portal</h2>

      {loading && <p className={styles.status}>Loading data for grade {grade}...</p>}

      {uploaded && (
        <p className={styles.status}>
          You have previously uploaded PDFs. You may upload again to replace them.
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formLayout}>
          {/* Room selection */}
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

                              {/* ✅ Show student names and statuses */}
                              {room.students.length > 0 && (
                                <ul className={styles.occupantsList}>
                                  {room.students.map((s, i) => (
                                    <li key={i}>
                                      {s.name}{' '}
                                      <span
                                        style={{
                                          color:
                                            s.status === 'pending'
                                              ? 'orange'
                                              : s.status === 'approved'
                                              ? 'green'
                                              : 'gray',
                                          fontSize: '0.9em',
                                        }}
                                      >
                                        ({s.status})
                                      </span>
                                    </li>
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

          {/* File upload and grade selection */}
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
                <label htmlFor="gradeSelect">Grade</label>
                <select
                  id="gradeSelect"
                  name="grade"
                  required
                  onChange={(e) => setGrade(e.target.value)}
                  value={grade}
                >
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
