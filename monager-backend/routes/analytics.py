import random
import math
from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["analytics"])

CATEGORIES = [
    "Housing",       # 0 → Bar chart (monthly bars)
    "Food & Dining", # 1 → Area line chart
    "Transportation",# 2 → Step chart
    "Utilities",     # 3 → Donut / gauge chart
    "Healthcare",    # 4 → Dot scatter chart
    "Entertainment", # 5 → Stacked bar chart
    "Shopping",      # 6 → Horizontal bar chart
    "Personal Care"  # 7 → Radial/polar spider chart
]

INK = "#2b1f1a"
ACCENT = "#e76f51"
GREEN = "#2a9d8f"


# ──────────────────────────────────────────────
# 0 · Housing  →  Vertical Bar Chart
# ──────────────────────────────────────────────
def chart_bar(values, months, width=240, height=100):
    n = len(values)
    max_v = max(values) or 1
    pad_x, pad_y, gap = 16, 10, 4
    bar_w = (width - pad_x * 2 - gap * (n - 1)) / n
    bars = ""
    for i, v in enumerate(values):
        bh = (v / max_v) * (height - pad_y * 2)
        bx = pad_x + i * (bar_w + gap)
        by = height - pad_y - bh
        color = ACCENT if i == n - 1 else INK
        alpha = "1" if i == n - 1 else "0.35"
        bars += f'<rect x="{bx:.1f}" y="{by:.1f}" width="{bar_w:.1f}" height="{bh:.1f}" rx="2" fill="{color}" opacity="{alpha}"/>'
        label = months[i] if i == 0 or i == n - 1 else ""
        if label:
            lx = bx + bar_w / 2
            bars += f'<text x="{lx:.1f}" y="{height - 1}" text-anchor="middle" font-size="7" fill="{INK}" opacity="0.6" font-family="sans-serif">{label}</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{bars}</svg>'


# ──────────────────────────────────────────────
# 1 · Food & Dining  →  Area Line Chart
# ──────────────────────────────────────────────
def chart_area(values, months, width=240, height=100):
    n = len(values)
    min_v, max_v = min(values), max(values)
    spread = max_v - min_v or 1
    pad = 8

    def x(i): return pad + (i / (n - 1)) * (width - pad * 2)
    def y(v): return pad + (1 - (v - min_v) / spread) * (height - pad * 2)

    pts = [(x(i), y(v)) for i, v in enumerate(values)]
    line = " ".join(f"{px:.1f},{py:.1f}" for px, py in pts)
    fill = "M " + " L ".join(f"{px:.1f},{py:.1f}" for px, py in pts)
    fill += f" L {pts[-1][0]:.1f},{height - pad} L {pts[0][0]:.1f},{height - pad} Z"

    dots = "".join(
        f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{"4" if i == n-1 else "2.5"}" fill="{"#e76f51" if i == n-1 else GREEN}" opacity="{"1" if i == n-1 else "0.8"}"/>'
        for i, (px, py) in enumerate(pts)
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">'
        f'<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="{GREEN}" stop-opacity="0.25"/><stop offset="100%" stop-color="{GREEN}" stop-opacity="0"/></linearGradient></defs>'
        f'<path d="{fill}" fill="url(#ag)"/>'
        f'<polyline points="{line}" fill="none" stroke="{GREEN}" stroke-width="2.5" stroke-linejoin="round"/>'
        f'{dots}</svg>'
    )


# ──────────────────────────────────────────────
# 2 · Transportation  →  Step Chart
# ──────────────────────────────────────────────
def chart_step(values, months, width=240, height=100):
    n = len(values)
    min_v, max_v = min(values), max(values)
    spread = max_v - min_v or 1
    pad = 10

    def x(i): return pad + (i / (n - 1)) * (width - pad * 2)
    def y(v): return pad + (1 - (v - min_v) / spread) * (height - pad * 2)

    pts = [(x(i), y(v)) for i, v in enumerate(values)]
    step_d = f"M {pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(1, n):
        step_d += f" H {pts[i][0]:.1f} V {pts[i][1]:.1f}"

    fill_d = step_d + f" V {height - pad} H {pts[0][0]:.1f} Z"
    dots = "".join(
        f'<circle cx="{px:.1f}" cy="{py:.1f}" r="3" fill="{ACCENT}" opacity="0.9"/>'
        for px, py in pts
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">'
        f'<path d="{fill_d}" fill="{ACCENT}" opacity="0.08"/>'
        f'<path d="{step_d}" fill="none" stroke="{ACCENT}" stroke-width="2.5" stroke-linejoin="miter"/>'
        f'{dots}</svg>'
    )


