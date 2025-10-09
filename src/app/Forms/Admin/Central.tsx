'use client';

import { useRouter } from 'next/navigation';
import styles from './Admin.module.css';

export default function AdminCentral() {
    const router = useRouter();

    const toCreate = () => {
        router.push('/Forms/Admin/Create.tsx');
    }

    const toSearch = () => {
        router.push('Forms/Admin/Search.tsx');
    }

    return (
        <div className={styles.containerC}>
            <div className={styles.cardC}>
                <h1 className={styles.titleC}>CHOOSE</h1>
                <button className={styles.buttonC} onClick={toCreate}>
                    Create
                </button>
                <button className={styles.buttonC} onClick={toSearch}>
                    Search
                </button>
            </div>
        </div>
    )
}
//Wolfram121