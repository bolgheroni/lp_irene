#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="assets/photos/originals"
OUT_DIR="assets/photos"
MAX_DIM=1920
QUALITY=55

mkdir -p "$OUT_DIR"
shopt -s nullglob

for src in "$SRC_DIR"/*.jpg "$SRC_DIR"/*.jpeg "$SRC_DIR"/*.JPG; do
  filename=$(basename "$src")
  base="${filename%.*}"
  out="$OUT_DIR/${base}.jpg"

  # Skip if up-to-date
  if [[ -f "$out" && "$out" -nt "$src" ]]; then
    echo "skip $filename"
    continue
  fi

  echo "optimize $filename"
  # Resize so the long edge is MAX_DIM, then re-encode JPEG at QUALITY.
  sips --resampleHeightWidthMax "$MAX_DIM" \
       -s format jpeg \
       -s formatOptions "$QUALITY" \
       "$src" --out "$out" >/dev/null
done

echo
echo "Output sizes:"
du -sh "$OUT_DIR"/*.jpg | sort -h
echo
echo "Total:"
du -sh "$OUT_DIR"
