"""Voice-synced version: every visual beat is keyed to the phrase timings in
assets/alignment.json (made by align.py from assets/transcript.txt).

    python3 align.py          # (re)compute phrase timings
    python3 render_vo.py      # render output/Al-Muntaqim_TikTok_Suara.mp4
    python3 render_vo.py --still 5 45 --safe
"""
import argparse
import json
import math
import os
import subprocess
from multiprocessing import Pool

from PIL import Image, ImageDraw

import audio
import render as R
from render import (CX, INK, GOLD, GOLD_L, RED, GREEN, WHITE, PAPER, TEAL, CORAL, BLUE_INK, W, H, FPS,
                    clamp, ease_out, ease_back, ease_in_out, put, cached, text_img, card, pill, glow, font,
                    emoji_img, with_alpha, Canvas)

ROOT = R.ROOT
PH = json.load(open(os.path.join(ROOT, "assets", "alignment.json"), encoding="utf-8"))
T = [p["start"] for p in PH]          # phrase start times (seconds in the recording)
TE = [p["end"] for p in PH]
VOICE_END = TE[-1]
END = VOICE_END + 3.4                 # hold closing card after the last word


def A(t, t0, d=0.45):
    return clamp((t - t0) / d)


def show(L, img, x, y, t, t_in, t_out=None, d=0.45, back=2.0, base=0.6, rot=0.0, fade=0.3):
    if t < t_in:
        return
    p = ease_back(A(t, t_in, d), back)
    a = clamp(A(t, t_in, d) * 2.5)
    if t_out is not None:
        if t >= t_out + fade:
            return
        a *= 1 - clamp((t - t_out) / fade)
    put(L, img, x, y, scale=base + (1 - base) * p, alpha=a, rot=rot)


def big_emoji(ch, size):
    return cached(("emo", ch, size), lambda: emoji_img(ch, size))


def word_times(idx, nwords):
    """Spread the words of phrase idx across its duration (by syllables)."""
    import re
    words = PH[idx]["text"].split()
    w = [max(1, len(re.findall(r"[aeiouAEIOU]+", x))) for x in words][:nwords]
    tot = sum(w)
    s, e = T[idx], TE[idx]
    out, acc = [], 0
    for x in w:
        out.append(s + (e - s) * acc / tot)
        acc += x
    return out


# ------------------------------------------------------------------ captions
CAP_Y = 1325


def caption_img(i):
    words = PH[i]["text"].split()
    spans = []
    for w in words:
        core = w.strip(".,!?…:")
        st = {}
        if core.isupper() and len(core) > 2 and core not in ("SPM", "SWT"):
            st = {"color": GOLD}
        spans.append((w, st))
    placed, bw, bh, sz = R.layout(spans, "xbold", 38, 760, 1.22)
    t = R.draw_tokens(placed, sz, bw, bh, "xbold", color=WHITE, stroke=0, pad=0, shadow=False)
    t = t.crop(t.getbbox())
    w, h = t.width + 56, t.height + 34
    c = Canvas(w, h)
    c.rrect((0, 0, w, h), 26, fill=(8, 20, 30, 190))
    im = c.get()
    im.alpha_composite(t, (28, 15))
    return im


def captions(L, t):
    for i in range(len(PH)):
        s = T[i] - 0.05
        e = T[i + 1] - 0.05 if i + 1 < len(PH) else VOICE_END + 0.6
        if s <= t < e:
            im = cached(("cap", i), lambda i=i: caption_img(i))
            a = clamp((t - s) / 0.12) * clamp((e - t) / 0.12)
            p = ease_out(A(t, s, 0.18))
            put(L, im, CX, CAP_Y + (1 - p) * 14, alpha=a)
            return


