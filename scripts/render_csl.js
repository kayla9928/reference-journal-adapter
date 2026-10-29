#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help") return {help: true};
    if (!token.startsWith("--") || index + 1 >= argv.length) {
      throw new Error(`Invalid argument: ${token}`);
    }
    args[token.slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

function usage() {
  return [
    "Usage: node render_csl.js --style STYLE --items ITEMS --scenarios SCENARIOS",
    "  --locale LOCALE --lang TAG --output OUTPUT [--citeproc MODULE_OR_PATH]",
    "The citeproc dependency is resolved from the target project's current directory unless an explicit path is supplied."
  ].join("\n");
}

function requireArg(args, key) {
  if (!args[key]) throw new Error(`Missing --${key}\n${usage()}`);
  return path.resolve(args[key]);
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolveCiteproc(specifier) {
  const value = specifier || "citeproc";
  let resolved;
  if (value.includes("/") || value.includes("\\") || path.isAbsolute(value)) {
    resolved = require.resolve(path.resolve(value));
  } else {
    resolved = require.resolve(value, {paths: [process.cwd()]});
  }
  let directory = path.dirname(resolved);
  let metadata = {};
  while (directory !== path.dirname(directory)) {
    const candidate = path.join(directory, "package.json");
    if (fs.existsSync(candidate)) {
      metadata = JSON.parse(fs.readFileSync(candidate, "utf8"));
      break;
    }
    directory = path.dirname(directory);
  }
  return {CSL: require(resolved), resolved, metadata};
}

function decodeEntities(value) {
  return value
    .replace(/&#38;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function htmlToPlainText(value) {
  return decodeEntities(
    value
      .replace(/<div class="csl-left-margin">([\s\S]*?)<\/div>\s*<div class="csl-right-inline">/g, "$1 ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function createEngine(CSL, style, locale, itemsById, language) {
  const system = {
    retrieveLocale: () => locale,
    retrieveItem: (id) => itemsById[id]
  };
  const engine = new CSL.Engine(system, style, language);
  engine.setOutputFormat("html");
  return engine;
}

function normalizeCitationItem(value, scenarioId) {
  if (typeof value === "string" || typeof value === "number") return {id: String(value)};
  if (value && typeof value === "object" && value.id !== undefined) return {...value, id: String(value.id)};
  throw new Error(`Invalid citation item in scenario ${scenarioId}. Use an item ID or an object with an id field.`);
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(usage());
    return;
  }

  const stylePath = requireArg(args, "style");
  const itemsPath = requireArg(args, "items");
  const scenariosPath = requireArg(args, "scenarios");
  const localePath = requireArg(args, "locale");
  const outputPath = requireArg(args, "output");
  if (!args.lang) throw new Error(`Missing --lang\n${usage()}`);
  const language = args.lang;
  assertDistinctOutput(outputPath, [stylePath, itemsPath, scenariosPath, localePath]);
  const citeproc = resolveCiteproc(args.citeproc);
  const CSL = citeproc.CSL;

  const style = fs.readFileSync(stylePath, "utf8");
  const locale = fs.readFileSync(localePath, "utf8");
  const items = readJson(itemsPath);
  const scenarioData = readJson(scenariosPath);
  if (!Array.isArray(items) || !Array.isArray(scenarioData.number_assignment_order) || !Array.isArray(scenarioData.scenarios)) {
    throw new Error("Items must be an array and scenarios must contain number_assignment_order and scenarios arrays.");
  }
  const itemsById = Object.fromEntries(items.map((item) => [String(item.id), item]));
  const assignment = scenarioData.number_assignment_order.map(String);
  for (const id of assignment) if (!itemsById[id]) throw new Error(`Unknown item in number assignment: ${id}`);

  const citationResults = scenarioData.scenarios.map((scenario) => {
    const engine = createEngine(CSL, style, locale, itemsById, language);
    engine.updateItems(assignment);
    if (!Array.isArray(scenario.items)) throw new Error(`Scenario ${scenario.id} must contain an items array.`);
    const citationItems = scenario.items.map((value) => normalizeCitationItem(value, scenario.id));
    for (const item of citationItems) if (!itemsById[item.id]) throw new Error(`Unknown item in scenario ${scenario.id}: ${item.id}`);
    const html = engine.makeCitationCluster(citationItems);
    return {id: scenario.id, items: citationItems, html, plain_text: htmlToPlainText(html)};
  });

  const bibliographyEngine = createEngine(CSL, style, locale, itemsById, language);
  bibliographyEngine.updateItems(assignment);
  const bibliography = bibliographyEngine.makeBibliography();
  if (!bibliography) throw new Error("Processor did not return a bibliography.");
  const [parameters, entries] = bibliography;
  const entryIds = Array.isArray(parameters.entry_ids) ? parameters.entry_ids : [];

  const result = {
    generated_at: new Date().toISOString(),
    auxiliary_only: true,
    processor: {
      module: citeproc.resolved,
      package_name: citeproc.metadata.name || "unknown",
      package_version: citeproc.metadata.version || "unknown",
      package_license: citeproc.metadata.license || "unknown",
      engine_version: CSL.PROCESSOR_VERSION || CSL.version || "unknown"
    },
    language,
    style: stylePath,
    locale: localePath,
    items: itemsPath,
    citation_scenarios: citationResults,
    bibliography_parameters: parameters,
    bibliography_entries: entries.map((html, index) => {
      const ids = Array.isArray(entryIds[index]) ? entryIds[index].map(String) : [assignment[index]];
      return {number: index + 1, id: ids[0], ids, html, plain_text: htmlToPlainText(html)};
    })
  };

  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`PASS: rendered ${citationResults.length} citation scenarios and ${entries.length} bibliography entries`);
  console.log(`OUTPUT: ${outputPath}`);
}

module.exports = {assertDistinctOutput, comparablePath, createEngine, decodeEntities, htmlToPlainText, normalizeCitationItem, parseArgs, resolveCiteproc};

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
