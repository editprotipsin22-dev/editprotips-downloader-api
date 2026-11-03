// Inside server.js
app.post("/api/download", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "URL required" });

    try {
        // 1. Call your video provider using process.env.CLIENT_KEY and process.env.CLIENT_SECRET
        // 2. Extract the direct MP4 URL
        // 3. Return { success: true, downloadUrl: "https://..." }
        
        const videoUrl = await getVideoFromProvider(url); 
        res.json({ success: true, downloadUrl: videoUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch video" });
    }
});
