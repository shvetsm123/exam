// прочее
UPDATE "Banks"
SET expiry = '09/30'
WHERE name = 'yriy';

// 8 task - перепись чата с mongo на sql + схема /server/8task.png

// 8.1 Добавление связей в User
ALTER TABLE "User" 
FOREIGN KEY (id) REFERENCES "Catalog" (userId);
FOREIGN KEY (id) REFERENCES "Message" (sender);

// 8.2 Создание каталога и чатов внутри каждого каталога
CREATE TABLE "Catalogs" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "catalogName" VARCHAR(255) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users"(id)
);
DROP TABLE "Catalogs";

// 8.3 Создание чатов внутри каждого каталога
CREATE TABLE "CatalogChats" (
  id SERIAL PRIMARY KEY,
  "catalogId" INTEGER NOT NULL,
  "conversationId" UUID NOT NULL,
  FOREIGN KEY ("catalogId") REFERENCES "Catalogs"(id),
  FOREIGN KEY ("conversationId") REFERENCES "Conversations"(id)
);
DROP TABLE "CatalogChats";

// 8.4.1 Для uuid_generate_v4
CREATE EXTENSION "uuid-ossp"; 
// 8.4.2 Создание конверсейшн
CREATE TABLE "Conversations" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participants INTEGER[] NOT NULL,
  "blackList" BOOLEAN[] NOT NULL,
  "favoriteList" BOOLEAN[] NOT NULL
);
DROP TABLE "Conversations";

// 8.5 Создание мессейджей
CREATE TABLE "Messages" (
  id SERIAL PRIMARY KEY,
  sender INTEGER NOT NULL,
  body TEXT NOT NULL,
  "conversationId" UUID NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender) REFERENCES "Users"(id),
  FOREIGN KEY ("conversationId") REFERENCES "Conversations"(id)
);
DROP TABLE "Messages";

// 9 task - подсчет всех юзеров по ролям
SELECT role, COUNT(*) 
FROM "Users"
GROUP BY role;

// 10 task - апдейт баланса кастомеров на +10%
UPDATE "Users"
SET "balance" = "balance" + COALESCE(
  (
    SELECT SUM("prize") * 0.1
    FROM "Contests"
    WHERE "userId" = "Users"."id" AND "createdAt" BETWEEN '2023-11-01' AND '2024-01-14' AND "status" = 'finished'
  ),
  0
)
WHERE "role" = 'customer';

// 11 task - апдейт баланса топ 3 креатора на +10$
UPDATE "Users"
SET "balance" = "balance" + 10
WHERE "role" = 'creator'
AND "id" IN (
    SELECT "id"
    FROM "Users"
    WHERE "role" = 'creator'
    ORDER BY "rating" DESC
    LIMIT 3
);

