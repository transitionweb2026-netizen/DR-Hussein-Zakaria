import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)

BRAND = {
    50: (238, 245, 255),
    100: (220, 234, 255),
    200: (183, 211, 254),
    300: (138, 181, 251),
    400: (91, 147, 245),
    500: (49, 107, 233),
    600: (28, 86, 216),
    700: (13, 79, 199),
    800: (10, 62, 158),
}
# Light page background family, sampled directly from Hussein's own mockup
LIGHT_BG = {
    50: (244, 249, 255),
    100: (220, 233, 250),
    200: (203, 220, 243),
}
NAVY = {
    950: (5, 15, 34),
    900: (10, 26, 55),
    800: (18, 39, 76),
    700: (27, 53, 100),
}
GOLD = (238, 163, 57)
WHITE = (255, 255, 255)
# Electric cyan sampled directly from the reference's glowing brain/specialty/video imagery
CYAN = (10, 213, 255)
CYAN_SOFT = (77, 216, 255)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def radial_gradient(size, center, inner, outer, radius_scale=1.0):
    w, h = size
    img = Image.new("RGB", size, outer)
    px = img.load()
    cx, cy = center
    max_r = math.hypot(max(cx, w - cx), max(cy, h - cy)) * radius_scale
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / max_r
            d = min(1.0, d)
            px[x, y] = lerp(inner, outer, d)
    return img


def diagonal_gradient(size, c1, c2):
    w, h = size
    base = Image.new("RGB", (w, h))
    px = base.load()
    for y in range(h):
        for x in range(w):
            t = ((x / w) * 0.5 + (y / h) * 0.5)
            px[x, y] = lerp(c1, c2, t)
    return base


