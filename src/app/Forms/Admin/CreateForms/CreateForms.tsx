'use client';

import { useState, useEffect } from 'react';
import styles from './CreateForms.module.css';
import createGradeConfig from '../../../api/createGradeConfig.api';
import getGradeConfig from '../../../api/getGradeConfig.api';

interface CreateFormsProps {
  isAdmin?: boolean;
}

export default function CreateForms({ isAdmin = false }: CreateFormsProps) {
  const [grade, setGrade] = useState('9');
  const [numBuses, setNumBuses] = useState(3);
  const [maleRooms, setMaleRooms] = useState<number[]>(Array(numBuses).fill(3));
  const [femaleRooms, setFemaleRooms] = useState<number[]>(Array(numBuses).fill(3));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const showAdmin = process.env.NEXT_PUBLIC_PROD === "true" ? isAdmin : true;

  // Your handlers...
  const handleLoadConfig = async () => { /* ... */ };
  const handleSaveConfig = async () => { /* ... */ };
  const updateMaleRooms = (i: number, val: number) => { /* ... */ };
  const updateFemaleRooms = (i: number, val: number) => { /* ... */ };
  const addBus = () => { /* ... */ };
  const removeBus = () => { /* ... */ };

  return showAdmin ? (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Grade Configurations</h1>
      <p className={styles.description}>
        Set the number of male and female rooms for each bus in a grade.
      </p>

      {/* Grade select and load button */}
      <div className={styles.formGroup}>
        <label htmlFor="gradeSelect" className={styles.label}>Grade:</label>
        <select
          id="gradeSelect"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className={styles.select}
        >
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <button onClick={handleLoadConfig} className={styles.button} disabled={loading}>
          Load Existing Config
        </button>
      </div>

      {/* Bus configurations */}
      <div className={styles.configSection}>
        <h2>Bus Configurations</h2>
        <div className={styles.busControls}>
          <button onClick={addBus} className={styles.button}>Add Bus</button>
          <button onClick={removeBus} className={styles.button} disabled={numBuses <= 1}>Remove Bus</button>
        </div>
        {Array.from({ length: numBuses }, (_, busIndex) => (
          <div key={busIndex} className={styles.busConfig}>
            <h3>Bus {busIndex + 1}</h3>
            <div className={styles.roomInputs}>
              <div className={styles.inputGroup}>
                <label>Male Rooms:</label>
                <input
                  type="number"
                  min="0"
                  value={maleRooms[busIndex] || 0}
                  onChange={(e) => updateMaleRooms(busIndex, parseInt(e.target.value) || 0)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Female Rooms:</label>
                <input
                  type="number"
                  min="0"
                  value={femaleRooms[busIndex] || 0}
                  onChange={(e) => updateFemaleRooms(busIndex, parseInt(e.target.value) || 0)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSaveConfig} className={styles.saveButton} disabled={loading}>
        {loading ? 'Saving...' : 'Save Configuration'}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  ) : (
    <label>You are not authorized to view this page</label>
  );
}