# ------------------------------------------------------------------ scene 1: HOOK
def scene1(L, t):
    paper = cached("paper", R.exam_paper)
    face = cached("face", R.shocked_face)
    tick = cached("tick", lambda: R.red_tick(60))
    crs = cached("crs", lambda: R.red_cross(60, 12))
    t1 = cached("h1", lambda: text_img([("Kamu dah tulis maksud nama Allah dengan ", {}), ("betul…", {"color": GOLD_L})],
                                       "black", 58, stroke=6, max_w=780))
    show(L, t1, CX, 300, t, T[0] - 0.2, T[2] - 0.1)
    t2 = cached("h2", lambda: text_img([("tapi markah kena ", {}), ("POTONG?! 😱", {"color": (255, 92, 92)})],
                                       "black", 62, stroke=7, max_w=800))
    sh = 0
    if 0.2 < t - T[1] < 1.2:
        sh = 7 * math.sin((t - T[1]) * 60) * (1.2 - (t - T[1]))
    show(L, t2, CX + sh, 530, t, T[1], T[2] - 0.1, back=2.6, base=0.3)
    t3 = cached("h3", lambda: text_img([("Haa, jangan risau! 😉", {})], "black", 66, stroke=7, color=GOLD_L))
    show(L, t3, CX, 380, t, T[2], T[3] - 0.1, back=2.4)
    # secret card
    t4a = cached("h4a", lambda: text_img([("Hari ni cikgu kongsi satu", {})], "xbold", 48, stroke=5))
    show(L, t4a, CX, 290, t, T[3])
    t4b = cached("h4b", lambda: text_img([("RAHSIA 🔑", {})], "black", 104, stroke=8, color=GOLD))
    show(L, t4b, CX, 420, t, T[3] + 0.5, back=2.6, base=0.2)
    t4c = cached("h4c", lambda: text_img([("yang ramai calon SPM ", {}), ("terlepas pandang!", {"color": GOLD_L})],
                                         "xbold", 46, stroke=5, max_w=760))
    show(L, t4c, CX, 570, t, T[3] + 2.6)
    # exam paper
    pp = ease_back(A(t, 0.2, 0.6), 1.4)
    pim = paper.copy()
    marks = [(T[0] + 0.6, "tick", 0), (T[0] + 1.0, "tick", 1), (T[0] + 1.4, "tick", 2),
             (T[1] + 0.3, "cross", 3), (T[1] + 0.6, "cross", 4), (T[1] + 0.9, "cross", 5)]
    for k, kind, row in marks:
        a = ease_back(A(t, k, 0.25), 2.5)
        if a > 0:
            m = tick if kind == "tick" else crs
            ms = m.resize((max(1, int(60 * a)), max(1, int(60 * a))))
            pim.alpha_composite(ms, (int(500 - ms.width / 2), int(168 + row * 88 - ms.height / 2)))
    sp = ease_back(A(t, T[1] + 1.2, 0.4), 2.2)
    if sp > 0:
        sc_im = cached("score", R._score_circle)
        s2 = sc_im.resize((max(1, int(sc_im.width * sp)), max(1, int(sc_im.height * sp))))
        pim.alpha_composite(s2, (int(450 - s2.width / 2), int(95 - s2.height / 2)))
    # paper shrinks down when the "secret" card arrives
    m = ease_in_out(A(t, T[3], 0.7))
    py = 1010 + (1 - pp) * 500 + 6 * math.sin(t * 2.2) + m * 60
    put(L, pim, CX - 40 - m * 60, py, rot=4 - 2 * pp + m * 4, alpha=clamp(pp * 2), scale=1 - 0.28 * m)
    # magnifier on the secret part
    if t > T[3] + 1.0:
        mg = big_emoji("🔍", 150)
        mp = ease_back(A(t, T[3] + 1.0, 0.5))
        put(L, mg, 640 + 50 * math.sin(t * 1.6), 980 + 40 * math.cos(t * 1.3), scale=mp)
    fp = ease_back(A(t, T[1] + 0.9, 0.5), 2.2) * (1 - ease_out(A(t, T[3], 0.4)))
    put(L, face, 720, 1170, scale=fp, rot=4 * math.sin(t * 9) - 8)
    # relief: wink face when "jangan risau"
    if T[2] <= t < T[3] + 0.3:
        e = big_emoji("😌", 140)
        put(L, e, 720, 1170, scale=ease_back(A(t, T[2] + 0.1, 0.4)) * (1 - A(t, T[3], 0.3)))


