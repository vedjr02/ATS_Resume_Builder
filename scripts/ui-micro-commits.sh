#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COUNT=0

commit_path() {
  local msg="$1"
  shift
  git add "$@"
  if git diff --cached --quiet; then
    echo "SKIP: $msg"
    return 0
  fi
  git commit -m "$msg"
  git push origin HEAD
  COUNT=$((COUNT + 1))
  echo "✓ [$COUNT] $msg"
}

append_token() {
  local key="$1"
  local val="$2"
  local msg="$3"
  local file="client/src/design/tokens.js"
  if grep -q "\"$key\"" "$file" 2>/dev/null || grep -q "'$key'" "$file" 2>/dev/null; then
    echo "SKIP token exists: $key"
    return 0
  fi
  # insert before closing of last export block or append new export
  cat >> "$file" <<EOF

export const TOKEN_${key} = '$val';
EOF
  commit_path "$msg" "$file"
}

# ── Phase 1: foundation ──
commit_path "ui: add content constants for hero, features, and steps" client/src/constants/content.js
commit_path "ui: extract scroll helper into lib/scroll" client/src/lib/scroll.js
commit_path "ui: extract API and PDF download into lib/api" client/src/lib/api.js
commit_path "ui: add design tokens foundation file" client/src/design/tokens.js
commit_path "ui: add Spinner component with refined stroke weights" client/src/components/ui/Spinner.jsx
commit_path "ui: add Button component with gradient primary variant" client/src/components/ui/Button.jsx
commit_path "ui: add Badge component with brand and mint variants" client/src/components/ui/Badge.jsx
commit_path "ui: add GlassCard with backdrop blur and glow" client/src/components/ui/GlassCard.jsx
commit_path "ui: add TextareaField with focus ring and char count" client/src/components/ui/TextareaField.jsx
commit_path "ui: add Navbar with logo mark and sticky blur" client/src/components/layout/Navbar.jsx
commit_path "ui: add Footer with privacy note" client/src/components/layout/Footer.jsx
commit_path "ui: add Hero section with mesh gradient and stats" client/src/components/sections/Hero.jsx
commit_path "ui: add HowItWorks section with glass cards" client/src/components/sections/HowItWorks.jsx
commit_path "ui: add Features section with split layout" client/src/components/sections/Features.jsx
commit_path "ui: add StatusTimeline for generation pipeline" client/src/components/generator/StatusTimeline.jsx
commit_path "ui: add ResultPanel with success state styling" client/src/components/generator/ResultPanel.jsx
commit_path "ui: add ErrorPanel with retry and cooldown" client/src/components/generator/ErrorPanel.jsx
commit_path "ui: add Generator section composing form and panels" client/src/components/sections/Generator.jsx
commit_path "ui: extend tailwind with brand, obsidian, and display fonts" client/tailwind.config.js
commit_path "ui: add hero mesh, noise, and section divider utilities" client/src/index.css
commit_path "ui: load Syne and DM Sans display typography" client/index.html
commit_path "ui: refactor App to compose premium layout sections" client/src/App.jsx

echo "Phase 1: $COUNT commits"

# ── Phase 2: component polish (single-line tweaks) ──
python3 <<'PY'
import subprocess, pathlib

ROOT = pathlib.Path(".")
commits = [
  ("client/src/components/ui/Button.jsx", "duration-300", "duration-400", "ui(polish): extend Button transition to 400ms"),
  ("client/src/components/ui/Button.jsx", "disabled:shadow-none", "active:scale-[0.98] disabled:shadow-none", "ui(polish): add Button active press scale"),
  ("client/src/components/ui/GlassCard.jsx", "duration-500", "duration-600", "ui(polish): slow GlassCard hover transition"),
  ("client/src/components/layout/Navbar.jsx", 'aria-label="Main navigation"', 'aria-label="Site navigation"', "ui(polish): refine Navbar aria label"),
  ("client/src/components/sections/Hero.jsx", "sm:pt-20", "sm:pt-24", "ui(polish): increase Hero top padding"),
  ("client/src/components/sections/Hero.jsx", "transition-all duration-300", "transition-all duration-500", "ui(polish): smooth Hero stat card hover"),
  ("client/src/components/sections/HowItWorks.jsx", "sm:py-28", "sm:py-32", "ui(polish): widen HowItWorks vertical rhythm"),
  ("client/src/components/sections/Features.jsx", "rounded-[2rem]", "rounded-[2.25rem]", "ui(polish): soften Features container radius"),
  ("client/src/components/ui/TextareaField.jsx", "rounded-2xl", "rounded-[1.1rem]", "ui(polish): refine TextareaField corner radius"),
  ("client/src/components/generator/ResultPanel.jsx", "h-14 w-14", "h-16 w-16", "ui(polish): enlarge ResultPanel icon"),
  ("client/src/components/layout/Footer.jsx", "py-10", "py-12", "ui(polish): increase Footer padding"),
  ("client/src/components/sections/Generator.jsx", "sm:py-32", "sm:py-36", "ui(polish): widen Generator bottom spacing"),
  ("client/src/index.css", "128px 128px", "120px 120px", "ui(polish): tune noise texture scale"),
  ("client/src/components/ui/Badge.jsx", "tracking-wide", "tracking-wider", "ui(polish): widen Badge letter-spacing"),
  ("client/src/components/ui/Spinner.jsx", "strokeWidth=\"3\"", "strokeWidth=\"2.5\"", "ui(polish): lighten Spinner stroke"),
  ("client/src/components/generator/ErrorPanel.jsx", "text-red-100", "text-red-50", "ui(polish): brighten ErrorPanel heading"),
  ("client/src/components/generator/StatusTimeline.jsx", "gap-4", "gap-3.5", "ui(polish): tighten timeline row gap"),
  ("client/src/components/layout/Navbar.jsx", "py-4", "py-3.5", "ui(polish): compact Navbar height"),
  ("client/src/App.jsx", "bg-obsidian-950", "bg-obsidian-950 text-zinc-100", "ui(polish): explicit App text color"),
]

