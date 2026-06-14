# 🚀 AI Cover Letter Generator (Premium Glassmorphic Edition)

An AI-powered, full-stack web application designed to craft highly compelling, modern, and tailored cover letters in seconds. Built with a sleek **Glassmorphic UI**, this tool allows users to generate professional artifacts either by entering raw skills or by directly uploading a **Resume (PDF)**. It features seamless light/dark mode toggling, dynamic context-aware file downloads, and crisp micro-interactions.

---

## ✨ Features

- **Double-Channel Input:** Generate tailored content via manual skill inputs or let the integrated client-side parser extract content directly from an uploaded **Resume (PDF)**.
- **Advanced AI Integration:** Powered by the latest Google Gen AI SDK (`gemini-2.5-flash`) for lightning-fast, contextual, and placeholder-free copy.
- **Premium Glassmorphic UI:** A beautifully engineered SaaS-style layout featuring backdrop filters, neon focus rings, glowing states, and responsive grids.
- **Persistent Theme Toggle:** Smooth transformation between Light Mode and a deep Cyberpunk Dark Mode, utilizing local storage memory.
- **Dynamic DOCX Downloads:** Instantly download generated assets as formatted `.doc` files, auto-named dynamically according to the target company and role input.
- **Smart Micro-interactions:** Live button feedback for operations like "Copy to Clipboard", "Clear", or "Download" eliminating outdated browser alert boxes.

---

## 📂 Project Structure

```text
ai-cover-letter-generator/
│
├── frontend/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── backend/
│   ├── controllers/
│   │   └── generateController.js    # Decoupled Request/Response Handler
│   ├── routes/
│   │   └── generateRoute.js         # Express Route Configuration
│   ├── services/
│   │   └── geminiService.js         # Google Gen AI SDK Integration Layer
│   ├── utils/
│   │   └── promptBuilder.js         # Prompt Engineering Core Logic
│   ├── .env                         # Environment Configuration File
│   ├── .gitignore                   # Safe Commits Manager
│   └── server.js                    # Core Express Server Entry Point
│
├── docs/
└── README.md                        # Documentation Blueprint