# ------------------------------------------------------------------ scene 2: MASALAH
def scene2(L, t):
    sheet = cached("sheet", R.answer_sheet)
    t1 = cached("m1", lambda: text_img([("Cuba tengok jawapan ni 👀", {})], "black", 60, stroke=6))
    show(L, t1, CX, 300, t, T[4] - 0.1, T[5] - 0.1)
    ar = cached("ar", R._arabic)
    show(L, ar, CX, 300, t, T[5], base=0.85)
    p = ease_back(A(t, T[4], 0.55), 1.3)
    sim = sheet.copy()
    # highlighter over the question line
    hq = ease_in_out(A(t, T[5] + 0.3, 1.2))
    if hq > 0:
        hl = Image.new("RGBA", sim.size, (0, 0, 0, 0))
        ImageDraw.Draw(hl).rounded_rectangle((132, 92, 132 + 460 * hq, 136), radius=8, fill=(255, 214, 70, 120))
        sim.alpha_composite(hl)
    hand = cached("hand", lambda: text_img([("Al-Muntaqim: Allah Maha Pembalas.", {})], "hand", 50,
                                           max_w=620, color=BLUE_INK, line_h=1.4, pad=6, shadow=False))
    hp = clamp((t - T[6] - 0.8) / 2.4)
    if hp > 0:
        rev = hand.copy()
        lh = hand.height / 2
        mask = Image.new("L", hand.size, 0)
        md = ImageDraw.Draw(mask)
        md.rectangle((0, 0, hand.width * clamp(hp * 2), lh), fill=255)
        md.rectangle((0, lh, hand.width * clamp(hp * 2 - 1), hand.height), fill=255)
        rev.putalpha(Image.composite(rev.getchannel("A"), Image.new("L", hand.size, 0), mask))
        sim.alpha_composite(rev, (140, 178))
    cp = A(t, T[9], 0.35)
    if cp > 0:
        tmp = Image.new("RGBA", sim.size, (0, 0, 0, 0))
        put(tmp, cached("bigcross", lambda: R.red_cross(220, 30)), 430, 430, scale=1.8 - 0.8 * ease_out(cp),
            alpha=clamp(cp * 2), rot=-6)
        put(tmp, cached("zero", lambda: R._mark_circle("1/2")), 670, 440, scale=ease_back(A(t, T[9] + 0.4, 0.35)),
            rot=-8)
        sim.alpha_composite(tmp)
    sh = 0
    if 0.1 < t - T[9] < 0.6:
        sh = 10 * math.sin((t - T[9]) * 70) * (0.6 - (t - T[9]))
    put(L, sim, CX + sh, 720 + (1 - p) * 600, alpha=clamp(p * 2))
    # beats under the sheet
    b1 = cached("m4", lambda: text_img([("Nampak macam betul, kan? 🤔", {})], "black", 54, stroke=6, color=GOLD_L))
    show(L, b1, CX, 1120, t, T[7], T[8] - 0.1)
    b2 = cached("m5", lambda: text_img([("Tapi sebenarnya…", {})], "black", 60, stroke=6))
    show(L, b2, CX, 1120, t, T[8], T[9] - 0.1)
    b3 = cached("m6", lambda: text_img([("❌ TAK LENGKAP!", {})], "black", 76, stroke=7, color=(255, 92, 92)))
    show(L, b3, CX, 1120, t, T[9], T[10] - 0.1, back=2.8, base=0.2)
    b4 = cached("m7", _missing_strip)
    show(L, b4, CX, 1120, t, T[10])
    if t > T[10] + 0.4:
        # pulse the ? slots
        g = cached("m7g", lambda: glow(b4, GOLD, 24, 14))
        put(L, g, CX, 1120, alpha=0.25 + 0.25 * math.sin(t * 6))


