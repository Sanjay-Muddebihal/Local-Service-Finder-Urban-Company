# 🇮🇳 Add Indian Phone Number to Twilio - Simple Version

## ⚡ Quick Setup (30 seconds)

### **Step 1: Go to Twilio Console**
```
https://www.twilio.com/console/phone-numbers/search
```

### **Step 2: Search Indian Number**
- Enter: **Country = India**
- Click: **SEARCH**

### **Step 3: Buy Any Number**
- Select any number shown
- Click: **BUY NOW**

### **Step 4: Copy Your Number**
Example: `+919876543210`

---

## **Step 5: Set Environment Variable**

**Windows PowerShell:**
```powershell
$env:TWILIO_PHONE_NUMBER = "+919876543210"
```

**Linux/Mac:**
```bash
export TWILIO_PHONE_NUMBER="+919876543210"
```

---

## **Step 6: Start Your App**

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

✅ **Done!** SMS now sends from Indian number.

---

## 🔄 Full Setup (With Other Credentials)

```powershell
# Set all 3 values
$env:TWILIO_ACCOUNT_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:TWILIO_AUTH_TOKEN = "your_auth_token_here"
$env:TWILIO_PHONE_NUMBER = "+919876543210"

# Start app
cd backend
.\mvnw.cmd spring-boot:run
```

---

## 📱 Test It

```powershell
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "customerPhone": "+919876543210",
    "address": "Mumbai",
    "description": "Test Service",
    "provider": {"id": 1}
  }'
```

Provider gets SMS with your Indian Twilio number! ✅

---

## 🆘 Issues?

| Problem | Solution |
|---------|----------|
| Number format wrong | Use: `+919876543210` |
| SMS not sending | Restart app after setting env variable |
| Can't find India numbers | Go directly to search link above |

---

**That's it!** Simple and fast. 🚀
