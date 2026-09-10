import Sanat from "../components/Assets/Team 2026/Sanat.jpg";
import Rohit from "../components/Assets/Team 2026/Rohit.png";
import Sujay from "../components/Assets/Team 2026/Sujay.jpeg";
import { INITIAL_MEMBERS } from "./sheetMembersCache";

/**
 * Configure your Google Sheet URL here or via REACT_APP_MEMBER_SHEET_URL in your .env
 * Supported formats:
 * 1. Published to Web CSV link: https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv
 * 2. Standard Google Sheet URL: https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit...
 */
const DEFAULT_SHEET_URL =
  process.env.REACT_APP_MEMBER_SHEET_URL ||
  "https://docs.google.com/spreadsheets/d/1iXHQPG6KwqPTXYO0-R8s4DAfQ3m2TQca-iQ8OlwhCtw/edit?usp=sharing";

let cachedMembers = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 5 * 1000; // 5 seconds for instant updates

/**
 * Default fallback / mock members used if sheet URL is not configured or for initial testing
 */
export const MOCK_MEMBERS = [
  {
    id: "101",
    name: "Sanat Sikhar Sinha",
    designation: "President",
    team: "Technical Team",
    regNo: "2201010001",
    branch: "Computer Science & Engineering",
    phone: "+91 98765 43210",
    email: "sanat@ecell.org",
    linkedin: "https://www.linkedin.com/in/sanatsinhaa/",
    photo: Sanat,
  },
  {
    id: "102",
    name: "Rohit Kumar",
    designation: "Technical Co-Lead",
    team: "Technical Team",
    regNo: "2301010045",
    branch: "Computer Science & Engineering",
    phone: "+91 70913 18966",
    email: "rohit@ecell.org",
    linkedin: "https://www.linkedin.com/in/rohit-kumar-238b26316/",
    photo: Rohit,
  },
  {
    id: "103",
    name: "Sujay Jagat",
    designation: "Technical Lead",
    team: "Technical Team",
    regNo: "2201010088",
    branch: "Information Technology",
    phone: "+91 91234 56789",
    email: "sujay@ecell.org",
    linkedin: "https://www.linkedin.com/in/sujay-jagat-7ab37b32a/",
    photo: Sujay,
  },
];

/**
 * Helper to extract Google Drive file ID from various link formats
 */
export function extractDriveFileId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) return dMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  return null;
}

/**
 * Transform Google Drive file view/open URLs into direct high-resolution image links
 */
export function formatDriveImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  // Check if it's a Google Drive link
  if (
    trimmed.includes("drive.google.com") ||
    trimmed.includes("docs.google.com") ||
    trimmed.includes("googleusercontent.com")
  ) {
    const fileId = extractDriveFileId(trimmed);
    if (fileId) {
      // Direct CDN thumbnail that loads reliably across all browsers without redirect blocks
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  return trimmed;
}

/**
 * Extract clean first name for the greeting (e.g. "Rohit", "Sanat")
 */
export function getFirstName(fullName) {
  if (!fullName || typeof fullName !== "string") return "Member";
  const cleaned = fullName.trim();
  const parts = cleaned.split(/\s+/);
  return parts[0] || "Member";
}

/**
 * Normalize Instagram field from sheet into a clean link and handle
 */
export function normalizeInstagram(val) {
  if (!val || typeof val !== "string") return { url: "", handle: "" };
  const raw = val.trim();
  if (["na", "none", "-", "n/a", "no"].includes(raw.toLowerCase())) {
    return { url: "", handle: "" };
  }

  if (raw.includes("instagram.com")) {
    let cleanUrl = raw;
    if (!cleanUrl.startsWith("http")) cleanUrl = `https://${cleanUrl}`;
    try {
      const parsed = new URL(cleanUrl);
      const pathname = parsed.pathname.replace(/^\/|\/$/g, "");
      const username = pathname.split("/")[0] || "";
      return {
        url: cleanUrl,
        handle: username ? `@${username}` : cleanUrl,
      };
    } catch {
      return { url: cleanUrl, handle: cleanUrl };
    }
  }

  const cleanHandle = raw.replace(/^@/, "").replace(/\/+$/, "").trim();
  if (!cleanHandle) return { url: "", handle: "" };
  return {
    url: `https://www.instagram.com/${cleanHandle}/`,
    handle: `@${cleanHandle}`,
  };
}

/**
 * Normalize LinkedIn URL
 */
export function normalizeLinkedIn(val) {
  if (!val || typeof val !== "string") return "";
  const raw = val.trim();
  if (["na", "none", "-", "n/a", "no"].includes(raw.toLowerCase())) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("www.") || raw.includes("linkedin.com")) return `https://${raw}`;
  return raw;
}

