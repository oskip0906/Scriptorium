const jwt = require("jsonwebtoken");
import prisma from "@/lib/prisma";

function checkAccess(accessToken){
    try {
        const accessData = jwt.verify(accessToken, process.env.JWT_SECRET);
        return accessData
    }
    catch {
        return null
    }
}

export default async function refresh(req, res) {

    const { accessToken, refreshToken } = req.body;
    var newAccessToken = null
    if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token is required" });
    }

    const accessData = checkAccess(accessToken);
    if (accessData) {
        newAccessToken = accessToken
        return res.status(200).json({ token: newAccessToken });
    }

    try {
        const refreshData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const userData = await prisma.user.findFirst({
            where: { id: refreshData.id }
        })
        if(!userData){
            return null
        }
        const newAccess = {
            userName: userData.userName,
            id: userData.id,
            role: userData.role
        }

        newAccessToken = jwt.sign(
            {
                data: newAccess
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return res.status(200).json({ token: newAccessToken });
    }
    catch (error){
        return res.status(500).json({ error: error.message });
    } 

}