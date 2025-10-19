# 🚀 Финальная инструкция по деплою lvlmart.kz

## ✅ **ПРОЕКТ ГОТОВ К ДЕПЛОЮ!**

### **📋 Что исправлено:**

- ✅ **Безопасность**: Нет автоматического входа после сброса пароля
- ✅ **URL**: Динамические ссылки для любого домена
- ✅ **Токены**: Работает с access_token (даже без refresh_token)
- ✅ **LockManager**: Исправлена ошибка с блокировкой браузера
- ✅ **Логирование**: Подробные логи для отладки

---

## 🌐 **ДЕПЛОЙ НА VERCEL:**

### **1. Подключение репозитория:**
1. Зайдите на [vercel.com](https://vercel.com)
2. Импортируйте репозиторий: `aimail77777/zakupkaproduct`
3. Выберите проект `lvlmart-frontend`

### **2. Переменные окружения:**
В настройках проекта Vercel добавьте:

```
NEXT_PUBLIC_SITE_URL = https://lvlmart.kz
NEXT_PUBLIC_SUPABASE_URL = https://fhiansdewwuvdkbqrqlc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaWFuc2Rld3d1dmRrYnFycWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTUzMjMsImV4cCI6MjA2OTQzMTMyM30.BV9jRbyx79_qm3yKOYxhxU_zuGc_0ZeUmApcL6W_hpA
NEXT_PUBLIC_ADMIN_EMAIL = hekgen01@gmail.com
```

### **3. Подключение домена:**
1. В настройках проекта → Domains
2. Добавьте домен: `lvlmart.kz`
3. Настройте DNS записи согласно инструкциям Vercel

---

## 🔧 **НАСТРОЙКА SUPABASE:**

### **1. URL Configuration:**
**Зайдите в Supabase Dashboard → Authentication → URL Configuration**

- **Site URL**: `https://lvlmart.kz`
- **Redirect URLs**:
  ```
  https://lvlmart.kz/auth/callback
  https://lvlmart.kz/reset-password
  https://lvlmart.kz/auth/callback?type=recovery
  ```

### **2. Email Template:**
**Зайдите в Authentication → Email Templates → Reset Password**

**Subject:**
```
Сброс пароля для lvlmart
```

**Body:**
```html
<h2>Сброс пароля</h2>
<p>Вы запросили сброс пароля для вашего аккаунта в lvlmart.</p>
<p>Нажмите на ссылку ниже, чтобы сбросить пароль:</p>
<p><a href="{{ .ConfirmationURL }}">Сбросить пароль</a></p>
<p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
<p>Ссылка действительна в течение 24 часов.</p>
```

---

## 🧪 **ТЕСТИРОВАНИЕ ПОСЛЕ ДЕПЛОЯ:**

### **1. Основные функции:**
- [ ] Сайт доступен на `https://lvlmart.kz`
- [ ] Регистрация новых пользователей
- [ ] Вход в систему
- [ ] Выход из системы

### **2. Сброс пароля:**
- [ ] Запрос сброса пароля
- [ ] Получение email с ссылкой
- [ ] Переход по ссылке (должна открыться форма)
- [ ] Успешный сброс пароля
- [ ] Принудительный выход после сброса

### **3. Безопасность:**
- [ ] Нет автоматического входа после сброса
- [ ] Нет доступа к профилю во время recovery
- [ ] Корректные логи в консоли

---

## 📊 **ОЖИДАЕМЫЕ ЛОГИ:**

### **При сбросе пароля:**
```javascript
URL params: { accessToken: true, refreshToken: false, type: "recovery" }
Access token found, allowing password reset...
Only access token available, allowing reset without session
[SECURITY] PASSWORD_RESET_ACCESS_TOKEN_ONLY: { ... }
```

### **При успешном сбросе:**
```javascript
[SECURITY] PASSWORD_RESET_SUCCESS: { userEmail: "user@example.com" }
```

---

## 🆘 **ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ:**

### **Сброс пароля не работает:**
1. Проверьте email template в Supabase
2. Убедитесь, что Redirect URLs настроены
3. Проверьте переменные окружения в Vercel

### **Ошибки в консоли:**
1. Откройте консоль браузера (F12)
2. Посмотрите логи `[SECURITY]`
3. Проверьте ошибки JavaScript

### **Ссылки ведут на localhost:**
1. Проверьте `NEXT_PUBLIC_SITE_URL` в Vercel
2. Убедитесь, что Supabase настроен правильно

---

## 🎯 **ФИНАЛЬНЫЙ ЧЕК-ЛИСТ:**

- [ ] Код зафиксирован в Git и отправлен в репозиторий
- [ ] Vercel подключен к репозиторию
- [ ] Переменные окружения добавлены в Vercel
- [ ] Домен `lvlmart.kz` подключен к Vercel
- [ ] Supabase настроен с правильными URL
- [ ] Email template обновлен
- [ ] Тестирование пройдено успешно

---

## 🎉 **ПОЗДРАВЛЯЕМ!**

**Ваш проект lvlmart готов к работе на `https://lvlmart.kz`!**

### **📞 Поддержка:**
- **Документация**: `DEPLOYMENT.md`, `SUPABASE_TOKEN_SETUP.md`
- **Логи**: Vercel Dashboard, Supabase Dashboard, консоль браузера
- **Мониторинг**: Следите за логами `[SECURITY]` в консоли

**Удачи с запуском! 🚀✨**
