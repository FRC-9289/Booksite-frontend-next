'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import getsubmissions from '../../../api/getsubmissions.api';
import updateStatus from '../../../api/updateStatus.api';
import { fetchAllComments, pushComment } from '../../../api/comment.api';

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [activeCommentPanelId, setActiveCommentPanelId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [commentHistory, setCommentHistory] = useState([])

  const commentStateChange = async (submissionId) => {
    if (!comment.trim()) return; // ignore empty comments
  
    console.log("Comment:", comment);
    console.log("Submission:", submissionId);
  
    try {
      const { success, commentId } = await pushComment(comment, submissionId);
      if (success) {
        console.log("✅ Comment added:", commentId);
        setComment("");
      } else {
        console.error("❌ Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }

    loadComments(submissionId);
  };


  useEffect(() => {

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

  const handlePress = (submissionId: string) => {
    // If clicking the same button, close it; otherwise open this one
    setActivePanelId(prev => (prev === submissionId ? null : submissionId));
  };

  const loadCommentScreen = (submissionId: string) => {
    setActiveCommentPanelId(prev => (prev == submissionId ? null : submissionId));

    loadComments(submissionId);
  }
  
  

  useEffect(() => {
    if (!isAdmin) loadSubmissions();
  }, [isAdmin]);

  const loadComments = async (submissionId: string) => {
    const comments = await fetchAllComments(submissionId);
    setCommentHistory(comments.comments);
    console.log("Comments: ",comments);
  }

  if (loading) return <p>Loading...</p>;

  const getColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Approved':
        return 'green';
      case 'Denied':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleStatusChange = async (submissionId: string, newStatus: string, email: string) => {
    try {
      const res = await updateStatus(submissionId, newStatus);
      // Reload submissions after update
      await loadSubmissions();
      if(!res.success){
        throw new Error(await res);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const addComment = async (comment, submissionId) => {
    console.log(`Comment: ${comment}`);
    console.log(`Submission: ${submissionId}`);
    const { success, commentId } = await pushComment(comment, submissionId);
  }

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
      {!isAdmin ? (
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <h2 className={styles.heading}>Admin Dashboard</h2>
  
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
            </select>
          </div>
  
          <input
            type="text"
            placeholder="Search by Name, Email, Grade, SubmissionId, Bus (Bus [n]), Room (Room [n]), Gender..."
            className={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
  

          {filteredSubmissions.length === 0 ? (
            <p>No submissions found.</p>
          ) : (
            filteredSubmissions.map((submission, i) => (
              <div className={styles.submission} key={i}>
              <div className={styles.manage} >
                <div>
                <p><strong>Submission ID:</strong> {submission._id}</p>
                <p><strong>Name:</strong> {submission.name}</p>
                <p><strong>Grade:</strong> {submission.grade}</p>
                <p><strong>Email:</strong> {submission.email}</p>
                <p><strong>Bus:</strong> {submission.room[0]}</p>
                <p>
                  <strong>Room:</strong>{" "}
                  {submission.room[1] === "M" ? "Male" : "Female"} {submission.room[2]}
                </p>
                </div>
                <div 
                className={styles.addComment}
                onClick={() => handlePress(submission._id)}
                >
                  <div className={styles.threedots}></div>
                  <div className={styles.threedots}></div>
                  <div className={styles.threedots}></div>
                </div>
                {activePanelId === submission._id && (
                  <div className={styles.panel}>
                    <button className={styles.panelButton}
                    onClick={() => loadCommentScreen(submission._id)}>Add Comment</button>
                  {
                    activeCommentPanelId == submission._id && (
                      <div className={styles.commentScreen}>
                        <div className={styles.textContainer}>
                            {commentHistory.map((comment, i) => (
                              <div className={styles.commentBubble} key={comment._id}>
                                <label>{comment.text}</label>
                              </div>
                            ))}
                        </div>
                        <div className={styles.sendContainer}>
                        <input type='text' placeholder="enter comment here" className={styles.commentInput} onChange={(e) => setComment(e.target.value)}></input>
                          <button
                          className={styles.sendButton}
                          onClick={() => commentStateChange(submission._id)}
                          >
                          </button>
                        </div>
                      </div>
                    )
                  }
                  </div>
                )}
                </div>
  
                {/* Display uploaded files */}
                <div className={styles.filesContainer}>
                  {submission.filesData?.map((file, j) => (
                    <button
                      key={file.fileId}
                      className={styles.fileButton}
                      onClick={() => {
                        const byteCharacters = atob(file.base64);
                        const byteNumbers = Array.from(byteCharacters, (c) =>
                          c.charCodeAt(0)
                        );
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: "application/pdf" });
                        const blobUrl = URL.createObjectURL(blob);
                        window.open(blobUrl, "_blank");
                      }}
                    >
                      {file.fileName}
                    </button>
                  ))}
                </div>
                <div className={styles.statusContainer}>
                <p style={{ color: getColor(submission.status) }}>
                  <select
                    value={submission.status}
                    onChange={(e) =>
                      handleStatusChange(submission._id, e.target.value, submission.email)
                    }
                    className={styles.statusFilter}
                    style={{ color: getColor(submission.status) }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Denied">Denied</option>
                  </select>
                </p>
                </div>
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
