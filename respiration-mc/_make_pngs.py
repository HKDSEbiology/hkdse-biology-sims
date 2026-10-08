# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path(__file__).with_name("media")


def font(size):
    for name in ("segoeui.ttf", "arial.ttf", "calibri.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def save(im, name):
    dest = OUT / name
    im.save(dest, "PNG")
    print("wrote", dest)


def seeds():
    im = Image.new("RGB", (840, 460), "white")
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((280, 70, 560, 380), 40, fill="#eef4fa", outline="#1f4e79", width=4)
    d.rectangle((360, 40, 480, 90), fill="#d9c7a3", outline="#8a6a20", width=2)
    d.ellipse((330, 180, 510, 300), fill="#e8d9a8", outline="#8a6a20", width=2)
    for box in [(360, 200, 390, 222), (410, 230, 440, 252), (450, 195, 478, 216)]:
        d.ellipse(box, fill="#c9a24a")
    d.line((600, 80, 600, 340), fill="#c0392b", width=4)
    d.rectangle((586, 58, 614, 90), fill="#c0392b")
    d.text((150, 50), "cotton wool", font=font(22), fill="#1c2430")
    d.text((620, 90), "thermometer", font=font(22), fill="#1c2430")
    d.text((180, 410), "vacuum flask with germinating seeds", font=font(24), fill="#5a6b7c")
    save(im, "seeds_flask.png")


def yeast():
    im = Image.new("RGB", (880, 440), "white")
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((80, 50, 220, 340), 16, fill="#fff8e8", outline="#1f4e79", width=4)
    d.rectangle((88, 210, 212, 332), fill="#e8d9a8")
    d.line((220, 80, 420, 80), fill="#1c2430", width=4)
    d.line((420, 80, 420, 230), fill="#1c2430", width=4)
    d.line((420, 230, 470, 230), fill="#1c2430", width=4)
    d.rounded_rectangle((470, 210, 640, 360), 16, fill="#eef6fb", outline="#1f4e79", width=4)
    d.rectangle((478, 300, 632, 352), fill="#dceef8")
    d.text((70, 380), "yeast + glucose", font=font(24), fill="#1c2430")
    d.text((470, 380), "lime water", font=font(24), fill="#1c2430")
    d.text((250, 50), "delivery tube", font=font(20), fill="#5a6b7c")
    save(im, "yeast_setup.png")


def mito():
    im = Image.new("RGB", (920, 440), "white")
    d = ImageDraw.Draw(im)
    d.ellipse((140, 70, 740, 340), fill="#f4f8ee", outline="#1f7a6c", width=5)
    d.ellipse((190, 110, 690, 300), outline="#2f6f9e", width=4)
    d.arc((250, 140, 430, 270), 200, 340, fill="#2f6f9e", width=4)
    d.arc((400, 140, 580, 270), 20, 160, fill="#2f6f9e", width=4)
    d.arc((520, 140, 680, 270), 200, 340, fill="#2f6f9e", width=4)
    d.text((30, 50), "X cytoplasm", font=font(26), fill="#1c2430")
    d.line((70, 80, 150, 120), fill="#1c2430", width=2)
    d.text((430, 200), "Y", font=font(32), fill="#1c2430")
    d.text((710, 120), "Z", font=font(32), fill="#1c2430")
    d.line((710, 150, 640, 180), fill="#1c2430", width=2)
    d.text((40, 390), "X outside the organelle | Y matrix | Z inner membrane / crista", font=font(22), fill="#5a6b7c")
    save(im, "mitochondrion.png")


def respi():
    im = Image.new("RGB", (920, 460), "white")
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((120, 40, 300, 360), 18, fill="#eef4fa", outline="#1f4e79", width=4)
    d.rectangle((128, 280, 292, 352), fill="#cfd8e6")
    d.text((155, 310), "KOH", font=font(24), fill="#1c2430")
    for box in [(160, 120, 200, 148), (210, 150, 250, 178), (180, 180, 216, 206)]:
        d.ellipse(box, fill="#c9a24a")
    d.line((300, 70, 520, 70), fill="#1c2430", width=4)
    d.line((520, 70, 520, 300), fill="#1c2430", width=4)
    d.line((520, 300, 680, 300), fill="#1c2430", width=4)
    d.ellipse((505, 286, 535, 316), fill="#c0392b")
    d.text((80, 400), "germinating seeds", font=font(24), fill="#1c2430")
    d.text((700, 280), "manometer", font=font(24), fill="#1c2430")
    save(im, "respirometer.png")


if __name__ == "__main__":
    seeds()
    yeast()
    mito()
    respi()
