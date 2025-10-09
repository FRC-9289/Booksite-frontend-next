'use client';

import { useState } from 'react';
import styles from './Admin.module.css';
import { createRoomsPOST } from '../../api/roomsPOST.api';

type RoomData = { bus: number; gender: 'M' | 'F'; room: number };

export default function AdminCreateRooms() {
    const [grade, setGrade] = useState<number | ''>('');
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [status, setStatus] = useState('');

    const addRoom = () => {
        setRooms([...rooms, { bus: 1, gender: 'M', room: 1 }]);
    };

    const updateRoom = <K extends keyof RoomData>(
        index: number,
        key: K,
        value: RoomData[K]
    ) => {
        const newRooms = [...rooms];
        newRooms[index] = { ...newRooms[index], [key]: value };
        setRooms(newRooms);
    };

    const removeRoom = (index: number) => {
        setRooms(rooms.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!grade || rooms.length === 0) {
            setStatus('Please select a grade and add at least one room.');
            return;
        }

        const roomIds = rooms.map((r) => `${r.bus}${r.gender}${r.room}`);

        try {
            await createRoomsPOST(Number(grade), roomIds);
            setStatus('Rooms created successfully!');
            setRooms([]);
        } catch (err) {
            console.error(err);
            setStatus('Failed to create rooms.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Admin – Create Rooms</h2>

            <fieldset className={styles.fileUploadFieldset}>
                <legend>Grade</legend>
                <label>Grade:</label>
                <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className={styles.input}
                >
                    <option value="">-- Select Grade --</option>
                    {Array.from({ length: 8 }, (_, i) => 5 + i).map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>
            </fieldset>

            <fieldset className={styles.fileUploadFieldset}>
                <legend>Rooms</legend>
                {rooms.map((r, i) => (
                    <div key={i} className={styles.group}>
                        <label>Bus:</label>
                        <input
                            type="number"
                            min={1}
                            value={r.bus}
                            onChange={(e) => updateRoom(i, 'bus', Number(e.target.value))}
                            className={styles.input}
                        />

                        <label>Gender:</label>
                        <select
                            value={r.gender}
                            onChange={(e) => updateRoom(i, 'gender', e.target.value as 'M' | 'F')}
                            className={styles.input}
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>

                        <label>Room #:</label>
                        <input
                            type="number"
                            min={1}
                            value={r.room}
                            onChange={(e) => updateRoom(i, 'room', Number(e.target.value))}
                            className={styles.input}
                        />

                        <button
                            type="button"
                            onClick={() => removeRoom(i)}
                            className={styles.button}
                            style={{ background: '#992d2d', marginTop: '0.5em' }}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addRoom} className={styles.button}>
                    + Add Room
                </button>
            </fieldset>

            {rooms.length > 0 && (
                <button onClick={handleSubmit} className={styles.button}>
                    Create Rooms
                </button>
            )}

            {status && <p className={styles.status}>{status}</p>}
        </div>
    );
}
//Wolfram121