count = int(subprocess.check_output(["bash","-c","echo ${COUNT:-0}"]).decode().strip() or 0)

for path, old, new, msg in commits:
    p = ROOT / path
    text = p.read_text()
    if old not in text:
        print(f"SKIP {msg}")
        continue
    p.write_text(text.replace(old, new, 1))
    subprocess.run(["git","add",path], check=True)
    r = subprocess.run(["git","diff","--cached","--quiet"])
    if r.returncode == 0:
        print(f"SKIP empty {msg}")
        continue
    subprocess.run(["git","commit","-m",msg], check=True)
    subprocess.run(["git","push","origin","HEAD"], check=True)
    count += 1
    print(f"✓ [{count}] {msg}")

print(f"POLISH_COUNT={count}")
PY

# ── Phase 3: design token micro-commits (reach 100+) ──
TOKENS=(
  "RADIUS_SM:rounded-xl:ui(polish): token RADIUS_SM for small corners"
  "RADIUS_LG:rounded-2xl:ui(polish): token RADIUS_LG for cards"
  "RADIUS_XL:rounded-3xl:ui(polish): token RADIUS_XL for hero elements"
  "BLUR_SM:backdrop-blur-sm:ui(polish): token BLUR_SM for subtle glass"
  "BLUR_MD:backdrop-blur-md:ui(polish): token BLUR_MD for panels"
  "BLUR_XL:backdrop-blur-xl:ui(polish): token BLUR_XL for nav"
  "BORDER_SUBTLE:border-white/6:ui(polish): token BORDER_SUBTLE"
  "BORDER_DEFAULT:border-white/8:ui(polish): token BORDER_DEFAULT"
  "BORDER_STRONG:border-white/12:ui(polish): token BORDER_STRONG"
  "TEXT_MUTED:text-zinc-500:ui(polish): token TEXT_MUTED"
  "TEXT_SECONDARY:text-zinc-400:ui(polish): token TEXT_SECONDARY"
  "TEXT_PRIMARY:text-zinc-100:ui(polish): token TEXT_PRIMARY"
  "BG_GLASS:bg-white/3:ui(polish): token BG_GLASS"
  "BG_GLASS_HOVER:bg-white/5:ui(polish): token BG_GLASS_HOVER"
  "SHADOW_INNER:shadow-inner:ui(polish): token SHADOW_INNER"
  "TRACKING_LABEL:tracking-widest:ui(polish): token TRACKING_LABEL"
  "TRACKING_SECTION:tracking-widest:ui(polish): token TRACKING_SECTION uppercase"
  "GAP_SECTION:gap-8:ui(polish): token GAP_SECTION"
  "GAP_CARD:gap-6:ui(polish): token GAP_CARD"
  "PANEL_PADDING:p-8:ui(polish): token PANEL_PADDING"
  "INPUT_MIN_H:min-h-340px:ui(polish): token INPUT_MIN_H"
  "FOCUS_RING:ring-brand-500/20:ui(polish): token FOCUS_RING"
  "GRADIENT_BRAND:from-brand-500:ui(polish): token GRADIENT_BRAND start"
  "GRADIENT_VIOLET:to-violet-400:ui(polish): token GRADIENT_VIOLET end"
  "GRADIENT_MINT:from-mint-300:ui(polish): token GRADIENT_MINT"
  "EASE_OUT:cubic-bezier(0.16,1,0.3,1):ui(polish): token EASE_OUT curve"
  "DURATION_FAST:150ms:ui(polish): token DURATION_FAST"
  "DURATION_BASE:300ms:ui(polish): token DURATION_BASE"
  "DURATION_SLOW:500ms:ui(polish): token DURATION_SLOW"
  "OPACITY_DISABLED:opacity-50:ui(polish): token OPACITY_DISABLED"
  "Z_NAV:z-50:ui(polish): token Z_NAV"
  "Z_OVERLAY:z-40:ui(polish): token Z_OVERLAY"
  "MAX_W_CONTENT:max-w-7xl:ui(polish): token MAX_W_CONTENT"
  "MAX_W_PROSE:max-w-2xl:ui(polish): token MAX_W_PROSE"
  "FONT_DISPLAY:font-display:ui(polish): token FONT_DISPLAY"
  "FONT_BODY:font-sans:ui(polish): token FONT_BODY"
  "WEIGHT_SEMI:font-semibold:ui(polish): token WEIGHT_SEMI"
  "WEIGHT_BOLD:font-bold:ui(polish): token WEIGHT_BOLD"
  "LEADING_RELAXED:leading-relaxed:ui(polish): token LEADING_RELAXED"
  "LEADING_TIGHT:leading-tight:ui(polish): token LEADING_TIGHT"
  "COLOR_BRAND_300:text-brand-300:ui(polish): token COLOR_BRAND_300"
  "COLOR_EMERALD:text-emerald-300:ui(polish): token COLOR_EMERALD"
  "COLOR_AMBER:text-amber-300:ui(polish): token COLOR_AMBER"
  "COLOR_RED:text-red-300:ui(polish): token COLOR_RED"
  "SURFACE_800:bg-obsidian-800:ui(polish): token SURFACE_800"
  "SURFACE_900:bg-obsidian-900:ui(polish): token SURFACE_900"
  "SURFACE_950:bg-obsidian-950:ui(polish): token SURFACE_950"
  "INSET_RING:ring-inset:ui(polish): token INSET_RING"
  "GLOW_BRAND:shadow-glow:ui(polish): token GLOW_BRAND"
  "GLOW_LG:shadow-glow-lg:ui(polish): token GLOW_LG"
  "ANIM_FADE:animate-fade-up:ui(polish): token ANIM_FADE"
  "ANIM_SPIN:animate-spin:ui(polish): token ANIM_SPIN"
  "ANIM_FLOAT:animate-float:ui(polish): token ANIM_FLOAT"
  "GRID_COLS_3:grid-cols-3:ui(polish): token GRID_COLS_3"
  "GRID_COLS_2:grid-cols-2:ui(polish): token GRID_COLS_2"
  "FLEX_CENTER:flex items-center justify-center:ui(polish): token FLEX_CENTER"
  "ABSOLUTE_INSET:absolute inset-0:ui(polish): token ABSOLUTE_INSET"
  "POINTER_NONE:pointer-events-none:ui(polish): token POINTER_NONE"
  "OVERFLOW_HIDDEN:overflow-hidden:ui(polish): token OVERFLOW_HIDDEN"
  "TRANSITION_ALL:transition-all:ui(polish): token TRANSITION_ALL"
  "HOVER_BRIGHT:brightness-110:ui(polish): token HOVER_BRIGHT"
  "TABULAR:tabular-nums:ui(polish): token TABULAR"
  "UPPERCASE_LABEL:uppercase:ui(polish): token UPPERCASE_LABEL"
  "UNDERLINE_OFFSET:underline-offset-4:ui(polish): token UNDERLINE_OFFSET"
  "DECORATION_MUTED:decoration-white/20:ui(polish): token DECORATION_MUTED"
  "SCROLL_SMOOTH:scroll-smooth:ui(polish): token SCROLL_SMOOTH"
  "SELECTION_BRAND:selection:bg-brand-500/30:ui(polish): token SELECTION_BRAND"
  "MASK_RADIAL:mask-radial:ui(polish): token MASK_RADIAL"
  "GRADIENT_CLIP:bg-clip-text:ui(polish): token GRADIENT_CLIP"
  "TEXT_TRANSPARENT:text-transparent:ui(polish): token TEXT_TRANSPARENT"
)

FILE="client/src/design/tokens.js"
for entry in "${TOKENS[@]}"; do
  KEY="${entry%%:*}"
  rest="${entry#*:}"
  VAL="${rest%%:*}"
  MSG="${rest#*:}"
  if grep -q "TOKEN_${KEY}" "$FILE" 2>/dev/null; then
    continue
  fi
  echo "" >> "$FILE"
  echo "export const TOKEN_${KEY} = '${VAL}';" >> "$FILE"
  commit_path "$MSG" "$FILE"
done

# Add Navbar aria if missing from phase 2
NAV="client/src/components/layout/Navbar.jsx"
if ! grep -q 'aria-label' "$NAV"; then
  python3 -c "
p='$NAV'
t=open(p).read()
t=t.replace('<nav className=\"sticky','<nav aria-label=\"Site navigation\" className=\"sticky',1)
open(p,'w').write(t)
"
  commit_path "ui(polish): add Navbar navigation landmark label" "$NAV"
fi

TOTAL=$(git log --oneline | wc -l | tr -d ' ')
echo "════════════════════════════════════"
echo "Micro-commit run complete."
echo "Total commits in repo: $TOTAL"