def add_glow(img, xy, radius, color, alpha=140, blur=None):
    if blur is None:
        blur = radius // 2
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    x, y = xy
    d.ellipse([x - radius, y - radius, x + radius, y + radius], fill=(*color, alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(blur))
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"), (0, 0))
    return img


def draw_node_network(img, rng, node_count=9, accent=None, accent_prob=0.16, region=None,
                       base_color=CYAN, line_color=None, line_alpha=70):
    w, h = img.size
    if region is None:
        region = (int(w * 0.12), int(h * 0.12), int(w * 0.88), int(h * 0.88))
    rx0, ry0, rx1, ry1 = region
    if line_color is None:
        line_color = base_color

    nodes = []
    for _ in range(node_count):
        x, y = rng.uniform(rx0, rx1), rng.uniform(ry0, ry1)
        use_accent = accent is not None and rng.random() < accent_prob
        color = accent if use_accent else base_color
        r = rng.uniform(3.2, 6.5)
        nodes.append({"x": x, "y": y, "color": color, "r": r})

    img = img.convert("RGBA")
    draw = ImageDraw.Draw(img, "RGBA")
    for i, n1 in enumerate(nodes):
        by_dist = sorted(nodes, key=lambda p: (p["x"] - n1["x"]) ** 2 + (p["y"] - n1["y"]) ** 2)
        for n2 in by_dist[1:3]:
            draw.line([(n1["x"], n1["y"]), (n2["x"], n2["y"])], fill=(*line_color, line_alpha), width=2)

    for n in nodes:
        x, y, color, r = n["x"], n["y"], n["color"], n["r"]
        glow_r = r * 7.5
        pad = int(glow_r * 2.2)
        bx0, by0 = int(max(0, x - pad)), int(max(0, y - pad))
        bx1, by1 = int(min(w, x + pad)), int(min(h, y + pad))
        patch_w, patch_h = bx1 - bx0, by1 - by0
        if patch_w <= 0 or patch_h <= 0:
            continue
        glow = Image.new("RGBA", (patch_w, patch_h), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gx, gy = x - bx0, y - by0
        gd.ellipse([gx - glow_r, gy - glow_r, gx + glow_r, gy + glow_r], fill=(*color, 205))
        glow = glow.filter(ImageFilter.GaussianBlur(glow_r * 0.45))
        patch = Image.alpha_composite(img.crop((bx0, by0, bx1, by1)), glow)
        img.paste(patch, (bx0, by0))

    draw = ImageDraw.Draw(img, "RGBA")
    for n in nodes:
        x, y, color, r = n["x"], n["y"], n["color"], n["r"]
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(*color, 235))

    return img.convert("RGB")


def vignette(img, strength=0.55):
    w, h = img.size
    overlay = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(overlay)
    d.ellipse([-w * 0.25, -h * 0.25, w * 1.25, h * 1.25], fill=255)
    overlay = overlay.filter(ImageFilter.GaussianBlur(min(w, h) * 0.18))
    dark = Image.new("RGB", (w, h), (2, 8, 20))
    return Image.composite(img, dark, overlay)


def make_dark_panel(size, seed, accent=None, node_count=10):
    rng = random.Random(seed)
    img = diagonal_gradient(size, NAVY[950], NAVY[800])
    img = add_glow(img, (size[0] * 0.28, size[1] * 0.32), int(min(size) * 0.6), CYAN, alpha=130, blur=int(min(size) * 0.24))
    img = add_glow(img, (size[0] * 0.78, size[1] * 0.7), int(min(size) * 0.45), CYAN_SOFT, alpha=100, blur=int(min(size) * 0.2))
    if accent:
        img = add_glow(img, (size[0] * 0.62, size[1] * 0.38), int(min(size) * 0.24), accent, alpha=140, blur=int(min(size) * 0.13))
    img = draw_node_network(img, rng, node_count=node_count, accent=accent, accent_prob=0.22 if accent else 0)
    img = vignette(img, strength=0.42)
    return img


def vignette_light(img, strength=0.35):
    w, h = img.size
    overlay = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(overlay)
    d.ellipse([-w * 0.3, -h * 0.3, w * 1.3, h * 1.3], fill=255)
    overlay = overlay.filter(ImageFilter.GaussianBlur(min(w, h) * 0.2))
    light = Image.new("RGB", (w, h), LIGHT_BG[200])
    return Image.composite(img, light, overlay)


def make_light_panel(size, seed, accent=None, node_count=8):
    """Light card + glowing brand-blue centerpiece, matching Hussein's own service-icon
    treatment (glowing blue graphic on a light card), not a dark island."""
    rng = random.Random(seed)
    img = diagonal_gradient(size, LIGHT_BG[50], LIGHT_BG[200])
    img = add_glow(img, (size[0] * 0.5, size[1] * 0.42), int(min(size) * 0.42), BRAND[300], alpha=90, blur=int(min(size) * 0.22))
    img = add_glow(img, (size[0] * 0.5, size[1] * 0.42), int(min(size) * 0.26), BRAND[500], alpha=70, blur=int(min(size) * 0.14))
    if accent:
        img = add_glow(img, (size[0] * 0.6, size[1] * 0.36), int(min(size) * 0.16), accent, alpha=110, blur=int(min(size) * 0.1))
    img = draw_node_network(
        img, rng, node_count=node_count, accent=accent, accent_prob=0.2 if accent else 0,
        base_color=BRAND[600], line_color=BRAND[400], line_alpha=90,
        region=(int(size[0] * 0.22), int(size[1] * 0.18), int(size[0] * 0.78), int(size[1] * 0.72)),
    )
    img = vignette_light(img, strength=0.3)
    return img


def save(img, name, quality=88):
    path = os.path.join(OUT, name)
    img.save(path, quality=quality)
    print("wrote", path)


# ---- Doctor portrait (Why Choose section) ----
def make_doctor_portrait():
    size = (900, 1100)
    img = diagonal_gradient(size, NAVY[900], BRAND[700])
    img = add_glow(img, (size[0] * 0.5, size[1] * 0.22), 520, BRAND[400], alpha=110, blur=210)
    img = add_glow(img, (size[0] * 0.5, size[1] * 0.85), 420, BRAND[300], alpha=60, blur=180)

    rng = random.Random(42)
    img = draw_node_network(img, rng, node_count=14, accent=None, region=(60, 60, size[0] - 60, size[1] - 60))

    draw = ImageDraw.Draw(img, "RGBA")
    cx, cy = size[0] * 0.5, size[1] * 0.46
    for i, r in enumerate([210, 160, 112]):
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(255, 255, 255, 70 - i * 10), width=2)

    try:
        font = ImageFont.truetype("arialbd.ttf", 150)
    except Exception:
        font = ImageFont.load_default()
    text = "HZ"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw / 2 - bbox[0], cy - th / 2 - bbox[1]), text, font=font, fill=(255, 255, 255, 235))

    img = vignette(img, strength=0.45)
    save(img, "doctor-portrait.jpg")


