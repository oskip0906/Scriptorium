import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export default function verifyUser(handler) {

    return async function(req, res) {

        const auth_header = req.headers.authorization;

        if (!auth_header) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = auth_header.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        try {
            const decoded_payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = decoded_payload.data;

            const codeTemplate = await prisma.CodeTemplate.findUnique({
                where: { id: parseInt(req.query.id) },
            });

            if (!codeTemplate) {
                return res.status(404).json({ error: "Code template not found" });
            }

            if (codeTemplate.createdUserId !== user.id) {
                return res.status(403).json({ error: "Access forbidden: template does not belong to user" });
            }

            return handler(req, res);
        } 
        catch (error) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

    };

}