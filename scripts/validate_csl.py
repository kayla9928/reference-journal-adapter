#!/usr/bin/env python3
from __future__ import annotations

import argparse
import importlib.metadata
import json
import sys
from pathlib import Path


def dependencies():
    try:
        from lxml import etree, isoschematron
        import rnc2rng
    except ImportError as error:
        raise SystemExit(
            "Missing validator dependency. Install project-pinned lxml and rnc2rng, then retry: "
            f"{error}"
        ) from error
    return etree, isoschematron, rnc2rng


def validate(style_path: Path, rnc_path: Path, schematron_path: Path, schema_id: str, schema_release: str) -> dict[str, object]:
    etree, isoschematron, rnc2rng = dependencies()
    parser = etree.XMLParser(resolve_entities=False, no_network=True, remove_blank_text=False)
    document = etree.parse(str(style_path), parser)

    with rnc_path.open("r", encoding="utf-8") as schema_file:
        rng_xml = rnc2rng.dumps(rnc2rng.load(schema_file))
    rng_document = etree.fromstring(rng_xml.encode("utf-8"), parser)
    relaxng = etree.RelaxNG(rng_document)
    rng_valid = relaxng.validate(document)

    schematron_document = etree.parse(str(schematron_path), parser)
    schematron = isoschematron.Schematron(schematron_document, store_report=True)
    schematron_valid = schematron.validate(document)
    failed_asserts = schematron.validation_report.xpath(
        "//*[local-name()='failed-assert']/*[local-name()='text']/text()"
    )

    return {
        "style": str(style_path.resolve()),
        "well_formed_xml": True,
        "relax_ng_valid": rng_valid,
        "relax_ng_errors": [str(entry) for entry in relaxng.error_log],
        "schematron_valid": schematron_valid,
        "schematron_failed_asserts": failed_asserts,
        "schema": {
            "identity": schema_id,
            "release": schema_release,
            "rnc": str(rnc_path.resolve()),
            "schematron": str(schematron_path.resolve()),
        },
        "validator": {
            "python": sys.version.split()[0],
            "lxml": ".".join(map(str, etree.LXML_VERSION)),
            "rnc2rng": importlib.metadata.version("rnc2rng"),
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate one CSL style against explicitly supplied official RNC and Schematron files.")
    parser.add_argument("style", type=Path)
    parser.add_argument("--rnc", type=Path, required=True)
    parser.add_argument("--schematron", type=Path, required=True)
    parser.add_argument("--schema-id", required=True, help="Recorded repository commit, tag, or other stable identity")
    parser.add_argument("--schema-release", default="unspecified")
    parser.add_argument("--dependency-path", type=Path, action="append", default=[], help="Project-local Python package directory; may be repeated")
    parser.add_argument("--json-output", type=Path)
    args = parser.parse_args()

    for dependency_path in reversed(args.dependency_path):
        if not dependency_path.is_dir():
            raise SystemExit(f"Missing dependency directory: {dependency_path}")
        sys.path.insert(0, str(dependency_path.resolve()))

    for file_path, label in ((args.style, "style"), (args.rnc, "RNC"), (args.schematron, "Schematron")):
        if not file_path.is_file():
            raise SystemExit(f"Missing {label} file: {file_path}")
    if args.json_output:
        output_path = args.json_output.resolve()
        input_paths = {args.style.resolve(), args.rnc.resolve(), args.schematron.resolve()}
        if output_path in input_paths:
            raise SystemExit(f"JSON output path must differ from every input path: {output_path}")

    try:
        result = validate(args.style, args.rnc, args.schematron, args.schema_id, args.schema_release)
    except Exception as error:
        etree, _, _ = dependencies()
        if not isinstance(error, etree.XMLSyntaxError):
            raise
        result = {
            "style": str(args.style.resolve()),
            "well_formed_xml": False,
            "relax_ng_valid": False,
            "relax_ng_errors": [str(error)],
            "schematron_valid": False,
            "schematron_failed_asserts": [],
            "schema": {"identity": args.schema_id, "release": args.schema_release},
        }

    if args.json_output:
        args.json_output.parent.mkdir(parents=True, exist_ok=True)
        args.json_output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"XML well formed: {result['well_formed_xml']}")
    print(f"RELAX NG valid: {result['relax_ng_valid']}")
    print(f"Schematron valid: {result['schematron_valid']}")
    for error in result.get("relax_ng_errors", []):
        print(f"RELAX NG: {error}")
    for error in result.get("schematron_failed_asserts", []):
        print(f"Schematron: {error}")
    if not all(result[key] for key in ("well_formed_xml", "relax_ng_valid", "schematron_valid")):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
