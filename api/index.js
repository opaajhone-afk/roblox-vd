import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/translate", async (req, res) => {
  const texts = req.body.texts || [];
  const result = {};

  await Promise.all(
    texts.map(async (text) => {
      if (!text || text.length < 2) {
        result[text] = text;
        return;
      }

      try {
        const url =
          "https://api.mymemory.translated.net/get?q=" +
          encodeURIComponent(text) +
          "&langpair=en|zh";

        const r = await fetch(url);
        const j = await r.json();
        result[text] =
          j?.responseData?.translatedText || text;
      } catch {
        result[text] = text;
      }
    })
  );

  res.json(result);
});

app.listen(process.env.PORT || 3000);