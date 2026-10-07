# Signal Atlas

Single-page coverage portal: predicted cell signal strength from macro sites, with place and
coordinate search. Published as a Claude artifact; no server or external tile/geocoding service
is required (the artifact sandbox blocks them), so the basemap, gazetteer and site list ship
alongside the page.

| File | Purpose |
|---|---|
| `signal_atlas.template.html` | Page source (edit this). `/*LEAFLET_CSS*/` is replaced at build time. |
| `signal_atlas.html` | Built page: template with Leaflet 1.9.4 CSS inlined. |
| `basemap.json` | Natural Earth 10m provinces/states, lakes, rivers, roads, urban areas (clipped, simplified). |
| `places.json` | GeoNames populated places in Canada (pop ≥ 200 or admin seats) used for search and labels. |
| `towers.json` | `{sample, source, providers:[{key,name,bit}], towers:[[lat, lon, id, providerMask], …]}`. `providerMask` is a bitmask over `providers[].bit` (1 TELUS, 2 Bell, 4 Rogers; 3 = TELUS/Bell shared site). **Currently synthetic sample sites and assignments.** |
| `prep_data.py` | Rebuilds the three data files from Natural Earth / GeoNames downloads. |

## Replacing the sample sites with the real export

```python
import pandas as pd, json
df = pd.read_csv("Site_Data_Extract_FX.csv")
BITS = {"TELUS": 1, "Bell": 2, "Rogers": 4}            # adjust to the export's operator labels
df["bit"] = df["operator"].map(BITS).fillna(0).astype(int)
pts = df.dropna(subset=["latitude", "longitude"]).groupby(["latitude", "longitude"])["bit"].agg(lambda s: int(s.sum()) if len(set(s)) == len(s) else int(sum(set(s))))
towers = [[round(lat, 5), round(lon, 5), i + 1, int(mask) or 1] for i, ((lat, lon), mask) in enumerate(pts.items())]
json.dump({"sample": False, "source": "Site_Data_Extract_FX",
           "providers": [{"key": "telus", "name": "TELUS", "bit": 1}, {"key": "bell", "name": "Bell", "bit": 2}, {"key": "rogers", "name": "Rogers", "bit": 4}],
           "towers": towers}, open("towers.json", "w"), separators=(",", ":"))
```

Republish `signal_atlas.html` with the new `towers.json`; the sample-data banner disappears
when `sample` is false.

## Providers

The header toggle switches the coverage raster, site markers and network KPIs between
TELUS, Bell, Rogers and all sites. The location inspector always compares the best server and
predicted level for every provider at the selected point. Sites shared by several operators
(e.g. TELUS/Bell RAN sharing) carry more than one bit and count for each.

## Model

Received level = EIRP − max(FSPL, Hata). Okumura-Hata (small/medium city mobile correction)
up to 1500 MHz, COST-231 Hata above; urban / suburban / rural corrections; flat terrain.
Nearest site is assumed to serve. Bands: ≥ −80 Excellent, −90 Good, −100 Fair, −110 Weak,
−120 Marginal, below that or beyond the serving range = no service. The "site pairs within
range" figure reproduces the cKDTree 20 km pair analysis from the earlier propagation script.
