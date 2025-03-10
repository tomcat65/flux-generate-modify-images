# Flux Image MCP

## 🌟 Overview
Flux Image MCP is a **Model Context Protocol (MCP)** designed for **image generation and modification** using the **Flux Schnell** model on Replicate. With this tool, users can **generate AI-powered images** from text prompts and **modify existing images** through an interactive drag-and-drop interface.

---

## ✨ Features
✔️ **Generate images** using AI from a descriptive text prompt.
✔️ **Modify images** by applying AI transformations.
✔️ **Drag and drop** files into the terminal for easy modification.
✔️ **Interactive CLI** guides users step by step.
✔️ **Automatically saves** generated images in `images-from-prompt/`.
✔️ **Automatically saves** modified images in `modified_images/`.

---

## 🛠️ Installation

### 📌 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org) (latest LTS version recommended)
- TypeScript
- A Replicate API token

### 📥 Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone <your-repo-url>
   cd flux-image-mcp
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file and add your Replicate API token:
   ```sh
   echo "REPLICATE_API_TOKEN=your-token-here" > .env
   ```

4. **Run in Development Mode**
   ```sh
   npm run dev
   ```

---

## 🚀 Usage

### 🖼️ Generating an Image
1. Run the MCP server:
   ```sh
   node index.ts
   ```
2. Enter a **text prompt** when prompted (e.g., "A futuristic cyberpunk city at night").
3. The **generated image** will be saved in `images-from-prompt/`.

### ✨ Modifying an Existing Image
1. Run the MCP server:
   ```sh
   node index.ts
   ```
2. **Drag and drop** an image file when prompted **or** manually enter the file path.
3. Enter a **modification description** (e.g., "Make it look like a watercolor painting").
4. The **modified image** will be saved in `modified_images/`.

---

## 📦 Directory Structure

```sh
flux-image-mcp/
│── images/               # Original images to modify
│── modified_images/      # AI-modified images
│── images-from-prompt/   # AI-generated images
│── src/                 # Source code
│── index.ts             # Main MCP implementation
│── package.json         # Project dependencies
│── tsconfig.json        # TypeScript config
│── README.md            # Project documentation
```

---

## 🚢 Deployment
For production, build and run the project using:
```sh
npm run build
npm start
```

---

## 📜 License
This project is licensed under the **MIT License**. Feel free to modify and distribute it under the terms of the license.

## 🤝 Contributing
We welcome contributions! Feel free to **open issues** or submit **pull requests**.

## 📞 Contact
For questions or support, reach out via GitHub issues or email.

---

🚀 **Happy coding!** 🎨✨
