import prisma from "@/lib/prisma";
import verifyUser from "@/lib/verifyUser";
import fs from "node:fs/promises";
import path from "path";

import {
  generateRandomId,
} from "../../utils/utils";

import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function modifyAvatar(req, res) {
  if (req.method === "POST") {
    try {
      const userId = req.user.id;
      const fileId = `${userId}-${generateRandomId(12)}`;

      const form = formidable({ multiples: false });
      const data = await form.parse(req);
      const file = data[1].file[0];

      if (!file) {
        return res.json({ error: "Bad request" }, { status: 400 });
      }

      const fileExtension =
        file.originalFilename.split(".")[
          file.originalFilename.split(".").length - 1
        ];
      const uploadDir = path.join(process.cwd(), "public", "avatars");
      await fs.mkdir(uploadDir, { recursive: true });
      const newFilePath = `${uploadDir}/${fileId}.${fileExtension}`;

      await fs.rename(file.filepath, newFilePath);

      const response = await prisma.user.update({
        where: { id: userId },
        data: {
          avatar: `/avatars/${fileId}.${fileExtension}`,
        },
      });

      return res.json(
        {
          success: true,
          data: response,
        },
        { status: 200 }
      );
    } catch (err) {
      return res.json({ error: err.message }, { status: 500 });
    }
  } else {
    return res.status(404).json({ error: "Not Found" });
  }
}

export default verifyUser(modifyAvatar);