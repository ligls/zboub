#!/usr/bin/env python3
"""Build the embedded basemap, gazetteer and (sample) tower data for the coverage portal."""
import json, math, random, sys, csv
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union

DL = "/tmp/claude-0/-home-user-zboub/574bd812-38df-5a71-b09d-9cb974f8f3f2/scratchpad/dl"
OUT = "/tmp/claude-0/-home-user-zboub/574bd812-38df-5a71-b09d-9cb974f8f3f2/scratchpad/portal"
import os; os.makedirs(OUT, exist_ok=True)

BBOX = box(-142, 41, -52, 84)          # Canada + northern US context
PREC = 4

def rnd(coords):
    return [round(c, PREC) for c in coords]

def geom_to_compact(geom, tol):
    g = geom.intersection(BBOX)
    if g.is_empty:
        return None
    g = g.simplify(tol, preserve_topology=True)
    if g.is_empty:
        return None
    return json.loads(json.dumps(mapping(g)), parse_float=lambda s: round(float(s), PREC))

def load(name):
    with open(f"{DL}/{name}") as f:
        return json.load(f)

basemap = {"admin1": [], "countries": [], "lakes": [], "rivers": [], "roads": [], "urban": [], "labels": []}

# --- admin-1 (provinces/states) -------------------------------------------------
a1 = load("ne_10m_admin_1_states_provinces_lakes.geojson")
for f in a1["features"]:
    p = f["properties"]
    if p.get("adm0_a3") not in ("CAN", "USA"):
        continue
    g = shape(f["geometry"])
    c = geom_to_compact(g, 0.004 if p["adm0_a3"] == "CAN" else 0.01)
    if not c:
        continue
    basemap["admin1"].append({"n": p.get("name"), "a": p.get("postal"), "c": p["adm0_a3"], "g": c})
    if p["adm0_a3"] == "CAN" and p.get("latitude") and p.get("longitude"):
        basemap["labels"].append({"n": p["name"], "lat": round(p["latitude"], 2), "lon": round(p["longitude"], 2), "k": "prov"})

# --- countries (coarse context beyond admin1, e.g. Greenland) -------------------
a0 = load("ne_50m_admin_0_countries.geojson")
for f in a0["features"]:
    p = f["properties"]
    if p.get("ADM0_A3") in ("CAN", "USA"):
        continue
    g = shape(f["geometry"])
    c = geom_to_compact(g, 0.02)
    if c:
        basemap["countries"].append({"n": p.get("NAME"), "g": c})

# --- lakes -------------------------------------------------------------------------
lk = load("ne_10m_lakes.geojson")
for f in lk["features"]:
    p = f["properties"]
    if p.get("scalerank", 99) > 7:
        continue
    g = shape(f["geometry"])
    c = geom_to_compact(g, 0.004)
    if c:
        basemap["lakes"].append({"n": p.get("name"), "s": p.get("scalerank"), "g": c})

# --- rivers ------------------------------------------------------------------------
rv = load("ne_10m_rivers_lake_centerlines.geojson")
for f in rv["features"]:
    p = f["properties"]
    if p.get("scalerank", 99) > 6:
        continue
    g = shape(f["geometry"])
    c = geom_to_compact(g, 0.006)
    if c:
        basemap["rivers"].append({"n": p.get("name"), "s": p.get("scalerank"), "g": c})

# --- roads -------------------------------------------------------------------------
rd = load("ne_10m_roads.geojson")
for f in rd["features"]:
    p = f["properties"]
    if p.get("scalerank", 99) > 8:
        continue
    g = shape(f["geometry"])
    if not g.intersects(BBOX):
        continue
    c = geom_to_compact(g, 0.004)
    if c:
        basemap["roads"].append({"t": p.get("type"), "s": p.get("scalerank"), "n": p.get("name"), "g": c})

# --- urban areas -------------------------------------------------------------------
ua = load("ne_10m_urban_areas.geojson")
for f in ua["features"]:
    g = shape(f["geometry"])
    if not g.intersects(BBOX):
        continue
    c = geom_to_compact(g, 0.003)
    if c:
        basemap["urban"].append({"g": c})

for k, v in basemap.items():
    print(k, len(v))
with open(f"{OUT}/basemap.json", "w") as f:
    json.dump(basemap, f, separators=(",", ":"))
print("basemap.json", os.path.getsize(f"{OUT}/basemap.json") / 1e6, "MB")

# --- gazetteer from GeoNames CA ----------------------------------------------------
ADMIN1 = {"01": "AB", "02": "BC", "03": "MB", "04": "NB", "05": "NL", "07": "NS", "08": "ON",
          "09": "PE", "10": "QC", "11": "SK", "12": "YT", "13": "NT", "14": "NU"}
places = []
with open(f"{DL}/CA.txt", encoding="utf-8") as f:
    for row in csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE):
        fclass, fcode = row[6], row[7]
        if fclass != "P":
            continue
        pop = int(row[14] or 0)
        if pop < 200 and fcode not in ("PPLA", "PPLA2", "PPLC"):
            continue
        places.append({"n": row[1], "a": ADMIN1.get(row[10], ""), "lat": round(float(row[4]), 4),
                       "lon": round(float(row[5]), 4), "p": pop})
places.sort(key=lambda d: -d["p"])
print("places", len(places))
with open(f"{OUT}/places.json", "w") as f:
    json.dump(places, f, separators=(",", ":"), ensure_ascii=False)
print("places.json", os.path.getsize(f"{OUT}/places.json") / 1e6, "MB")

# --- SAMPLE towers (placeholder until the real Site_Data_Extract CSV is re-uploaded) ----
random.seed(42)
towers = []
tid = 1
for pl in places:
    pop = pl["p"]
    if pop <= 0:
        continue
    # roughly one macro site per ~1,800 people in cities, at least 1 per listed town
    n = max(1, int(round(pop / 1800)))
    n = min(n, 900)
    # city radius grows with population (km)
    radius = min(28, 1.2 + math.sqrt(pop) / 45)
    for _ in range(n):
        r = radius * math.sqrt(random.random())
        th = random.random() * 2 * math.pi
        dlat = (r * math.cos(th)) / 111.32
        dlon = (r * math.sin(th)) / (111.32 * math.cos(math.radians(pl["lat"])))
        towers.append([round(pl["lat"] + dlat, 5), round(pl["lon"] + dlon, 5), tid])
        tid += 1
print("sample towers", len(towers))
with open(f"{OUT}/towers.json", "w") as f:
    json.dump({"sample": True, "source": "Synthetic sample sites generated around GeoNames populated places. Replace with Site_Data_Extract_FX export.",
               "towers": towers}, f, separators=(",", ":"))
print("towers.json", os.path.getsize(f"{OUT}/towers.json") / 1e6, "MB")
