# Yotto Glass Website

Современный React/Vite сайт для `yotto.uz` с:

- glassmorphism-интерфейсом в стиле iOS
- языками `RU` / `UZ`
- полным каталогом блюд + официальными menu board изображениями
- единой формой для `reservation`, `delivery` и `pickup`
- отдельной скрытой admin-панелью со списком заказов и сменой статусов
- demo-режимом без Firebase

## Запуск

```bash
npm install
npm run dev
```

Для production:

```bash
npm run build
```

## Deploy

Сайт теперь использует чистые URL без `#` и без `.html`:

- `/`
- `/branches`
- `/menu`
- `/reservation`
- `/gallery`

Для `Vercel` добавлен `vercel.json` с rewrite на `index.html`.

Для `GitHub Pages` добавлен `public/404.html`, чтобы прямой вход и обновление страниц вроде `/menu` или `/reservation` тоже работали без hash-router.

## Firebase

Чтобы заказы приходили на компьютер в реальном времени, создай файл `.env` на основе `.env.example`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_PASSWORD=
```

После этого сайт будет писать заказы в коллекцию Firestore `orders`, а блок `Live order desk` будет слушать её в realtime.

Если `VITE_ADMIN_PASSWORD` не указан, по умолчанию используется пароль `yotto-admin-2026`.

## Firestore rules

Для демо можно начать с простых правил и потом ужесточить доступ:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if true;
    }
  }
}
```

Для продакшена лучше ограничить `read` для админов и добавить серверную валидацию.

## Как открыть admin desk

1. Открой сайт на компьютере ресторана.
2. Нажми на footer 5 раз.
3. Введи admin-пароль.
4. После первого успешного входа устройство запомнит авторизацию.
5. Новые заявки с сайта будут появляться в панели автоматически.
