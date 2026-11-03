const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS so your WordPress site can communicate with Render
app.use(cors());
app.use(express.json());

// Your provided API Credentials (We will set these in Render Environment Variables)
const CLIENT_KEY = process.env.CLIENT_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Health check endpoint
app.get('/', (req, res) => {
    res.send('EditProTips Downloader API is running.');
});

// The download endpoint your frontend calls
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: 'URL is required.' });
    }

    try {
        // =====================================================================
        // OPTION 1: YOUR PROVIDER API (Uncomment and configure this block)
        // If your provider uses a Bearer token or Basic auth, use this format.
        // =====================================================================
        /*
        const providerResponse = await axios.post('YOUR_PROVIDER_API_ENDPOINT', 
            { url: url },
            {
                headers: {
                    'Authorization': `Bearer ${CLIENT_KEY}`,
                    'X-Client-Secret': CLIENT_SECRET, // Depends on your provider's docs
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Extract the video URL based on your provider's JSON response structure
        const videoUrl = providerResponse.data.video_url; 
        */

        // =====================================================================
        // OPTION 2: WORKING PUBLIC FALLBACK API (For immediate testing)
        // This uses a free TikTok scraper API so your tool works right now.
        // =====================================================================
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);
        
        const apiData = response.data;

        // Check if the API successfully extracted the video
        if (apiData.code !== 0 || !apiData.data) {
            return res.status(404).json({ 
                success: false, 
                message: 'Could not extract video. It may be private or region-locked.' 
            });
        }

        // Extract the no-watermark MP4 URL
        const videoUrl = apiData.data.play; 
        const title = apiData.data.title || 'tiktok-video';

        // Return the success response to your frontend
        return res.json({
            success: true,
            downloadUrl: videoUrl,
            title: title
        });

    } catch (error) {
        console.error('API Error:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to process the video. Please try again later.' 
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
