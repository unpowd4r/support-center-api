import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "3030",
  SERVER_URL: process.env.SERVER_URL || "http://localhost:3030",
  CORS_ORIGINS: (() => {
    if (process.env.NODE_ENV === "development") {
      return "*";
    }

    const origins = process.env.CORS_ORIGINS?.split(",").map((origin) =>
      origin.trim(),
    );

    if (!origins || origins.length === 0) {
      throw new Error("CORS_ORIGINS is required in .env");
    }

    return origins;
  })(),
};
