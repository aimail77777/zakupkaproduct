# 🔧 Настройка Supabase для работы с токенами

## 🎯 **Обязательные настройки для работы сброса пароля с токенами**

### **1. 📋 URL Configuration в Supabase:**

**Зайдите в Supabase Dashboard → Authentication → URL Configuration**

#### **Site URL:**
```
https://lvlmart.kz
```

#### **Redirect URLs (добавьте все эти URL):**
```
https://lvlmart.kz/auth/callback
https://lvlmart.kz/reset-password
https://lvlmart.kz/auth/callback?type=recovery
```

### **2. 📧 Email Templates:**

**Зайдите в Authentication → Email Templates → Reset Password**

#### **Subject:**
```
Сброс пароля для lvlmart
```

#### **Body (используйте этот шаблон):**
```html
<h2>Сброс пароля</h2>
<p>Вы запросили сброс пароля для вашего аккаунта в lvlmart.</p>
<p>Нажмите на ссылку ниже, чтобы сбросить пароль:</p>
<p><a href="{{ .SiteURL }}/reset-password?access_token={{ .TokenHash }}&refresh_token={{ .RefreshToken }}&type=recovery">Сбросить пароль</a></p>
<p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
<p>Ссылка действительна в течение 24 часов.</p>
```

### **3. 🔧 Дополнительные настройки:**

#### **В Authentication → Settings:**
- **Enable email confirmations**: ✅ Включено
- **Enable email change confirmations**: ✅ Включено
- **Enable phone confirmations**: ❌ Отключено (если не используете)

#### **Password Requirements:**
- **Minimum password length**: 8
- **Require uppercase**: ✅
- **Require lowercase**: ✅
- **Require numbers**: ✅

---

## 🚀 **Как это работает:**

### **1. Пользователь запрашивает сброс пароля:**
- Заполняет email на странице `/forgot-password`
- Supabase отправляет email с токенами

### **2. Email содержит ссылку с токенами:**
```
https://lvlmart.kz/reset-password?access_token=xxx&refresh_token=yyy&type=recovery
```

### **3. При переходе по ссылке:**
- Код извлекает `access_token` и `refresh_token` из URL
- Создает сессию с помощью `supabase.auth.setSession()`
- Разрешает сброс пароля

### **4. После сброса пароля:**
- Принудительно выходит из сессии
- Перенаправляет на страницу входа

---

## 🧪 **Тестирование:**

### **1. Запросите сброс пароля:**
- Перейдите на `/forgot-password`
- Введите email
- Нажмите "Отправить ссылку для сброса"

### **2. Проверьте email:**
- Откройте письмо от Supabase
- Убедитесь, что ссылка содержит токены

### **3. Перейдите по ссылке:**
- Откройте консоль браузера (F12)
- Должны появиться логи:
  ```
  URL params: { accessToken: true, refreshToken: true, type: "recovery" }
  [SECURITY] PASSWORD_RESET_TOKEN_SESSION_CREATED: { ... }
  ```

### **4. Сбросьте пароль:**
- Введите новый пароль
- Подтвердите пароль
- Нажмите "Обновить пароль"

---

## 🔍 **Отладка:**

### **Если токены не приходят:**
1. Проверьте настройки URL в Supabase
2. Убедитесь, что `redirectTo` правильный
3. Проверьте email template

### **Если сессия не создается:**
1. Проверьте логи в консоли браузера
2. Убедитесь, что токены валидны
3. Проверьте настройки Supabase

### **Если сброс пароля не работает:**
1. Проверьте права пользователя
2. Убедитесь, что пароль соответствует требованиям
3. Проверьте логи ошибок

---

## 📊 **Логи для мониторинга:**

### **Успешные события:**
- `PASSWORD_RESET_TOKEN_SESSION_CREATED`
- `PASSWORD_RESET_SUCCESS`

### **Ошибки:**
- `PASSWORD_RESET_TOKEN_ERROR`
- `PASSWORD_RESET_TOKEN_PROCESSING_ERROR`
- `PASSWORD_RESET_UPDATE_ERROR`

---

## ✅ **Чек-лист после настройки:**

- [ ] Site URL установлен на `https://lvlmart.kz`
- [ ] Redirect URLs добавлены правильно
- [ ] Email template обновлен с токенами
- [ ] Тестовая ссылка сброса пароля работает
- [ ] Токены извлекаются из URL
- [ ] Сессия создается из токенов
- [ ] Сброс пароля работает корректно
- [ ] После сброса происходит выход из сессии

---

**🎯 После выполнения всех настроек сброс пароля будет работать с токенами!**
