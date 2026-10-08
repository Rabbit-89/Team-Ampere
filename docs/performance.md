# Matning

| Ändring        | LCP dashboard (median) | CLS dashboard | JS inloggningssidan (gzip) | JS dashboarden (gzip) |
| -------------- | ---------------------- | ------------- | -------------------------- | --------------------- |
| Före           | 9.1 s                  | 0.03 s        | 141.31 KB                  | 141.31 KB             |
| 1. Hero bild   | 1.12 s                 |               |                            |                       |
| 2. lazy routes |                        |               | 40.11 KB                   | 100.07 KB             |
| 3. Lodash      |                        |               | 40.12 KB                   | 72.84 KB              |
| 4. chart.js    | 0.96 s                 | 0.02          | 40.12 KB                   | 51.67 KB KB           |
