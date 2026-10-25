"""Render the "Current designs" boards of the designs canvas: one image per kind of page, from the shipped examples.
usage: py -3 tools/current-designs.py <out dir> [--ja]
Each image is the page at 1280 px (its first 2000 px) beside the same page at 390 px (its first two screens), light theme,
saved as <out>/current-<kind>.webp at 1718 x 2044. Needs Python with Playwright (Chrome) and Pillow; run it after a release,
then upload the images to the canvas and point each Current board at its new image. See docs/dev/design/README.md.
With --ja it renders each page's Japanese twin (<page>.ja.html) as current-<kind>-ja.webp, for the Japanese designs page.
"""
import sys, pathlib
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
E, G = 'skills/glance-explainer/examples/', 'skills/explainer-gather/examples/'
KINDS = {  # kind: page, in the canvas order (by the job the reader has)
    'decision': E + 'decision.html', 'ballot': G + 'ballot.html', 'compare': E + 'compare.html', 'spec': E + 'spec.html',
    'playbook': E + 'playbook.html', 'status': E + 'status.html', 'portfolio': E + 'portfolio.html', 'roadmap': 'docs/roadmap.html',
    'release': E + 'release.html', 'incident': E + 'incident.html', 'handover': E + 'handover.html', 'explainer': E + 'explainer.html',
    'teach': E + 'teach.html', 'tour': E + 'tour.html', 'research': E + 'research.html', 'field-guide': E + 'field-guide.html',
    'atlas': 'skills/explainer-atlas/examples/atlas/index.html', 'runbook': E + 'runbook.html', 'pr': E + 'pr.html',
    'questionnaire': G + 'questionnaire.html', 'public': 'docs/index.html',
}

def grab(br, page, width, height, clip_h, tmp):
    ctx = br.new_context(viewport={'width': width, 'height': height}, color_scheme='light', device_scale_factor=1)
    pg = ctx.new_page()
    pg.goto(page.resolve().as_uri())
    pg.wait_for_timeout(900)
    total = pg.evaluate('document.documentElement.scrollHeight')
    pg.screenshot(path=str(tmp), full_page=True, clip={'x': 0, 'y': 0, 'width': width, 'height': min(clip_h, total)})
    ctx.close()
    return Image.open(tmp).convert('RGB')

def main():
    out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    ja = '--ja' in sys.argv[2:]
    tmp = out / '_grab.png'
    try:
        font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 22)
    except OSError:
        font = ImageFont.load_default()
    with sync_playwright() as pw:
        br = pw.chromium.launch(channel='chrome')
        for kind, rel in KINDS.items():
            if ja: rel = rel[:-len('.html')] + '.ja.html'
            desk = grab(br, ROOT / rel, 1280, 900, 2000, tmp)
            phone = grab(br, ROOT / rel, 390, 844, 1688, tmp)
            top = 44
            im = Image.new('RGB', (1280 + 48 + 390, top + 2000), '#ffffff')
            d = ImageDraw.Draw(im)
            d.text((0, 8), 'Desktop, 1280 px, first 2000 px' + (', Japanese' if ja else ''), fill='#4a5a6a', font=font)
            d.text((1280 + 48, 8), 'Phone, first two screens', fill='#4a5a6a', font=font)
            im.paste(desk, (0, top))
            im.paste(phone, (1280 + 48, top))
            d.rectangle([1280 + 47, top - 1, 1280 + 48 + 390, top + phone.height], outline='#aebbc8')
            im.save(out / f'current-{kind}{"-ja" if ja else ""}.webp', 'WEBP', quality=82)
            print(kind, flush=True)
        br.close()
    tmp.unlink(missing_ok=True)

if __name__ == '__main__':
    main()
