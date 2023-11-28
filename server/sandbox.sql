
// прочее
UPDATE "Banks"
SET expiry = '09/30'
WHERE name = 'yriy';

// 9 task - подсчет всех юзеров по ролям
SELECT role, COUNT(*) 
FROM "Users"
GROUP BY role;

// 10 task - апдейт баланса кастомеров на +10%
UPDATE "Users"
SET "balance" = "balance" + ("balance" * 0.1 * COALESCE((
  SELECT COUNT(*)
  FROM "Contests"
  WHERE "userId" = "Users"."id" AND "createdAt" BETWEEN '2023-11-01' AND '2024-01-14'
), 0))
WHERE "role" = 'customer';