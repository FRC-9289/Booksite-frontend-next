export function getAuthHeaders(token?: string): Record<string, string> {
    return token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
  
  }
  