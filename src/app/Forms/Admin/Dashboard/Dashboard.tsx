'use client';

import React, { useState, useEffect } from "react";
import styles from './Dashboard.module.css';

interface DashboardProps {
    isAdmin?: boolean;
}

export default function Dashboard({ isAdmin = false }: DashboardProps) {
    const [userName, setUserName] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // This runs only on the client
        const name = localStorage.getItem("userName");
        if (name) setUserName(name);
        setMounted(true); // indicate that client has mounted
    }, []);

    // Don't render until client has mounted
    if (!mounted) return null;

    // Check admin only on PROD
    const showAdmin = process.env.NEXT_PUBLIC_PROD === "true" ? isAdmin : true;

    return showAdmin ? (
                <>
                    <div className={styles.header}>
                        <h1 className={styles.pHeader}>Hello {userName}</h1>
                    </div>
                    <div className={styles.centerContainer}>
                        <div className={styles.buttonContainer}>
                            <button className={styles.button} onClick={() => window.location.href = '/Forms/Admin/Review'}>
                                Review Forms
                            </button>
                            <button className={styles.button} onClick={() => window.location.href = '/Forms/Admin/CreateForms'}>
                                Create Forms
                            </button>
                        </div>
                    </div>
                    <div>
                        <h2 className={styles.h2}>Notifications</h2>
                        <div className={styles.notificationBar}></div>
                    </div>
                </>
            ) : (
                <label>You are not authorized to be here</label>
            )
}
