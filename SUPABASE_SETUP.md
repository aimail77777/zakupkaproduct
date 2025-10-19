# 🔧 Настройка Supabase для lvlmart.kz

## 📋 Обязательные настройки

### **1. Site URL Configuration**
Перейдите в панель Supabase → **Authentication** → **URL Configuration**:

```
Site URL: https://lvlmart.kz
```

### **2. Redirect URLs**
В том же разделе добавьте следующие URL в **Redirect URLs**:

```
https://lvlmart.kz/auth/callback
https://lvlmart.kz/reset-password
```

### **3. Email Templates**
Перейдите в **Authentication** → **Email Templates**:

#### **Reset Password Template:**
- **Subject**: `Сброс пароля для lvlmart`
- **Body**: Используйте переменную `{{ .SiteURL }}/reset-password`

#### **Confirm Signup Template:**
- **Subject**: `Подтвердите регистрацию в lvlmart`
- **Body**: Используйте переменную `{{ .SiteURL }}/auth/callback`

## 🔒 Дополнительные настройки безопасности

### **4. Rate Limiting**
В **Authentication** → **Settings**:
- **Enable rate limiting**: ✅ Включено
- **Max requests per minute**: 60

### **5. Password Requirements**
В **Authentication** → **Settings**:
- **Minimum password length**: 8
- **Require uppercase**: ✅
- **Require lowercase**: ✅
- **Require numbers**: ✅

### **6. Session Configuration**
- **Session timeout**: 24 hours
- **Refresh token rotation**: ✅ Включено

## 📧 Настройка Email

### **7. SMTP Configuration (опционально)**
Если хотите использовать свой SMTP вместо Supabase:

1. Перейдите в **Authentication** → **Settings**
2. В разделе **SMTP Settings**:
   - **Enable custom SMTP**: ✅
   - Настройте ваш SMTP сервер

### **8. Email Domain**
- **From email**: `noreply@lvlmart.kz`
- **From name**: `lvlmart`

## 🧪 Тестирование настроек

### **9. Проверочный чек-лист:**

- [ ] Site URL установлен на `https://lvlmart.kz`
- [ ] Redirect URLs добавлены:
  - [ ] `https://lvlmart.kz/auth/callback`
  - [ ] `https://lvlmart.kz/reset-password`
- [ ] Email templates используют `{{ .SiteURL }}`
- [ ] Rate limiting включен
- [ ] Password requirements настроены
- [ ] Session timeout установлен

### **10. Тестовые сценарии:**

1. **Регистрация нового пользователя:**
   - Создайте тестовый аккаунт
   - Проверьте, что email приходит с правильным доменом
   - Подтвердите регистрацию по ссылке

2. **Сброс пароля:**
   - Запросите сброс пароля
   - Проверьте, что ссылка ведет на `https://lvlmart.kz/reset-password`
   - Убедитесь, что сброс работает корректно

3. **Вход в систему:**
   - Войдите с тестовым аккаунтом
   - Проверьте, что сессия создается правильно

## 🚨 Важные моменты

### **⚠️ Безопасность:**
- Никогда не публикуйте `SUPABASE_SERVICE_ROLE_KEY` в клиентском коде
- Используйте только `NEXT_PUBLIC_SUPABASE_ANON_KEY` на фронтенде
- Регулярно ротируйте ключи

### **📊 Мониторинг:**
- Следите за логами в **Authentication** → **Logs**
- Проверяйте метрики использования
- Настройте алерты на подозрительную активность

### **🔄 Обновления:**
- После изменения настроек подождите 5-10 минут
- Очистите кеш браузера
- Протестируйте все функции

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в Supabase Dashboard
2. Убедитесь, что все URL настроены правильно
3. Проверьте переменные окружения в Vercel
4. Обратитесь к [документации Supabase](https://supabase.com/docs)

---

**🎯 После выполнения всех настроек ваш сайт будет готов к работе на домене `https://lvlmart.kz`!**
