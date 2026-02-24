import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { journals as initialJournals, activities as initialActivities } from "./data";

const DB_FILE = "./db.json";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ✅ Cloud Run PORT (WAJIB)
  const PORT = Number(process.env.PORT) || 8080;

  const wss = new WebSocketServer({ server });

  // =============================
  // LOAD STATE
  // =============================
  let state: any;

  if (fs.existsSync(DB_FILE)) {
    try {
      state = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch (err) {
      console.error("Error reading DB file, using initial data");
    }
  }

  if (!state) {
    state = {
      journals: initialJournals,
      activities: initialActivities,
      settings: {
        siteName: "Corpus",
        logoUrl: "https://picsum.photos/seed/corpus/200/200",
        contactEmail: "info@corpus.id",
        contactAddress: "Jakarta, Indonesia",
        visionStatement:
          "Menjadi sumber referensi utama dalam analisis komunikasi.",
        aboutText: "Platform multidimensi untuk diseminasi riset.",
        team: [],
      },
    };
  }

  // =============================
  // WEBSOCKET
  // =============================
  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.send(JSON.stringify({ type: "INIT", data: state }));

    ws.on("message", (message) => {
      try {
        const { type, data } = JSON.parse(message.toString());

        if (type === "UPDATE_STATE") {
          state = { ...state, ...data };

          fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "STATE_UPDATED",
                  data: state,
                })
              );
            }
          });
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    });

    ws.on("close", () => console.log("Client disconnected"));
  });

  // =============================
  // FRONTEND HANDLING
  // =============================
  if (process.env.NODE_ENV !== "production") {
    // ✅ DEV MODE ONLY
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    // ✅ PRODUCTION STATIC BUILD
    const distPath = path.resolve("dist");

    app.use(express.static(distPath));

    app.get("*", (_, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // =============================
  // START SERVER
  // =============================
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

startServer();