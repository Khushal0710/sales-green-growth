export default async function handler(req, res) {
  try {
    const response = await fetch('https://n8n.warpdrivetech.in/webhook/dashboard', {
      method: 'POST',  // Changed to match your update
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add any required authentication headers here
        // 'Authorization': 'Bearer your_token_here',
      },
      // Add body if your POST request requires it
      // body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in dashboard API route:', error);
    res.status(500).json({ error: error.message });
  }
}
