### ProductHunt Views

```sql

CREATE VIEW sortedphbytime AS
SELECT
  ROW_NUMBER() OVER w AS row_no,
  LAG(id) OVER w AS prev,
  LEAD(id) OVER w AS next,
  id,
  added_at,
  tags,
  "votesCount"
FROM
  producthunt
WHERE
  webp = true
WINDOW w AS (ORDER BY DATE(added_at) DESC, "votesCount" desc);

```

```sql

CREATE VIEW sortedphbyvote AS
SELECT
  ROW_NUMBER() OVER w AS row_no,
  LAG(id) OVER w AS prev,
  LEAD(id) OVER w AS next,
  id,
  added_at,
  tags,
  "votesCount"
FROM
  producthunt
WHERE
  webp = true
WINDOW w AS (ORDER BY "votesCount" DESC);

```

### YC Views

```sql

CREATE VIEW sorted_yc_by_launchedat AS
SELECT
  ROW_NUMBER() OVER w AS row_no,
  LAG(id) OVER w AS prev,
  LEAD(id) OVER w AS next,
  id,
  stage,
  status,
  team_size,
  launched_at
FROM
  yc
WHERE
  webp = true
WINDOW w AS (ORDER BY launched_at DESC, id DESC);

```

```sql

CREATE VIEW sorted_yc_by_teamsize AS
SELECT
  ROW_NUMBER() OVER w AS row_no,
  LAG(id) OVER w AS prev,
  LEAD(id) OVER w AS next,
  id,
  stage,
  status,
  team_size,
  launched_at,
  name
FROM
  yc
WHERE
  webp = true and team_size >= 0
WINDOW w AS (ORDER BY team_size DESC, id DESC);


```

### Indiehackers Views


```sql

CREATE VIEW sorted_indiehackers_by_revenue AS
SELECT
  ROW_NUMBER() OVER w AS row_no,
  LAG(id) OVER w AS prev,
  LEAD(id) OVER w AS next,
  id,
  name,
  revenue,
  added_at
FROM
  indiehackers
WHERE
  webp = true
WINDOW w AS (ORDER BY revenue DESC);

```

```sql

CREATE VIEW sorted_indiehackers_by_addedat AS
SELECT
  ROW_NUMBER() OVER w AS row_no,
  LAG(id) OVER w AS prev,
  LEAD(id) OVER w AS next,
  id,
  name,
  revenue,
  added_at
FROM
  indiehackers
WHERE
  webp = true
WINDOW w AS (ORDER BY added_at DESC);

```
