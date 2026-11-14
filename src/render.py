"""Renders the 9:16 TikTok video: 'Al-Muntaqim — jawapan markah penuh' (SPM Pendidikan Islam).

Usage:
    python3 render.py                # 60 s version (music + SFX, space for voice-over)
    python3 render.py --vo           # version timed to assets/voiceover.m4a
    python3 render.py --still 12.5   # write a single frame PNG for checking
"""
import argparse
import math
import os
import re
import subprocess
import sys
from functools import lru_cache
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import audio

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "assets", "fonts")
OUT = os.path.join(ROOT, "output")

W, H, FPS = 1080, 1920, 30

# ---------------------------------------------------------------- safe zone
# TikTok UI: top tabs (~150px), right action column (x > ~930, y 700-1520),
# bottom caption / username / music / nav bar (y > ~1500).
SAFE_L, SAFE_R = 80, 900
SAFE_T, SAFE_B = 190, 1380          # main content lives here
CX = (SAFE_L + SAFE_R) // 2          # 490: horizontal centre of safe area
WATERMARK_Y = 1440                   # above bottom UI, never at the extreme edge
WATERMARK = "Ustazah Rasyidah@Penrissen"

# ---------------------------------------------------------------- palette
BG_TOP = (14, 72, 74)
BG_BOT = (9, 34, 52)
GOLD = (255, 201, 60)
GOLD_L = (255, 228, 140)
RED = (240, 68, 68)
GREEN = (34, 197, 110)
INK = (27, 31, 59)
PAPER = (255, 253, 245)
WHITE = (255, 255, 255)
CORAL = (255, 122, 89)
SKY = (76, 201, 240)
TEAL = (20, 184, 166)
BLUE_INK = (30, 64, 175)


# ---------------------------------------------------------------- helpers
@lru_cache(None)
def font(name, size):
    files = {
        "black": "poppins-latin-900-normal.ttf",
        "xbold": "poppins-latin-800-normal.ttf",
        "bold": "poppins-latin-700-normal.ttf",
        "semi": "poppins-latin-600-normal.ttf",
        "fun": "baloo-2-latin-800-normal.ttf",
        "hand": "baloo-2-latin-600-normal.ttf",
        "arabic": "amiri-arabic-700.ttf",
    }
    return ImageFont.truetype(os.path.join(FONTS, files[name]), size)


EMOJI_RE = re.compile("[☀-➿\U0001F300-\U0001FAFF]")


@lru_cache(None)
def emoji_img(ch, size):
    f = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", 109)
    im = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((10, 10), ch, font=f, embedded_color=True)
    im = im.crop(im.getbbox())
    s = size / max(im.size)
    return im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    x = clamp(x)
    return 3 * x * x - 2 * x * x * x


def ease_back(x, s=1.9):
    x = clamp(x)
    x -= 1
    return x * x * ((s + 1) * x + s) + 1


def with_alpha(im, a):
    if a >= 0.999:
        return im
    im = im.copy()
    im.putalpha(im.getchannel("A").point(lambda v: int(v * a)))
    return im


def put(layer, img, cx, cy, scale=1.0, alpha=1.0, rot=0.0):
    """Composite img centred on (cx, cy) with scale / alpha / rotation (deg)."""
    if scale <= 0.01 or alpha <= 0.01:
        return
    im = img
    if abs(scale - 1) > 1e-3:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.BICUBIC)
    if abs(rot) > 0.05:
        im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    im = with_alpha(im, alpha)
    x, y = int(round(cx - im.width / 2)), int(round(cy - im.height / 2))
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(layer.width, x + im.width), min(layer.height, y + im.height)
    if x1 <= x0 or y1 <= y0:
        return
    layer.alpha_composite(im.crop((x0 - x, y0 - y, x1 - x, y1 - y)), (x0, y0))


SS = 3  # supersampling for vector shapes


class Canvas:
    """Draw at SS x resolution, get an anti-aliased RGBA image back."""

    def __init__(self, w, h):
        self.w, self.h = w, h
        self.im = Image.new("RGBA", (w * SS, h * SS), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)

    def s(self, v):
        if isinstance(v, (list, tuple)):
            return [x * SS for x in v]
        return v * SS

    def rrect(self, box, r, fill=None, outline=None, width=0):
        self.d.rounded_rectangle(self.s(box), radius=r * SS, fill=fill, outline=outline, width=width * SS)

    def ellipse(self, box, fill=None, outline=None, width=0):
        self.d.ellipse(self.s(box), fill=fill, outline=outline, width=width * SS)

    def line(self, pts, fill, width, round_caps=True):
        p = [tuple(x * SS for x in pt) for pt in pts]
        self.d.line(p, fill=fill, width=width * SS, joint="curve")
        if round_caps:
            r = width * SS / 2
            for x, y in (p[0], p[-1]):
                self.d.ellipse((x - r, y - r, x + r, y + r), fill=fill)

    def poly(self, pts, fill=None, outline=None, width=0):
        p = [tuple(x * SS for x in pt) for pt in pts]
        self.d.polygon(p, fill=fill, outline=outline, width=width * SS)

    def arc(self, box, start, end, fill, width):
        self.d.arc(self.s(box), start, end, fill=fill, width=width * SS)

    def text(self, xy, txt, f, fill, anchor="la"):
        ff = ImageFont.truetype(f.path, f.size * SS)
        self.d.text((xy[0] * SS, xy[1] * SS), txt, font=ff, fill=fill, anchor=anchor)

    def get(self):
        return self.im.resize((self.w, self.h), Image.LANCZOS)


# ---------------------------------------------------------------- rich text
def tokenize(spans):
    """spans: list of (text, style dict). Returns list of (word, style) incl. emoji words."""
    toks = []
    for text, st in spans:
        for w in text.split(" "):
            if w == "":
                continue
            toks.append((w.replace("️", ""), st))
    return toks


def word_width(w, f, emoji_size):
    total = 0
    for part in split_emoji(w):
        if EMOJI_RE.fullmatch(part):
            total += emoji_size + 4
        else:
            total += f.getlength(part)
    return total


def split_emoji(w):
    out, buf = [], ""
    for ch in w:
        if EMOJI_RE.fullmatch(ch):
            if buf:
                out.append(buf)
                buf = ""
            out.append(ch)
        else:
            buf += ch
    if buf:
        out.append(buf)
    return out


