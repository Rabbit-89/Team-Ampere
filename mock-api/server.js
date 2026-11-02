// Simple mock of Kraftly's API. Built for the demo -- NOT for production.
// Webbmakarna AB / M & J
const express = require("express");
const { randomUUID } = require("node:crypto");
// Konfiguration kommer från miljön. Lokalt läses .env (om den finns).
try {
  process.loadEnvFile();
} catch {
  // ingen .env – helt normalt i en container
}

// API_KEYS = flera klienter, en nyckel var: "volt:abc123,ampere:def456"
// API_KEY  = en enda nyckel (det räcker lokalt)
const keys = new Map(
  (
    process.env.API_KEYS ||
    (process.env.API_KEY ? `lokal:${process.env.API_KEY}` : "")
  )
    .split(",")
    .map((entry) => entry.trim())
    .map((entry) => [
      entry.slice(0, entry.indexOf(":")),
      entry.slice(entry.indexOf(":") + 1),
    ])
    .filter(([name, key]) => name && key)
    .map(([name, key]) => [key, name]),
);
if (keys.size === 0) {
  console.error(
    "API_KEY saknas. Lokalt: kopiera .env.example till .env. I molnet: sätt variabeln hos plattformen.",
  );
  process.exit(1);
}

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const user = {
  id: 1,
  name: "Anna Andersson",
  email: "anna.andersson@example.com",
  address: "Solvägen 12, 802 67 Gävle",
  contract: "Rörligt pris",
  customerNo: "K-104233",
};

const invoices = [
  {
    id: "F-2026-06",
    period: "Juni 2026",
    amount: 412,
    status: "Obetald",
    due: "2026-07-31",
  },
  {
    id: "F-2026-05",
    period: "Maj 2026",
    amount: 486,
    status: "Betald",
    due: "2026-06-30",
  },
  {
    id: "F-2026-04",
    period: "April 2026",
    amount: 655,
    status: "Betald",
    due: "2026-05-31",
  },
  {
    id: "F-2026-03",
    period: "Mars 2026",
    amount: 918,
    status: "Betald",
    due: "2026-04-30",
  },
  {
    id: "F-2026-02",
    period: "Februari 2026",
    amount: 1204,
    status: "Betald",
    due: "2026-03-31",
  },
  {
    id: "F-2026-01",
    period: "Januari 2026",
    amount: 1345,
    status: "Betald",
    due: "2026-02-28",
  },
];

const consumption = {
  unit: "kWh",
  months: [
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Maj",
    "Jun",
  ],
  values: [210, 195, 260, 340, 520, 680, 730, 640, 470, 320, 240, 205],
  pricePerKwh: 1.42,
};

const refreshCookie = "kraftly_refresh";
const refreshSessions = new Map();
const accessTokens = new Map();

const setRefreshCookie = (res, token) =>
  res.cookie(refreshCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/api/v2/auth",
  });

const clearRefreshCookie = (res) =>
  res.clearCookie(refreshCookie, {
    httpOnly: true,
    sameSite: "lax",
    path: "/api/v2/auth",
  });

const getRefreshToken = (req) => {
  const cookie = (req.get("Cookie") || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${refreshCookie}=`));
  return cookie?.slice(refreshCookie.length + 1);
};

const issueSession = (res) => {
  const refreshToken = randomUUID();
  const accessToken = randomUUID();
  refreshSessions.set(refreshToken, accessToken);
  accessTokens.set(accessToken, refreshToken);
  setRefreshCookie(res, refreshToken);
  return accessToken;
};

app.post(["/api/v2/auth/login", "/api/login"], (req, res) => {
  const accessToken = issueSession(res);
  res.json({ accessToken, token: accessToken, name: user.name });
});

app.post("/api/v2/auth/refresh", (req, res) => {
  const refreshToken = getRefreshToken(req);
  const previousAccessToken = refreshSessions.get(refreshToken);
  if (!previousAccessToken) {
    clearRefreshCookie(res);
    return res.status(401).json({ error: "No active session" });
  }

  accessTokens.delete(previousAccessToken);
  const accessToken = randomUUID();
  refreshSessions.set(refreshToken, accessToken);
  accessTokens.set(accessToken, refreshToken);
  res.json({ accessToken });
});

app.post("/api/v2/auth/logout", (req, res) => {
  const refreshToken = getRefreshToken(req);
  const accessToken = refreshSessions.get(refreshToken);
  if (accessToken) accessTokens.delete(accessToken);
  refreshSessions.delete(refreshToken);
  clearRefreshCookie(res);
  res.sendStatus(204);
});

app.use("/api", (req, res, next) => {
  const authorization = req.get("Authorization") || "";
  const accessToken = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  if (!accessTokens.has(accessToken)) {
    console.log(
      `401 ${req.method} ${req.originalUrl} – saknad eller ogiltig token`,
    );
    return res.status(401).json({ error: "Saknad eller ogiltig token" });
  }
  next();
});

app.get(["/api/user", "/api/v2/user"], (req, res) => res.json(user));

app.get(["/api/consumption", "/api/v2/consumption"], (req, res) => {
  // quick fix: dashboard felt too fast in the demo, added a delay so the spinner shows /J
  setTimeout(() => res.json(consumption), 600);
});

app.get(["/api/invoices", "/api/v2/invoices"], (req, res) =>
  res.json(invoices),
);

app.post(["/api/move", "/api/v2/move"], (req, res) => {
  console.log("Move request:", req.body);
  res.json({
    ok: true,
    ref: "FLYTT-" + Math.floor(Math.random() * 90000 + 10000),
  });
});

app.put(["/api/user", "/api/v2/user"], (req, res) => {
  Object.assign(user, req.body);
  res.json(user);
});

app.get("/healthz", (req, res) => {
  res.sendStatus(200);
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Mock API on port ${port} – ${keys.size} nyckel/nycklar laddade`),
);
