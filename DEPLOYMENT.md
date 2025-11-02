# 🚀 Инструкции по деплою lvlmart

## 📋 Настройка переменных окружения

### **Для локальной разработки (.env):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://fhiansdewwuvdkbqrqlc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaWFuc2Rld3d1dmRrYnFycWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTUzMjMsImV4cCI6MjA2OTQzMTMyM30.BV9jRbyx79_qm3yKOYxhxU_zuGc_0ZeUmApcL6W_hpA
NEXT_PUBLIC_ADMIN_EMAIL=hekgen01@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **Для продакшна (.env.production):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://fhiansdewwuvdkbqrqlc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaWFuc2Rld3d1dmRrYnFycWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTUzMjMsImV4cCI6MjA2OTQzMTMyM30.BV9jRbyx79_qm3yKOYxhxU_zuGc_0ZeUmApcL6W_hpA
NEXT_PUBLIC_ADMIN_EMAIL=hekgen01@gmail.com
NEXT_PUBLIC_SITE_URL=https://lvlmart.kz
```

## 🔧 Настройка Supabase

### **1. Site URL:**
В панели Supabase → Authentication → URL Configuration:
- **Site URL**: `https://lvlmart.kz`

### **2. Redirect URLs:**
Добавьте следующие URL в **Redirect URLs**:
- `https://lvlmart.kz/auth/callback`
- `https://lvlmart.kz/reset-password`

### **3. Email Templates:**
Убедитесь, что в шаблонах email используются правильные URL:
- **Reset Password**: `{{ .SiteURL }}/reset-password`
- **Confirm Signup**: `{{ .SiteURL }}/auth/callback`

## 🌐 Деплой на Vercel

### **1. Подключение репозитория:**
1. Зайдите на [vercel.com](https://vercel.com)
2. Импортируйте ваш GitHub репозиторий
3. Выберите проект `lvlmart-frontend`

### **2. Настройка переменных окружения:**
В настройках проекта Vercel добавьте:
```
NEXT_PUBLIC_SUPABASE_URL=https://fhiansdewwuvdkbqrqlc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaWFuc2Rld3d1dmRrYnFycWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTUzMjMsImV4cCI6MjA2OTQzMTMyM30.BV9jRbyx79_qm3yKOYxhxU_zuGc_0ZeUmApcL6W_hpA
NEXT_PUBLIC_ADMIN_EMAIL=hekgen01@gmail.com
NEXT_PUBLIC_SITE_URL=https://lvlmart.kz
```

### **3. Настройка домена:**
1. В настройках проекта → Domains
2. Добавьте ваш кастомный домен: `lvlmart.kz`
3. Настройте DNS записи согласно инструкциям Vercel

## 🔒 Безопасность

### **Проверьте после деплоя:**
- ✅ Сброс пароля работает с правильным доменом
- ✅ Email ссылки ведут на ваш домен, а не на localhost
- ✅ Auth callback работает корректно
- ✅ Все защищенные маршруты работают

### **Логирование:**
Проверьте консоль браузера на наличие ошибок:
- `[SECURITY]` события
- Ошибки авторизации
- Проблемы с URL

## 🧪 Тестирование

### **После деплоя протестируйте:**
1. **Регистрация** нового пользователя
2. **Вход** в аккаунт
3. **Сброс пароля** - проверьте, что ссылка ведет на ваш домен
4. **Корзина** и покупки
5. **Админ-панель** (только для admin email)

## 📞 Поддержка

При возникновении проблем:
1. Проверьте переменные окружения
2. Убедитесь, что Supabase настроен правильно
3. Проверьте логи в консоли браузера
4. Убедитесь, что все URL используют правильный домен
