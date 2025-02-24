import vine from "@vinejs/vine";
import { customErrorReporter } from "./CustomErrorReporter.js";

vine.errorReporter = () => new customErrorReporter();

export const newsSchema = vine.object({
  title: vine.string(),
  content: vine.string(),
});

