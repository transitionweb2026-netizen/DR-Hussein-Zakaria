"""
Fetch real, royalty-free/public-domain photography from Wikimedia Commons to
replace the procedural placeholder images used across the Dr. Hussein Zakaria
site. Images are searched via the Commons search API (File namespace, bitmap
only), downloaded at a sane resolution via Special:FilePath, converted to
RGB JPEG (or RGBA PNG for avatars), and saved under the exact filenames the
Next.js components already reference -- so no component code needs to change.

Every choice is logged to manifest.json (source Commons file title + page
URL) so provenance/attribution can be checked later.
"""
import json
import os
import subprocess
import time
import urllib.parse
from io import BytesIO

from PIL import Image

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")
MANIFEST_PATH = os.path.join(os.path.dirname(__file__), "real_images_manifest.json")
UA = "HusseinZakariaSiteBot/1.0 (temporary dev-content sourcing; contact: transitionweb2026@gmail.com)"

API = "https://commons.wikimedia.org/w/api.php"

# Titles containing any of these (case-insensitive) are excluded outright:
# antique/archival book & engraving scans (wrong "modern professional" look),
# military/combat/casualty photojournalism and refugee/crisis imagery (wrong
# context + real identifiable people in serious real circumstances), and
# real specific personal documents (a real diploma/certificate has a real
# other person's real name and institution printed on it, which would read
# as broken/wrong content, independent of any identity concern).
BLOCKLIST = [
    "(ia ", "personification", "allegor", "engraving", "woodcut",
    "plate from", "frontispiece", "vintage", "antique", "historical",
    "biographical", "afghanistan", "iraq", "combat", "military", " war ",
    "ww1", "ww2", "world war", "casualty", "wounded", "trauma team",
    "soldier", "refugee", " camp", "disaster", "famine", "crisis", "victim",
    "awarded to", "baptismal", "marriage certificate", "birth certificate",
    "diploma of", "commencement", "gravestone", "memorial", "forestry",
    "sketches of", "hundred years", "dvids", "partnership", "little girl",
    "little boy", "humanitarian", "mod ", " dod ", "student nurse",
    "life at", "mast course", "ausmat", "medical assistance team",
    "trade card", "return sight", "cadaver", "dissection", "specimen",
    "cross section", "cross-section", "sagittal section", "post-mortem",
    "postmortem", "autopsy", "coupe", "embalmed", "prosection", "corpse",
    "helmand", "spangdahlem", "joint theater hospital", "tesla",
    "bagram", "kandahar", "joint task force", "röntgen", "roentgen",
    "wilhelm", "first medical x-ray",
]

USED_TITLES = set()


def _is_blocked(title):
    t = title.lower()
    if any(b in t for b in BLOCKLIST):
        return True
    import re
    # US DoD public-affairs photo ID, e.g. "111015-M-DF801-013" or
    # "150724-F-QU482-002" -- reliably signals a military-sourced photo
    # (often from an active conflict zone hospital), regardless of caption.
    if re.search(r"\b\d{6}-[a-z]-[a-z0-9]+-\d+\b", t):
        return True
    # Anonymized radiological scans (no face/identity visible) are fine even
    # when captioned with a demographic case descriptor like "20 year old
    # male, case 2" -- that's standard, harmless medical-literature practice.
    # Only block the age/case pattern for actual photographs of people.
    is_anonymized_scan = any(k in t for k in ["x-ray", "xray", "mri", "ct scan", "radiograph", "fluorosc"])
    if not is_anonymized_scan:
        if re.search(r"\d+[\s-]?year[\s-]old", t):  # "12-year-old girl": a
            return True                              # specific real patient
        if re.search(r"\bcase\s*\d+\b", t):
            return True
    # any pre-1990 4-digit year token (parenthesized or not) strongly
    # signals an archival photo or scanned document, e.g. "... (1903)",
    # "... (1910-1923)", or "St Helier Hospital, Surrey, 1943 D12828.jpg"
    import re
    for m in re.finditer(r"(?<!\d)(1[7-9]\d{2})(?!\d)", t):
        if int(m.group(1)) < 1990:
            return True
    # glued YYYYMMDD-style dates, e.g. "...hand - 18951222.jpg"
    m2 = re.search(r"(?<!\d)(1[7-9]\d{2})\d{4}(?!\d)", t)
    if m2 and int(m2.group(1)) < 1990:
        return True
    return False


