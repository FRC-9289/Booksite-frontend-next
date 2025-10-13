'use client';

import React from "react";
import styles from './Dashboard.module.css';

export default function Dashboard() {
    return (
        <div>
            <p>Hello {localStorage.getItem("userName")}</p>
            <p>Welcome to the Admin Dashboard</p>
            <div className={styles.buttonContainer}>
                <button className={styles.button}>Review Forms</button>
                <button className={styles.button}>Create Forms</button>
            </div>
        </div>
    )
}