def make_doctor_portrait_secondary():
    size = (900, 1000)
    img = diagonal_gradient(size, BRAND[800], NAVY[900])
    img = add_glow(img, (size[0] * 0.42, size[1] * 0.3), 480, BRAND[400], alpha=100, blur=200)
    rng = random.Random(7)
    img = draw_node_network(img, rng, node_count=12)
    draw = ImageDraw.Draw(img, "RGBA")
    try:
        font = ImageFont.truetype("arialbd.ttf", 130)
    except Exception:
        font = ImageFont.load_default()
    cx, cy = size[0] * 0.5, size[1] * 0.44
    text = "HZ"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw / 2 - bbox[0], cy - th / 2 - bbox[1]), text, font=font, fill=(255, 255, 255, 220))
    img = vignette(img, strength=0.4)
    save(img, "doctor-portrait-secondary.jpg")


# ---- Video thumbnails ----
# Reference video thumbnails are uniformly electric-cyan glow — no red/gold accent.
VIDEO_ACCENTS = [None, None, None, None]


def make_video_thumbs():
    for i in range(4):
        img = make_dark_panel((1280, 720), seed=100 + i, accent=VIDEO_ACCENTS[i], node_count=11)
        save(img, f"video-{i + 1}.jpg")


# ---- Specialty / condition cards ----
# Only the pathology cards (Brain Tumor, Aneurysm) carry the reference's warm red focal glow;
# the rest stay pure electric cyan like the reference's other specialty images.
SPECIALTY_ACCENTS = [
    (233, 90, 90),  # brain tumor - warm red focal point
    (233, 90, 90),  # aneurysm - warm red focal point
    None,           # spine disorders
    None,           # disc herniation
    None,           # hydrocephalus
    None,           # peripheral nerve
]


def make_specialty_thumbs():
    for i in range(6):
        img = make_light_panel((800, 800), seed=200 + i, accent=SPECIALTY_ACCENTS[i], node_count=8)
        save(img, f"specialty-{i + 1}.jpg")


# ---- Testimonial avatars ----
AVATAR_NAMES = ["AA", "SF", "MH", "MS"]
AVATAR_GRADIENTS = [
    (BRAND[500], BRAND[700]),
    (BRAND[400], BRAND[600]),
    (BRAND[600], NAVY[900]),
    (BRAND[400], BRAND[800]),
]