def layout(spans, fname, size, max_w, line_h=1.25, align="center"):
    """Returns (positioned tokens, width, height). Each token: dict(x,y,w,word,style)."""
    f = font(fname, size)
    es = int(size * 1.05)
    space = f.getlength(" ")
    toks = tokenize(spans)
    lines, cur, cw = [], [], 0
    for w, st in toks:
        if st.get("br"):
            lines.append(cur)
            cur, cw = [], 0
            continue
        ww = word_width(w, font(st.get("font", fname), int(size * st.get("scale", 1))), es)
        add_w = ww + (space if cur else 0)
        if cur and cw + add_w > max_w:
            lines.append(cur)
            cur, cw = [], 0
            add_w = ww
        cur.append((w, st, ww))
        cw += add_w
    if cur:
        lines.append(cur)
    lh = size * line_h
    placed = []
    maxw = 0
    for i, ln in enumerate(lines):
        lw = sum(x[2] for x in ln) + space * (len(ln) - 1)
        maxw = max(maxw, lw)
        if align == "center":
            x = (max_w - lw) / 2
        else:
            x = 0
        for w, st, ww in ln:
            placed.append(dict(x=x, y=i * lh, w=ww, word=w, style=st, line=i))
            x += ww + space
    return placed, max_w, len(lines) * lh, size


def draw_tokens(placed, size, box_w, box_h, fname, color=WHITE, stroke=0, stroke_col=INK,
                n_visible=None, hl_progress=1.0, pad=30, shadow=True):
    """Render positioned tokens to an RGBA image (with padding)."""
    im = Image.new("RGBA", (int(box_w + 2 * pad), int(box_h + 2 * pad)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    es = int(size * 1.05)
    toks = placed if n_visible is None else placed[: max(0, n_visible)]
    # highlight boxes first
    for tk in toks:
        st = tk["style"]
        if st.get("hl") and hl_progress > 0:
            x0 = pad + tk["x"] - 8
            y0 = pad + tk["y"] + size * 0.08
            wv = (tk["w"] + 16) * clamp(hl_progress)
            d.rounded_rectangle((x0, y0, x0 + wv, y0 + size * 1.22), radius=10, fill=st["hl"])
    for tk in toks:
        st = tk["style"]
        sz = int(size * st.get("scale", 1))
        f = font(st.get("font", fname), sz)
        col = st.get("color", color)
        if st.get("hl") and hl_progress > 0.5:
            col = st.get("hl_color", INK)
        x = pad + tk["x"]
        y = pad + tk["y"]
        for part in split_emoji(tk["word"]):
            if EMOJI_RE.fullmatch(part):
                e = emoji_img(part, es)
                im.alpha_composite(e, (int(x + 2), int(y + size * 0.62 - e.height / 2 + size * 0.1)))
                x += es + 4
            else:
                sw = st.get("stroke", stroke)
                if shadow and sw:
                    d.text((x + 4, y + 6), part, font=f, fill=(0, 0, 0, 90), stroke_width=sw,
                           stroke_fill=(0, 0, 0, 90))
                d.text((x, y), part, font=f, fill=col, stroke_width=sw, stroke_fill=stroke_col)
                x += f.getlength(part)
    return im


def text_img(spans, fname, size, max_w=SAFE_R - SAFE_L, stroke=0, color=WHITE, line_h=1.25, **kw):
    placed, bw, bh, sz = layout(spans, fname, size, max_w, line_h)
    return draw_tokens(placed, sz, bw, bh, fname, color=color, stroke=stroke, **kw)


cache = {}


def cached(key, fn):
    if key not in cache:
        cache[key] = fn()
    return cache[key]


# ---------------------------------------------------------------- background
def star_tile(size=240):
    c = Canvas(size, size)
    col = (255, 214, 120, 34)
    cx = cy = size / 2
    r = size * 0.30

    def sq(rot):
        pts = []
        for k in range(4):
            a = math.radians(rot + 45 + 90 * k)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
        return pts

    for rot in (0, 45):
        p = sq(rot)
        c.line(p + [p[0]], col, 3, round_caps=False)
    c.ellipse((cx - r * 0.38, cy - r * 0.38, cx + r * 0.38, cy + r * 0.38), outline=col, width=3)
    # connecting lines to tile edges (girih feel)
    for k in range(8):
        a = math.radians(22.5 + 45 * k)
        c.line([(cx + r * 1.0 * math.cos(a), cy + r * 1.0 * math.sin(a)),
                (cx + size * 0.72 * math.cos(a), cy + size * 0.72 * math.sin(a))], col, 2, round_caps=False)
    # small corner stars
    for (x, y) in [(0, 0), (size, 0), (0, size), (size, size)]:
        rr = size * 0.07
        c.ellipse((x - rr, y - rr, x + rr, y + rr), outline=col, width=2)
    return c.get()


def make_bg_static():
    g = np.linspace(0, 1, H)[:, None]
    top, bot = np.array(BG_TOP), np.array(BG_BOT)
    arr = (top * (1 - g) + bot * g)[:, None, :].repeat(W, axis=1)
    # soft radial light behind content
    yy, xx = np.mgrid[0:H, 0:W]
    rad = np.exp(-(((xx - CX) / 620) ** 2 + ((yy - 800) / 820) ** 2))
    arr = arr + rad[..., None] * np.array([30, 45, 35])
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    base = Image.fromarray(arr, "RGB").convert("RGBA")
    tile = star_tile()
    pat = Image.new("RGBA", (W + 480, H + 480), (0, 0, 0, 0))
    for y in range(0, pat.height, tile.height):
        for x in range(0, pat.width, tile.width):
            pat.alpha_composite(tile, (x, y))
    return base, pat


BG = None


def background(t):
    global BG
    if BG is None:
        BG = make_bg_static()
    base, pat = BG
    frame = base.copy()
    off = int((t * 14) % 240)
    frame.alpha_composite(pat.crop((off, off, off + W, off + H)))
    # floating soft bokeh dots
    d = ImageDraw.Draw(frame, "RGBA")
    for i in range(10):
        ph = i * 1.7
        x = (i * 211 + 60 * math.sin(t * 0.3 + ph)) % W
        y = (H - ((t * (18 + i * 3) + i * 380) % (H + 200))) + 100
        r = 6 + (i % 4) * 4
        a = int(40 + 30 * math.sin(t * 1.3 + ph))
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 220, 130, max(0, a)))
    return frame