# ──────────────────────────────────────────────
# 3 · Utilities  →  Donut / Gauge Chart
# ──────────────────────────────────────────────
def chart_donut(utilization, width=240, height=100):
    cx, cy, r = width / 2, height * 0.58, 38
    thick = 14
    pct = min(utilization, 1.0)
    circ = 2 * math.pi * r
    dash_used = pct * circ
    dash_rem = circ - dash_used
    color = ACCENT if pct > 0.8 else (GREEN if pct < 0.5 else "#f4a261")
    pct_text = f"{int(pct * 100)}%"
    label = "OVER" if pct > 1 else pct_text
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">'
        f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="none" stroke="{INK}" stroke-width="{thick}" opacity="0.1" stroke-dasharray="{circ:.2f}" stroke-dashoffset="0" transform="rotate(-90 {cx:.1f} {cy:.1f})"/>'
        f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="none" stroke="{color}" stroke-width="{thick}" stroke-linecap="round" stroke-dasharray="{dash_used:.2f} {dash_rem:.2f}" transform="rotate(-90 {cx:.1f} {cy:.1f})"/>'
        f'<text x="{cx:.1f}" y="{cy + 5:.1f}" text-anchor="middle" font-size="18" font-weight="bold" fill="{INK}" font-family="Georgia,serif">{label}</text>'
        f'<text x="{cx:.1f}" y="{cy + 18:.1f}" text-anchor="middle" font-size="7" fill="{INK}" opacity="0.5" font-family="sans-serif" letter-spacing="2">UTILIZATION</text>'
        f'</svg>'
    )


# ──────────────────────────────────────────────
# 4 · Healthcare  →  Dot / Scatter Plot
# ──────────────────────────────────────────────
def chart_dots(values, months, width=240, height=100):
    n = len(values)
    min_v, max_v = min(values), max(values)
    spread = max_v - min_v or 1
    pad = 12

    def x(i): return pad + (i / (n - 1)) * (width - pad * 2)
    def y(v): return pad + (1 - (v - min_v) / spread) * (height - pad * 2 - 8)

    # Grid lines
    grid = "".join(
        f'<line x1="{pad}" y1="{pad + k * (height - pad * 2 - 8) / 3:.1f}" x2="{width - pad}" y2="{pad + k * (height - pad * 2 - 8) / 3:.1f}" stroke="{INK}" stroke-width="0.5" opacity="0.12"/>'
        for k in range(4)
    )
    dots = ""
    for i, v in enumerate(values):
        px, py = x(i), y(v)
        size = 4 + (v / max_v) * 6  # size encodes magnitude
        color = ACCENT if i == n - 1 else "#9467bd"
        alpha = "1" if i == n - 1 else "0.65"
        dots += f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{size:.1f}" fill="{color}" opacity="{alpha}"/>'

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">'
        f'{grid}{dots}</svg>'
    )


