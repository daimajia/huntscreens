ProductHunt Views

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