def _missing_strip():
    c = Canvas(820, 120)
    x = 8
    for i in range(5):
        c.rrect((x, 22, x + 62, 98), 14, fill=(255, 255, 255, 40), outline=GOLD, width=4)
        c.text((x + 31, 60), "?", font("black", 44), GOLD, anchor="mm")
        x += 72
    c.text((x + 4, 60), "+ Allah Maha Pembalas", font("xbold", 33), WHITE, anchor="lm")
    return c.get().crop((0, 0, 820, 120))


# ------------------------------------------------------------------ scene 3: 5 PERKATAAN KUNCI
WORDS = ["NAMA", "ALLAH SWT", "YANG", "MENUNJUKKAN", "BAHAWA"]
WY = [460, 640, 820, 1000, 1180]


def slot_img():
    c = Canvas(420, 112)
    c.rrect((4, 4, 416, 108), 56, fill=(255, 255, 255, 25), outline=(255, 214, 120, 150), width=4)
    return c.get()


def scene3(L, t):
    k1 = cached("k1", lambda: text_img([("Jadi, ingat baik-baik! ☝️", {})], "black", 64, stroke=6, color=GOLD_L))
    show(L, k1, CX, 380, t, T[11] - 0.1, T[13] - 0.1)
    k2 = cached("k2", lambda: text_img([("Setiap kali jawab soalan ", {}), ("MAKSUD NAMA ALLAH", {"color": GOLD})],
                                       "xbold", 52, stroke=5, max_w=760))
    show(L, k2, CX, 620, t, T[12], T[13] - 0.1)
    reading = T[20] - 0.2  # "Ingat ya" -> collapse into sentence card
    title = cached("k3", lambda: text_img([("✨ 5 PERKATAAN KUNCI ✨", {})], "black", 60, stroke=6))
    show(L, title, CX, 290, t, T[13], reading)
    out_a = 1 - clamp((t - reading) / 0.35)
    if T[13] <= t and out_a > 0:
        slot = cached("slot", slot_img)
        reread = word_times(19, 6)  # Nama Allah SWT yang menunjukkan bahawa
        reread = [reread[0], reread[1], reread[3], reread[4], reread[5]]
        for i, (w, y) in enumerate(zip(WORDS, WY)):
            sp = ease_back(A(t, T[13] + 0.25 + i * 0.12, 0.4))
            k = T[14 + i]
            p = A(t, k - 0.05, 0.45)
            if p <= 0:
                put(L, slot, CX + 20, y, scale=sp, alpha=out_a)
                nb = cached("nb%d" % i, lambda i=i: R.num_badge(i + 1))
                put(L, nb, CX + 20 - 220, y - 36, scale=sp, alpha=out_a)
                continue
            pim = cached("pill" + w, lambda w=w: R.word_pill(w))
            gl = cached("glow" + w, lambda pim=pim: glow(pim, GOLD, 30, 20))
            since = t - k
            flash = math.exp(-max(0, since) * 2.5)
            # second read: each word flashes again as it is re-spoken
            flash2 = math.exp(-max(0, t - reread[i]) * 3) if t > reread[i] else 0
            s = ease_back(p, 2.4) * (1 + 0.08 * flash2)
            put(L, gl, CX + 20, y, scale=s, alpha=clamp((0.5 + 0.2 * math.sin(t * 4 + i) + flash + flash2) * out_a))
            put(L, pim, CX + 20, y, scale=s, alpha=out_a)
            nb = cached("nb%d" % i, lambda i=i: R.num_badge(i + 1))
            put(L, nb, CX + 20 - pim.width / 2 - 10, y - 40, alpha=out_a)
            if 0 < since < 0.9:
                spk = cached("spk", R.sparkle)
                for j in range(6):
                    a = j * math.pi / 3 + i
                    r = 120 + 260 * ease_out(since / 0.9)
                    put(L, spk, CX + 20 + r * math.cos(a) * 1.3, y + r * math.sin(a) * 0.5,
                        scale=0.9 * (1 - since / 0.9), alpha=(1 - since / 0.9) * out_a, rot=since * 200)
    # after "Ingat ya": sentence card + callouts
    sc = cached("k5", _sentence_card)
    show(L, sc, CX, 400, t, reading + 0.2, base=0.5)
    if t > reading + 0.6:
        put(L, cached("k5g", lambda: glow(sc, GOLD, 30, 18)), CX, 400, alpha=0.25 + 0.2 * math.sin(t * 4))
        put(L, sc, CX, 400)
    c1 = cached("k6", lambda: _callout("❌", [("BUKAN sekadar ", {"color": RED}), ("pembuka ayat", {})], WHITE, INK))
    show(L, c1, CX, 700, t, T[21])
    c2 = cached("k7", lambda: _callout("✅", [("SEBAHAGIAN ", {"color": (14, 140, 80)}), ("daripada MAKSUD", {})],
                                       WHITE, INK))
    show(L, c2, CX, 880, t, T[22])
    c3 = cached("k8", lambda: _callout("⚠️", [("Tinggal = jawapan ", {}), ("TAK LENGKAP!", {"color": GOLD_L})],
                                       RED, WHITE))
    sh = 0
    if 0.2 < t - T[24] < 1.0:
        sh = 6 * math.sin((t - T[24]) * 55) * (1.0 - (t - T[24]))
    show(L, c3, CX + sh, 1080, t, T[23])


