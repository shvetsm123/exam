
// прочее
UPDATE "Banks"
SET expiry = '09/30'
WHERE name = 'yriy';

// 9 task - подсчет всех юзеров по ролям
SELECT role, COUNT(*) 
FROM "Users"
GROUP BY role;

