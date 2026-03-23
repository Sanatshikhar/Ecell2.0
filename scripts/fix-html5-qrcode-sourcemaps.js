const fs = require("fs");
const path = require("path");

function walkFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, out);
    } else {
      out.push(fullPath);
    }
  }
  return out;
}

function stripSourceMapReference(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const updated = content
    .replace(/\n\/\/\# sourceMappingURL=.*$/gm, "")
    .replace(/\n\/\*@ sourceMappingURL=.*\*\//gm, "");

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    return true;
  }
  return false;
}

function main() {
  const esmDir = path.join(process.cwd(), "node_modules", "html5-qrcode", "esm");
  if (!fs.existsSync(esmDir)) {
    console.log("[fix-html5-qrcode-sourcemaps] html5-qrcode esm folder not found, skipping.");
    return;
  }

  const files = walkFiles(esmDir).filter((p) => p.endsWith(".js"));
  let changed = 0;

  for (const filePath of files) {
    if (stripSourceMapReference(filePath)) {
      changed += 1;
    }
  }

  console.log(`[fix-html5-qrcode-sourcemaps] patched ${changed} file(s).`);
}

main();
