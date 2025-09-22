export default async function auth(id, name, email, bus) {
  
    try {
      const response = await fetch(process.env.BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BACKEND_TOKEN}`,
        },
        body: JSON.stringify({
          id,
          name,
          email,
          bus,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error('Error during authentication:', error);
      throw error;
    }
  }
  