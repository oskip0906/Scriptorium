import path from "path";
import fs from "fs";
import prisma from "@/lib/prisma";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;
  

    if (!id) {
      return res.status(400).json({ error: "Invalid Avatar" });
    }
    try {
      const filePath = path.join(__dirname, `../avatars/${id}`);
      const imageBuffer = fs.readFileSync(filePath);
      //res.setHeader("Content-Type", "image/jpg");
      //res.send(imageBuffer)
      res.status(200).json({ imageBuffer})
    } 
    catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Avatar not found" });
    }
  } else {
    return res.status(404).json({ error: "Not found" });
  }
}
