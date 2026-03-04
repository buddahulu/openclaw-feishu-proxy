export default async function handler(req, res) {
  const upstream = process.env.UPSTREAM_URL;
  if (!upstream) return res.status(500).send("Missing UPSTREAM_URL");

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  const r = await fetch(upstream, {
    method: req.method,
    headers: { "content-type": req.headers["content-type"] || "application/json" },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : body
  });

  const buf = Buffer.from(await r.arrayBuffer());
  res.status(r.status);
  res.setHeader("content-type", r.headers.get("content-type") || "application/json");
  return res.send(buf);
}
