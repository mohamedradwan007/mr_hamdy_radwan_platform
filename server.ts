import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs-extra";
import bodyParser from "body-parser";
import cors from "cors";

const DATA_FILE = path.join(process.cwd(), "data.json");

// Initial data structure
const INITIAL_DATA = {
  config: {
    siteName: "أ/ حمدي رضوان",
    siteSubtitle: "مدرس الرياضيات والإحصاء للمراحل الثانوية",
    examsLink: "https://mr-hamdy-radwan-platform.netlify.app/",
    showContact: true,
    contactDetails: {
      phone: "01XXXXXXXXX",
      whatsapp: "https://wa.me/201XXXXXXXXX",
      telegram: "https://t.me/XXXXXXXXX",
      email: "info@example.com",
      address: "المكان بالتفصيل هنا",
    },
    heroTitle: "أ/ حمدي رضوان",
    heroSubtitle: "فيديوهات الشرح",
  },
  videos: [
    {
      id: 1,
      title: "المشتقات — المفهوم الأساسي",
      unit: "الوحدة الأولى",
      level: "أول ثانوي",
      duration: "18:42",
      views: "1,240",
      ytLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }
  ],
  students: [{ phone: "01000000000", name: "طالب تجريبي" }], // قائمة الطلاب (رقم واسم)
  adminPassword: "admin123" // كلمة السر الافتراضية للأدمن
};

async function ensureDataFile() {
  if (!(await fs.pathExists(DATA_FILE))) {
    await fs.writeJson(DATA_FILE, INITIAL_DATA, { spaces: 2 });
  } else {
    // Ensure students array exists and is in the correct format
    const data = await fs.readJson(DATA_FILE);
    if (!data.students) {
      data.students = INITIAL_DATA.students;
      await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    } else if (data.students.length > 0 && typeof data.students[0] === 'string') {
      // Migrate old format (string array) to new format (object array)
      data.students = data.students.map((phone: string) => ({ phone, name: "طالب" }));
      await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    }
  }
}

async function startServer() {
  await ensureDataFile();
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API Routes
  app.get("/api/data", async (req, res) => {
    try {
      const data = await fs.readJson(DATA_FILE);
      const { adminPassword, ...publicData } = data;
      res.json(publicData);
    } catch (err) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { type, password, phone } = req.body;
      const data = await fs.readJson(DATA_FILE);

      if (type === "admin") {
        if (password === data.adminPassword) {
          return res.json({ success: true, role: "admin", name: "الأستاذ حمدي" });
        } else {
          return res.status(401).json({ success: false, message: "كلمة المرور غير صحيحة" });
        }
      } else if (type === "student") {
        const student = data.students.find((s: any) => s.phone === phone);
        if (student) {
          return res.json({ success: true, role: "student", phone, name: student.name });
        } else {
          return res.status(401).json({ success: false, message: "الرقم غير مسجل راجع المستر" });
        }
      }
      res.status(401).json({ success: false, message: "بيانات الدخول غير صحيحة" });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/update-config", async (req, res) => {
    try {
      const { config } = req.body;
      const data = await fs.readJson(DATA_FILE);
      data.config = config;
      await fs.writeJson(DATA_FILE, data, { spaces: 2 });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const { videos } = req.body;
      const data = await fs.readJson(DATA_FILE);
      data.videos = videos;
      await fs.writeJson(DATA_FILE, data, { spaces: 2 });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const { students } = req.body;
      const data = await fs.readJson(DATA_FILE);
      data.students = students;
      await fs.writeJson(DATA_FILE, data, { spaces: 2 });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Update failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: "spa",
      root: process.cwd()
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
