# Portfolio Management System - Frontend

A modern, responsive portfolio management system built with React 19, Tailwind CSS 4, and Vite. This application features a public-facing landing page and a robust admin dashboard for full CRUD operations on portfolio projects.

## 🚀 Features

### Public Side
- **Dynamic Portfolio Gallery:** View all published projects with ease.
- **Search & Filter:** Quickly find projects by title, industry, or project type.
- **Multi-language Support:** Available in **English**, **Indonesian**, and **Russian**.
- **Dark/Light Mode:** Seamlessly switch between themes.
- **Responsive Design:** Optimized for mobile, tablet, and desktop.

### Admin Dashboard (Protected)
- **Secure Login:** Role-based access control.
- **Portfolio Management:** 
  - Create, edit, and delete portfolio items.
  - Upload multiple images per project (Main image + Gallery).
  - Rich project details including tech stack, project links, and dates.
- **User Management:** Manage admin credentials and profiles.
- **Real-time Feedback:** Toasts and skeletons for a smooth UX.

## 🛠️ Tech Stack

- **Framework:** React 19 (Functional Components & Hooks)
- **Styling:** Tailwind CSS 4
- **Build Tool:** Vite 8
- **Routing:** React Router 7
- **Internationalization:** i18next
- **HTTP Client:** Axios (with Interceptors for Auth)
- **State Management:** React Hooks & Local Storage
- **Icons:** Lucide React

## 📦 Installation & Setup

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/azharf99/portofolio-frontend.git
   cd portofolio-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and update the values:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - `VITE_API_BASE_URL`: The base URL for your backend API.
   - `VITE_TARGET_URL`: The target URL for Vite proxy during development.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components (Auth, Theme, etc.)
├── lib/          # Utilities, API client, and sanitizers
├── locales/      # i18n translation files (en, id, ru)
├── pages/        # Main route components (Landing, Admin, Login)
├── services/     # API integration logic
└── App.jsx       # Root component and Routing
```

## 🛡️ License & Attribution

This project is licensed under the **Apache License 2.0**.

### Attribution Requirement
If you use, modify, or distribute this software, you **MUST** provide credit to the original author:

**Azhar Faturohman Ahidin**  
GitHub: [@azharf99](https://github.com/azharf99)

You can do this by including the author's name and a link to the original repository in your project's "About" page, footer, or documentation.

---
*Created with ❤️ by [Azhar Faturohman Ahidin](https://github.com/azharf99)*
