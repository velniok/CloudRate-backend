# CloudRate (Backend)

Веб-приложение для оценки музыки российских SoundCloud артистов (https://soundcloud.com).

## Используемый стак технологий:

  - Frontend: HTML, SCSS, JavaScript, React + Vite, Redux, axios;
  - Backend: JavaScript, Node.js, express, mongoose (MongoDB).

## В веб приложении реализовано:

  - Система авторизации с JWT токенами;
  - Панель администратора с CRUD-операциями для управления артистами, треками;
  - Безопасность: JWT-аутентификация, хеширование паролей (bcrypt), middleware для проверки ролей;
  - Оценка треков по 5 критериям и краткая статистика трека по ним;

Веб-приложение разрабатывается только мной и находится в стадии разработки и имеет недоработки, баги и т.д., которые будут исправляться в будушем как и дополнительный функционал сайта.

Деплой проекта: https://cloud-rate-frontend.vercel.app

Frontend проекта: https://github.com/velniok/CloudRate-frontend