/**
 * Normalize phone / WhatsApp number into display string and direct WhatsApp URL
 */
export function normalizePhone(val) {
  if (!val || typeof val !== "string") return { display: "", waUrl: "" };
  const raw = val.trim();
  const digits = raw.replace(/[^0-9]/g, "");

  if (digits.length === 10) {
    return {
      display: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
      waUrl: `https://wa.me/91${digits}`,
    };
  }
  if (digits.length > 10) {
    return {
      display: raw.startsWith("+") ? raw : `+${digits}`,
      waUrl: `https://wa.me/${digits}`,
    };
  }
  return {
    display: raw,
    waUrl: digits ? `https://wa.me/${digits}` : "",
  };
}

/**
 * Simple, robust CSV string parser that handles quoted commas and line breaks
 */
function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentToken = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      row.push(currentToken.trim());
      if (row.some((cell) => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      currentToken = "";
    } else {
      currentToken += char;
    }
  }

  if (currentToken.length > 0 || row.length > 0) {
    row.push(currentToken.trim());
    if (row.some((cell) => cell.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

/**
 * Resolve standard Google Sheet URL or pubhtml into direct CSV export endpoint
 */
function getCsvFetchUrl(sheetUrl) {
  if (!sheetUrl) return "";
  const trimmed = sheetUrl.trim();

  // If already a pub?output=csv URL
  if (trimmed.includes("output=csv")) {
    return trimmed;
  }

  // If published as pubhtml: convert to pub?output=csv
  if (trimmed.includes("/pubhtml")) {
    return trimmed.replace(/\/pubhtml.*$/, "/pub?output=csv");
  }
  if (trimmed.endsWith("/pub")) {
    return `${trimmed}?output=csv`;
  }

  // If standard sheet URL with ID: /spreadsheets/d/<ID>/...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&t=${Date.now()}`;
  }

  return trimmed;
}

/**
 * Match column header with priority to exact match then substring match
 */
function matchColumn(headers, keywords) {
  const cleanKeywords = keywords.map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const cleanHeaders = headers.map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));

  // 1. Exact match pass
  for (const kw of cleanKeywords) {
    for (let i = 0; i < cleanHeaders.length; i++) {
      if (cleanHeaders[i] === kw) {
        return i;
      }
    }
  }

  // 2. Substring match pass
  for (const kw of cleanKeywords) {
    for (let i = 0; i < cleanHeaders.length; i++) {
      if (cleanHeaders[i].includes(kw)) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Fetches all members from Google Sheet or fallback mock
 */
export async function getAllMembers() {
  const now = Date.now();
  if (cachedMembers && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedMembers;
  }

  const sheetUrl = DEFAULT_SHEET_URL;

  if (!sheetUrl) {
    // Return cached sheet data if no sheet URL is set
    cachedMembers = INITIAL_MEMBERS;
    lastFetchTime = now;
    return cachedMembers;
  }

  try {
    const fetchUrl = getCsvFetchUrl(sheetUrl);
    const response = await fetch(fetchUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: HTTP ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      console.warn("Sheet has less than 2 rows, falling back to mock members");
      return MOCK_MEMBERS;
    }

    const headers = rows[0];

    // Find column indexes matching exact Google Sheet columns
    const idIdx = matchColumn(headers, ["member id", "memberid", "card id", "unique id", "id"]);
    const nameIdx = matchColumn(headers, ["name", "full name", "student name", "member name"]);
    const teamIdx = matchColumn(headers, ["team", "domain", "department"]);
    const desigIdx = matchColumn(headers, ["designation", "role", "position", "post"]);
    const emailIdx = matchColumn(headers, ["email address", "email id", "email", "mail"]);
    const phoneIdx = matchColumn(headers, ["whatsapp number", "whatsapp", "phone", "mobile", "contact", "ph no", "ph.no"]);
    const linkedinIdx = matchColumn(headers, ["linkedin id url", "linkedin id", "linkedin url", "linkedin profile", "linkedin"]);
    const instagramIdx = matchColumn(headers, ["instagram id url", "instagram id", "instagram url", "instagram"]);
    const branchIdx = matchColumn(headers, ["branch", "course", "stream"]);
    const yearIdx = matchColumn(headers, ["year", "batch", "academic year"]);
    const regNoIdx = matchColumn(headers, ["registration number", "registration no", "regd no", "reg no", "roll no", "sic"]);
    const dobIdx = matchColumn(headers, ["dob date of birth", "dob", "date of birth", "birth date"]);
    const photoIdx = matchColumn(headers, [
      "your professional photo for id card",
      "professional photo",
      "photo for id card",
      "photo",
      "picture",
      "image",
      "profile pic",
      "upload"
    ]);

    const members = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      // Calculate member ID: explicit column value or sequential (101, 102...)
      let idVal = idIdx !== -1 && row[idIdx] ? String(row[idIdx]).trim() : "";
      if (!idVal) {
        idVal = String(100 + r); // Row 1 = 101, Row 2 = 102, ...
      }

      const nameVal = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : "";
      // If row has no name and no photo, skip empty rows
      if (!nameVal && (!photoIdx || !row[photoIdx])) continue;

      const rawInstagram = instagramIdx !== -1 && row[instagramIdx] ? row[instagramIdx].trim() : "";
      const rawLinkedin = linkedinIdx !== -1 && row[linkedinIdx] ? row[linkedinIdx].trim() : "";
      const rawPhone = phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx].trim() : "";
      const instaNorm = normalizeInstagram(rawInstagram);
      const phoneNorm = normalizePhone(rawPhone);

      const member = {
        id: idVal,
        name: nameVal || `Member ${idVal}`,
        firstName: getFirstName(nameVal),
        designation: desigIdx !== -1 && row[desigIdx] ? row[desigIdx].trim() : "Member",
        team: teamIdx !== -1 && row[teamIdx] ? row[teamIdx].trim() : "E-Cell",
        regNo: regNoIdx !== -1 && row[regNoIdx] ? row[regNoIdx].trim() : "—",
        branch: branchIdx !== -1 && row[branchIdx] ? row[branchIdx].trim() : "—",
        year: yearIdx !== -1 && row[yearIdx] ? row[yearIdx].trim() : "",
        phone: rawPhone,
        phoneDisplay: phoneNorm.display,
        waUrl: phoneNorm.waUrl,
        email: emailIdx !== -1 && row[emailIdx] ? row[emailIdx].trim() : "",
        linkedin: normalizeLinkedIn(rawLinkedin),
        instagram: rawInstagram,
        instagramUrl: instaNorm.url,
        instagramHandle: instaNorm.handle,
        dob: dobIdx !== -1 && row[dobIdx] ? row[dobIdx].trim() : "",
        photo: photoIdx !== -1 && row[photoIdx] ? formatDriveImageUrl(row[photoIdx].trim()) : "",
      };

      members.push(member);
    }

    cachedMembers = members.length > 0 ? members : INITIAL_MEMBERS;
    lastFetchTime = now;
    return cachedMembers;
  } catch (error) {
    console.error("Error fetching or parsing Google Sheet:", error);
    // Return initial sheet members so all members work seamlessly
    return INITIAL_MEMBERS;
  }
}

/**
 * Fetch a single member by their unique ID string (e.g. "101", "102")
 */
export async function getMemberById(id) {
  if (!id) return null;
  const targetId = String(id).trim().toLowerCase();

  const members = await getAllMembers();
  // Exact match on ID, or match on Regd No if someone entered Regd No in URL
  const found = members.find(
    (m) =>
      String(m.id).trim().toLowerCase() === targetId ||
      String(m.regNo).trim().toLowerCase() === targetId
  );

  return found || null;
}