def _sentence_card():
    t = text_img([("Nama Allah SWT yang menunjukkan bahawa", {})], "black", 52, max_w=700, color=INK, pad=0,
                 shadow=False, line_h=1.2)
    w, h = 800, t.height + 70
    p = pill(w, h, GOLD, r=40)
    p.alpha_composite(t, (int(6 + (w - t.width) / 2), int(4 + (h - t.height) / 2)))
    return p


def _callout(emo, spans, fill, color):
    t = text_img(spans, "xbold", 44, max_w=640, color=color, pad=0, shadow=False)
    w, h = 800, max(t.height + 50, 120)
    c = card(w, h + 14, fill, r=32)
    e = emoji_img(emo.replace("️", ""), 64)
    c.alpha_composite(e, (34, int((h - e.height) / 2)))
    c.alpha_composite(t, (int(120 + (640 - t.width) / 2), int((h - t.height) / 2)))
    return c


# ------------------------------------------------------------------ scene 4: CONTOH BETUL
CARD_W, CARD_H, CARD_Y = R.CARD_W, 820, 770
LX, RX = R.LEFT_X, R.RIGHT_X


def scene4(L, t):
    h1 = cached("c1", lambda: text_img([("Jom betulkan jawapan tadi! ✏️", {})], "black", 46, stroke=6))
    show(L, h1, CX, 270, t, T[25] - 0.1, T[31] - 0.15)
    # checklist replaces header: Lengkap / Tepat / Ikut skema
    for j, (lab, k) in enumerate((("Lengkap", T[31]), ("Tepat", T[32]), ("Ikut skema", T[33]))):
        im = cached(("chk", lab), lambda lab=lab: _check_pill(lab))
        xs = [CX - 280, CX - 50, CX + 225][j]
        show(L, im, xs, 270, t, k, back=2.6, base=0.3)
    dim = 1 - 0.35 * ease_out(A(t, T[30], 0.5))
    lp = ease_out(A(t, T[25] + 0.2, 0.6))
    lc = cached("lcard4", _left_card)
    put(L, lc, LX - (1 - lp) * 500, CARD_Y, alpha=clamp(lp * 1.5) * dim)
    rp = ease_out(A(t, T[26], 0.6))
    if rp > 0:
        base = cached("rcard4", lambda: card(CARD_W, CARD_H, (236, 253, 243), outline=INK, header=(GREEN, 150)))
        rc = base.copy()
        hdr = cached("rhdr", lambda: R._card_header("MARKAH", "PENUH"))
        rc.alpha_composite(hdr, (int((CARD_W - hdr.width) / 2), 18))
        placed, bw, bh, sz = cached("rlay", lambda: R.layout(R.right_spans(), "bold", 38, CARD_W - 64, 1.32))
        times = word_times(27, 9) + word_times(28, 3) + word_times(29, 5)
        nvis = sum(1 for x in times if t >= x - 0.05)
        timg = R.draw_tokens(placed, sz, bw, bh, "bold", color=INK, stroke=0, n_visible=nvis, hl_progress=1.0,
                             pad=10, shadow=False)
        rc.alpha_composite(timg, (22, 175))
        # bracket labels: key words / huraian
        if t > T[28] - 0.1:
            lab = cached("hur", lambda: _tag("huraian", CORAL))
            rc.alpha_composite(with_alpha(lab, ease_out(A(t, T[28] - 0.1, 0.4))), (CARD_W - lab.width - 24, CARD_H - 72))
        if t > T[30]:
            put(L, cached("rglow4", lambda: glow(base, GOLD, 30, 20)), RX, CARD_Y, alpha=0.35 + 0.25 * math.sin(t * 4))
        put(L, rc, RX + (1 - rp) * 500, CARD_Y, alpha=clamp(rp * 1.5))
    for emo, x, k in (("❌", LX, T[25] + 0.5), ("✅", RX + (1 - rp) * 500, T[26] + 0.4)):
        b = cached("badge" + emo, lambda emo=emo: R._emoji_badge(emo))
        show(L, b, x - CARD_W / 2 + 40, CARD_Y - CARD_H / 2 + 20, t, k, back=2.5, base=0.0)
    show(L, cached("vs", R._vs_badge), (LX + RX) / 2, CARD_Y - CARD_H / 2 + 75, t, T[26] + 0.4, base=0.0)


