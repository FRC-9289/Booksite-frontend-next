'use client';

import { useRouter } from 'next/navigation';
import styles from './Central.module.css';

export default function AdminCentral() {
    const router = useRouter();

    const toCreate = () => {
        router.push('/Forms/Admin/Create');
    }

    const toSearch = () => {
        router.push('/Forms/Admin/Search');
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>CHOOSE</h1>
                <button className={styles.button} onClick={toCreate}>
                    Create
                </button>
                <button className={styles.button} onClick={toSearch}>
                    Search
                </button>
            </div>
        </div>
    )
}
//Wolfram121