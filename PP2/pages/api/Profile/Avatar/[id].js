import path from "path";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;
  

    if (!id) {
      return res.status(400).json({ error: "Invalid Avatar" });
    }
    try {
      const filePath = path.join(process.cwd(), "public", "avatars", id);

      console.log(filePath);
      
      res.status(200).json({filePath})
    } 
    catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Avatar not found" });
    }
  } else {
    return res.status(404).json({ error: "Not found" });
  }
}