def _left_card():
    cc = card(CARD_W, CARD_H, (255, 238, 238), outline=INK, header=(RED, 150))
    hdr = R._card_header("JAWAPAN", "TADI")
    cc.alpha_composite(hdr, (int((CARD_W - hdr.width) / 2), 18))
    tt = text_img([("Allah Maha Pembalas.", {})], "xbold", 48, max_w=CARD_W - 70, color=(180, 30, 30), pad=0,
                  shadow=False, line_h=1.3)
    cc.alpha_composite(tt, (int((CARD_W - tt.width) / 2), 280))
    cc.alpha_composite(with_alpha(R.red_cross(150, 22), 0.85), (int((CARD_W - 150) / 2), 520))
    n = text_img([("Tiada 5 perkataan kunci & tiada huraian", {})], "semi", 28, max_w=CARD_W - 70,
                 color=(120, 60, 60), pad=0, shadow=False)
    cc.alpha_composite(n, (int((CARD_W - n.width) / 2), 690))
    return cc


def _tag(txt, col):
    f = font("xbold", 26)
    w = int(f.getlength(txt) + 36)
    c = Canvas(w, 46)
    c.rrect((0, 0, w, 46), 23, fill=col)
    c.text((w / 2, 24), txt, f, WHITE, anchor="mm")
    return c.get()


def _check_pill(lab):
    t = text_img([("✅ " + lab, {})], "black", 34, color=INK, pad=0, shadow=False, max_w=400)
    t = t.crop(t.getbbox())
    w, h = t.width + 40, 74
    p = pill(w, h, WHITE)
    p.alpha_composite(t, (int(6 + (w - t.width) / 2), int(4 + (h - t.height) / 2)))
    return p


