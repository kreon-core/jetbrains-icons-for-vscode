#!/bin/bash
set -e

PKG_JSON="package.json"

if [ ! -f "$PKG_JSON" ]; then
	echo "package.json not found!"
	exit 1
fi

# Get current version
CUR_VER=$(jq -r '.version' "$PKG_JSON")
IFS='.' read -r MAJOR MINOR PATCH <<<"$CUR_VER"

# Determine which part to bump based on first argument
case "$1" in
1)
	MAJOR=$((MAJOR + 1))
	MINOR=0
	PATCH=0
	;;
2)
	MINOR=$((MINOR + 1))
	PATCH=0
	;;
3)
	PATCH=$((PATCH + 1))
	;;
*)
	echo "Usage: $0 [1|2|3] (1=major, 2=minor, 3=patch)"
	exit 1
	;;
esac
NEW_VER="$MAJOR.$MINOR.$PATCH"

# Update package.json
jq ".version = \"$NEW_VER\"" "$PKG_JSON" >"$PKG_JSON.tmp" && mv "$PKG_JSON.tmp" "$PKG_JSON"

echo "Version bumped: $CUR_VER -> $NEW_VER"
