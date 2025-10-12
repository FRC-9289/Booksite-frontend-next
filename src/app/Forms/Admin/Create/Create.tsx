'use client';

import { useState } from 'react';
import styles from './Create.module.css';
import { roomsPOST } from '../../../api/roomsPOST.api';

type BusData = { bus: number; maleRooms: number; femaleRooms: number };

export default function AdminCreateRooms() {
  const [grade, setGrade] = useState<number | ''>('');
  const [buses, setBuses] = useState<BusData[]>([]);
  const [status, setStatus] = useState('');

  const addBus = () => setBuses([...buses, { bus: 1, maleRooms: 1, femaleRooms: 1 }]);

  const updateBus = <K extends keyof BusData>(index: number, key: K, value: BusData[K]) => {
    const newBuses = [...buses];
    newBuses[index] = { ...newBuses[index], [key]: value };
    setBuses(newBuses);
  };

  const removeBus = (index: number) => setBuses(buses.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!grade || buses.length === 0) {
      setStatus('Please select a grade and add at least one bus.');
      return;
    }

    const roomIds: string[] = [];
    buses.forEach((bus) => {
      for (let i = 1; i <= bus.maleRooms; i++) roomIds.push(`${bus.bus}M${i}`);
      for (let i = 1; i <= bus.femaleRooms; i++) roomIds.push(`${bus.bus}F${i}`);
    });

    try {
      await roomsPOST(Number(grade), roomIds);
      setStatus('Rooms created successfully!');
      setBuses([]);
    } catch (err) {
      console.error(err);
      setStatus('Failed to create rooms.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin – Create Rooms</h2>

      <div className={styles.formLayout}>
        <fieldset className={styles.fieldset}>
          <legend>Grade</legend>
          <select
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
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

        <fieldset className={styles.fieldset}>
          <legend>Buses</legend>
          <div className={styles.busRoomsContainer}>
            {buses.map((bus, i) => (
              <div key={i} className={styles.group}>
                <label>Bus:</label>
                <input
                  type="number"
                  min={1}
                  value={bus.bus}
                  onChange={(e) => updateBus(i, 'bus', Number(e.target.value))}
                  className={styles.input}
                />

                <label>Male Rooms:</label>
                <input
                  type="number"
                  min={0}
                  value={bus.maleRooms}
                  onChange={(e) => updateBus(i, 'maleRooms', Number(e.target.value))}
                  className={styles.input}
                />

                <label>Female Rooms:</label>
                <input
                  type="number"
                  min={0}
                  value={bus.femaleRooms}
                  onChange={(e) => updateBus(i, 'femaleRooms', Number(e.target.value))}
                  className={styles.input}
                />

                <button
                  type="button"
                  onClick={() => removeBus(i)}
                  className={styles.button}
                  style={{ background: '#992d2d', marginTop: '0.5em' }}
                >
                  Remove Bus
                </button>
              </div>
            ))}

            <button type="button" onClick={addBus} className={styles.button}>
              + Add Bus
            </button>
          </div>
        </fieldset>

        {buses.length > 0 && (
          <button onClick={handleSubmit} className={styles.button}>
            Create Rooms
          </button>
        )}

        {status && <p className={styles.status}>{status}</p>}
      </div>
    </div>
  );
}
//Wolfram121