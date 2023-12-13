
# Проект Squadhelp

Squadhelp - биржа по созданию названия, слогана и логотипа для Вашей новой компании/сайта/проекта. Проект использует PostgreSQL в качестве базы данных (ранее часть функционала, а именно - чаты, хранились в MongoDB).

Пользователь с ролью Заказчика (`Customer`) может выбрать услугу по созданию необходимого контента (`Contest`) и оплатить ее, а с ролью Создателя (`Creator`) - предложить вариант контента (`Offer`), согласно техническому заданию Заказчика.

Заказчик сможет увидеть преложенный вариант контента только после того, как пользователь с ролью модератора (`Moder`) проверит и утвердит ее. Сообщение об утверждении или отказе будет отправлено на электронную почту Заказчика.


# Запуск проекта

Склонируйте проект

```bash
  git clone https://github.com/shvetsm123/exam
```

Перейдите в директорию проекта

```bash
  cd exam
```

В корневой папке выполните команду по установке проекта

```bash
  docker compose --file ./docker-compose-dev.yaml up --build
```

Перейдите на локальный адрес для открытия проекта в браузере 

```bash
  http://localhost:5000/
```
# Конфиг PostgreSQL

Настройки по подключению БД находятся в `server/src/config/postgresConfig.json`.



# Задания проекта

- Bugs fix
- Layout
- React Events and Timers
- React Button Group
- DB No-SQL MongoDB
- DB SQL Migration
- DB SQL SQL queries
- Node.js Logger
- Full Stack Create Moderator role
- Full Stack Chats from MongoBD to Sequelize

## Bugs fix

Выполнено исправление всех багов, ошибки и предупреждения убраны.

## Layout

Выполнена верстка страницы How It Works. 

Страница помещена в выпадающий список навигации главного меню `CONTESTS/HOW IT WORKS`, а также доступна по ссылке `http://localhost:5000/how-it-works`.

Исходный код - `/client/http-task`

## React Events and Timers

Выполнена реализация страницы Events и таймера с напоминаниями.

Страница помещена в выпадающий список навигации главного меню `Blog/EVENTS`, а также доступна по ссылке `http://localhost:5000/events`.

Исходный код - `/client/src/pages/Events`.

## React Button Group

Выполнена верстка компонента Button Group.

Компонент помещен в конец страницы `START CONTEST` по адресу `http://localhost:5000/startContest`.

Исходный код - `/client/src/components/ButtonGroup`.

## DB No-SQL MongoDB

С помощью агрегационной функции выполнен поиск и подсчет записей в коллекции `Messages`, которые содержат слово `Паровоз`.

Исходный код - `/server/nosql.js`.

## DB SQL Migration

Выполнена разработка структуры БД с использованием SQL-запросов, а также добавлен скриншот со схемой БД. 

Исходный код - `/server/sandbox.js`.

Скриншот - `/server/task8.png`.


## DB SQL Migration

Выполнены запросы/изменения в БД с использованием SQL-запросов.

Исходный код - `/server/sandbox.js`.

## Node.js Logger

Выполнены логгер ошибок на сервере, а также перезапись всех текущих ошибок в новый файл и очистка старого файла.

Исходный код - `/server/src/errorLogger.js`.

Добавлен функционал в `/server/src/index.js`.

## Full Stack Create Moderator role

Выполнено добавление роли `MODER` и статуса `ModerStatus` с помощью миграций, реализации `ModerStatus` при создании `Offer`, создание `ModerPanel`, а также отправки электронного письма при смене `ModerStatus`.

Присвоить роль модератора - `UPDATE "Users"
SET role = 'moder'
WHERE id = <id_number>;`

## Full Stack Chats from MongoBD to Sequelize

Выполнен переход чатов с MongoDB на Sequelize с помощью моделей и миграций, изменен `chatController` и внесены изменения на клиент, касающиеся чатов.

Исходный код - `/server/src/controllers/chatController.js`.
