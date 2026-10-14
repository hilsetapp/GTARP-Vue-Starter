#!/usr/bin/env python3
"""Генерирует assets/og-banner.png (1200x630) — баннер RP VUE STARTER.
Запуск: python3 assets/og-banner.py   (нужен Pillow)"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (21, 18, 16); CREAM = (242, 234, 217); ACC = (255, 138, 42)
DIM = (128, 118, 104); GREEN = (158, 242, 77); VUE = (65, 184, 131); TSBLUE = (69, 133, 190)
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FM = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
FMr = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

def font(p, s): return ImageFont.truetype(p, s)

im = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(im)

# blueprint-сетка
for x in range(0, W, 30): d.line((x, 0, x, H), fill=(33, 30, 27))
for y in range(0, H, 30): d.line((0, y, W, y), fill=(33, 30, 27))
# янтарное свечение снизу
for i in range(90):
    a = int(30 * (1 - i/90))
    d.line((0, H-i, W, H-i), fill=(21+int(160*a/255), 18+int(66*a/255), 16), width=1)

# ── левый блок: заголовок ──
x0, y = 70, 74
d.text((x0+3, y+3), "RP", font=font(FB, 118), fill=(84, 76, 66))
d.text((x0, y), "RP", font=font(FB, 118), fill=CREAM)
w_rp = d.textlength("RP  ", font=font(FB, 118))
d.text((x0+w_rp, y), "VUE", font=font(FB, 118), fill=VUE)
w_vue = d.textlength("VUE  ", font=font(FB, 118))
d.text((x0+w_rp+w_vue, y), "STARTER", font=font(FB, 74), fill=ACC)

d.text((x0+4, y+150), "современный стартер", font=font(FB, 46), fill=CREAM)
d.text((x0+4, y+208), "для RAGE MP серверов", font=font(FB, 46), fill=(206, 196, 178))
d.text((x0+4, y+290), "типизированные события: CEF ⇄ клиент ⇄ сервер", font=font(FM, 22), fill=DIM)
d.text((x0+4, y+324), "разработка без игры — мок-панель сервера в браузере", font=font(FM, 22), fill=DIM)
d.text((x0+4, y+374), "vue 3 · vite · typescript · pinia · rp-ui-kit", font=font(FM, 24), fill=ACC)

# ── правый блок: три мира ──
def world(x, y, w, h, title, sub, color):
    d.rounded_rectangle((x, y, x+w, y+h), radius=14, outline=color, width=3, fill=(26, 23, 20))
    t = font(FB, 26)
    tw = d.textlength(title, font=t)
    d.text((x + (w-tw)/2, y + 16), title, font=t, fill=color)
    s = font(FMr, 17)
    sw = d.textlength(sub, font=s)
    d.text((x + (w-sw)/2, y + 54), sub, font=s, fill=CREAM)

bx, bw, bh, gap = 760, 165, 86, 34
world(bx, 120, bw, bh, "CEF", "Vue 3 + Pinia", VUE)
def arrow(x1, y1, x2, y2):
    d.line((x1, y1, x2, y2), fill=ACC, width=4)
    d.polygon([(x2-8, y2-6), (x2+8, y2-6), (x2, y2+8)], fill=ACC)
arrow(bx+bw/2+14, 120+bh, bx+bw/2-40, 120+bh+gap)
d.line((bx+bw/2-40, 120+bh+gap-4, bx+bw/2+14, 120+bh-0), fill=(60,54,46), width=0) # noop keep
world(bx+70, 120+bh+gap, bw, bh, "CLIENT", "мост + HUD-цикл", ACC)
arrow(bx+70+bw/2+14, 120+2*bh+gap, bx+70+bw/2-40, 120+2*bh+2*gap)
world(bx+140, 120+2*(bh+gap), bw, bh, "SERVER", "Node + TS", TSBLUE)
# бейдж TS
d.rounded_rectangle((bx-6, 470, bx+386, 528), radius=12, outline=DIM, width=2, fill=(24, 22, 19))
d.text((bx+18, 484), "shared/events.ts — одна правда типов", font=font(FMr, 19), fill=CREAM)

# рамка
d.rectangle((10, 10, W-10, H-10), outline=(48, 43, 37), width=3)

im.save("assets/og-banner.png")
print("✔ assets/og-banner.png")
