#!/usr/bin/env node
"use strict";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import download from "image-downloader";
import { Request, Response } from "express";

console.log("🚀 Starting MCP Server...");

// Define expected argument types
interface ImageRequest {
    prompt: string;
    image_filename?: string;
}

const REPLICATE_API_TOKEN: string | undefined = process.env.REPLICATE_API_TOKEN;

if (!REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN environment variable is required");
}

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

// Define image directories
const IMAGE_INPUT_DIR = path.join(__dirname, "images");
const MODIFIED_IMAGES_DIR = path.join(__dirname, "modified_images");
const GENERATED_IMAGES_DIR = path.join(__dirname, "images-from-prompt");

// Ensure directories exist
[IMAGE_INPUT_DIR, MODIFIED_IMAGES_DIR, GENERATED_IMAGES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log("✅ Image directories ensured");

const axiosInstance = axios.create({
  baseURL: "https://api.replicate.com/v1",
  headers: {
    Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    Prefer: "wait",
  },
});

async function generateImage(args: ImageRequest): Promise<{ message?: string; file?: string; error?: string }> {
    if (!args.prompt) {
        return { error: "Missing prompt parameter." };
    }

    console.log("🖼 Generating image with prompt:", args.prompt);

  try {
    const response = await axiosInstance.post(
      "/models/black-forest-labs/flux-schnell/predictions",
      { input: { prompt: args.prompt } }
    );
    console.log("🛠 API Response:", response.data);

    if (response.data.output) {
      console.log("🔗 Image URL:", response.data.output);
      const outputFilename = `generated_${Date.now()}.jpg`;
      const outputPath = path.join(GENERATED_IMAGES_DIR, outputFilename);

      if (typeof response.data.output === "string") {
        await download.image({ url: response.data.output, dest: outputPath });
      } else {
        console.error("⚠️ Unexpected output format:", response.data.output);
      }

      return { message: "Image generated successfully.", file: outputPath };
    } else {
      return { error: "No output received from the model." };
    }
  } catch (error: any) {
    console.error("🔥 Error generating image:", error);
    return { error: error.message || "Internal Server Error" };
  }
}

async function modifyImage(args: ImageRequest): Promise<{ message?: string; file?: string; error?: string }> {
    if (!args.prompt || !args.image_filename) {
        return { error: "Missing required parameters (prompt, image_filename)." };
    }

  const inputImagePath = path.join(IMAGE_INPUT_DIR, args.image_filename);
  if (!fs.existsSync(inputImagePath)) {
    return { error: "Specified image file does not exist." };
  }

  console.log("🛠 Modifying image:", inputImagePath, "with prompt:", args.prompt);

  try {
    const response = await axiosInstance.post(
      "/models/black-forest-labs/flux-schnell/predictions",
      { input: { prompt: args.prompt, image: inputImagePath } }
    );
    console.log("🛠 API Response:", response.data);

    if (response.data.output) {
      console.log("🔗 Modified Image URL:", response.data.output);
      const outputFilename = `modified_${Date.now()}_${args.image_filename}`;
      const outputPath = path.join(MODIFIED_IMAGES_DIR, outputFilename);

      if (typeof response.data.output === "string") {
        await download.image({ url: response.data.output, dest: outputPath });
      } else {
        console.error("⚠️ Unexpected output format:", response.data.output);
      }

      return { message: "Image modified successfully.", file: outputPath };
    } else {
      return { error: "No output received from the model." };
    }
  } catch (error: any) {
    console.error("🔥 Error modifying image:", error);
    return { error: error.message || "Internal Server Error" };
  }
}

// Fix the Express API route handler
app.post("/mcp", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, arguments: args } = req.body;
        console.log("📩 Received request:", name, args);

        if (name === "generate_image") {
            const response = await generateImage(args);
            res.json(response);
        } else if (name === "modify_image") {
            const response = await modifyImage(args);
            res.json(response);
        } else {
            res.status(400).json({ error: "Unknown tool requested." });
        }
    } catch (error: any) {
        console.error("🔥 Error handling request:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 MCP server running at http://127.0.0.1:${PORT}`);
});

// Handle unexpected errors
declare global {
    interface Process {
        on(event: "uncaughtException", listener: (error: Error) => void): this;
        on(event: "unhandledRejection", listener: (reason: any, promise: Promise<any>) => void): this;
    }
}

process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("⚠️ Unhandled Rejection:", reason);
});