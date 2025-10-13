'use client';

import React from "react";
import styles from './Dashboard.module.css';
import { useState, useEffect } from "react";

export default function Dashboard() {
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        const name = localStorage.getItem("userName");
        if (name) setUserName(name);
    }, []);
    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.pHeader}>Hello {userName}</h1>
            </div>
            <div className={styles.centerContainer}>
                <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={
                        () => {
                            window.location.href = '/Forms/Admin/Review';
                        }
                    }>Review Forms</button>
                    <button className={styles.button} onClick={
                        () => {
                            window.location.href = '/Forms/Admin/CreateForms';
                        }
                    }>Create Forms</button>
                </div>
            </div>

            <div>
                <h2 className={styles.h2}>Notifications</h2>
                <div className={styles.notificationBar}></div>
            </div>
        </>
    )
}