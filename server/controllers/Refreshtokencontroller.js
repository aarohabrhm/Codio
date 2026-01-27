// Add this to your authcontroller.js file

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
        
        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '15m' } // Standard 15min expiry for refreshed tokens
        );

        res.status(200).json({ 
            accesstoken: newAccessToken,
            message: "Token refreshed successfully"
        });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};