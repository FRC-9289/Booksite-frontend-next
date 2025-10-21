'use client';

import { useState, useEffect } from 'react';
import styles from './CreateForms.module.css';
import { getGradeConfig, createGradeConfig } from '../../../api/createforms.api';

interface CreateFormsProps {
  isAdmin?: boolean;
}

export default function CreateForms({ isAdmin = false }: CreateFormsProps) {
  const [grade, setGrade] = useState('9');
  const [numBuses, setNumBuses] = useState(0);
  const [maleRooms, setMaleRooms] = useState<number[]>([]);
  const [femaleRooms, setFemaleRooms] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // ✅ Always call hooks before any conditional returns
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      handleLoadConfig();
    }
  }, [grade, mounted]);

  const showAdmin = process.env.NEXT_PUBLIC_PROD === "true" ? isAdmin : true;

  const handleLoadConfig = async () => {
    setLoading(true);
    try {
      const config = await getGradeConfig(grade);
      if (config) {
        const loadedMaleRooms = config.maleRooms || [];
        const loadedFemaleRooms = config.femaleRooms || [];

        if (loadedMaleRooms.length === 0 && loadedFemaleRooms.length === 0) {
          // 👇 Default: no buses
          setNumBuses(0);
          setMaleRooms([]);
          setFemaleRooms([]);
          setMessage('No buses configured for this grade');
        } else {
          const busCount = Math.max(
            loadedMaleRooms.length,
            loadedFemaleRooms.length
          );
          setNumBuses(busCount);
          setMaleRooms(
            loadedMaleRooms.length === busCount
              ? loadedMaleRooms
              : [
                  ...loadedMaleRooms,
                  ...Array(busCount - loadedMaleRooms.length).fill(3),
                ]
          );
          setFemaleRooms(
            loadedFemaleRooms.length === busCount
              ? loadedFemaleRooms
              : [
                  ...loadedFemaleRooms,
                  ...Array(busCount - loadedFemaleRooms.length).fill(3),
                ]
          );
          setMessage('Config loaded successfully');
        }
      } else {
        setNumBuses(0);
        setMaleRooms([]);
        setFemaleRooms([]);
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

  const addBus = () => {
    setNumBuses(numBuses + 1);
    setMaleRooms([...maleRooms, 3]);
    setFemaleRooms([...femaleRooms, 3]);
  };

  const removeBus = () => {
    if (numBuses > 0) {
      setNumBuses(numBuses - 1);
      setMaleRooms(maleRooms.slice(0, -1));
      setFemaleRooms(femaleRooms.slice(0, -1));
    }
  };

  // ✅ Hooks always run before conditional return
  if (!mounted) {
    return <></>; // Empty until client-side hydration
  }

  return showAdmin ? (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Grade Configurations</h1>
      <p className={styles.description}>
        Set the number of male and female rooms for each bus in a grade.
      </p>

      {/* Grade selector */}
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
        <button
          onClick={handleLoadConfig}
          className={styles.button}
          disabled={loading}
        >
          Load Existing Config
        </button>
      </div>

      {/* Bus configuration section */}
      <div className={styles.configSection}>
        <h2>Bus Configurations</h2>
        <div className={styles.busControls}>
          <button onClick={addBus} className={styles.button}>Add Bus</button>
          <button
            onClick={removeBus}
            className={styles.button}
            disabled={numBuses <= 0}
          >
            Remove Bus
          </button>
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
                  onChange={(e) =>
                    updateMaleRooms(busIndex, parseInt(e.target.value) || 0)
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Female Rooms:</label>
                <input
                  type="number"
                  min="0"
                  value={femaleRooms[busIndex] || 0}
                  onChange={(e) =>
                    updateFemaleRooms(busIndex, parseInt(e.target.value) || 0)
                  }
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveConfig}
        className={styles.saveButton}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Configuration'}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  ) : (
    <label>You are not authorized to view this page</label>
  );
}
