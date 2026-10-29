from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path


SKILL = Path(__file__).resolve().parents[2]


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def main() -> None:
    for name in ("oracle-template.json", "citation-scenarios-template.json"):
        data = json.loads((SKILL / "assets" / name).read_text(encoding="utf-8"))
        assert data["schema_version"] == 1

    temp = Path(__file__).resolve().parent / "_runtime"
    temp.mkdir(exist_ok=True)
    try:
        source = temp / "candidate.csl"
        destination = temp / "deliverables" / "candidate.csl"
        report = temp / "promotion.json"
        source.write_bytes(b"<style/>\r\n")
        source_hash = digest(source)
        command = [
            sys.executable,
            str(SKILL / "scripts" / "promote_verified_artifact.py"),
            str(source),
            str(destination),
            "--expected-sha256",
            source_hash,
            "--json-output",
            str(report),
        ]
        completed = subprocess.run(command, check=True, capture_output=True, text=True)
        assert "promoted" in completed.stdout
        assert destination.read_bytes() == source.read_bytes()
        assert digest(destination) == source_hash
        assert json.loads(report.read_text(encoding="utf-8"))["sha256"] == source_hash

        repeated = subprocess.run(command, capture_output=True, text=True)
        assert repeated.returncode != 0
        assert "will not be overwritten" in repeated.stderr

        alias_command = command[:-2] + ["--json-output", str(source)]
        alias = subprocess.run(alias_command, capture_output=True, text=True)
        assert alias.returncode != 0
        assert "must differ" in alias.stderr

        validator_alias = subprocess.run(
            [
                sys.executable,
                str(SKILL / "scripts" / "validate_csl.py"),
                str(source),
                "--rnc",
                str(source),
                "--schematron",
                str(source),
                "--schema-id",
                "test-schema",
                "--json-output",
                str(source),
            ],
            capture_output=True,
            text=True,
        )
        assert validator_alias.returncode != 0
        assert "must differ" in validator_alias.stderr
    finally:
        for path in (report, destination, source):
            if path.exists():
                path.unlink()
        deliverables = temp / "deliverables"
        if deliverables.exists():
            deliverables.rmdir()
        temp.rmdir()

    print("PASS: JSON templates and byte-preserving promotion")


if __name__ == "__main__":
    main()
