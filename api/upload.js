const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    const { fileUrl } = req.body;
    const openaiKey = process.env.OPENAI_API_KEY;

    const fileRes = await axios.get(fileUrl, { responseType: 'stream' });
    const formData = new FormData();
    formData.append('file', fileRes.data, 'document.pdf');
    formData.append('purpose', 'assistants');

    const uploadRes = await axios.post('https://api.openai.com/v1/files', formData, {
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        ...formData.getHeaders(),
      },
    });

    res.status(200).json({ fileId: uploadRes.data.id });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Upload failed.' });
  }
};
