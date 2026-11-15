"""Rough forced alignment: map transcript phrases onto pauses in the recording.

Phrase length is estimated from syllables (Malay vowels); boundaries are snapped
to detected pauses with dynamic programming. Output: assets/alignment.json
"""
import json, os, re, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VO = os.path.join(ROOT, "assets", "voiceover.m4a")

def pauses():
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", VO, "-af", "silencedetect=n=-32dB:d=0.15", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    v = [float(x) for x in re.findall(r"silence_(?:start|end): ([0-9.]+)", r)]
    return list(zip(v[0::2], v[1::2]))

def syl(t):
    t = t.lower().replace("swt", "subhanahu wa taala").replace("spm", "es pi em")
    n = len(re.findall(r"[aeiou]+", t))
    return n + 0.6 * (t.count(",") + t.count("…") + t.count(":"))  # small pause weight

def main():
    phrases, sec = [], None
    for ln in open(os.path.join(ROOT, "assets", "transcript.txt")):
        ln = ln.strip()
        if not ln: continue
        if ln.startswith("#"): sec = ln[1:]; continue
        phrases.append(dict(text=ln, sec=sec, syl=syl(ln)))
    ps = pauses()
    start, end = ps[0][1], ps[-1][0]
    inner = [p for p in ps[1:-1]]
    # candidate boundaries: midpoint of each inner pause, with its length
    cands = [((a + b) / 2, b - a, a, b) for a, b in inner]
    N, M = len(phrases), len(cands)
    tot_syl = sum(p["syl"] for p in phrases)
    rate = (end - start - sum(c[1] for c in cands) * 0.5) / tot_syl
    INF = 1e18
    # dp[i][j]: phrases 0..i-1 placed, boundary after phrase i-1 is cand j-1 (j=0 -> start)
    import math
    pos = [start] + [c[0] for c in cands]
    plen = [0] + [c[1] for c in cands]
    dp = [[INF] * (M + 1) for _ in range(N)]
    bk = [[-1] * (M + 1) for _ in range(N)]
    def cost(i, j0, j1):  # phrase i spans pos[j0]..pos[j1]
        d = pos[j1] - pos[j0]
        e = phrases[i]["syl"] * rate + 0.35
        return ((d - e) / (0.35 * e + 0.4)) ** 2 - 1.5 * plen[j1]  # prefer long pauses as boundaries
    for j in range(1, M + 1):
        dp[0][j] = cost(0, 0, j)
    for i in range(1, N - 1):
        for j in range(i + 1, M + 1):
            best, arg = INF, -1
            for k in range(max(i, j - 12), j):
                if dp[i - 1][k] < INF:
                    v = dp[i - 1][k] + cost(i, k, j)
                    if v < best: best, arg = v, k
            dp[i][j], bk[i][j] = best, arg
    # last phrase ends at `end`
    pos.append(end); plen.append(0)
    best, arg = INF, -1
    for k in range(N - 1, M + 1):
        if dp[N - 2][k] < INF:
            v = dp[N - 2][k] + cost(N - 1, k, M + 1)
            if v < best: best, arg = v, k
    bounds = [M + 1, arg]
    j = arg
    for i in range(N - 2, 0, -1):
        j = bk[i][j]; bounds.append(j)
    bounds.append(0)
    bounds = bounds[::-1]
    out = []
    for i, p in enumerate(phrases):
        j0, j1 = bounds[i], bounds[i + 1]
        s = start if j0 == 0 else cands[j0 - 1][3]
        e = end if j1 == M + 1 else cands[j1 - 1][2]
        out.append(dict(p, start=round(s, 2), end=round(e, 2)))
        print(f"{s:7.2f}-{e:7.2f} [{p['sec']:8}] {p['text']}")
    json.dump(out, open(os.path.join(ROOT, "assets", "alignment.json"), "w"), indent=1, ensure_ascii=False)

main()
