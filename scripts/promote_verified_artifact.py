#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import tempfile
from pathlib import Path
import re


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def main() -> None:
    parser = argparse.ArgumentParser(description="Promote a witnessed artifact by byte-preserving copy and SHA-256 equality verification.")
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--expected-sha256", required=True)
    parser.add_argument("--allow-identical-existing", action="store_true")
    parser.add_argument("--json-output", type=Path)
    args = parser.parse_args()

    source = args.source.resolve()
    destination = args.destination.resolve()
    expected = args.expected_sha256.upper()
    if not re.fullmatch(r"[0-9A-F]{64}", expected):
        raise SystemExit("--expected-sha256 must be exactly 64 hexadecimal characters.")
    if not source.is_file():
        raise SystemExit(f"Source is not a file: {source}")
    if source == destination:
        raise SystemExit("Source and destination must differ.")
    report_path = args.json_output.resolve() if args.json_output else None
    if report_path in {source, destination}:
        raise SystemExit("JSON report path must differ from source and destination.")

    source_hash = sha256(source)
    if source_hash != expected:
        raise SystemExit(f"Source SHA-256 mismatch: expected {expected}, got {source_hash}")

    if destination.exists():
        if args.allow_identical_existing and destination.is_file() and sha256(destination) == source_hash:
            result = {"status": "already-identical", "source": str(source), "destination": str(destination), "sha256": source_hash}
            if report_path:
                report_path.parent.mkdir(parents=True, exist_ok=True)
                report_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
            print(json.dumps(result, indent=2))
            return
        raise SystemExit(f"Destination already exists and will not be overwritten: {destination}")

    destination.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(prefix=f".{destination.name}.", suffix=".tmp", dir=destination.parent)
    temporary = Path(temporary_name)
    try:
        with source.open("rb") as source_handle, os.fdopen(descriptor, "wb") as destination_handle:
            shutil.copyfileobj(source_handle, destination_handle, length=1024 * 1024)
            destination_handle.flush()
            os.fsync(destination_handle.fileno())
        temporary_hash = sha256(temporary)
        if temporary_hash != source_hash:
            raise RuntimeError(f"Temporary copy SHA-256 mismatch: {temporary_hash}")
        os.replace(temporary, destination)
    finally:
        if temporary.exists():
            temporary.unlink()

    destination_hash = sha256(destination)
    if destination_hash != source_hash:
        raise RuntimeError(f"Destination SHA-256 mismatch: {destination_hash}")
    result = {"status": "promoted", "source": str(source), "destination": str(destination), "sha256": destination_hash}
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
