# ⚡ Environment Variables Cheat Sheet

## Windows PowerShell (Copy-Paste)

```powershell
# 1. Set your Twilio values (replace with your actual values)
$env:TWILIO_ACCOUNT_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:TWILIO_AUTH_TOKEN = "your_auth_token_here"
$env:TWILIO_PHONE_NUMBER = "+919876543210"

# 2. Go to backend folder
cd D:\InternProject\Urban-Company-main\backend

# 3. Start application
.\mvnw.cmd spring-boot:run
```

## Windows Command Prompt (Copy-Paste)

```cmd
REM 1. Set your Twilio values (replace with your actual values)
set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
set TWILIO_AUTH_TOKEN=your_auth_token_here
set TWILIO_PHONE_NUMBER=+919876543210

REM 2. Go to backend folder
cd D:\InternProject\Urban-Company-main\backend

REM 3. Start application
.\mvnw.cmd spring-boot:run
```

## Linux/Mac (Copy-Paste)

```bash
# 1. Set your Twilio values (replace with your actual values)
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_auth_token_here"
export TWILIO_PHONE_NUMBER="+919876543210"

# 2. Go to backend folder
cd /path/to/Urban-Company-main/backend

# 3. Start application
./mvnw spring-boot:run
```

---

## 🧪 Test It Works

After starting the app, test with:

```powershell
curl -X POST http://localhost:8080/api/bookings `
  -H "Content-Type: application/json" `
  -d '{
    "customerName": "Test",
    "customerPhone": "+919876543210",
    "address": "Test Address",
    "description": "Test Service",
    "provider": {"id": 1}
  }'
```

**Success = SMS sent!** ✅

---

## 📝 Remember

- Set variables **BEFORE** starting the app
- Use the **same terminal window**
- Replace with your **actual Twilio values**
- Variables are temporary (reset when terminal closes)

---

**Copy-paste and go!** 🚀
