import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 根路径：用来测试服务是否在线
app.get("/", (req, res) => {
  res.send("Translate API is running");
});

// 单条翻译（可留可不用）
app.get("/translate", async (req, res) => {
  const { q, from = "en", to = "zh" } = req.query;

  if (!q) {
    return res.status(400).json({ error: "missing q" });
  }

  try {
    const url =
      "https://api.mymemory.translated.net/get" +
      `?q=${encodeURIComponent(q)}` +
      `&langpair=${from}|${to}`;

    const r = await fetch(url);
    const j = await r.json();

    res.json({
      ok: true,
      original: q,
      translated: j.responseData?.translatedText || q
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// 🔥 批量翻译（你要的重点）
app.post("/translate/batch", async (req, res) => {
  const { texts, from = "en", to = "zh" } = req.body;

  if (!Array.isArray(texts)) {
    return res.status(400).json({ error: "texts must be an array" });
  }

  try {
    const results = [];

    for (const text of texts) {
      if (!text || text.length < 1) {
        results.push(text);
        continue;
      }

      const url =
        "https://api.mymemory.translated.net/get" +
        `?q=${encodeURIComponent(text)}` +
        `&langpair=${from}|${to}`;

      const r = await fetch(url);
      const j = await r.json();

      results.push(j.responseData?.translatedText || text);
    }

    res.json({
      ok: true,
      from,
      to,
      results
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Railway 必须监听这个端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Translate API listening on port", PORT);
});