# ──────────────────────────────────────────────
# 5 · Entertainment  →  Stacked Bar Chart (2 series)
# ──────────────────────────────────────────────
def chart_stacked(values, months, max_budget, width=240, height=100):
    n = len(values)
    pad_x, pad_y, gap = 14, 8, 5
    bar_w = (width - pad_x * 2 - gap * (n - 1)) / n
    bars = ""
    for i, v in enumerate(values):
        # Split into "essential" ~60% and "leisure" ~40%
        essential = v * random.uniform(0.5, 0.7)
        leisure = v - essential
        total_h = (height - pad_y * 2)
        scale = total_h / (max_budget * 1.1)
        h1 = essential * scale
        h2 = leisure * scale
        bx = pad_x + i * (bar_w + gap)
        by1 = height - pad_y - h1 - h2
        by2 = by1 + h1
        bars += f'<rect x="{bx:.1f}" y="{by1:.1f}" width="{bar_w:.1f}" height="{h1:.1f}" rx="2" fill="{INK}" opacity="0.5"/>'
        bars += f'<rect x="{bx:.1f}" y="{by2:.1f}" width="{bar_w:.1f}" height="{h2:.1f}" rx="2" fill="{ACCENT}" opacity="0.7"/>'
        if i == 0 or i == n - 1:
            lx = bx + bar_w / 2
            bars += f'<text x="{lx:.1f}" y="{height - 1}" text-anchor="middle" font-size="7" fill="{INK}" opacity="0.5" font-family="sans-serif">{months[i]}</text>'

    legend = (
        f'<rect x="4" y="4" width="7" height="7" fill="{INK}" opacity="0.5"/>'
        f'<text x="14" y="11" font-size="7" fill="{INK}" opacity="0.6" font-family="sans-serif">Essential</text>'
        f'<rect x="60" y="4" width="7" height="7" fill="{ACCENT}" opacity="0.7"/>'
        f'<text x="70" y="11" font-size="7" fill="{INK}" opacity="0.6" font-family="sans-serif">Leisure</text>'
    )
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{legend}{bars}</svg>'


# ──────────────────────────────────────────────
# 6 · Shopping  →  Horizontal Bar Chart
# ──────────────────────────────────────────────
def chart_hbar(width=240, height=100):
    categories = ["Clothing", "Electronics", "Home", "Beauty", "Misc"]
    amounts = sorted([random.uniform(20, 200) for _ in categories], reverse=True)
    max_a = max(amounts) or 1
    pad_x, pad_y, gap = 60, 8, 6
    bar_h = (height - pad_y * 2 - gap * (len(categories) - 1)) / len(categories)
    bars = ""
    for i, (cat, amt) in enumerate(zip(categories, amounts)):
        bw = (amt / max_a) * (width - pad_x - 12)
        by = pad_y + i * (bar_h + gap)
        alpha = 1.0 - i * 0.12
        bars += f'<text x="{pad_x - 4}" y="{by + bar_h / 2 + 3:.1f}" text-anchor="end" font-size="8" fill="{INK}" opacity="0.7" font-family="sans-serif">{cat}</text>'
        bars += f'<rect x="{pad_x}" y="{by:.1f}" width="{bw:.1f}" height="{bar_h:.1f}" rx="2" fill="{ACCENT}" opacity="{alpha:.2f}"/>'
        bars += f'<text x="{pad_x + bw + 3:.1f}" y="{by + bar_h / 2 + 3:.1f}" font-size="7" fill="{INK}" opacity="0.6" font-family="sans-serif">₹{int(amt)}</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{bars}</svg>'


# ──────────────────────────────────────────────
# 7 · Personal Care  →  Radar / Spider Chart
# ──────────────────────────────────────────────
def chart_radar(width=240, height=100):
    axes = ["Skin", "Hair", "Dental", "Fitness", "Mental"]
    n = len(axes)
    values = [random.uniform(0.3, 1.0) for _ in axes]
    cx, cy = width / 2, height * 0.52
    max_r = min(cx, cy) - 14

    def polar(i, r):
        angle = math.pi / 2 - (2 * math.pi * i / n)
        return cx + r * math.cos(angle), cy - r * math.sin(angle)

    # Grid rings
    grid = ""
    for ring in [0.33, 0.67, 1.0]:
        pts = " ".join(f"{polar(i, max_r * ring)[0]:.1f},{polar(i, max_r * ring)[1]:.1f}" for i in range(n))
        grid += f'<polygon points="{pts}" fill="none" stroke="{INK}" stroke-width="0.5" opacity="0.15"/>'

    # Axis lines
    for i in range(n):
        ex, ey = polar(i, max_r)
        grid += f'<line x1="{cx:.1f}" y1="{cy:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{INK}" stroke-width="0.5" opacity="0.2"/>'

    # Data polygon
    data_pts = " ".join(f"{polar(i, max_r * v)[0]:.1f},{polar(i, max_r * v)[1]:.1f}" for i, v in enumerate(values))
    shape = f'<polygon points="{data_pts}" fill="{GREEN}" fill-opacity="0.25" stroke="{GREEN}" stroke-width="2"/>'

    # Labels & dots
    labels = ""
    for i, (ax, v) in enumerate(zip(axes, values)):
        lx, ly = polar(i, max_r + 10)
        labels += f'<text x="{lx:.1f}" y="{ly:.1f}" text-anchor="middle" dominant-baseline="middle" font-size="7" fill="{INK}" opacity="0.7" font-family="sans-serif">{ax}</text>'
        dx, dy = polar(i, max_r * v)
        labels += f'<circle cx="{dx:.1f}" cy="{dy:.1f}" r="3" fill="{GREEN}"/>'

    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{grid}{shape}{labels}</svg>'


