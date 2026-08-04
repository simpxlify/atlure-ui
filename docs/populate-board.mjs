import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OWNER = "simpxlify";
const PROJECT_NUMBER = process.env.PROJECT_NUMBER ?? "1";
const HUB_REPO = "atlure-ui";
const DRY_RUN = process.env.DRY_RUN !== "0";

const here = dirname(fileURLToPath(import.meta.url));
const ticketsDir = process.env.TICKETS_DIR ?? resolve(here, "tickets-source");
const manifestPath = join(ticketsDir, "MANIFEST.csv");
const statePath = join(ticketsDir, ".created-issues.tsv");

const log = (message) => process.stderr.write(`${message}\n`);
const die = (message) => {
  log(`ERROR: ${message}`);
  process.exit(1);
};

function gh(args, { allowFailure = false } = {}) {
  try {
    return execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    if (allowFailure) return null;
    throw new Error(`gh ${args.join(" ")}\n${error.stderr ?? error.message}`);
  }
}

function ghJson(args) {
  const raw = gh(args);
  return JSON.parse(raw);
}

if (!existsSync(manifestPath)) die(`manifest not found at ${manifestPath}`);

if (gh(["project", "list", "--owner", OWNER], { allowFailure: true }) === null) {
  die("gh token lacks the project scope. Run: gh auth refresh -s project");
}

const project = ghJson(["project", "view", PROJECT_NUMBER, "--owner", OWNER, "--format", "json"]);
log(`project: ${project.title} (${project.id})`);

const REQUIRED_FIELDS = [
  ["Epic", "decommission,ds-foundations,ds-native,ds-web,backend,paw-shell,paw-screens,web-marketing,quality,monetization"],
  ["Priority", "P0,P1,P2,P3"],
  ["Size", "XS,S,M,L,XL"],
  ["Serialize", "Yes,No"],
  ["Milestone Phase", "M0,M1,M2,M3,M4,M5,M6"],
];

function listFields() {
  return ghJson(["project", "field-list", PROJECT_NUMBER, "--owner", OWNER, "--format", "json"]).fields;
}

let fields = listFields();
log("existing fields:");
for (const field of fields) {
  const options = (field.options ?? []).map((option) => option.name).join(", ");
  log(`  ${field.name} [${field.type}]${options ? ` -> ${options}` : ""}`);
}

for (const [name, options] of REQUIRED_FIELDS) {
  if (fields.some((field) => field.name === name)) continue;
  log(`creating field: ${name}`);
  if (DRY_RUN) continue;
  gh([
    "project", "field-create", PROJECT_NUMBER, "--owner", OWNER,
    "--name", name, "--data-type", "SINGLE_SELECT", "--single-select-options", options,
  ]);
}
if (!DRY_RUN) fields = listFields();

const fieldByName = new Map(fields.map((field) => [field.name, field]));

function optionId(fieldName, optionName) {
  const field = fieldByName.get(fieldName);
  if (!field) return null;
  const option = (field.options ?? []).find((candidate) => candidate.name === optionName);
  return option ? option.id : null;
}

const LABEL_COLORS = {
  P0: "b60205", P1: "d93f0b", P2: "fbca04", P3: "c2e0c6",
  serialize: "5319e7", ops: "0052cc", "needs:david": "e99695",
};

function labelColor(label) {
  if (LABEL_COLORS[label]) return LABEL_COLORS[label];
  if (label.startsWith("epic:")) return "1d76db";
  if (label.startsWith("size:")) return "ededed";
  if (label.startsWith("type:")) return "c5def5";
  return "0e8a16";
}

const ensuredLabels = new Set();
function ensureLabel(repo, label) {
  const key = `${repo}/${label}`;
  if (ensuredLabels.has(key)) return;
  ensuredLabels.add(key);
  if (DRY_RUN) return;
  gh(["label", "create", label, "--repo", `${OWNER}/${repo}`, "--color", labelColor(label), "--force"],
    { allowFailure: true });
}

