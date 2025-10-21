'use client';

import studentPOST from '../../api/studentPOST.api';
import { studentGET } from '../../api/studentGET.api';
import { roomsGET } from '../../api/roomGET.api';
import styles from './Student.module.css';
import { useEffect, useState, useCallback } from 'react';

interface RoomData {
  roomId: string;
  students: string[];
}

export default function StudentSignUp() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [status, setStatus] = useState('');
  const [grade, setGrade] = useState<number | null>(null);
  const [debugRaw, setDebugRaw] = useState<any>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Load grade from localStorage
  useEffect(() => {
    const g = localStorage.getItem('userGrade');
    if (g) {
      const parsed = parseInt(g, 10);
      if (!Number.isNaN(parsed)) setGrade(parsed);
    }
  }, []);

  // Fetch rooms for a specific grade
  const fetchRooms = useCallback(async (g: number) => {
    try {
      setLoadingRooms(true);
      const email = localStorage.getItem('userEmail');

      let studentData: { room?: string; pdfs?: Blob[]; status?: number } = { pdfs: [] };

      if (email) {
        try {
          studentData = await studentGET(email, g);
        } catch (err: any) {
          if (err.message.includes('404')) {
            console.log('No existing student record; will create on submit.');
          } else {
            console.error('Failed to fetch student:', err);
          }
        }
      }

      const roomListRaw = await roomsGET(g);
      setDebugRaw(roomListRaw);
      console.log('roomsGET raw:', roomListRaw);

      const roomList: RoomData[] = (roomListRaw || []).map((arr: string[]) => ({
        roomId: arr[0],
        students: arr.slice(1),
      }));

      console.log('mapped rooms:', roomList);
      setRooms(roomList);
      setUploaded((studentData?.pdfs?.length || 0) === 3);
      localStorage.setItem('userGrade', g.toString());
    } catch (err) {
      console.error('Failed to fetch room data:', err);
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    if (grade) fetchRooms(grade);
  }, [grade, fetchRooms]);

  // ------------------------
  // FIXED SUBMIT HANDLER
  // ------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Keep form reference before async
    const form = e.currentTarget;

    const email = localStorage.getItem('userEmail');
    if (!email) {
      setStatus('Missing email. Please log in again.');
      return;
    }
    if (!grade) {
      setStatus('Please select a grade.');
      return;
    }

    const formData = new FormData(form);
    formData.append('email', email);
    formData.append('room', selectedRoom);
    formData.append('grade', grade.toString());

    try {
      const studentData = await studentGET(email, grade);
      const existingPDFs = studentData?.pdfs || [];

      // ✅ Safe loop — uses the stored "form" reference
      for (let i = 1; i <= 3; i++) {
        const input = form.querySelector<HTMLInputElement>(`#file${i}`);
        if (input?.files?.length) {
          // new file uploaded
          formData.append(`file${i}`, input.files[0]);
        } else if (existingPDFs[i - 1]) {
          // reuse old PDF
          const existingBlob = existingPDFs[i - 1];
          formData.append(`file${i}`, existingBlob, `existing_file${i}.pdf`);
        }
      }

      const response = await studentPOST(formData);
      setStatus('Submission successful!');
      setUploaded(true);
      console.log('Success:', response);
    } catch (err) {
      setStatus('Submission failed.');
      console.error('Error:', err);
    }
  };

  // Group rooms by bus and gender
  const groupedByBus: Record<string, { M: RoomData[]; F: RoomData[] }> = {};
  rooms.forEach((r) => {
    const id = r.roomId.trim().toUpperCase();
    const match = id.match(/^(\d+)([MF])(\d+)$/);
    if (!match) return;
    const [, busNum, gender] = match;
    if (!groupedByBus[busNum]) groupedByBus[busNum] = { M: [], F: [] };
    groupedByBus[busNum][gender].push({ ...r, roomId: id });
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>TVS Sign Up</h2>

      {uploaded && (
        <p className={styles.status}>
          You have previously uploaded PDFs. You may upload again to replace them.
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formLayout}>
          <div className={styles.busContainer}>
            {loadingRooms && <p>Loading rooms for grade {grade}…</p>}

            {Object.keys(groupedByBus).length === 0 && !loadingRooms && grade && (
              <div style={{ padding: 12 }}>
                <p>No rooms found for grade {grade}.</p>
                <button
                  type="button"
                  onClick={() => {
                    if (grade) fetchRooms(grade);
                  }}
                  className={styles.button}
                >
                  Reload rooms
                </button>
                <p style={{ marginTop: 8, fontSize: 12 }}>Open console to inspect response.</p>
              </div>
            )}

            {Object.entries(groupedByBus).map(([busNum, genders]) => (
              <fieldset key={busNum} className={styles.busFieldset}>
                <legend>Bus {busNum}</legend>
                <div className={styles.genderContainer}>
                  {(['M', 'F'] as const).map((gender) =>
                    genders[gender].length > 0 ? (
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
                                onChange={(e) => {
                                  const selected = e.target.value;
                                  console.log('Room selected:', selected);
                                  setSelectedRoom(selected);
                                }}
                                disabled={isFull}
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
                    ) : null
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
                    required={!uploaded}
                  />
                </div>
              ))}
            </fieldset>

            <fieldset className={styles.fileUploadFieldset}>
              <legend>Select Grade</legend>
              <label htmlFor="grade">Grade:</label>
              <select
                id="grade"
                name="grade"
                value={grade ?? ''}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  setGrade(Number.isNaN(parsed) ? null : parsed);
                }}
                required
                className={styles.input}
              >
                <option value="">-- Select Grade --</option>
                {Array.from({ length: 4 }, (_, i) => 9 + i).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Sign Up / Update
        </button>
        <p className={styles.status}>{status}</p>
      </form>

      {debugRaw && (
        <details style={{ marginTop: 12, color: '#ccc' }}>
          <summary>Debug: raw rooms response</summary>
          <pre style={{ maxHeight: 240, overflow: 'auto' }}>
            {JSON.stringify(debugRaw, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
// Wolfram121