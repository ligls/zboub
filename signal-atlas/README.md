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
| `towers.json` | `{sample, source, towers:[[lat, lon, id], …]}`. **Currently synthetic sample sites.** |
| `prep_data.py` | Rebuilds the three data files from Natural Earth / GeoNames downloads. |

## Replacing the sample sites with the real export

```python
import pandas as pd, json
df = pd.read_csv("Site_Data_Extract_FX.csv")
pts = df[["latitude", "longitude"]].dropna().drop_duplicates().reset_index(drop=True)
towers = [[round(a, 5), round(b, 5), i + 1] for i, (a, b) in enumerate(zip(pts.latitude, pts.longitude))]
json.dump({"sample": False, "source": "Site_Data_Extract_FX", "towers": towers},
          open("towers.json", "w"), separators=(",", ":"))
```

Republish `signal_atlas.html` with the new `towers.json`; the sample-data banner disappears
when `sample` is false.

## Model

Received level = EIRP − max(FSPL, Hata). Okumura-Hata (small/medium city mobile correction)
up to 1500 MHz, COST-231 Hata above; urban / suburban / rural corrections; flat terrain.
Nearest site is assumed to serve. Bands: ≥ −80 Excellent, −90 Good, −100 Fair, −110 Weak,
−120 Marginal, below that or beyond the serving range = no service. The "site pairs within
range" figure reproduces the cKDTree 20 km pair analysis from the earlier propagation script.
