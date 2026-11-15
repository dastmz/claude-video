# Contact sheet of out/stills/*.png with the TikTok safe zone drawn (stills are 0.5 scale).
import sys, glob, os
from PIL import Image, ImageDraw
files = sorted(glob.glob(sys.argv[1]))
out = sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 5
W, H = 540, 960
tw, th = 270, 480
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (tw + 10) + 10, rows * (th + 34) + 10), "#222")
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB")
    dr = ImageDraw.Draw(im)
    dr.rectangle([60, 125, W - 60, H - 200], outline="#00FF88", width=2)
    im = im.resize((tw, th))
    x = 10 + (i % cols) * (tw + 10); y = 10 + (i // cols) * (th + 34)
    sheet.paste(im, (x, y))
    d.text((x, y + th + 6), os.path.basename(f)[:-4], fill="white")
sheet.save(out)