# ------------------------------------------------------------------ scene 5: FORMULA
def scene5(L, t):
    a1 = cached("f1", lambda: text_img([("Senang je nak ingat! 😉", {})], "black", 60, stroke=6, color=GOLD_L))
    show(L, a1, CX, 290, t, T[34] - 0.1, T[35] - 0.1)
    a2 = cached("f2", lambda: text_img([("📌 FORMULA JAWAPAN", {})], "black", 60, stroke=6))
    show(L, a2, CX, 290, t, T[35])
    blocks = [("5 perkataan kunci", GOLD, INK, T[36], 500), ("Allah Maha ___", TEAL, WHITE, T[37], 730),
              ("huraian", CORAL, WHITE, T[39], 960)]
    for i, (txt, col, tc, k, y) in enumerate(blocks):
        if t < k:
            continue
        b = cached("blk%d" % i, lambda txt=txt, col=col, tc=tc: R._block(txt, col, tc))
        bob = 5 * math.sin(t * 3 + i)
        show(L, b, CX, y + bob, t, k, back=2.2, base=0.0)
        if i > 0:
            show(L, cached("plus", R.plus_badge), CX, y - 115, t, k - 0.2, back=2.5, base=0.0)
    # "Allah Maha apa?" tag
    q = cached("f3", lambda: _tag("apa? 🤔".replace(" 🤔", ""), CORAL))
    if t > T[38]:
        wob = 6 * math.sin(t * 8)
        show(L, q, CX + 270, 660, t, T[38], back=2.6, base=0.0, rot=wob)
    s = cached("f4", lambda: _callout("✨", [("Boleh guna untuk ", {}), ("SEMUA", {"color": (200, 120, 0)}),
                                            (" nama Allah!", {})], PAPER, INK))
    show(L, s, CX, 1160, t, T[40])


# ------------------------------------------------------------------ scene 6: CTA
def scene6(L, t):
    a = cached("e1", lambda: text_img([("Jadi lepas ni…", {})], "black", 60, stroke=6, color=GOLD_L))
    show(L, a, CX, 330, t, T[41] - 0.1, T[44] - 0.2)
    b = cached("e2", lambda: _callout("⚠️", [("Jangan bagi markah ", {}), ("terlepas", {"color": RED})], WHITE, INK))
    show(L, b, CX, 560, t, T[42], T[44] - 0.2)
    c = cached("e3", lambda: _callout("🔑", [("hanya sebab ", {}), ("5 perkataan!", {"color": (200, 120, 0)})],
                                      WHITE, INK))
    show(L, c, CX, 740, t, T[43], T[44] - 0.2)
    if t < T[44] - 0.2:
        show(L, cached("face", R.shocked_face), CX, 1050, t, T[42] + 0.3, T[44] - 0.2, base=0.0)
    # closing
    cc = cached("s6card", R._closing_card)
    show(L, cc, CX, 760, t, T[44], d=0.6, back=1.6, base=0.5)
    for i, (ic, k) in enumerate(((cached("bk", R.bookmark_icon), T[44] + 0.2), (cached("sh", R.share_icon), T[45]))):
        if t > k:
            bounce = abs(math.sin(t * 4 + i * 1.3)) * 18
            p = ease_back(A(t, k, 0.5), 2.6)
            put(L, ic, CX - 110 + i * 220, 440 - bounce, scale=p, rot=8 * math.sin(t * 3 + i))
    if t > T[46]:
        pulse = 1 + 0.04 * math.sin(t * 7)
        fp = ease_back(A(t, T[46], 0.5))
        put(L, cached("s6follow", R._follow_btn), CX, 1110, scale=(0.6 + 0.4 * fp) * pulse, alpha=clamp(fp * 2))


# ------------------------------------------------------------------ timeline
def sec_bounds():
    secs = []
    for i, p in enumerate(PH):
        if i == 0 or p["sec"] != PH[i - 1]["sec"]:
            secs.append(i)
    b = [0.0]
    for i in secs[1:]:
        b.append((TE[i - 1] + T[i]) / 2)
    b.append(END)
    return b


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6]
BOUNDS = sec_bounds()
WM = None


