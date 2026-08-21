import sys
import time

sys.path.insert(0, ".")
from fetch_real_images import fetch_one, load_manifest, save_manifest  # noqa: E402

manifest = load_manifest()

# ---------------------------------------------------------------------------
# Doctor imagery (portrait orientation, professional male doctor).
# Generic/anonymous stock-style photos only -- never claimed to depict the
# real Dr. Hussein Zakaria; temporary placeholder until real photos exist.
# ---------------------------------------------------------------------------
DOCTOR = [
    dict(file="doctor-portrait.jpg", queries=[
        "male doctor white coat smiling stock photo",
        "male physician portrait white coat arms crossed",
        "doctor stethoscope portrait studio",
    ], want_portrait=True, min_w=500, min_h=600, max_dim=1400),
    dict(file="doctor-portrait-secondary.jpg", queries=[
        "male doctor portrait scrubs smiling stock",
        "male surgeon portrait hospital hallway",
        "physician portrait white coat hospital",
    ], want_portrait=True, min_w=500, min_h=600, max_dim=1400),
]

VIDEO_INTRO = [
    dict(file="video-intro.jpg", queries=[
        "doctor talking to camera studio",
        "physician presenting medical talk",
        "doctor explaining diagram medical education",
    ], want_portrait=False, min_w=900, min_h=500, max_dim=1600),
]

HERO = [
    dict(file="hero-bg.jpg", queries=[
        "Facial Plastic Surgeon Operating Room",
        "Plastic Surgeon Performing Surgery Operating Room",
        "surgeon wearing surgical headlight operating",
    ], want_portrait=False, min_w=1400, min_h=800, max_dim=2200),
]

SERVICE_CATEGORIES = [
    dict(file="service-category-1.jpg", queries=["MRI scanner", "MRI-Philips", "PET scan"]),
    dict(file="service-category-2.jpg", queries=["spine X-ray radiology", "lumbar spine MRI", "vertebrae X-ray radiology"]),
    dict(file="service-category-3.jpg", queries=["Facial Plastic Surgeon Operating Room", "surgeon wearing surgical loupes operating"]),
    dict(file="service-category-4.jpg", queries=["laparoscopic surgery equipment operating theatre", "endoscopy equipment hospital"]),
]
for s in SERVICE_CATEGORIES:
    s.setdefault("want_portrait", False)
    s.setdefault("max_dim", 1400)

SURGERIES = [
    dict(file="surgery-1.jpg", queries=["Plastic Surgeon Performing Surgery Operating Room", "Facial Plastic Surgeon Operating Room"]),
    dict(file="surgery-2.jpg", queries=["Close-Up of Plastic Surgeon Wearing Surgical Headlight", "surgeon operating room close up procedure"]),
    dict(file="surgery-3.jpg", queries=["Facial Plastic Surgeon Performing Surgery", "surgeon wearing surgical headlight operating"]),
    dict(file="surgery-4.jpg", queries=["spine X-ray radiology", "vertebrae X-ray radiology"]),
    dict(file="surgery-5.jpg", queries=["spine MRI scan", "lumbar spine MRI"]),
    dict(file="surgery-6.jpg", queries=["laparoscopic surgery equipment", "minimally invasive surgery equipment"]),
    dict(file="surgery-7.jpg", queries=["hand X-ray radiology", "wrist X-ray radiology"]),
    dict(file="surgery-8.jpg", queries=["surgeon wearing surgical gloves operating", "Plastic Surgeon Wearing Surgical Headlight"]),
    dict(file="surgery-9.jpg", queries=["Plastic surgeon during surgery", "surgeon operating room close up procedure"]),
    dict(file="surgery-10.jpg", queries=["Laparoscopic operating theatre", "operating theatre surgical team"], allow_reuse=True),
    dict(file="surgery-11.jpg", queries=["surgical instruments tray operating room", "surgical instruments hospital"]),
    dict(file="surgery-12.jpg", queries=["interventional radiology equipment", "fluoroscopy machine hospital"]),
]
for s in SURGERIES:
    s.setdefault("want_portrait", False)
    s.setdefault("max_dim", 1200)

# Patient-story photos: doctor/patient consultation scenes only. Extensive
# testing showed nearly every "doctor with patient" photo on Commons shows
# real, identifiable, specifically-documented people (community health
# outreach events, 1970s-80s archival photojournalism, etc.) -- unsuitable to
# attach to fabricated patient names. These three titles were individually
# verified as genuine stock-style compositions with no identifiable face
# (blurred/out-of-frame/hands-only), so they're reused across the six cards
# rather than risking an unverified new photo per slot.
_CONSULT_HANDS = "Healthcare professional checks temperature with digital thermometer during patient consultation in a medical office undefined"
_STETH_BLUR = "Close-up of a stethoscope chest piece in a womans hand with a blurry background"
_STETH_PRODUCT = "Doctors stethoscope 1"
PATIENT_STORIES = [
    dict(file="patient-story-1.jpg", queries=[_CONSULT_HANDS], allow_reuse=True),
    dict(file="patient-story-2.jpg", queries=[_STETH_BLUR], allow_reuse=True),
    dict(file="patient-story-3.jpg", queries=[_CONSULT_HANDS], allow_reuse=True),
    dict(file="patient-story-4.jpg", queries=[_STETH_PRODUCT], allow_reuse=True),
    dict(file="patient-story-5.jpg", queries=[_STETH_BLUR], allow_reuse=True),
    dict(file="patient-story-6.jpg", queries=[_CONSULT_HANDS], allow_reuse=True),
]
for s in PATIENT_STORIES:
    s.setdefault("want_portrait", False)
    s.setdefault("max_dim", 1200)

