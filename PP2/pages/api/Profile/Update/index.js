import prisma from "@/lib/prisma";
import verifyUser from "@/lib/verifyUser";

async function handler(req, res) {
  if (req.method === "PATCH") {
    try {
      const { firstName, lastName, email, userName, phoneNumber } = req.body;
      const user = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          firstName,
          lastName,
          email,
          userName,
          phoneNumber,
        },
      });
      return res.status(200).json({ user });
    }
    catch (error){
      return res.status(500).json({ error: error.message });
    }
  }
}

export default verifyUser(handler);