def curl_bytes(url, timeout=30):
    """Fetch a URL via the system curl binary (TLS trust store already
    verified working in this environment, unlike Python's default urllib
    SSL context here)."""
    result = subprocess.run(
        ["curl", "-sL", "--max-time", str(timeout), "-A", UA, url],
        capture_output=True,
        check=True,
    )
    return result.stdout


def api_get(params):
    params = {**params, "format": "json"}
    url = API + "?" + urllib.parse.urlencode(params)
    raw = curl_bytes(url, timeout=20)
    return json.loads(raw)


def search_commons(query, limit=8):
    data = api_get({
        "action": "query",
        "list": "search",
        "srsearch": f"filetype:bitmap {query}",
        "srnamespace": 6,
        "srlimit": limit,
    })
    return [r["title"] for r in data.get("query", {}).get("search", [])]


def get_imageinfo(titles):
    if not titles:
        return {}
    data = api_get({
        "action": "query",
        "titles": "|".join(titles),
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
    })
    pages = data.get("query", {}).get("pages", {})
    out = {}
    for p in pages.values():
        info = p.get("imageinfo")
        if info:
            out[p["title"]] = info[0]
    return out


def pick_best(titles, min_w=500, min_h=400, want_portrait=None, allow_reuse=False):
    info = get_imageinfo(titles)
    candidates = []
    for title, meta in info.items():
        if _is_blocked(title):
            continue
        if not allow_reuse and title in USED_TITLES:
            continue
        mime = meta.get("mime", "")
        if mime not in ("image/jpeg", "image/png"):
            continue
        w, h = meta.get("width", 0), meta.get("height", 0)
        if w < min_w or h < min_h:
            continue
        is_portrait = h > w
        score = w * h
        if want_portrait is not None and is_portrait != want_portrait:
            score *= 0.4  # deprioritize wrong orientation but don't exclude
        candidates.append((score, title, meta))
    candidates.sort(key=lambda c: -c[0])
    return candidates[0] if candidates else None


def download_and_save(url, out_path, max_dim=1600, mode="RGB", ext="JPEG", quality=87):
    raw = curl_bytes(url, timeout=30)
    im = Image.open(BytesIO(raw))
    im = im.convert(mode)
    w, h = im.size
    if max(w, h) > max_dim:
        ratio = max_dim / max(w, h)
        im = im.resize((max(1, int(w * ratio)), max(1, int(h * ratio))), Image.LANCZOS)
    if ext == "PNG":
        im.save(out_path, ext, optimize=True)
    else:
        im.save(out_path, ext, quality=quality, optimize=True)
    return im.size


def fetch_one(entry, manifest, want_portrait=None, min_w=500, min_h=400, max_dim=1600, mode="RGB", ext="JPEG", allow_reuse=False):
    filename, queries = entry["file"], entry["queries"]
    out_path = os.path.join(OUT_DIR, filename)
    last_err = None
    for q in queries:
        try:
            titles = search_commons(q, limit=10)
            best = pick_best(titles, min_w=min_w, min_h=min_h, want_portrait=want_portrait, allow_reuse=allow_reuse)
            if not best:
                continue
            score, title, meta = best
            size = download_and_save(meta["url"], out_path, max_dim=max_dim, mode=mode, ext=ext)
            USED_TITLES.add(title)
            manifest[filename] = {
                "query": q,
                "commons_title": title,
                "commons_page": meta.get("descriptionurl", ""),
                "saved_size": size,
            }
            print(f"OK  {filename:<32} <- {title}  ({size[0]}x{size[1]})  q='{q}'")
            return True
        except Exception as e:
            last_err = e
            time.sleep(0.3)
            continue
    print(f"FAIL {filename:<32} all queries failed. last_err={last_err}")
    manifest[filename] = {"error": str(last_err)}
    return False


def load_manifest():
    if os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_manifest(m):
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(m, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    print("This module provides helpers; run a specific batch script that imports it.")