# ──────────────────────────────────────────────
# Dispatch
# ──────────────────────────────────────────────
def generate_chart_svg(idx, values, months, max_budget, utilization, width=240, height=100):
    if idx == 0:
        raw = chart_bar(values, months, width, height)
    elif idx == 1:
        raw = chart_area(values, months, width, height)
    elif idx == 2:
        raw = chart_step(values, months, width, height)
    elif idx == 3:
        raw = chart_donut(utilization, width, height)
    elif idx == 4:
        raw = chart_dots(values, months, width, height)
    elif idx == 5:
        raw = chart_stacked(values, months, max_budget, width, height)
    elif idx == 6:
        raw = chart_hbar(width, height)
    elif idx == 7:
        raw = chart_radar(width, height)
    else:
        raw = chart_area(values, months, width, height)

    # Make SVG fluid: replace fixed px dimensions with 100% while keeping viewBox
    import re
    raw = re.sub(
        r'(<svg[^>]*?)(\s+width="\d+")(\s+height="\d+")(\s+viewBox="[^"]*")',
        r'\1 width="100%" height="100%"\4',
        raw
    )
    return raw


# ──────────────────────────────────────────────
# Chart type labels for frontend display
# ──────────────────────────────────────────────
CHART_LABELS = [
    "6MO BARS",
    "AREA TREND",
    "STEP SPEND",
    "UTILIZATION",
    "SPEND DOTS",
    "STACKED MIX",
    "CATEGORY SPLIT",
    "WELLNESS RADAR",
]

@router.get("/category/{category_id}")
def get_category_analytics(category_id: int):
    idx = category_id % 8
    cat_name = CATEGORIES[idx]

    max_budget = random.randint(300, 4000)
    drawn_budget = random.randint(int(max_budget * 0.2), int(max_budget * 1.1))
    budget_remaining = max_budget - drawn_budget
    if budget_remaining < 0:
        budget_remaining = 0

    receipts_scanned = random.randint(2, 30)

    utilization = drawn_budget / max_budget
    if utilization > 0.8:
        remark = f"Careful! You're above 80% utilization for {cat_name}. Slow down your pacing."
    elif utilization < 0.5:
        remark = f"Incredible pacing for {cat_name}! You're well under 50% utilization."
    else:
        remark = f"You are on track with your {cat_name} budget this month. Keep it steady."

    merchants = ["Amazon", "Uber", "Whole Foods", "Netflix", "Shell", "Pharmacy", "Target", "Local Coffee Shop"]
    recent_transactions = [
        {"merchant": random.choice(merchants), "amount": round(random.uniform(5, 120), 2)}
        for _ in range(4)
    ]

    months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]
    values = [random.uniform(max_budget * 0.4, max_budget * 1.1) for _ in range(6)]
    values[-1] = drawn_budget

    sparkline_svg = generate_chart_svg(idx, values, months, max_budget, utilization)
    chart_label = CHART_LABELS[idx]

    return {
        "id": category_id,
        "cat_name": cat_name,
        "drawn": drawn_budget,
        "max": max_budget,
        "remaining": budget_remaining,
        "receipts_scanned": receipts_scanned,
        "recent_transactions": recent_transactions,
        "remark": remark,
        "sparkline_svg": sparkline_svg,
        "chart_label": chart_label,
        "sparkline_months": months,
        "sparkline_values": [round(v, 2) for v in values],
    }