VIDEOS = [
    dict(file="video-1.jpg", queries=["MRI scanner", "MRI Scanner Mark One"]),
    dict(file="video-2.jpg", queries=["Facial Plastic Surgeon Operating Room", "Plastic Surgeon Performing Surgery"]),
    dict(file="video-3.jpg", queries=["hand X-ray", "wrist X-ray"]),
    dict(file="video-4.jpg", queries=["medical examination room", "modern medical examination room"]),
    dict(file="video-5.jpg", queries=["CT Brain Scan", "PET scan"]),
    dict(file="video-6.jpg", queries=["MEDIMAX Physiotherapy Clinic", "physiotherapy clinic"]),
]
for v in VIDEOS:
    v.setdefault("want_portrait", False)
    v.setdefault("max_dim", 1600)

ARTICLES = [
    dict(file="article-1.jpg", queries=["MRI scanner", "An MRI scanner"]),
    dict(file="article-2.jpg", queries=["Plastic Surgeon Performing Surgery", "Facial Plastic Surgeon Operating Room"]),
    dict(file="article-3.jpg", queries=["hand X-ray", "wrist X-ray"]),
    dict(file="article-4.jpg", queries=["Facial Plastic Surgeon Operating Room", "Plastic Surgeon Performing Surgery"]),
    dict(file="article-5.jpg", queries=["spine X-ray", "lumbar spine MRI"]),
    dict(file="article-6.jpg", queries=["brain MRI scan", "MRI scanner hospital"]),
]
for a in ARTICLES:
    a.setdefault("want_portrait", False)
    a.setdefault("max_dim", 1400)

# Certificates: a real photographed diploma always shows someone else's real
# name/institution printed on it, which would visibly conflict with the site's
# own certificate copy. Use blank/decorative certificate template imagery
# instead of filled-out real documents.
CERTIFICATES = [
    dict(file="certificate-1.jpg", queries=["blank certificate template border", "certificate template ornate border blank"]),
    dict(file="certificate-2.jpg", queries=["certificate border gold seal blank template", "diploma template border blank"]),
    dict(file="certificate-3.jpg", queries=["certificate template ribbon seal blank", "award certificate template blank border"]),
    dict(file="certificate-4.jpg", queries=["certificate paper texture border blank", "certificate template formal blank"]),
]
for c in CERTIFICATES:
    c.setdefault("want_portrait", False)
    c.setdefault("max_dim", 1100)

AVATARS = [
    dict(file="avatar-1.png", queries=["smiling man face stock photo", "man headshot stock photo casual"], want_portrait=None, min_w=300, min_h=300, max_dim=480, mode="RGB", ext="PNG"),
    dict(file="avatar-2.png", queries=["smiling woman face stock photo", "woman headshot stock photo casual"], want_portrait=None, min_w=300, min_h=300, max_dim=480, mode="RGB", ext="PNG"),
    dict(file="avatar-3.png", queries=["man face stock photo casual smiling", "young man headshot stock photo"], want_portrait=None, min_w=300, min_h=300, max_dim=480, mode="RGB", ext="PNG"),
    dict(file="avatar-4.png", queries=["middle aged man face stock photo", "man headshot stock photo professional"], want_portrait=None, min_w=300, min_h=300, max_dim=480, mode="RGB", ext="PNG"),
    dict(file="avatar-5.png", queries=["young woman face stock photo smiling", "woman headshot stock photo professional"], want_portrait=None, min_w=300, min_h=300, max_dim=480, mode="RGB", ext="PNG"),
]

ALL_GROUPS = [
    ("doctor", DOCTOR),
    ("video-intro", VIDEO_INTRO),
    ("hero", HERO),
    ("service-categories", SERVICE_CATEGORIES),
    ("surgeries", SURGERIES),
    ("patient-stories", PATIENT_STORIES),
    ("videos", VIDEOS),
    ("articles", ARTICLES),
    ("certificates", CERTIFICATES),
    ("avatars", AVATARS),
]

if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for name, group in ALL_GROUPS:
        if only and name != only:
            continue
        print(f"\n=== {name} ===")
        for entry in group:
            kwargs = {k: v for k, v in entry.items() if k not in ("file", "queries")}
            fetch_one(entry, manifest, **kwargs)
            save_manifest(manifest)
            time.sleep(0.4)
    print("\nDone.")
