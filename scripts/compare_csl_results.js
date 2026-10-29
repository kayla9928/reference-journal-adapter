#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const SUPPORTED_SCOPES = new Set(["citation", "entry", "parameter", "zotero"]);
const SUPPORTED_KINDS = new Set(["exact_text", "contains_text", "not_contains_text", "html_tag_contains", "not_html_tag_contains", "equals", "zotero_only"]);

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help") return {help: true};
    if (!token.startsWith("--") || index + 1 >= argv.length) throw new Error(`Invalid argument: ${token}`);
    args[token.slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

function usage() {
  return "Usage: node compare_csl_results.js --oracle ORACLE --actual ACTUAL --baseline BASELINE --output OUTPUT";
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function comparablePath(value) {
  let resolved = path.resolve(value);
  try {
    resolved = fs.realpathSync.native(resolved);
  } catch {
    const parent = path.dirname(resolved);
    try { resolved = path.join(fs.realpathSync.native(parent), path.basename(resolved)); } catch { /* parent may not exist yet */ }
  }
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

function assertDistinctOutput(outputPath, inputPaths) {
  const output = comparablePath(outputPath);
  const conflict = inputPaths.map(comparablePath).find((value) => value === output);
  if (conflict) throw new Error(`Output path must differ from every input path: ${output}`);
}

function decodeEntities(value) {
  return value
    .replace(/&#38;/g, "&").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function htmlToPlainText(value) {
  return decodeEntities(String(value || "").replace(/<div class="csl-left-margin">([\s\S]*?)<\/div>\s*<div class="csl-right-inline">/g, "$1 ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
}

function tagContains(html, tag, fragment) {
  const safeTag = String(tag).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`<${safeTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${safeTag}>`, "gi");
  let match;
  while ((match = regex.exec(String(html || ""))) !== null) {
    if (htmlToPlainText(match[1]).includes(String(fragment))) return true;
  }
  return false;
}

function indexResult(result) {
  return {
    citation: new Map((result.citation_scenarios || []).map((row) => [String(row.id), row])),
    entry: new Map((result.bibliography_entries || []).flatMap((row) => (row.ids || [row.id]).filter(Boolean).map((id) => [String(id), row]))),
    parameter: result.bibliography_parameters || {}
  };
}

function getPath(object, dottedPath) {
  return String(dottedPath).split(".").reduce((value, key) => value == null ? undefined : value[key], object);
}

function evaluate(assertion, index) {
  if (assertion.scope === "zotero" || assertion.kind === "zotero_only") return {matched: false, zotero: true};
  if (assertion.scope === "parameter") {
    const actual = getPath(index.parameter, assertion.target);
    return {matched: actual === assertion.expected, actual};
  }
  const row = index[assertion.scope].get(String(assertion.target));
  if (!row) return {matched: false, missing: true, actual: null};
  const html = String(row.html || "");
  const plain = row.plain_text === undefined ? htmlToPlainText(html) : String(row.plain_text);
  if (assertion.kind === "exact_text") return {matched: plain === assertion.expected, actual: plain};
  if (assertion.kind === "contains_text") return {matched: plain.includes(String(assertion.expected)), actual: plain};
  if (assertion.kind === "not_contains_text") return {matched: !plain.includes(String(assertion.expected)), actual: plain};
  if (assertion.kind === "html_tag_contains") return {matched: tagContains(html, assertion.tag, assertion.expected), actual: html};
  if (assertion.kind === "not_html_tag_contains") return {matched: !tagContains(html, assertion.tag, assertion.expected), actual: html};
  if (assertion.kind === "equals") {
    const actual = getPath(row, assertion.field || "plain_text");
    return {matched: actual === assertion.expected, actual};
  }
  return {matched: false, unsupported: true, actual: null};
}

function validateOracle(oracle, actual, baseline) {
  const issues = [];
  if (oracle.schema_version !== 1) issues.push("Unsupported oracle schema_version.");
  if (!Array.isArray(oracle.assertions)) issues.push("Oracle assertions must be an array.");
  if (issues.length) return issues;
  if (oracle.assertions.length === 0) issues.push("Executable oracle must contain at least one assertion.");
  const ids = new Set();
  const rules = new Set((oracle.catalog && oracle.catalog.rule_ids) || []);
  const sources = new Set((oracle.catalog && oracle.catalog.source_ids) || []);
  const actualIndex = indexResult(actual);
  const baselineIndex = indexResult(baseline);
  for (const assertion of oracle.assertions) {
    if (!assertion.id || ids.has(assertion.id)) issues.push(`Missing or duplicate assertion ID: ${assertion.id || "<missing>"}.`);
    ids.add(assertion.id);
    if (!SUPPORTED_SCOPES.has(assertion.scope)) issues.push(`${assertion.id}: unsupported scope ${assertion.scope}.`);
    if (!SUPPORTED_KINDS.has(assertion.kind)) issues.push(`${assertion.id}: unsupported kind ${assertion.kind}.`);
    if (assertion.scope !== "zotero" && !["pass", "known_difference"].includes(assertion.parent_status)) issues.push(`${assertion.id}: invalid parent_status.`);
    if (!Array.isArray(assertion.rule_ids) || assertion.rule_ids.length === 0) issues.push(`${assertion.id}: rule_ids must be a nonempty array.`);
    if (!Array.isArray(assertion.source_ids) || assertion.source_ids.length === 0) issues.push(`${assertion.id}: source_ids must be a nonempty array.`);
    for (const id of Array.isArray(assertion.rule_ids) ? assertion.rule_ids : []) if (!rules.has(id)) issues.push(`${assertion.id}: unknown Rule ID ${id}.`);
    for (const id of Array.isArray(assertion.source_ids) ? assertion.source_ids : []) if (!sources.has(id)) issues.push(`${assertion.id}: unknown Source ID ${id}.`);
    if (assertion.scope !== "zotero" && assertion.target === undefined) issues.push(`${assertion.id}: target is required.`);
    if (assertion.scope !== "zotero" && assertion.expected === undefined) issues.push(`${assertion.id}: expected is required.`);
    if (["html_tag_contains", "not_html_tag_contains"].includes(assertion.kind) && !assertion.tag) issues.push(`${assertion.id}: tag is required for HTML tag assertions.`);
    if (assertion.scope !== "zotero") {
      const actualEvaluation = evaluate(assertion, actualIndex);
      const baselineEvaluation = evaluate(assertion, baselineIndex);
      if (actualEvaluation.unsupported || baselineEvaluation.unsupported) issues.push(`${assertion.id}: assertion cannot be evaluated.`);
      if (baselineEvaluation.missing) issues.push(`${assertion.id}: target is missing from the baseline.`);
      if (assertion.parent_status === "pass" && !baselineEvaluation.matched) issues.push(`${assertion.id}: parent_status says pass but the baseline fails.`);
      if (assertion.parent_status === "known_difference" && baselineEvaluation.matched) issues.push(`${assertion.id}: parent_status says known_difference but the baseline passes.`);
    }
  }
  return [...new Set(issues)];
}

function classify(assertion, actualEval, baselineEval) {
  if (actualEval.zotero) return "zotero-required";
  if (actualEval.missing || actualEval.unsupported) return "fixture-or-expectation-suspect";
  if (actualEval.matched) return "pass";
  if (baselineEval.missing || baselineEval.unsupported) return "fixture-or-expectation-suspect";
  if (assertion.parent_status === "pass" && !baselineEval.matched) return "fixture-or-expectation-suspect";
  if (assertion.parent_status === "known_difference" && !baselineEval.matched) return "known-parent-difference";
  return "unexpected-regression";
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) return console.log(usage());
  for (const key of ["oracle", "actual", "baseline", "output"]) if (!args[key]) throw new Error(`Missing --${key}\n${usage()}`);
  assertDistinctOutput(args.output, [args.oracle, args.actual, args.baseline]);
  const oracle = readJson(args.oracle);
  const actual = readJson(args.actual);
  const baseline = readJson(args.baseline);
  const issues = validateOracle(oracle, actual, baseline);
  const actualIndex = indexResult(actual);
  const baselineIndex = indexResult(baseline);
  const results = (oracle.assertions || []).map((assertion) => {
    const actualEval = evaluate(assertion, actualIndex);
    const baselineEval = evaluate(assertion, baselineIndex);
    return {
      id: assertion.id,
      gate: assertion.gate || "unspecified",
      scope: assertion.scope,
      classification: classify(assertion, actualEval, baselineEval),
      expected: assertion.expected,
      actual: actualEval.actual,
      rule_ids: assertion.rule_ids || [],
      source_ids: assertion.source_ids || []
    };
  });
  issues.forEach((reason, index) => results.push({id: `ORACLE_INTEGRITY_${index + 1}`, gate: "infrastructure", scope: "oracle", classification: "fixture-or-expectation-suspect", reason, rule_ids: [], source_ids: []}));
  const counts = results.reduce((acc, row) => ({...acc, [row.classification]: (acc[row.classification] || 0) + 1}), {});
  const report = {generated_at: new Date().toISOString(), auxiliary_only: true, integrity_issue_count: issues.length, counts, results};
  const outputPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Oracle integrity issues: ${issues.length}`);
  Object.entries(counts).forEach(([key, value]) => console.log(`${key}: ${value}`));
  console.log(`OUTPUT: ${outputPath}`);
  if (issues.length || (counts["unexpected-regression"] || 0)) process.exitCode = 2;
}

module.exports = {assertDistinctOutput, classify, comparablePath, evaluate, htmlToPlainText, indexResult, tagContains, validateOracle};

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