def make_avatars():
    for i, (initials, (c1, c2)) in enumerate(zip(AVATAR_NAMES, AVATAR_GRADIENTS)):
        size = (240, 240)
        img = radial_gradient(size, (size[0] * 0.35, size[1] * 0.3), c1, c2, radius_scale=1.1)
        draw = ImageDraw.Draw(img)
        try:
            font = ImageFont.truetype("arialbd.ttf", 84)
        except Exception:
            font = ImageFont.load_default()
        bbox = draw.textbbox((0, 0), initials, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        draw.text(
            (size[0] / 2 - tw / 2 - bbox[0], size[1] / 2 - th / 2 - bbox[1]),
            initials,
            font=font,
            fill=(255, 255, 255, 235),
        )
        mask = Image.new("L", size, 0)
        ImageDraw.Draw(mask).ellipse([0, 0, size[0], size[1]], fill=255)
        out = Image.new("RGBA", size, (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        out.save(os.path.join(OUT, f"avatar-{i + 1}.png"))
        print("wrote", f"avatar-{i + 1}.png")


# ---- Hero background (wide, full-bleed) ----
def make_hero_bg():
    size = (2400, 1500)
    img = diagonal_gradient(size, NAVY[950], BRAND[800])
    img = add_glow(img, (size[0] * 0.24, size[1] * 0.32), 780, BRAND[500], alpha=110, blur=320)
    img = add_glow(img, (size[0] * 0.78, size[1] * 0.68), 640, BRAND[400], alpha=90, blur=280)
    img = add_glow(img, (size[0] * 0.55, size[1] * 0.15), 420, (255, 255, 255), alpha=40, blur=220)

    rng = random.Random(11)
    img = draw_node_network(
        img, rng, node_count=22, region=(int(size[0] * 0.05), int(size[1] * 0.08), int(size[0] * 0.95), int(size[1] * 0.92))
    )

    # soft bokeh circles for an operating-room / medical-tech ambience
    img = img.convert("RGBA")
    bokeh_rng = random.Random(99)
    for _ in range(14):
        bx = bokeh_rng.uniform(0, size[0])
        by = bokeh_rng.uniform(0, size[1])
        br = bokeh_rng.uniform(30, 90)
        alpha = int(bokeh_rng.uniform(10, 35))
        overlay = Image.new("RGBA", size, (0, 0, 0, 0))
        ImageDraw.Draw(overlay).ellipse([bx - br, by - br, bx + br, by + br], fill=(255, 255, 255, alpha))
        overlay = overlay.filter(ImageFilter.GaussianBlur(br * 0.6))
        img = Image.alpha_composite(img, overlay)
    img = img.convert("RGB")

    img = vignette(img, strength=0.5)
    save(img, "hero-bg.jpg", quality=90)


# ---- Video intro (wide, single feature video) ----
def make_video_intro():
    img = make_dark_panel((1600, 900), seed=55, accent=None, node_count=16)
    save(img, "video-intro.jpg", quality=90)


# ---- Certificates (parchment-style credential frames, no fabricated seals) ----
def make_certificate(seed):
    size = (700, 500)
    rng = random.Random(seed)
    img = diagonal_gradient(size, (250, 247, 240), (237, 231, 216))

    draw = ImageDraw.Draw(img, "RGBA")
    margin = 26
    draw.rectangle(
        [margin, margin, size[0] - margin, size[1] - margin],
        outline=(*BRAND[600], 200),
        width=3,
    )
    inner = margin + 12
    draw.rectangle(
        [inner, inner, size[0] - inner, size[1] - inner],
        outline=(*GOLD, 180),
        width=1,
    )

    # corner flourishes
    for cx, cy, sx, sy in [
        (margin, margin, 1, 1),
        (size[0] - margin, margin, -1, 1),
        (margin, size[1] - margin, 1, -1),
        (size[0] - margin, size[1] - margin, -1, -1),
    ]:
        L = 34
        draw.line([(cx, cy + sy * L), (cx, cy), (cx + sx * L, cy)], fill=(*BRAND[600], 220), width=3)

    # central laurel-ish emblem: two soft arcs + a circle seal
    cx, cy = size[0] * 0.5, size[1] * 0.42
    img_rgba = img.convert("RGBA")
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([cx - 60, cy - 60, cx + 60, cy + 60], fill=(*BRAND[400], 70))
    glow = glow.filter(ImageFilter.GaussianBlur(30))
    img_rgba = Image.alpha_composite(img_rgba, glow)
    draw = ImageDraw.Draw(img_rgba, "RGBA")
    draw.ellipse([cx - 46, cy - 46, cx + 46, cy + 46], outline=(*BRAND[700], 230), width=3)
    draw.ellipse([cx - 34, cy - 34, cx + 34, cy + 34], outline=(*GOLD, 220), width=2)
    draw.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=(*BRAND[700], 230))
    for i in range(8):
        ang = (i / 8) * 2 * math.pi
        x1, y1 = cx + 40 * math.cos(ang), cy + 40 * math.sin(ang)
        x2, y2 = cx + 50 * math.cos(ang), cy + 50 * math.sin(ang)
        draw.line([(x1, y1), (x2, y2)], fill=(*GOLD, 200), width=2)

    # small scattered accent dots (subtle, not a full node network — keeps it legible as a document)
    for _ in range(5):
        x = rng.uniform(size[0] * 0.15, size[0] * 0.85)
        y = rng.uniform(size[1] * 0.72, size[1] * 0.85)
        r = rng.uniform(1.5, 3)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(*BRAND[400], 140))

    img = img_rgba.convert("RGB")
    save(img, f"certificate-{seed}.jpg", quality=90)


def make_certificates():
    for i in range(1, 5):
        make_certificate(i)


# ---- Service category cards (Services page general categories) ----
def make_service_categories():
    for i in range(1, 5):
        img = make_light_panel((900, 700), seed=300 + i, accent=None, node_count=9)
        save(img, f"service-category-{i}.jpg")


# ---- Detailed surgery cards (Services page) ----
def make_surgeries():
    for i in range(1, 13):
        accent = GOLD if i % 4 == 0 else None
        img = make_light_panel((800, 640), seed=400 + i, accent=accent, node_count=7)
        save(img, f"surgery-{i}.jpg")


# ---- Extra video thumbnails (Videos page, items 5-6) ----
def make_extra_video_thumbs():
    for i in range(5, 7):
        img = make_dark_panel((1280, 720), seed=100 + i, accent=None, node_count=11)
        save(img, f"video-{i}.jpg")


# ---- Patient story images — warm, caring tone (never a fabricated photo of a real person) ----
def make_patient_story(seed):
    size = (900, 700)
    rng = random.Random(seed)
    img = diagonal_gradient(size, LIGHT_BG[50], BRAND[100])
    img = add_glow(img, (size[0] * 0.5, size[1] * 0.45), int(min(size) * 0.5), GOLD, alpha=70, blur=int(min(size) * 0.28))
    img = add_glow(img, (size[0] * 0.5, size[1] * 0.45), int(min(size) * 0.28), BRAND[400], alpha=80, blur=int(min(size) * 0.16))
    img = draw_node_network(
        img, rng, node_count=6, accent=GOLD, accent_prob=0.3,
        base_color=BRAND[500], line_color=BRAND[300], line_alpha=80,
        region=(int(size[0] * 0.25), int(size[1] * 0.2), int(size[0] * 0.75), int(size[1] * 0.75)),
    )

    # simple heart/care glyph at the center as a trust motif (no depiction of a real person)
    img = img.convert("RGBA")
    draw = ImageDraw.Draw(img, "RGBA")
    cx, cy = size[0] * 0.5, size[1] * 0.45
    r = 26
    draw.ellipse([cx - r * 1.6, cy - r * 0.6, cx - r * 0.2, cy + r * 0.9], fill=(*BRAND[600], 210))
    draw.ellipse([cx + r * 0.2, cy - r * 0.6, cx + r * 1.6, cy + r * 0.9], fill=(*BRAND[600], 210))
    draw.polygon(
        [(cx - r * 1.55, cy + r * 0.35), (cx, cy + r * 1.9), (cx + r * 1.55, cy + r * 0.35)],
        fill=(*BRAND[600], 210),
    )
    img = img.convert("RGB")
    img = vignette_light(img, strength=0.28)
    save(img, f"patient-story-{seed}.jpg")


def make_patient_stories():
    for i in range(1, 7):
        make_patient_story(i)


# ---- Extra avatar (5th review) ----
def make_extra_avatar():
    size = (240, 240)
    img = radial_gradient(size, (size[0] * 0.35, size[1] * 0.3), BRAND[500], NAVY[900], radius_scale=1.1)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arialbd.ttf", 84)
    except Exception:
        font = ImageFont.load_default()
    initials = "LH"
    bbox = draw.textbbox((0, 0), initials, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        (size[0] / 2 - tw / 2 - bbox[0], size[1] / 2 - th / 2 - bbox[1]),
        initials,
        font=font,
        fill=(255, 255, 255, 235),
    )
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size[0], size[1]], fill=255)
    out = Image.new("RGBA", size, (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    out.save(os.path.join(OUT, "avatar-5.png"))
    print("wrote avatar-5.png")


# ---- Article images ----
def make_articles():
    for i in range(1, 7):
        accent = BRAND[400] if i % 2 == 0 else None
        img = make_light_panel((1000, 640), seed=500 + i, accent=accent, node_count=8)
        save(img, f"article-{i}.jpg")


if __name__ == "__main__":
    make_doctor_portrait()
    make_doctor_portrait_secondary()
    make_video_thumbs()
    make_specialty_thumbs()
    make_avatars()
    make_hero_bg()
    make_video_intro()
    make_certificates()
    make_service_categories()
    make_surgeries()
    make_extra_video_thumbs()
    make_patient_stories()
    make_extra_avatar()
    make_articles()
