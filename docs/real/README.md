# Документація API проєкту управління

## Зміст
1. [Загальна інформація](#загальна-інформація)
2. [Налаштування проєкту](#налаштування-проєкту)
3. [Структура проєкту](#структура-проєкту)
4. [Основні модулі](#основні-модулі)
   - [Користувачі (Users)](#користувачі-users)
   - [Ролі (Roles)](#ролі-roles)
   - [Дозволи (Permissions)](#дозволи-permissions)
   - [Проєкти (Projects)](#проєкти-projects)
   - [Завдання (Tasks)](#завдання-tasks)
   - [Повідомлення (Messages)](#повідомлення-messages)
   - [Звіти (Reports)](#звіти-reports)
5. [Зв'язки між сутностями](#зв'язки-між-сутностями)
   - [Користувач-Роль (User-Role)](#користувач-роль-user-role)
   - [Роль-Дозвіл (Role-Permission)](#роль-дозвіл-role-permission)
   - [Проєкт-Учасник (Project-Member)](#проєкт-учасник-project-member)
   - [Завдання-Виконавець (Task-Assignment)](#завдання-виконавець-task-assignment)
6. [API Endpoints](#api-endpoints)
7. [Приклади запитів](#приклади-запитів)
8. [Помилки та обробка винятків](#помилки-та-обробка-винятків)
9. [База даних](#база-даних)

## Загальна інформація

Цей проєкт представляє собою RESTful API для системи управління проєктами та завданнями. Основними функціональними можливостями є:

- Управління користувачами та авторизацією
- Управління ролями та дозволами
- Створення та редагування проєктів
- Створення та призначення завдань
- Обмін повідомленнями
- Генерація звітів

API розроблено з використанням Node.js та Express.js з PostgreSQL як системою управління базами даних.

## Налаштування проєкту

### Вимоги
- Node.js (версія 12.0.0 або вище)
- PostgreSQL (версія 10 або вище)

### Установка

1. Клонуйте репозиторій:
```bash
git clone https://github.com/username/project-management-api.git
cd project-management-api
```

2. Встановіть залежності:
```bash
npm install
```

3. Створіть файл `.env` у кореневій директорії з такими змінними оточення:
```
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=project_management
```

4. Запустіть сервер:
```bash
npm start
```

Сервер за замовчуванням запускається на порту 8080.

## Структура проєкту

```
project-management-api/
├── db/
│   └── index.js       # Налаштування підключення до бази даних
├── models/           # Моделі даних
├── dao/              # Шар доступу до даних (Data Access Objects)
├── routes/           # Маршрути API
├── app.js            # Основний файл додатку
├── index.js          # Точка входу
└── package.json      # Залежності та скрипти
```

## Основні модулі

### Користувачі (Users)

Модуль керування користувачами системи.

**Властивості:**
- id: унікальний ідентифікатор
- email: електронна адреса (унікальна)
- password_hash: хеш паролю
- first_name: ім'я
- last_name: прізвище
- registration_date: дата реєстрації
- last_login: дата останнього входу в систему
- is_active: статус активності

**Операції:**
- Створення користувача
- Отримання інформації про користувача
- Оновлення даних користувача
- Видалення користувача
- Отримання списку всіх користувачів

### Ролі (Roles)

Модуль для визначення ролей користувачів у системі.

**Властивості:**
- id: унікальний ідентифікатор
- name: назва ролі
- description: опис ролі
- is_system: системна роль (не може бути видалена)

**Операції:**
- Створення ролі
- Отримання інформації про роль
- Оновлення даних ролі
- Видалення ролі
- Отримання списку всіх ролей

### Дозволи (Permissions)

Модуль для керування дозволами у системі.

**Властивості:**
- id: унікальний ідентифікатор
- code: код дозволу (унікальний)
- description: опис дозволу
- module: модуль системи, до якого відноситься дозвіл

**Операції:**
- Створення дозволу
- Отримання інформації про дозвіл
- Оновлення даних дозволу
- Видалення дозволу
- Отримання списку всіх дозволів

### Проєкти (Projects)

Модуль для керування проєктами.

**Властивості:**
- id: унікальний ідентифікатор
- title: назва проєкту
- description: опис проєкту
- start_date: дата початку
- deadline: дедлайн
- status: статус проєкту
- owner_id: ідентифікатор власника

**Операції:**
- Створення проєкту
- Отримання інформації про проєкт
- Оновлення даних проєкту
- Видалення проєкту
- Отримання списку всіх проєктів

### Завдання (Tasks)

Модуль для керування завданнями в межах проєктів.

**Властивості:**
- id: унікальний ідентифікатор
- title: назва завдання
- description: опис завдання
- priority: пріоритет
- status: статус завдання
- created_at: дата створення
- updated_at: дата оновлення
- project_id: ідентифікатор проєкту

**Операції:**
- Створення завдання
- Отримання інформації про завдання
- Оновлення даних завдання
- Видалення завдання
- Отримання списку всіх завдань

### Повідомлення (Messages)

Модуль для обміну повідомленнями між користувачами.

**Властивості:**
- id: унікальний ідентифікатор
- content: зміст повідомлення
- sent_at: дата відправлення
- is_read: статус прочитання
- sender_id: ідентифікатор відправника
- recipient_id: ідентифікатор отримувача

**Операції:**
- Створення повідомлення
- Отримання інформації про повідомлення
- Оновлення статусу повідомлення
- Видалення повідомлення
- Отримання списку всіх повідомлень

### Звіти (Reports)

Модуль для керування звітами.

**Властивості:**
- id: унікальний ідентифікатор
- generated_at: дата генерації
- period_start: початок періоду
- period_end: кінець періоду
- format: формат звіту
- content_hash: хеш вмісту
- file_path: шлях до файлу
- author_id: ідентифікатор автора

**Операції:**
- Створення звіту
- Отримання інформації про звіт
- Оновлення даних звіту
- Видалення звіту
- Отримання списку всіх звітів

## Зв'язки між сутностями

### Користувач-Роль (User-Role)

Зв'язок між користувачами та ролями.

**Властивості:**
- user_id: ідентифікатор користувача
- role_id: ідентифікатор ролі
- assigned_at: дата призначення
- assigned_by: ідентифікатор користувача, який призначив роль

**Операції:**
- Призначення ролі користувачу
- Скасування ролі у користувача
- Отримання ролей користувача

### Роль-Дозвіл (Role-Permission)

Зв'язок між ролями та дозволами.

**Властивості:**
- role_id: ідентифікатор ролі
- permission_id: ідентифікатор дозволу
- granted_at: дата надання
- granted_by: ідентифікатор користувача, який надав дозвіл

**Операції:**
- Надання дозволу ролі
- Скасування дозволу у ролі
- Отримання дозволів ролі

### Проєкт-Учасник (Project-Member)

Зв'язок між проєктами та їх учасниками.

**Властивості:**
- project_id: ідентифікатор проєкту
- user_id: ідентифікатор користувача
- joined_at: дата приєднання
- role: роль у проєкті
- assigned_by: ідентифікатор користувача, який додав учасника

**Операції:**
- Додавання учасника до проєкту
- Видалення учасника з проєкту
- Отримання учасників проєкту

### Завдання-Виконавець (Task-Assignment)

Зв'язок між завданнями та їх виконавцями.

**Властивості:**
- task_id: ідентифікатор завдання
- user_id: ідентифікатор виконавця
- assigned_at: дата призначення
- assigned_by: ідентифікатор користувача, який призначив завдання
- deadline: дедлайн виконання

**Операції:**
- Призначення завдання виконавцю
- Скасування призначення
- Отримання призначень для завдання

## API Endpoints

### Користувачі (Users)

| Метод | URL               | Опис                                  |
|-------|-------------------|---------------------------------------|
| GET   | /users            | Отримати список усіх користувачів     |
| GET   | /users/:id        | Отримати дані користувача за ID       |
| POST  | /users            | Створити нового користувача           |
| PUT   | /users/:id        | Оновити дані користувача              |
| DELETE| /users/:id        | Видалити користувача                  |

### Ролі (Roles)

| Метод | URL               | Опис                                  |
|-------|-------------------|---------------------------------------|
| GET   | /roles            | Отримати список усіх ролей            |
| GET   | /roles/:id        | Отримати дані ролі за ID             |
| POST  | /roles            | Створити нову роль                    |
| PUT   | /roles/:id        | Оновити дані ролі                     |
| DELETE| /roles/:id        | Видалити роль                         |

### Дозволи (Permissions)

| Метод | URL               | Опис                                  |
|-------|-------------------|---------------------------------------|
| GET   | /permissions      | Отримати список усіх дозволів         |
| GET   | /permissions/:id  | Отримати дані дозволу за ID          |
| POST  | /permissions      | Створити новий дозвіл                 |
| PUT   | /permissions/:id  | Оновити дані дозволу                  |
| DELETE| /permissions/:id  | Видалити дозвіл                       |

### Проєкти (Projects)

| Метод | URL               | Опис                                  |
|-------|-------------------|---------------------------------------|
| GET   | /projects         | Отримати список усіх проєктів         |
| GET   | /projects/:id     | Отримати дані проєкту за ID          |
| POST  | /projects         | Створити новий проєкт                 |
| PUT   | /projects/:id     | Оновити дані проєкту                  |
| DELETE| /projects/:id     | Видалити проєкт                       |

### Завдання (Tasks)

| Метод | URL               | Опис                                  |
|-------|-------------------|---------------------------------------|
| GET   | /tasks            | Отримати список усіх завдань          |
| GET   | /tasks/:id        | Отримати дані завдання за ID         |
| POST  | /tasks            | Створити нове завдання                |
| PUT   | /tasks/:id        | Оновити дані завдання                 |
| DELETE| /tasks/:id        | Видалити завдання                     |

### Повідомлення (Messages)

| Метод | URL               | Опис                                  |
|-------|-------------------|---------------------------------------|
| GET   | /messages         | Отримати список усіх повідомлень      |
| GET   | /messages/:id     | Отримати дані повідомлення за ID     |
| POST  | /messages         | Створити нове повідомлення            |
| PUT   | /messages/:id     | Оновити дані повідомлення             |
| DELETE| /messages/:id     | Видалити повідомлення                 |

### Звіти (Reports)

| Метод | URL               | Опис                                  |
|-------|-------------------|---------------------------------------|
| GET   | /reports          | Отримати список усіх звітів           |
| GET   | /reports/:id      | Отримати дані звіту за ID            |
| POST  | /reports          | Створити новий звіт                   |
| PUT   | /reports/:id      | Оновити дані звіту                    |
| DELETE| /reports/:id      | Видалити звіт                         |

### Користувач-Роль (User-Role)

| Метод | URL                   | Опис                                  |
|-------|-----------------------|---------------------------------------|
| GET   | /user_roles/:user_id | Отримати ролі користувача             |
| POST  | /user_roles           | Призначити роль користувачу           |
| DELETE| /user_roles           | Скасувати роль у користувача          |

### Роль-Дозвіл (Role-Permission)

| Метод | URL                      | Опис                                  |
|-------|--------------------------|---------------------------------------|
| GET   | /role_permissions/:role_id | Отримати дозволи ролі                |
| POST  | /role_permissions        | Надати дозвіл ролі                    |
| DELETE| /role_permissions        | Скасувати дозвіл у ролі               |

### Проєкт-Учасник (Project-Member)

| Метод | URL                         | Опис                                  |
|-------|-----------------------------|---------------------------------------|
| GET   | /project_members/:project_id | Отримати учасників проєкту           |
| POST  | /project_members            | Додати учасника до проєкту            |
| DELETE| /project_members            | Видалити учасника з проєкту           |

### Завдання-Виконавець (Task-Assignment)

| Метод | URL                          | Опис                                   |
|-------|------------------------------|----------------------------------------|
| GET   | /task_assignments/:task_id   | Отримати призначення завдання          |
| POST  | /task_assignments            | Призначити завдання виконавцю          |
| DELETE| /task_assignments            | Скасувати призначення завдання         |

## Приклади запитів

### Створення користувача

**Запит:**
```http
POST /users HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "email": "user@example.com",
  "password_hash": "hashed_password_here",
  "first_name": "Іван",
  "last_name": "Петренко",
  "is_active": true
}
```

**Відповідь:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Іван",
  "last_name": "Петренко",
  "registration_date": "2023-01-20T12:34:56.789Z",
  "last_login": null,
  "is_active": true
}
```

### Створення проєкту

**Запит:**
```http
POST /projects HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "title": "Проєкт модернізації",
  "description": "Оновлення системи управління",
  "start_date": "2023-02-01",
  "deadline": "2023-05-01",
  "status": "active",
  "owner_id": 1
}
```

**Відповідь:**
```json
{
  "id": 1,
  "title": "Проєкт модернізації",
  "description": "Оновлення системи управління",
  "start_date": "2023-02-01",
  "deadline": "2023-05-01",
  "status": "active",
  "owner_id": 1
}
```

### Призначення ролі користувачу

**Запит:**
```http
POST /user_roles HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "user_id": 1,
  "role_id": 2,
  "assigned_by": 3
}
```

**Відповідь:**
```json
{
  "user_id": 1,
  "role_id": 2,
  "assigned_at": "2023-01-21T10:15:30.123Z",
  "assigned_by": 3
}
```

## Помилки та обробка винятків

API повертає відповіді з відповідними HTTP-кодами статусу:

| Код статусу | Опис                                   |
|-------------|----------------------------------------|
| 200         | OK - Запит успішно виконано            |
| 201         | Created - Ресурс успішно створено      |
| 400         | Bad Request - Некоректний запит        |
| 404         | Not Found - Ресурс не знайдено         |
| 409         | Conflict - Конфлікт (вже існує)        |
| 500         | Internal Server Error - Внутрішня помилка |

Приклад помилки:
```json
{
  "error": "User not found"
}
```

## База даних

### Схема бази даних

База даних PostgreSQL містить такі таблиці:

1. **users** - Користувачі системи
2. **roles** - Ролі користувачів
3. **permissions** - Дозволи в системі
4. **projects** - Проєкти
5. **tasks** - Завдання
6. **messages** - Повідомлення
7. **reports** - Звіти
8. **user_roles** - Зв'язок між користувачами та ролями
9. **role_permissions** - Зв'язок між ролями та дозволами
10. **project_members** - Зв'язок між проєктами та учасниками
11. **task_assignments** - Зв'язок між завданнями та виконавцями

### Приклад SQL-запитів для створення таблиць

```sql
-- Таблиця користувачів
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Таблиця ролей
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE
);

-- Таблиця дозволів
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  module VARCHAR(100) NOT NULL
);

-- Таблиця проєктів
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  deadline DATE,
  status VARCHAR(50) NOT NULL,
  owner_id INTEGER REFERENCES users(id)
);

-- Таблиця завдань
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50),
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  project_id INTEGER REFERENCES projects(id)
);

-- Таблиця повідомлень
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  sender_id INTEGER REFERENCES users(id),
  recipient_id INTEGER REFERENCES users(id)
);

-- Таблиця звітів
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  period_start DATE,
  period_end DATE,
  format VARCHAR(50),
  content_hash VARCHAR(255),
  file_path VARCHAR(255),
  author_id INTEGER REFERENCES users(id)
);

-- Таблиця зв'язків користувачів і ролей
CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id),
  role_id INTEGER REFERENCES roles(id),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INTEGER REFERENCES users(id),
  PRIMARY KEY (user_id, role_id)
);

-- Таблиця зв'язків ролей і дозволів
CREATE TABLE role_permissions (
  role_id INTEGER REFERENCES roles(id),
  permission_id INTEGER REFERENCES permissions(id),
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  granted_by INTEGER REFERENCES users(id),
  PRIMARY KEY (role_id, permission_id)
);

-- Таблиця учасників проєктів
CREATE TABLE project_members (
  project_id INTEGER REFERENCES projects(id),
  user_id INTEGER REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(100),
  assigned_by INTEGER REFERENCES users(id),
  PRIMARY KEY (project_id, user_id)
);

-- Таблиця призначень завдань
CREATE TABLE task_assignments (
  task_id INTEGER REFERENCES tasks(id),
  user_id INTEGER REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INTEGER REFERENCES users(id),
  deadline DATE,
  PRIMARY KEY (task_id, user_id)
);
```