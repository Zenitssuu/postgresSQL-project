import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/News.validation.js";
import {
  uploadOnCloudinary,
  destroyFromCloudinary,
} from "../utils/cloudinary.js";
import prisma from "../db/index.js";
import redisCache from "../config/redis.config.js";
import logger from "../utils/logger.js";

class NewsController {
  static async index(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if (page <= 0) page = 1;

      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      const skip = (page - 1) * limit;

      const news = await prisma.news.findMany({
        take: limit,
        skip: skip,
        select: {
          id: true,
          user_id: true,
          title: true,
          image: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
              profile: true,
            },
          },
        },
      });

      const totalNews = await prisma.news.count();
      const totalPages = Math.ceil(totalNews / limit);

      return res.status(200).json({
        news: news,
        metadata: {
          totalPages: totalPages,
          currrentPage: page,
          currentLimit: limit,
        },
      });
    } catch (error) {
      console.log(error.message);
      logger.error(error.message);

      return res
        .status(500)
        .json({ message: error.message || "INTERNAL SERVER ERROR" });
    }
  }

  static async store(req, res) {
    const user = req.user;
    const body = req.body;
    const file = req.file;
    // console.log(file);

    try {
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      // return res.status(200).json(payload);
      if (!file) {
        return res
          .status(400)
          .json({ error: { image: "Picture for news is required" } });
      }

      const uploadUrl = await uploadOnCloudinary(file);
      // console.log(uploadUrl);
      payload.user_id = user.id;
      payload.image = uploadUrl;
      // console.log(payload);

      const newNews = await prisma.news.create({
        data: payload,
      });

      // removing cache
      redisCache.del("/api/news", (err) => {
        if (err) throw err;
      });

      return res
        .status(200)
        .json({ message: "news created successfully", news: newNews });
    } catch (error) {
      console.log(error.message);
      logger.error(error?.message);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res
          .status(500)
          .json({ message: "INTERNAL SERVER ERROR,PLEASE TRY AGAIN" });
      }
    }
  }

  static async show(req, res) {
    const { id } = req.params;

    try {
      const news = await prisma.news.findUnique({
        where: {
          id: id,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              profile: true,
            },
          },
        },
      });
      if (!news) {
        return res.status(400).json({
          error: {
            message: "no news found",
          },
        });
      }
      return res.status(200).json({ news: news });
    } catch (error) {
      console.log(error.message);
      logger.error(error?.message);
      return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const user = req.user;
    const file = req.file;
    const body = req.body;
    try {
      // console.log(id);

      const news = await prisma.news.findUnique({
        where: {
          id: id,
        },
      });

      // console.log(news);

      if (news.user_id !== user.id) {
        return res.status(400).json({
          error: {
            message: "Unauthorized",
          },
        });
      }

      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);
      // console.log(payload);

      if (file) {
        //deleting old image

        const deleteImage = destroyFromCloudinary(news.image);

        if (deleteImage) {
          console.log("image successfully deleted");
        } else {
          console.log("error occured during deleting image");
        }

        const imageUrl = await uploadOnCloudinary(file);

        payload.image = imageUrl;
      }

      await prisma.news.update({
        data: payload,
        where: {
          id: id,
        },
      });

      // console.log("updated news", updatedNews);

      return res.status(200).json({
        message: "news successfully updated",
      });
    } catch (error) {
      console.log(error.message);
      logger.error(error.message);

      return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
  }

  static async destroy(req, res) {
    const { id } = req.params;
    const user = req.user;

    try {
      const news = await prisma.news.findUnique({
        where: {
          id: id,
        },
      });

      if (news.user_id !== user.id) {
        return res.status(400).json({
          error: {
            message: "Unauthorized",
          },
        });
      }

      //deleting old image
      const deleteImage = destroyFromCloudinary(news.image);

      if (deleteImage) {
        console.log("image successfully deleted");
      } else {
        console.log("error occured during deleting image");
      }

      await prisma.news.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json({
        message: {
          news: "news deleted successfully",
        },
      });
    } catch (error) {
      console.log(error.message);
      logger.error(error.message);

      return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
  }
}

export default NewsController;
