#!/usr/bin/env bash
set -euo pipefail

# ensure_html.sh
# Usage: ensure_html.sh /path/to/dir1/index.html /another/path/page.html ...
# Creates parent directories and html files if they don't exist.

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 /abs/or/relative/path/file.html [more.html ...]" >&2
  exit 1
fi

for target in "$@"; do
  # Normalize to absolute path
  if [[ "$target" != /* ]]; then
    target="$(pwd)/$target"
  fi

  dir="$(dirname -- "$target")"
  file="$(basename -- "$target")"

  # Ensure .html extension
  case "$file" in
    *.html) ;;
    *)
      echo "Skipping '$target' (not an .html file)" >&2
      continue
      ;;
  esac

  # Create directory if missing
  if [[ ! -d "$dir" ]]; then
    mkdir -p -- "$dir"
    echo "Created directory: $dir"
  fi

  # Create file if missing
  if [[ ! -f "$target" ]]; then
    cat > "$target" <<'TEMPLATE'
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>New Page</title>
	<style>
		:root { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
		body { margin: 2rem; line-height: 1.6; }
		h1 { font-size: 1.75rem; }
	</style>
</head>
<body>
	<h1>New Page</h1>
	<p>This page was created by ensure_html.sh.</p>
</body>
</html>
TEMPLATE
    echo "Created file: $target"
  else
    echo "Exists: $target"
  fi

done
