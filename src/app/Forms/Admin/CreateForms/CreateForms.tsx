'use client';

import { useState } from 'react';
import styles from './CreateForms.module.css';
import createGradeConfig from '../../../api/createGradeConfig.api';
import getGradeConfig from '../../../api/getGradeConfig.api';

export default function CreateForms() {
  const [grade, setGrade] = useState('9');
  const [maleRooms, setMaleRooms] = useState<number[]>([3, 3, 3]); // Default for 3 buses
  const [femaleRooms, setFemaleRooms] = useState<number[]>([3, 3, 3]); // Default for 3 buses
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoadConfig = async () => {
    setLoading(true);
    try {
      const config = await getGradeConfig(grade);
      if (config) {
        setMaleRooms(config.maleRooms || [3, 3, 3]);
        setFemaleRooms(config.femaleRooms || [3, 3, 3]);
        setMessage('Config loaded successfully');
      } else {
        setMessage('No config found for this grade');
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      setMessage('Failed to load config');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      await createGradeConfig(grade, maleRooms, femaleRooms);
      setMessage('Config saved successfully');
    } catch (error) {
      console.error('Failed to save config:', error);
      setMessage('Failed to save config');
    } finally {
      setLoading(false);
    }
  };

  const updateMaleRooms = (busIndex: number, value: number) => {
    const newRooms = [...maleRooms];
    newRooms[busIndex] = value;
    setMaleRooms(newRooms);
  };

  const updateFemaleRooms = (busIndex: number, value: number) => {
    const newRooms = [...femaleRooms];
    newRooms[busIndex] = value;
    setFemaleRooms(newRooms);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Grade Configurations</h1>
      <p className={styles.description}>
        Set the number of male and female rooms for each bus in a grade.
      </p>

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

      <div className={styles.configSection}>
        <h2>Bus Configurations</h2>
        {[0, 1, 2].map((busIndex) => (
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
  );
}
