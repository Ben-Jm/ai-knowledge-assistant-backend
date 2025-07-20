const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { fileId, question } = req.body;

  try {
    const openaiKey = process.env.OPENAI_API_KEY;

    const chatRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-1106-preview',
        messages: [
          { role: 'system', content: 'You are an assistant that answers using only the uploaded document.' },
          { role: 'user', content: question }
        ],
        file_ids: [fileId],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ answer: chatRes.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'AI response failed.' });
  }
};