# ---------------------------------------------------------------- watermark
def watermark_img():
    f = font("xbold", 46)
    tw = f.getlength(WATERMARK)
    im = Image.new("RGBA", (int(tw + 60), 110), (0, 0, 0, 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((30, 22), WATERMARK, font=f, fill=(0, 0, 0, 200), stroke_width=6,
                            stroke_fill=(0, 0, 0, 200))
    sh = sh.filter(ImageFilter.GaussianBlur(5))
    im.alpha_composite(sh, (2, 4))
    ImageDraw.Draw(im).text((30, 22), WATERMARK, font=f, fill=WHITE, stroke_width=3,
                            stroke_fill=(15, 20, 35))
    return im


# ---------------------------------------------------------------- illustrations
def shocked_face(size=260):
    c = Canvas(size, size)
    m = 10
    c.ellipse((m, m, size - m, size - m), fill=(255, 205, 64), outline=INK, width=8)
    # blue fear tint on forehead
    tint = Canvas(size, size)
    tint.ellipse((m + 4, m + 4, size - m - 4, size - m - 4), fill=(110, 150, 255, 255))
    t_im = tint.get()
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rectangle((0, 0, size, size * 0.36), fill=170)
    mask = mask.filter(ImageFilter.GaussianBlur(18))
    face = c.get()
    t_im.putalpha(Image.composite(t_im.getchannel("A"), Image.new("L", t_im.size, 0), mask).point(lambda v: v * 0.75))
    face.alpha_composite(t_im)
    c2 = Canvas(size, size)
    s = size / 260
    # eyes
    for ex in (90, 170):
        c2.ellipse(((ex - 26) * s, 88 * s, (ex + 26) * s, 150 * s), fill=WHITE, outline=INK, width=6)
        c2.ellipse(((ex - 9) * s, 112 * s, (ex + 9) * s, 132 * s), fill=INK)
    # raised brows
    c2.arc((62 * s, 50 * s, 118 * s, 95 * s), 200, 330, INK, 8)
    c2.arc((142 * s, 50 * s, 198 * s, 95 * s), 210, 340, INK, 8)
    # mouth
    c2.ellipse((104 * s, 165 * s, 156 * s, 232 * s), fill=(110, 30, 40), outline=INK, width=6)
    c2.ellipse((114 * s, 200 * s, 146 * s, 228 * s), fill=(240, 110, 120))
    # sweat drop
    c2.poly([(222 * s, 70 * s), (210 * s, 102 * s), (234 * s, 102 * s)], fill=(120, 200, 255))
    c2.ellipse((208 * s, 90 * s, 236 * s, 118 * s), fill=(120, 200, 255), outline=INK, width=3)
    face.alpha_composite(c2.get())
    return face


def red_cross(size, width=34):
    c = Canvas(size, size)
    m = width
    c.line([(m, m + 6), (size - m, size - m)], RED, width)
    c.line([(size - m - 4, m), (m + 6, size - m - 2)], RED, width)
    return c.get()


def red_tick(size, width=12):
    c = Canvas(size, size)
    c.line([(size * 0.15, size * 0.55), (size * 0.4, size * 0.8), (size * 0.88, size * 0.2)], RED, width)
    return c.get()


def exam_paper(w=560, h=700):
    c = Canvas(w, h)
    c.rrect((6, 14, w - 6, h - 2), 26, fill=(0, 0, 0, 60))
    c.rrect((6, 6, w - 10, h - 12), 26, fill=PAPER, outline=INK, width=7)
    c.rrect((6, 6, w - 10, 110), 26, fill=TEAL, outline=INK, width=7)
    c.d.rectangle((6 * SS + 7 * SS, 80 * SS, (w - 10) * SS - 7 * SS, 104 * SS), fill=TEAL)
    c.text((34, 32), "PENDIDIKAN ISLAM", font("xbold", 30), WHITE)
    c.text((34, 70), "Kertas 1  •  SPM", font("semi", 20), (220, 255, 245))
    y = 150
    for i in range(6):
        c.ellipse((34, y + 6, 54, y + 26), fill=(200, 205, 220))
        ln = [360, 300, 380, 260, 340, 290][i]
        c.rrect((74, y + 8, 74 + ln, y + 24), 8, fill=(205, 210, 225))
        c.rrect((74, y + 44, 74 + ln * 0.7, y + 58), 7, fill=(225, 228, 238))
        y += 88
    return c.get()


def answer_sheet(w=800, h=560):
    c = Canvas(w, h)
    c.rrect((8, 18, w - 4, h - 2), 30, fill=(0, 0, 0, 70))
    c.rrect((4, 4, w - 12, h - 16), 30, fill=PAPER, outline=INK, width=7)
    # margin line + ruled lines
    for y in range(170, h - 40, 70):
        c.line([(30, y), (w - 40, y)], (170, 200, 235), 3, round_caps=False)
    c.line([(110, 30), (110, h - 30)], (255, 140, 140), 4, round_caps=False)
    c.text((140, 46), "Soalan 3(a)", font("xbold", 34), INK)
    c.text((140, 96), "Nyatakan maksud Al-Muntaqim.", font("semi", 28), (70, 75, 100))
    c.text((w - 60, 96), "[2m]", font("xbold", 28), (70, 75, 100), anchor="ra")
    return c.get()


def pill(w, h, fill, outline=INK, ow=6, r=None):
    c = Canvas(w + 12, h + 14)
    r = h // 2 if r is None else r
    c.rrect((6, 12, w + 6, h + 12), r, fill=(0, 0, 0, 80))
    c.rrect((6, 4, w + 6, h + 4), r, fill=fill, outline=outline, width=ow)
    return c.get()


def glow(im, color, radius=28, grow=18):
    a = im.getchannel("A")
    big = Image.new("L", (im.width + 4 * grow, im.height + 4 * grow), 0)
    big.paste(a, (2 * grow, 2 * grow))
    big = big.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(radius))
    g = Image.new("RGBA", big.size, color + (0,))
    g.putalpha(big.point(lambda v: min(255, int(v * 1.6))))
    return g


def card(w, h, fill, outline=INK, ow=7, r=34, header=None):
    c = Canvas(w, h)
    c.rrect((8, 18, w - 2, h - 2), r, fill=(0, 0, 0, 80))
    c.rrect((4, 4, w - 10, h - 14), r, fill=fill, outline=outline, width=ow)
    if header:
        hc, hh = header
        c.rrect((4, 4, w - 10, hh), r, fill=hc, outline=outline, width=ow)
        c.d.rectangle(((4 + ow) * SS, (hh - r) * SS, (w - 10 - ow) * SS, (hh - ow / 2) * SS), fill=hc)
        c.line([(4, hh), (w - 10, hh)], outline, ow, round_caps=False)
    return c.get()


def bookmark_icon(size=120, col=GOLD):
    c = Canvas(size, size)
    c.poly([(size * .24, size * .1), (size * .76, size * .1), (size * .76, size * .9), (size * .5, size * .68),
            (size * .24, size * .9)], fill=col, outline=INK, width=6)
    return c.get()


def share_icon(size=120, col=SKY):
    c = Canvas(size, size)
    pts = [(size * .12, size * .78), (size * .12, size * .62), (size * .3, size * .42), (size * .55, size * .42),
           (size * .55, size * .2), (size * .9, size * .52), (size * .55, size * .84), (size * .55, size * .62),
           (size * .34, size * .62)]
    c.poly(pts, fill=col, outline=INK, width=6)
    return c.get()


def plus_badge(size=80):
    c = Canvas(size, size)
    c.ellipse((4, 4, size - 4, size - 4), fill=WHITE, outline=INK, width=6)
    c.line([(size * .3, size / 2), (size * .7, size / 2)], INK, 9)
    c.line([(size / 2, size * .3), (size / 2, size * .7)], INK, 9)
    return c.get()


def num_badge(n, size=70, col=CORAL):
    c = Canvas(size, size)
    c.ellipse((4, 4, size - 4, size - 4), fill=col, outline=INK, width=5)
    c.text((size / 2, size / 2 + 2), str(n), font("black", 34), WHITE, anchor="mm")
    return c.get()


def arrow_down(w=40, h=40, col=GOLD_L):
    c = Canvas(w, h)
    c.line([(w / 2, 4), (w / 2, h - 10)], col, 7)
    c.line([(w * .2, h * .5), (w / 2, h - 8), (w * .8, h * .5)], col, 7)
    return c.get()


def sparkle(size=60, col=GOLD_L):
    c = Canvas(size, size)
    s = size / 2
    c.poly([(s, 0), (s * 1.18, s * .82), (size, s), (s * 1.18, s * 1.18), (s, size), (s * .82, s * 1.18), (0, s),
            (s * .82, s * .82)], fill=col)
    return c.get()


# ================================================================ SCENES
# Each scene: (nominal_duration, draw_fn, events). Keyframes k are in nominal
# seconds and get multiplied by the stretch factor `sc` when a scene is
# lengthened (voice-over version); animation durations stay snappy.

def P(lt, k, dur, sc):
    return clamp((lt - k * sc) / dur)


# ---------- Scene 1 (0-5s): shock / exam paper with red marks
S1_MARKS = [(0.9, "tick", 0), (1.15, "cross", 1), (1.4, "tick", 2), (1.65, "cross", 3), (1.9, "cross", 4)]


def scene1(L, lt, sc, dur):
    paper = cached("paper", exam_paper)
    face = cached("face", shocked_face)
    tick = cached("tick", lambda: red_tick(60))
    crs = cached("crs", lambda: red_cross(60, 12))
    # text
    p1 = ease_back(P(lt, 0.15, 0.5, sc))
    t1 = cached("s1t1", lambda: text_img([("Jawapan betul…", {})], "black", 76, stroke=6))
    put(L, t1, CX, 330, scale=0.6 + 0.4 * p1, alpha=clamp(p1 * 2))
    p2 = ease_out(P(lt, 0.7, 0.4, sc))
    t2 = cached("s1t2", lambda: text_img([("tapi markah", {})], "black", 64, stroke=6, color=GOLD_L))
    put(L, t2, CX, 425, alpha=p2, scale=0.9 + 0.1 * p2)
    p3 = ease_back(P(lt, 2.1, 0.45, sc), 2.6)
    t3 = cached("s1t3", lambda: text_img([("TAK PENUH?! 😱", {})], "black", 96, stroke=8, color=(255, 92, 92)))
    shake = 0
    since = lt - 2.1 * sc
    if 0.3 < since < 1.3:
        shake = 7 * math.sin(since * 60) * (1.3 - since)
    put(L, t3, CX + shake, 535, scale=0.3 + 0.7 * p3, alpha=clamp(p3 * 3), rot=shake * 0.4)
    # paper
    pp = ease_back(P(lt, 0.0, 0.6, sc), 1.4)
    pim = paper.copy()
    for k, kind, row in S1_MARKS:
        a = ease_back(P(lt, k, 0.25, sc), 2.5)
        if a > 0:
            m = tick if kind == "tick" else crs
            ms = m.resize((max(1, int(60 * a)), max(1, int(60 * a))))
            pim.alpha_composite(ms, (int(470 - ms.width / 2 + 30), int(150 + row * 88 + 18 - ms.height / 2)))
    # score circle
    sp = ease_back(P(lt, 2.1, 0.4, sc), 2.2)
    if sp > 0:
        sc_im = cached("score", lambda: _score_circle())
        s2 = sc_im.resize((max(1, int(sc_im.width * sp)), max(1, int(sc_im.height * sp))))
        pim.alpha_composite(s2, (int(450 - s2.width / 2), int(55 - s2.height / 2 + 40)))
    bob = 6 * math.sin(lt * 2.2)
    put(L, pim, CX - 40, 1010 + (1 - pp) * 500 + bob, rot=4 - 2 * pp, alpha=clamp(pp * 2))
    # shocked face
    fp = ease_back(P(lt, 2.0, 0.5, sc), 2.2)
    wob = 4 * math.sin(lt * 9) if lt > 2.0 * sc else 0
    put(L, face, 720, 1220, scale=fp, rot=wob - 8)


def _score_circle():
    c = Canvas(170, 120)
    c.ellipse((8, 8, 162, 112), fill=WHITE, outline=RED, width=7)
    c.text((85, 62), "6/10", font("fun", 50), RED, anchor="mm")
    return c.get()


S1_EVENTS = [(0.0, "whoosh", None)] + [(k, "pop", None) for k, *_ in S1_MARKS] + [(2.1, "stamp", None),
                                                                                  (2.2, "buzz", None)]


# ---------- Scene 2 (5-15s): answer sheet with red cross
def scene2(L, lt, sc, dur):
    sheet = cached("sheet", answer_sheet)
    p = ease_back(P(lt, 0.0, 0.55, sc), 1.3)
    # Arabic name
    ar = cached("ar", lambda: _arabic())
    pa = ease_out(P(lt, 0.2, 0.6, sc))
    put(L, ar, CX, 300, alpha=pa, scale=0.85 + 0.15 * pa)
    # sheet "close-up": zooms in slightly over the scene
    zoom = 1.0 + 0.04 * ease_in_out(lt / dur)
    sim = sheet.copy()
    # handwriting reveal
    hand = cached("hand", lambda: text_img([("Al-Muntaqim: Allah Maha Pembalas.", {})], "hand", 50,
                                           max_w=620, color=BLUE_INK, line_h=1.4, pad=6, shadow=False))
    hp = clamp((lt - 0.7 * sc) / (2.0))
    if hp > 0:
        rev = hand.crop((0, 0, int(hand.width), int(hand.height)))
        # reveal line by line (two lines): use horizontal wipe per line
        lines_h = hand.height / 2
        mask = Image.new("L", hand.size, 0)
        md = ImageDraw.Draw(mask)
        first = clamp(hp * 2)
        second = clamp(hp * 2 - 1)
        md.rectangle((0, 0, hand.width * first, lines_h), fill=255)
        md.rectangle((0, lines_h, hand.width * second, hand.height), fill=255)
        rev.putalpha(Image.composite(rev.getchannel("A"), Image.new("L", hand.size, 0), mask))
        sim.alpha_composite(rev, (140, 178))
    cp = P(lt, 3.2, 0.35, sc)
    if cp > 0:
        cr = cached("bigcross", lambda: red_cross(220, 30))
        s = 1.8 - 0.8 * ease_out(cp)
        tmp = Image.new("RGBA", sim.size, (0, 0, 0, 0))
        put(tmp, cr, 430, 430, scale=s, alpha=clamp(cp * 2), rot=-6)
        sim.alpha_composite(tmp)
        # "0/2" in red
        z = cached("zero", lambda: _mark_circle("1/2"))
        tmp2 = Image.new("RGBA", sim.size, (0, 0, 0, 0))
        put(tmp2, z, 670, 440, scale=ease_back(P(lt, 3.6, 0.35, sc)), rot=-8)
        sim.alpha_composite(tmp2)
    shake = 0
    since = lt - 3.2 * sc
    if 0.1 < since < 0.6:
        shake = 10 * math.sin(since * 70) * (0.6 - since)
    put(L, sim, CX + shake, 700 + (1 - p) * 600, scale=zoom, alpha=clamp(p * 2))
    # caption (spec text)
    qp = ease_back(P(lt, 4.0, 0.5, sc))
    cap = cached("s2cap", lambda: _caption_card())
    put(L, cap, CX, 1115, scale=0.6 + 0.4 * qp, alpha=clamp(qp * 2))
    np_ = ease_back(P(lt, 6.0, 0.5, sc))
    note = cached("s2note", lambda: text_img([("Terlalu ringkas! Markah ", {}), ("TAK\u00a0PENUH", {"color": GOLD})],
                                             "xbold", 46, stroke=5))
    put(L, note, CX, 1290, scale=0.7 + 0.3 * np_, alpha=clamp(np_ * 2))


def _arabic():
    f = font("arabic", 120)
    im = Image.new("RGBA", (700, 260), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    txt = "المنتقم"
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((350, 120), txt, font=f, fill=(0, 0, 0, 140), anchor="mm", direction="rtl",
                            language="ar")
    sh = sh.filter(ImageFilter.GaussianBlur(6))
    im.alpha_composite(sh, (3, 6))
    d.text((350, 120), txt, font=f, fill=GOLD, anchor="mm", direction="rtl", language="ar")
    im = im.crop(im.getbbox())
    g = glow(im, GOLD, 22, 10)
    out = Image.new("RGBA", g.size, (0, 0, 0, 0))
    out.alpha_composite(with_alpha(g, 0.35))
    out.alpha_composite(im, (20, 20))
    return out


def _mark_circle(txt):
    c = Canvas(170, 120)
    c.ellipse((8, 8, 162, 112), outline=RED, width=7)
    c.text((85, 62), txt, font("fun", 52), RED, anchor="mm")
    return c.get()


def _caption_card():
    t = text_img([("❌ Al-Muntaqim: Allah Maha Pembalas.", {})], "xbold", 50, max_w=720, color=INK,
                 pad=0, shadow=False)
    w, h = t.width + 70, t.height + 50
    cc = card(w + 10, h + 14, WHITE, ow=6, r=30)
    cc.alpha_composite(t, (37, 22))
    return cc


S2_EVENTS = [(0.0, "whoosh", None), (0.7, "pop", None), (3.2, "stamp", None), (3.35, "buzz", None),
             (3.6, "pop", None), (4.0, "pop", None), (6.0, "pop", None)]

# ---------- Scene 3 (15-30s): five key words with ding
S3_WORDS = ["NAMA", "ALLAH SWT", "YANG", "MENUNJUKKAN", "BAHAWA"]
S3_TIMES = [1.0, 3.4, 5.8, 8.2, 10.6]
S3_Y = [450, 630, 810, 990, 1170]


def word_pill(word):
    f = font("black", 62)
    tw = f.getlength(word)
    w = int(max(tw + 110, 300))
    h = 112
    p = pill(w, h, GOLD)
    d = ImageDraw.Draw(p)
    d.text((6 + w / 2, 4 + h / 2 + 4), word, font=f, fill=INK, anchor="mm")
    return p


def scene3(L, lt, sc, dur):
    tp = ease_back(P(lt, 0.0, 0.5, sc))
    title = cached("s3title", lambda: text_img([("✨ 5 PERKATAAN KUNCI ✨", {})], "black", 60, stroke=6,
                                               color=WHITE))
    put(L, title, CX, 290, scale=0.6 + 0.4 * tp, alpha=clamp(tp * 2))
    all_in = lt > (S3_TIMES[-1] + 1.2) * sc
    for i, (w, k, y) in enumerate(zip(S3_WORDS, S3_TIMES, S3_Y)):
        p = P(lt, k, 0.45, sc)
        if p <= 0:
            continue
        pim = cached("pill" + w, lambda w=w: word_pill(w))
        gl = cached("glow" + w, lambda pim=pim: glow(pim, GOLD, 30, 20))
        since = lt - k * sc
        flash = math.exp(-since * 2.5)
        pulse = 0.55 + 0.25 * math.sin(lt * 4 + i)
        if all_in:
            pulse = 0.7 + 0.3 * math.sin(lt * 6 - i * 0.7)
        s = ease_back(p, 2.4)
        put(L, gl, CX + 20, y, scale=s, alpha=clamp(pulse + flash))
        put(L, pim, CX + 20, y, scale=s)
        nb = cached("nb%d" % i, lambda i=i: num_badge(i + 1))
        put(L, nb, CX + 20 - pim.width / 2 - 10, y - 40, scale=ease_back(P(lt, k + 0.15, 0.4, sc), 2.5))
        # sparkles burst
        if since < 0.9:
            sp = cached("spk", sparkle)
            for j in range(6):
                a = j * math.pi / 3 + i
                r = 120 + 260 * ease_out(since / 0.9)
                put(L, sp, CX + 20 + r * math.cos(a) * 1.3, y + r * math.sin(a) * 0.5,
                    scale=0.9 * (1 - since / 0.9), alpha=1 - since / 0.9, rot=since * 200)
        if i < 4:
            ap = ease_out(P(lt, S3_TIMES[i + 1] - 0.25, 0.3, sc))
            arr = cached("arr", arrow_down)
            put(L, arr, CX + 20, y + 90, alpha=ap)
    fp = ease_back(P(lt, S3_TIMES[-1] + 1.4, 0.5, sc))
    foot = cached("s3foot", lambda: text_img([("Mesti ada dalam jawapan! ", {}), ("✅", {})], "xbold", 50,
                                             stroke=5, color=GOLD_L))
    put(L, foot, CX, 1320, scale=0.6 + 0.4 * fp, alpha=clamp(fp * 2))


S3_EVENTS = [(0.0, "whoosh", None)] + [(k, "ding", f) for k, f in
                                       zip(S3_TIMES, [1046.5, 1174.7, 1318.5, 1568.0, 1760.0])] + \
            [(S3_TIMES[-1] + 1.4, "chime", None)]

# ---------- Scene 4 (30-45s): split screen comparison
KEY_HL = {"Nama", "Allah", "SWT", "yang", "menunjukkan", "bahawa"}
RIGHT_TEXT = ("Nama Allah SWT yang menunjukkan bahawa Allah Maha Pembalas dengan menimpakan azab terhadap "
              "orang yang melampaui batas.")
CARD_W, CARD_H, CARD_Y = 395, 900, 790
LEFT_X = SAFE_L + CARD_W / 2
RIGHT_X = SAFE_R - CARD_W / 2


def right_spans():
    words = RIGHT_TEXT.split(" ")
    spans = []
    for i, w in enumerate(words):
        st = {}
        if i < 6 and w.strip(".") in KEY_HL:  # first six tokens = the 5 key words
            st = {"hl": GOLD, "hl_color": INK}
        elif w in ("Allah", "Maha", "Pembalas") and 6 <= i < 9:
            st = {"color": (14, 140, 80), "font": "black"}
        spans.append((w, st))
    return spans


def scene4(L, lt, sc, dur):
    hp = ease_back(P(lt, 0.0, 0.5, sc))
    head = cached("s4h", lambda: text_img([("Mana satu dapat ", {}), ("PENUH?", {"color": GOLD})], "black", 54,
                                          stroke=6))
    put(L, head, CX, 270, scale=0.6 + 0.4 * hp, alpha=clamp(hp * 2))
    # left card
    lp = ease_out(P(lt, 0.3, 0.6, sc))
    lc = cached("lcard", lambda: _left_card())
    put(L, lc, LEFT_X - (1 - lp) * 500, CARD_Y, alpha=clamp(lp * 1.5))
    # right card (word-by-word)
    rp = ease_out(P(lt, 1.3, 0.6, sc))
    base = cached("rcard", lambda: card(CARD_W, CARD_H, (236, 253, 243), outline=INK,
                                        header=(GREEN, 150)))
    rc = base.copy()
    hdr = cached("rhdr", lambda: _card_header("MARKAH", "PENUH"))
    rc.alpha_composite(hdr, (int((CARD_W - hdr.width) / 2), 18))
    placed, bw, bh, sz = cached("rlay", lambda: layout(right_spans(), "bold", 38, CARD_W - 64, 1.32))
    nvis = int(clamp((lt - 2.0 * sc) / (4.5 * sc)) * len(placed) + 0.999) if lt > 2.0 * sc else 0
    hlp = ease_in_out(P(lt, 7.2, 1.2, sc))
    timg = draw_tokens(placed, sz, bw, bh, "bold", color=INK, stroke=0, n_visible=nvis, hl_progress=hlp,
                       pad=10, shadow=False)
    rc.alpha_composite(timg, (22, 175))
    if hlp > 0:
        g = cached("rglow", lambda: glow(base, GOLD, 30, 20))
        put(L, g, RIGHT_X + (1 - rp) * 500, CARD_Y, alpha=0.35 + 0.25 * math.sin(lt * 4))
    put(L, rc, RIGHT_X + (1 - rp) * 500, CARD_Y, alpha=clamp(rp * 1.5))
    # emoji badges (❌ left, ✅ right) on the card corners
    for emo, x, k in (("❌", LEFT_X, 0.6), ("✅", RIGHT_X + (1 - rp) * 500, 1.6)):
        b = cached("badge" + emo, lambda emo=emo: _emoji_badge(emo))
        put(L, b, x - CARD_W / 2 + 40, CARD_Y - CARD_H / 2 + 20, scale=ease_back(P(lt, k, 0.4, sc), 2.5))
    # VS badge
    vp = ease_back(P(lt, 1.8, 0.4, sc), 2.5)
    vs = cached("vs", _vs_badge)
    put(L, vs, (LEFT_X + RIGHT_X) / 2, CARD_Y - 330, scale=vp)


def _card_header(l1, l2):
    t = text_img([(l1, {})], "black", 40, max_w=CARD_W - 40, color=WHITE,
                 stroke=4, pad=0)
    t2 = text_img([(l2, {})], "black", 40, max_w=CARD_W - 40, color=WHITE, stroke=4, pad=0)
    out = Image.new("RGBA", (max(t.width, t2.width), t.height + t2.height - 4), (0, 0, 0, 0))
    out.alpha_composite(t, ((out.width - t.width) // 2, 0))
    out.alpha_composite(t2, ((out.width - t2.width) // 2, t.height - 4))
    return out


def _left_card():
    cc = card(CARD_W, CARD_H, (255, 238, 238), outline=INK, header=(RED, 150))
    hdr = _card_header("MARKAH", "TAK PENUH")
    cc.alpha_composite(hdr, (int((CARD_W - hdr.width) / 2), 18))
    t = text_img([("Allah Maha Pembalas.", {})], "xbold", 48, max_w=CARD_W - 70, color=(180, 30, 30), pad=0,
                 shadow=False, line_h=1.3)
    cc.alpha_composite(t, (int((CARD_W - t.width) / 2), 300))
    cr = red_cross(150, 22)
    cc.alpha_composite(with_alpha(cr, 0.85), (int((CARD_W - 150) / 2), 560))
    n = text_img([("Tiada 5 perkataan kunci & tiada huraian", {})], "semi", 28, max_w=CARD_W - 70,
                 color=(120, 60, 60), pad=0, shadow=False)
    cc.alpha_composite(n, (int((CARD_W - n.width) / 2), 740))
    return cc


def _emoji_badge(emo):
    c = Canvas(96, 96)
    c.ellipse((4, 4, 92, 92), fill=WHITE, outline=INK, width=6)
    im = c.get()
    e = emoji_img(emo, 54)
    im.alpha_composite(e, ((96 - e.width) // 2, (96 - e.height) // 2))
    return im


def _vs_badge():
    c = Canvas(110, 110)
    c.ellipse((4, 4, 106, 106), fill=GOLD, outline=INK, width=7)
    c.text((55, 58), "VS", font("black", 40), INK, anchor="mm")
    return c.get()


S4_EVENTS = [(0.0, "whoosh", None), (0.3, "whoosh", None), (0.4, "buzz", None), (1.3, "whoosh", None),
             (1.8, "pop", None), (2.0, "chime", None), (7.2, "ding", 1318.5), (7.6, "ding", 1568.0)]


# ---------- Scene 5 (45-55s): formula card
def scene5(L, lt, sc, dur):
    tp = ease_back(P(lt, 0.0, 0.5, sc))
    title = cached("s5t", lambda: text_img([("📌 FORMULA JAWAPAN", {})], "black", 60, stroke=6))
    put(L, title, CX, 290, scale=0.6 + 0.4 * tp, alpha=clamp(tp * 2))
    blocks = [
        ("5 perkataan kunci", GOLD, INK, 0.8, 520),
        ("Allah Maha ___", TEAL, WHITE, 2.3, 760),
        ("huraian", CORAL, WHITE, 3.8, 1000),
    ]
    for i, (txt, col, tc, k, y) in enumerate(blocks):
        p = P(lt, k, 0.5, sc)
        if p <= 0:
            continue
        b = cached("blk%d" % i, lambda txt=txt, col=col, tc=tc: _block(txt, col, tc))
        bob = 5 * math.sin(lt * 3 + i)
        put(L, b, CX, y + bob, scale=ease_back(p, 2.2), alpha=clamp(p * 3))
        if i > 0:
            pp = ease_back(P(lt, k - 0.3, 0.4, sc), 2.5)
            put(L, cached("plus", plus_badge), CX, y - 120, scale=pp, rot=(1 - pp) * 180)
    fp = ease_back(P(lt, 5.6, 0.5, sc))
    ex = cached("s5ex", lambda: text_img([("Contoh: ", {"color": GOLD_L}),
                                          ("Nama Allah SWT yang menunjukkan bahawa Allah Maha Pembalas dengan "
                                           "menimpakan azab…", {})], "semi", 34, stroke=4, max_w=780))
    put(L, ex, CX, 1235, scale=0.8 + 0.2 * fp, alpha=clamp(fp * 2))


def _block(txt, col, tc):
    f = font("black", 58)
    w = int(f.getlength(txt) + 120)
    w = max(w, 560)
    p = pill(w, 130, col, r=36)
    ImageDraw.Draw(p).text((6 + w / 2, 4 + 65 + 4), txt, font=f, fill=tc, anchor="mm",
                           stroke_width=3 if tc == WHITE else 0, stroke_fill=INK)
    return p


S5_EVENTS = [(0.0, "whoosh", None), (0.8, "ding", 1046.5), (2.0, "pop", None), (2.3, "ding", 1318.5),
             (3.5, "pop", None), (3.8, "ding", 1568.0), (5.6, "chime", None)]


# ---------- Scene 6 (55-60s): closing card
def scene6(L, lt, sc, dur):
    p = ease_back(P(lt, 0.0, 0.6, sc), 1.6)
    cc = cached("s6card", _closing_card)
    put(L, cc, CX, 760, scale=0.5 + 0.5 * p, alpha=clamp(p * 2))
    bk = cached("bk", bookmark_icon)
    sh = cached("sh", share_icon)
    for i, ic in enumerate((bk, sh)):
        ip = ease_back(P(lt, 0.6 + i * 0.25, 0.5, sc), 2.6)
        bounce = abs(math.sin(lt * 4 + i * 1.3)) * 18
        put(L, ic, CX - 110 + i * 220, 420 - bounce, scale=ip, rot=8 * math.sin(lt * 3 + i))
    fp = ease_back(P(lt, 1.2, 0.5, sc))
    pulse = 1 + 0.04 * math.sin(lt * 7)
    fb = cached("s6follow", _follow_btn)
    put(L, fb, CX, 1180, scale=(0.6 + 0.4 * fp) * pulse, alpha=clamp(fp * 2))


def _closing_card():
    t = text_img([("Save & share", {"color": GOLD}), ("dengan kawan SPM kamu! 📚", {})], "black", 62,
                 max_w=700, color=INK, pad=0, shadow=False, line_h=1.2)
    w, h = 800, t.height + 110
    cc = card(w, h, PAPER, r=40)
    # inner gold rim
    ImageDraw.Draw(cc).rounded_rectangle((22, 20, w - 28, h - 32), radius=28, outline=GOLD, width=4)
    cc.alpha_composite(t, (int((w - 10 - t.width) / 2), 50))
    return cc


def _follow_btn():
    t = text_img([("Follow", {"color": GOLD, "font": "black"}), ("untuk tip Pendidikan Islam SPM", {})],
                 "xbold", 44, max_w=620, color=WHITE, stroke=0, pad=0, shadow=False, line_h=1.2)
    w, h = 740, t.height + 70
    p = pill(w, h, (225, 29, 72), r=44)
    p.alpha_composite(t, (int(6 + (w - t.width) / 2), int(4 + (h - t.height) / 2)))
    return p


S6_EVENTS = [(0.0, "whoosh", None), (0.0, "chime", None), (0.6, "pop", None), (0.85, "pop", None),
             (1.2, "ding", 1568.0)]

SCENES = [
    (5.0, scene1, S1_EVENTS),
    (10.0, scene2, S2_EVENTS),
    (15.0, scene3, S3_EVENTS),
    (15.0, scene4, S4_EVENTS),
    (10.0, scene5, S5_EVENTS),
    (5.0, scene6, S6_EVENTS),
]

# Voice-over version: scene boundaries placed on the longest pauses in the
# recording (21.2s, 65.2s, 89.8s, 103.9s, 130.1s). Edit freely.
VO_BOUNDS = [0.0, 21.5, 65.5, 90.1, 104.4, 130.2, 135.0]


def timeline(vo):
    if vo:
        b = VO_BOUNDS
        return [(b[i], b[i + 1] - b[i]) for i in range(len(SCENES))]
    out, t = [], 0.0
    for d, *_ in SCENES:
        out.append((t, d))
        t += d
    return out


TL = None
WM = None
EXIT = 0.28


def frame(t):
    global WM
    if WM is None:
        WM = watermark_img()
    img = background(t)
    for i, ((nom, fn, _), (st, dur)) in enumerate(zip(SCENES, TL)):
        if st <= t < st + dur:
            lt = t - st
            sc = dur / nom
            layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            fn(layer, lt, sc, dur)
            a = 1.0
            if i < len(SCENES) - 1 and lt > dur - EXIT:
                a = clamp((dur - lt) / EXIT)
            img.alpha_composite(with_alpha(layer, a))
            break
    # permanent watermark (always on top, whole video)
    put(img, WM, CX, WATERMARK_Y)
    return img.convert("RGB")


def frame_bytes(i):
    return frame(i / FPS).tobytes()


def events_abs():
    ev = []
    for (nom, _, evs), (st, dur) in zip(SCENES, TL):
        sc = dur / nom
        for k, kind, prm in evs:
            ev.append((st + k * sc, kind, prm))
    return ev


def main():
    global TL
    ap = argparse.ArgumentParser()
    ap.add_argument("--vo", action="store_true")
    ap.add_argument("--still", type=float, nargs="*")
    ap.add_argument("--safe", action="store_true", help="overlay TikTok UI guide on stills")
    a = ap.parse_args()
    TL = timeline(a.vo)
    total = TL[-1][0] + TL[-1][1]
    os.makedirs(OUT, exist_ok=True)
    if a.still is not None:
        for t in a.still:
            im = frame(t)
            if a.safe:
                im = safe_overlay(im)
            p = os.path.join(OUT, "still_%05.1f.png" % t)
            im.save(p)
            print(p)
        return
    tag = "VO" if a.vo else "60s"
    wav = os.path.join(OUT, "_audio_%s.wav" % tag)
    print("audio…", flush=True)
    audio.build(total, events_abs(), wav, music_level=0.10 if a.vo else 0.30, sfx_level=0.38 if a.vo else 0.6)
    final_audio = wav
    if a.vo:
        mixed = os.path.join(OUT, "_audio_VO_mix.wav")
        vo = os.path.join(ROOT, "assets", "voiceover.m4a")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-i", vo, "-filter_complex",
                        "[1:a]aresample=48000,loudnorm=I=-16:TP=-1.5,adelay=150|150[v];"
                        "[0:a][v]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[o]",
                        "-map", "[o]", mixed], check=True)
        final_audio = mixed
    nframes = int(round(total * FPS))
    out = os.path.join(OUT, "Al-Muntaqim_TikTok_%s.mp4" % tag)
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s",
                           "%dx%d" % (W, H), "-r", str(FPS), "-i", "-", "-i", final_audio, "-c:v", "libx264",
                           "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-profile:v", "high",
                           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", out],
                          stdin=subprocess.PIPE)
    with Pool(os.cpu_count(), initializer=_init, initargs=(a.vo,)) as pool:
        for i, b in enumerate(pool.imap(frame_bytes, range(nframes), chunksize=8)):
            ff.stdin.write(b)
            if i % 150 == 0:
                print("frame %d/%d" % (i, nframes), flush=True)
    ff.stdin.close()
    ff.wait()
    print(out)


def _init(vo):
    global TL
    TL = timeline(vo)


def safe_overlay(im):
    """Approximate TikTok UI for checking placement (not in the final video)."""
    o = im.convert("RGBA")
    d = ImageDraw.Draw(o, "RGBA")
    d.rectangle((0, 0, W, 150), fill=(255, 0, 0, 60))
    d.rectangle((940, 700, W, 1520), fill=(255, 0, 0, 60))
    d.rectangle((0, 1500, W, H), fill=(255, 0, 0, 60))
    for i, y in enumerate([760, 900, 1040, 1180, 1320]):
        d.ellipse((960, y, 1060, y + 100), outline=(255, 255, 255, 160), width=4)
    d.text((40, 1560), "@username  •  caption text here…", font=font("bold", 36), fill=(255, 255, 255, 200))
    return o.convert("RGB")


if __name__ == "__main__":
    main()
