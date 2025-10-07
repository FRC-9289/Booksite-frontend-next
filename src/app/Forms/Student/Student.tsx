'use client';

import studentPOST from '../../api/studentPOST.api';
import { studentGET } from '../../api/studentGET.api';
import { roomsGET } from '../../api/roomGET.api';
import styles from './Student.module.css';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function StudentSignUp() {
  const [uploaded, setUploaded] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [status, setStatus] = useState('');
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  const buses = ['1', '2', '3'];
  const roomsPerBus = ['1', '2', '3'];
  const genders = ['M', 'F'];
  const slotsPerRoom = 2;

  useEffect(() => {
    async function fetchData() {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) return;

        const student = await studentGET(email);
        setSelectedSlot(student?.room || '');
        setUploaded(student?.pdfs?.length === 3);

        const usedSlots = await roomsGET(); // fetch already taken slot IDs
        setTakenSlots(usedSlots);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!selectedSlot) {
      setStatus('Please select a slot');
      return;
    }
  
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setStatus('Missing email');
      return;
    }
  
    // Create FormData from form inputs (includes PDFs automatically)
    const formData = new FormData(e.currentTarget);
  
    // Append other fields
    formData.append('email', email);
    formData.append('room', selectedSlot);
    formData.append('name', localStorage.getItem('userName') || 'Unknown');
  
    // Optional: ensure files are actually selected before sending
    for (let i = 1; i <= 3; i++) {
      const file = formData.get(`file${i}`);
      if (!(file instanceof File)) {
        setStatus(`Please select PDF ${i}`);
        return;
      }
    }
  
    try {
      const response = await studentPOST(formData);
      setStatus('Signup successful!');
      setUploaded(true);
      toast.success('Signup successful! Submission ID: ' + response.submissionId);
    } catch (err) {
      setStatus('Signup failed');
      console.error(err);
      toast.error('Signup failed. Please try again.');
    }
  };
  

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      {/* form */}
      <h2 className={styles.heading}>Village Robotics 9289 Sign Up</h2>
      <form onSubmit={handleSubmit} className={styles.formLayout}>
        {/* Bus + Slots Section */}
        <div className={styles.busContainer}>
          {buses.map((bus) => (
            <fieldset key={bus} className={styles.busFieldset}>
              <legend>Bus {bus}</legend>
              <div className={styles.genderContainer}>
                {genders.map((gender) => (
                  <fieldset key={gender} className={styles.genderFieldset}>
                    <legend>{gender === 'M' ? 'Male Rooms' : 'Female Rooms'}</legend>
                    {roomsPerBus.map((roomNum) => (
                      <div key={roomNum} className={styles.roomContainer}>
                        <p>Room {roomNum}</p>
                        {Array.from({ length: slotsPerRoom }).map((_, slotIndex) => {
                          const slotId = `${bus}${gender}${roomNum}${slotIndex + 1}`;
                          const disabled = takenSlots.includes(slotId);
                          return (
                            <label key={slotId} className={styles.radioOption}>
                              <input
                                type="radio"
                                name="slot_select"
                                value={slotId}
                                checked={selectedSlot === slotId}
                                onChange={(e) => setSelectedSlot(e.target.value)}
                                required
                                disabled={disabled}
                              />
                              <span className={styles.radioLabel}>
                                Slot {slotIndex + 1} {disabled ? '(Taken)' : ''}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </fieldset>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        {/* PDF Upload Section */}
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

        <button type="submit" className={styles.button}>Sign Up / Update</button>
        <p className={styles.status}>{status}</p>
      </form>
    </div>
  );
}
