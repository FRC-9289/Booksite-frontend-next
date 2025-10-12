export async function sendApprovalEmail(to: string, userName: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sendMail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          userName,
          status: "approved",
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send approval email: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in sendApprovalEmail:", error);
      throw error;
    }
  }

  export async function sendRejectionEmail(to: string, userName: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sendMail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          userName,
          status: "rejected",
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send rejection email: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in sendRejectionEmail:", error);
      throw error;
    }
  }

  export async function sendPendingEmail(to: string, userName: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sendMail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          userName,
          status: "pending", 
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send rejection email: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in sendPendingEmail:", error);
      throw error;
    }
  }
  // Brainspark1