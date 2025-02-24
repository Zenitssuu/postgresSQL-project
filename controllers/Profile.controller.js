import prisma from "../db/index.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

class ProfileController {
  static async index(req, res) {
    try {
      const user = req.user;
      return res.status(200).json({ user: user });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req, res) {
    const user = req.user;
    // const body = req.body;
    const file = req.file;

    try {
      const id = user.id;

      if (!file) {
        return res
          .status(400)
          .json({ error: { image: "profile picture required" } });
      }
      console.log(file);
      const uploadUrl = await uploadOnCloudinary(file);

      await prisma.user.update({
        data: {
          profile: uploadUrl,
        },
        where: {
          id: id,
        },
      });
      console.log(id);

      return res.status(200).json({ message: "profile updated" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
  }

  static async getProfile(req, res) {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          profile: true,
          email: true,
        },
      });

      if (!user) {
        return res.status(400).json({
          error: { user: "Profile not found, we are looking into it" },
        });
      }

      return res.status(200).json({ user: user });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
  }
}

export default ProfileController;
