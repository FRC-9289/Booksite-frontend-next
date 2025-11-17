'use client';

import { useEffect, useState } from 'react';
import studentPOST from '../../../api/studentPOST.api';
import { studentGET } from '../../../api/studentGET.api';
import { roomsGET, roomGET } from '../../../api/roomGET.api';
import { getGradeConfig } from '../../../api/createforms.api';
import styles from './Student.module.css';
import { useRouter } from 'next/navigation';


interface StudentInfo {
  name: string;
  status: string;
}

interface RoomData {
  roomId: string;
  students: StudentInfo[];
}

export default function StudentSignUp() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [status, setStatus] = useState('');
  const [grade, setGrade] = useState('9');
  const [loading, setLoading] = useState(false);

  // Bus/room configuration - now fetched dynamically
  const [maleRooms, setMaleRooms] = useState<number[]>([]);
  const [femaleRooms, setFemaleRooms] = useState<number[]>([]);
  const [numPdfs, setNumPdfs] = useState(1);
  const [pdfNames, setPdfNames] = useState<string[]>([]);

  // Fetch student info, grade config, and rooms whenever grade changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const name = localStorage.getItem('userName') || 'Unknown';
        const email = localStorage.getItem('userEmail');
        if (!email) return console.error('No email found in localStorage');

        // Fetch grade config first
        const config = await getGradeConfig(grade);
        if (config) {
          setMaleRooms(config.maleRooms || []);
          setFemaleRooms(config.femaleRooms || []);
          setNumPdfs(config.numPdfs || 1);
          setPdfNames(config.pdfNames || ['PDF Not Set Up Yet']);
        } else {
          // Raise error if config not found and alert students
          alert("Your admin has not yet set the number of male and female rooms in each bus.");
        }

        // Fetch student info
        const studentData = await studentGET(name, email, grade);
        setUploaded(studentData.pdfs?.length === numPdfs || false);
        setSelectedRoom(studentData.room || '');

        if(studentData.status=="Approved"){
          router.push("/Forms/Student/Roommate");
      }

        // Fetch all rooms
        const roomIds = await roomsGET(grade);

        const roomsWithStudents: RoomData[] = await Promise.all(
          roomIds.map(async (roomId) => {
            try {
              const response = await roomGET(roomId, grade);
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
  
    // Metadata
    formData.append('name', name);
    formData.append('email', email);
    formData.append('grade', grade);
    formData.append('room', "   ");
  

    formData.append("pdfNames", JSON.stringify(pdfNames));
  
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
  

  // Group rooms dynamically per bus
  const groupedByBus: Record<string, { M: RoomData[]; F: RoomData[] }> = {};
  for (let i = 0; i < Math.max(maleRooms.length, femaleRooms.length); i++) {
    const busNum = String(i + 1);
    groupedByBus[busNum] = { M: [], F: [] };

    for (let roomNum = 1; roomNum <= (maleRooms[i] || 0); roomNum++) {
      const roomId = `${busNum}M${roomNum}`;
      const existing = rooms.find((r) => r.roomId === roomId);
      groupedByBus[busNum].M.push(existing || { roomId, students: [] });
    }

    for (let roomNum = 1; roomNum <= (femaleRooms[i] || 0); roomNum++) {
      const roomId = `${busNum}F${roomNum}`;
      const existing = rooms.find((r) => r.roomId === roomId);
      groupedByBus[busNum].F.push(existing || { roomId, students: [] });
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

          {/* File upload and grade selection */}
          <div className={styles.fileUploadContainer}>
            <fieldset className={styles.fileUploadFieldset}>
              <legend>Upload Required PDFs</legend>
              {Array.from({ length: numPdfs }, (_, i) => (
                <div key={i} className={styles.fileInputGroup}>
                  <label htmlFor={`file${i + 1}`}>{pdfNames[i] || `PDF ${i + 1}`}:</label>
                  <input
                    type="file"
                    id={`file${i + 1}`}
                    name={`file${i + 1}`}
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
                  className={styles.gradeSelect}
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