function parseManifest(text) {
  const [header, ...rows] = text.trim().split(/\r?\n/);
  const columns = header.split(",");
  return rows.filter(Boolean).map((row) => {
    const cells = row.split(",");
    if (cells.length !== columns.length) {
      throw new Error(`malformed manifest row (${cells.length} fields, expected ${columns.length}): ${row}`);
    }
    return Object.fromEntries(columns.map((column, index) => [column, cells[index].trim()]));
  });
}

function bodyOf(file) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  let delimiters = 0;
  const body = [];
  for (const line of lines) {
    if (/^---\s*$/.test(line) && delimiters < 2) {
      delimiters += 1;
      continue;
    }
    if (delimiters >= 2) body.push(line);
  }
  return body.join("\n").trim();
}

const ticketFiles = new Map();
for (const epicDir of readdirSync(join(ticketsDir, "tickets"))) {
  for (const file of readdirSync(join(ticketsDir, "tickets", epicDir))) {
    const id = file.split("-")[0];
    ticketFiles.set(id, join(ticketsDir, "tickets", epicDir, file));
  }
}

if (!existsSync(statePath)) writeFileSync(statePath, "");
const alreadyCreated = new Set(
  readFileSync(statePath, "utf8").split(/\r?\n/).filter(Boolean).map((line) => line.split("\t")[0]),
);

const tickets = parseManifest(readFileSync(manifestPath, "utf8"));
log(`\nmanifest rows: ${tickets.length}`);

let created = 0;
let skipped = 0;

for (const ticket of tickets) {
  if (alreadyCreated.has(ticket.id)) {
    skipped += 1;
    continue;
  }

  const file = ticketFiles.get(ticket.id);
  if (!file) {
    log(`WARN no body file for ${ticket.id}`);
    continue;
  }

  const isOps = ["admin", "all", "ops"].includes(ticket.repo);
  const targetRepo = isOps ? HUB_REPO : ticket.repo;

  const labels = new Set([
    `epic:${ticket.epic}`,
    ticket.priority,
    `size:${ticket.size}`,
    ...(ticket.serialize === "Yes" ? ["serialize"] : []),
    ...(isOps ? ["ops"] : []),
    ...ticket.labels.split(";").map((label) => label.trim()).filter(Boolean),
  ]);

  for (const label of labels) ensureLabel(targetRepo, label);

  if (DRY_RUN) {
    log(`would create [${targetRepo}] ${ticket.id} ${ticket.title}  {${[...labels].join(", ")}}`);
    created += 1;
    continue;
  }

  const labelArgs = [...labels].flatMap((label) => ["--label", label]);
  const url = gh([
    "issue", "create", "--repo", `${OWNER}/${targetRepo}`,
    "--title", ticket.title, "--body", bodyOf(file), ...labelArgs,
  ]);

  const item = ghJson([
    "project", "item-add", PROJECT_NUMBER, "--owner", OWNER, "--url", url, "--format", "json",
  ]);

  const assignments = [
    ["Epic", ticket.epic],
    ["Priority", ticket.priority],
    ["Size", ticket.size],
    ["Serialize", ticket.serialize],
    ["Milestone Phase", ticket.milestone],
  ];

  for (const [fieldName, value] of assignments) {
    const field = fieldByName.get(fieldName);
    const option = optionId(fieldName, value);
    if (!field || !option) continue;
    gh([
      "project", "item-edit", "--project-id", project.id, "--id", item.id,
      "--field-id", field.id, "--single-select-option-id", option,
    ]);
  }

  appendFileSync(statePath, `${ticket.id}\t${targetRepo}\t${url}\t${item.id}\n`);
  created += 1;
  log(`created ${ticket.id} -> ${url}`);
}

log(`\ncreated=${created} skipped=${skipped}`);
if (DRY_RUN) {
  log("DRY RUN. Nothing was created. Re-run with DRY_RUN=0 to apply.");
} else {
  log("Set Status from the board: leave blocked tickets in Backlog and move only");
  log("tickets whose blockers are Done into Ready, so agents cannot claim blocked work.");
}
