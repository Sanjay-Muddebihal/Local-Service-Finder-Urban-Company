# 🔧 How to Set Environment Variables for Twilio

## Windows PowerShell (Recommended)

### **Step 1: Open PowerShell**
- Press `Win + R`
- Type: `powershell`
- Click: OK

### **Step 2: Copy-Paste These Commands**

```powershell
# Set your Twilio credentials (replace with your actual values)
$env:TWILIO_ACCOUNT_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:TWILIO_AUTH_TOKEN = "your_auth_token_here"
$env:TWILIO_PHONE_NUMBER = "+919876543210"

# Verify they're set (optional)
echo "Account SID: $env:TWILIO_ACCOUNT_SID"
echo "Auth Token: $env:TWILIO_AUTH_TOKEN"
echo "Phone Number: $env:TWILIO_PHONE_NUMBER"
```

### **Step 3: Start Your Application**

```powershell
# In the same PowerShell window, run:
cd D:\InternProject\Urban-Company-main\backend
.\mvnw.cmd spring-boot:run
```

---

## Windows Command Prompt (cmd)

### **Step 1: Open Command Prompt**
- Press `Win + R`
- Type: `cmd`
- Click: OK

### **Step 2: Copy-Paste These Commands**

```cmd
REM Set your Twilio credentials (replace with your actual values)
set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
set TWILIO_AUTH_TOKEN=your_auth_token_here
set TWILIO_PHONE_NUMBER=+919876543210

REM Verify they're set (optional)
echo %TWILIO_ACCOUNT_SID%
echo %TWILIO_AUTH_TOKEN%
echo %TWILIO_PHONE_NUMBER%
```

### **Step 3: Start Your Application**

```cmd
REM In the same cmd window, run:
cd D:\InternProject\Urban-Company-main\backend
.\mvnw.cmd spring-boot:run
```

---

## Linux/Mac Terminal

### **Step 1: Open Terminal**

### **Step 2: Copy-Paste These Commands**

```bash
# Set your Twilio credentials (replace with your actual values)
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_auth_token_here"
export TWILIO_PHONE_NUMBER="+919876543210"

# Verify they're set (optional)
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN
echo $TWILIO_PHONE_NUMBER
```

### **Step 3: Start Your Application**

```bash
# In the same terminal window, run:
cd /path/to/your/project/backend
./mvnw spring-boot:run
```

---

## ⚠️ Important Notes

### **1. Set Variables BEFORE Starting App**
```powershell
# ❌ Wrong - app starts first, then variables set
.\mvnw.cmd spring-boot:run
$env:TWILIO_ACCOUNT_SID = "AC..."

# ✅ Correct - variables set first, then app starts
$env:TWILIO_ACCOUNT_SID = "AC..."
.\mvnw.cmd spring-boot:run
```

### **2. Variables Are Temporary**
- Environment variables set this way only last for the current terminal session
- If you close PowerShell/cmd and reopen, you need to set them again
- For permanent variables, use System Properties (see below)

### **3. Use Your Actual Values**
Replace these placeholders with your real Twilio values:
- `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` → Your Account SID
- `your_auth_token_here` → Your Auth Token
- `+919876543210` → Your Twilio phone number

---

## 🔄 Permanent Environment Variables (Optional)

### **For Windows (System-Wide)**

1. **Right-click** on Start button
2. **Click**: System
3. **Click**: Advanced system settings
4. **Click**: Environment Variables
5. **Under "User variables"**, click New
6. **Variable name**: `TWILIO_ACCOUNT_SID`
7. **Variable value**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
8. **Click**: OK
9. **Repeat** for `TWILIO_AUTH_TOKEN` and `TWILIO_PHONE_NUMBER`

### **For Linux/Mac (.bashrc or .zshrc)**

Add to your `~/.bashrc` or `~/.zshrc`:
```bash
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_auth_token_here"
export TWILIO_PHONE_NUMBER="+919876543210"
```

---

## 🧪 Test Your Setup

### **After Setting Variables and Starting App:**

```powershell
# Create a test booking
curl -X POST http://localhost:8080/api/bookings `
  -H "Content-Type: application/json" `
  -d '{
    "customerName": "Test User",
    "customerPhone": "+919876543210",
    "address": "Test Address",
    "description": "Test Service",
    "provider": {"id": 1}
  }'
```

### **Check Console Output:**
```
✅ SMS sent successfully. SID: SMxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If you see this, environment variables are working! 🎉

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "SMS NOT CONFIGURED" | Set environment variables BEFORE starting app |
| Variables not working | Use the same terminal window for both setting and running |
| App can't find variables | Restart terminal and set variables again |
| Values not showing | Check for typos in variable names (case-sensitive) |

---

## 📋 Quick Reference

### **PowerShell (Windows)**
```powershell
$env:TWILIO_ACCOUNT_SID = "AC..."
$env:TWILIO_AUTH_TOKEN = "..."
$env:TWILIO_PHONE_NUMBER = "+91..."
cd backend
.\mvnw.cmd spring-boot:run
```

### **Command Prompt (Windows)**
```cmd
set TWILIO_ACCOUNT_SID=AC...
set TWILIO_AUTH_TOKEN=...
set TWILIO_PHONE_NUMBER=+91...
cd backend
.\mvnw.cmd spring-boot:run
```

### **Linux/Mac**
```bash
export TWILIO_ACCOUNT_SID="AC..."
export TWILIO_AUTH_TOKEN="..."
export TWILIO_PHONE_NUMBER="+91..."
cd backend
./mvnw spring-boot:run
```

---

**That's it!** Environment variables are now set. 🚀