def frame(t):
    global WM
    if WM is None:
        WM = R.watermark_img()
    img = R.background(t)
    for i, fn in enumerate(SCENES):
        st, en = BOUNDS[i], BOUNDS[i + 1]
        if st <= t < en or (i == len(SCENES) - 1 and t >= st):
            layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            fn(layer, t)
            a = clamp((en - t) / 0.28) if i < len(SCENES) - 1 else 1.0
            a *= clamp((t - st) / 0.15 + 0.3) if i > 0 else 1.0
            img.alpha_composite(with_alpha(layer, a))
            break
    cap = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    captions(cap, t)
    img.alpha_composite(cap)
    put(img, WM, CX, R.WATERMARK_Y)
    return img.convert("RGB")


def frame_bytes(i):
    return frame(i / FPS).tobytes()


def events():
    ev = [(0.2, "whoosh", None)]
    for b in BOUNDS[1:-1]:
        ev.append((b - 0.1, "whoosh", None))
    ev += [(T[0] + 0.6 + 0.4 * k, "pop", None) for k in range(3)]
    ev += [(T[1] + 0.3, "pop", None), (T[1] + 0.6, "pop", None), (T[1] + 0.9, "pop", None),
           (T[1] + 1.2, "stamp", None), (T[1] + 1.3, "buzz", None), (T[3] + 0.5, "chime", None)]
    ev += [(T[6] + 0.8, "pop", None), (T[9], "stamp", None), (T[9] + 0.1, "buzz", None), (T[10], "pop", None)]
    freqs = [1046.5, 1174.7, 1318.5, 1568.0, 1760.0]
    ev += [(T[14 + i] - 0.05, "ding", f) for i, f in enumerate(freqs)]
    ev += [(T[20], "chime", None), (T[21], "pop", None), (T[22], "pop", None), (T[23], "buzz", None)]
    ev += [(T[26], "whoosh", None), (T[30], "chime", None)] + [(T[k], "ding", f) for k, f in
                                                                  ((31, 1318.5), (32, 1568.0), (33, 1760.0))]
    ev += [(T[36], "ding", 1046.5), (T[37], "ding", 1318.5), (T[39], "ding", 1568.0), (T[40], "chime", None)]
    ev += [(T[42], "pop", None), (T[43], "pop", None), (T[44], "chime", None), (T[45], "pop", None),
           (T[46], "ding", 1568.0)]
    return ev


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--still", type=float, nargs="*")
    ap.add_argument("--safe", action="store_true")
    a = ap.parse_args()
    out_dir = R.OUT
    if a.still is not None:
        for t in a.still:
            im = frame(t)
            if a.safe:
                im = R.safe_overlay(im)
            p = os.path.join(out_dir, "still_%05.1f.png" % t)
            im.save(p)
            print(p)
        return
    wav = os.path.join(out_dir, "_audio_suara_music.wav")
    audio.build(END, events(), wav, music_level=0.11, sfx_level=0.36)
    mixed = os.path.join(out_dir, "_audio_suara_mix.wav")
    vo = os.path.join(ROOT, "assets", "voiceover.m4a")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-i", vo, "-filter_complex",
                    "[1:a]aresample=48000,loudnorm=I=-16:TP=-1.5[v];"
                    "[0:a][v]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[o]",
                    "-map", "[o]", "-c:a", "pcm_s16le", mixed], check=True)
    n = int(round(END * FPS))
    out = os.path.join(out_dir, "Al-Muntaqim_TikTok_Suara.mp4")
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s",
                           "%dx%d" % (W, H), "-r", str(FPS), "-i", "-", "-i", mixed, "-c:v", "libx264", "-preset",
                           "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "aac",
                           "-b:a", "192k", "-movflags", "+faststart", "-shortest", out], stdin=subprocess.PIPE)
    with Pool(os.cpu_count()) as pool:
        for i, b in enumerate(pool.imap(frame_bytes, range(n), chunksize=8)):
            ff.stdin.write(b)
            if i % 600 == 0:
                print("frame %d/%d" % (i, n), flush=True)
    ff.stdin.close()
    ff.wait()
    print(out)


if __name__ == "__main__":
    main()
