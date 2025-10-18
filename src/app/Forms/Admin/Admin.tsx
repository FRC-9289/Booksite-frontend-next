'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import getsubmissions from '../../api/getsubmissions.api';
import updateStatus from '../../api/updateStatus.api';
import sendEmail from '../../api/sendEmail.api';
import createGradeConfig from '../../api/createGradeConfig.api';

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(true);

  const [configGrade, setConfigGrade] = useState('9');
  const [maleRooms, setMaleRooms] = useState<number[]>([3, 3, 3]); // Default for 3 buses
  const [femaleRooms, setFemaleRooms] = useState<number[]>([3, 3, 3]); // Default for 3 buses

  useEffect(() => {
    // ✅ Runs only in the browser
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    setLoading(false);
  }, []);

  const loadSubmissions = async () => {
    const res = await getsubmissions();

    // Strip large base64s
    const lightweight = res.map(s => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      status: s.status,
      grade: s.grade,
      room: s.room
    }));

    localStorage.setItem('submissions_meta', JSON.stringify(lightweight));
    setSubmissions(res);
  };
  

  useEffect(() => {
    if (isAdmin) loadSubmissions();
  }, [isAdmin]);

  if (loading) return <p>Loading...</p>;

  const getColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleStatusChange = async (submissionId: string, newStatus: string, email: string) => {
    try {
      await updateStatus(submissionId, newStatus);
      // Send email if approved or rejected
      if (newStatus === 'approved' || newStatus === 'rejected') {
        await sendEmail(email, newStatus);
      }
      // Reload submissions after update
      await loadSubmissions();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleCreateConfig = async () => {
    try {
      await createGradeConfig(configGrade, maleRooms, femaleRooms);
      alert('Buses created successfully!');
    } catch (error) {
      console.error('Failed to create buses:', error);
      alert('Failed to create buses. Please try again.');
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const term = search.toLowerCase();
    const matchesSearch = (
      s.name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s._id?.toLowerCase().includes(term) ||
      String(s.grade)?.toLowerCase().includes(term) ||
      ("Bus "+s.room[0]).toLowerCase().includes(term) ||
      ("Room "+s.room[2]).toLowerCase().includes(term) ||
      (s.room[1] == "M" ? "Male" : "Female").toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {isAdmin ? (
        <div className={styles.container}>
          <h2 className={styles.heading}>Admin Dashboard</h2>

          {/* Buses Creation Section */}
          <div className={styles.configSection}>
            <h3>Create Buses and Rooms</h3>
            <div className={styles.configForm}>
              <label>
                Grade:
                <select value={configGrade} onChange={(e) => setConfigGrade(e.target.value)}>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </label>
              <div className={styles.roomInputs}>
                <div>
                  <h4>Male Rooms per Bus</h4>
                  {maleRooms.map((count, i) => (
                    <label key={i}>
                      Bus {i + 1}: {/* if there are i rooms, they will be found in the bus i + 1 based on what Aditya told me */}
                      <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => {
                          const newMale = [...maleRooms];
                          newMale[i] = parseInt(e.target.value) || 0;
                          setMaleRooms(newMale);
                        }}
                      />
                    </label>
                  ))}
                </div>
                <div>
                  <h4>Female Rooms per Bus</h4>
                  {femaleRooms.map((count, i) => (
                    <label key={i}>
                      Bus {i + 1}:
                      <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => {
                          const newFemale = [...femaleRooms];
                          newFemale[i] = parseInt(e.target.value) || 0;
                          setFemaleRooms(newFemale);
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={handleCreateConfig} className={styles.button}>Create Buses and Rooms</button>
            </div>
          </div>

          <div className={styles.filters}>
            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <input
              type="text"
              placeholder="Search by Name, Email, Grade, SubmissionId, Bus (Bus [n]), Room (Room [n]), Gender..."
              className={styles.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
  
          {filteredSubmissions.length === 0 ? (
            <p>No submissions found.</p>
          ) : (
            filteredSubmissions.map((submission, i) => (
              <div className={styles.submission} key={i}>
                <p><strong>Submission ID:</strong> {submission._id}</p>
                <p><strong>Name:</strong> {submission.name}</p>
                <p><strong>Grade:</strong> {submission.grade}</p>
                <p><strong>Email:</strong> {submission.email}</p>
                <p style={{ color: getColor(submission.status) }}>
                  <strong>Status:</strong>
                  <select
                    value={submission.status}
                    onChange={(e) => handleStatusChange(submission._id, e.target.value, submission.email)}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </p>
                <p><strong>Bus:</strong> {submission.room[0]}</p>
                <p>
                  <strong>Room:</strong>{" "}
                  {submission.room[1] === "M" ? "Male" : "Female"}{" "}
                  {submission.room[2]}
                </p>

                {/* Display uploaded files */}
                <div className={styles.filesContainer}>
              {submission.filesData?.map((file, j) => (
                <button
                  key={j}
                  className={styles.fileButton}
                  onClick={() => {
                    // Convert Base64 → Blob → Object URL
                    const byteCharacters = atob(file.base64);
                    const byteNumbers = new Array(byteCharacters.length)
                      .fill(0)
                      .map((_, i) => byteCharacters.charCodeAt(i));
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: "application/pdf" });
                    const blobUrl = URL.createObjectURL(blob);

                    // Open in a new tab
                    window.open(blobUrl, "_blank");
                  }}
                >
                  {file.fileName}
                </button>
              ))}
            </div>

                {/* TODO: Comments Section - Aditya implement for admin here probably */}

              </div>
            ))
          )}
        </div>
      ) : (
        <p>You are not authorized to view this page</p>
      )}
    </>
  );
  
}
