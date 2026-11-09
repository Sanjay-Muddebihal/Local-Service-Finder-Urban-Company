# 📱 How to Get and Configure Twilio Phone Number

## 🎯 Complete Step-by-Step Guide

---

## **STEP 1: Create Twilio Account**

### Go to Twilio Console
- Visit: https://www.twilio.com/console
- Sign up or login

### Free Trial Benefits:
- ✅ Get $15 trial credit
- ✅ Get 1 free phone number
- ✅ Send SMS to verified numbers
- ✅ Test without payment card

---

## **STEP 2: Find Your Account Credentials**

### Location in Twilio Dashboard:

1. **Login to Twilio Console**: https://www.twilio.com/console
2. **Click Settings** (⚙️ icon) in the sidebar
3. **Select "General"**

### You'll see:
```
Account SID (Account Information section)
├─ Looks like: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
└─ Copy this value

Auth Token (Account Information section)  
├─ Looks like: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
└─ ⚠️ Keep this SECRET! Don't share!
```

**Screenshots location**:
- Account SID: Top-right area of Settings page
- Auth Token: Below Account SID
- Both shown clearly in gray boxes

---

## **STEP 3: Get Twilio Phone Number**

### For FREE Trial (One-Click):

1. **Go to**: https://www.twilio.com/console/phone-numbers/incoming
2. **Look for**: "Get your first Twilio phone number" button
3. **Click it** → Number assigned automatically
4. **Accept** the suggested number
5. **Copy the phone number** (format: +1234567890)

Example screenshot path:
```
Twilio Console 
  → Phone Numbers (sidebar)
    → Manage Numbers
      → Buy a Number
        → Search & Select
          → Confirm Purchase
```

### For Production (Buy a Number):

1. **Go to**: https://www.twilio.com/console/phone-numbers/search
2. **Search parameters**:
   - Country: Select your country
   - Area code: (Optional)
   - Capabilities: SMS & MMS
3. **Select a number** from results
4. **Click "Buy"** and complete checkout
5. **Number is ready** immediately

---

## **STEP 4: Copy All 3 Values**

You need exactly **3 values**:

| Value | Format | Where to Find | Example |
|-------|--------|---------------|---------|
| Account SID | ACxxxx... | Settings → General → Account SID | ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| Auth Token | xxxx... | Settings → General → Auth Token | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| Phone Number | +1234567890 | Phone Numbers → Active Numbers | +1234567890 |

---

## **STEP 5: Configure in Your Project**

### **Option A: Environment Variables (BEST for Production)**

#### Windows PowerShell:
```powershell
# Paste one command at a time:
$env:TWILIO_ACCOUNT_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:TWILIO_AUTH_TOKEN = "your_actual_auth_token_here"
$env:TWILIO_PHONE_NUMBER = "+1234567890"

# Verify they're set:
echo $env:TWILIO_ACCOUNT_SID
echo $env:TWILIO_AUTH_TOKEN
echo $env:TWILIO_PHONE_NUMBER
```

#### Windows Command Prompt (cmd):
```cmd
set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
set TWILIO_AUTH_TOKEN=your_actual_auth_token_here
set TWILIO_PHONE_NUMBER=+1234567890

REM Verify:
echo %TWILIO_ACCOUNT_SID%
echo %TWILIO_AUTH_TOKEN%
echo %TWILIO_PHONE_NUMBER%
```

#### Linux/Mac:
```bash
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_actual_auth_token_here"
export TWILIO_PHONE_NUMBER="+1234567890"

# Verify:
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN
echo $TWILIO_PHONE_NUMBER
```

### **Option B: application.properties (Development Only)**

⚠️ **WARNING**: Only for development/testing! NEVER commit credentials to git!

1. **Open file**: `backend/src/main/resources/application.properties`

2. **Find the Twilio section**:
```properties
# ── Twilio SMS Configuration ──────────────────────────────────────────────────
twilio.account.sid=${TWILIO_ACCOUNT_SID:}
twilio.auth.token=${TWILIO_AUTH_TOKEN:}
twilio.phone.number=${TWILIO_PHONE_NUMBER:}
```

3. **Uncomment and fill in** (for development only):
```properties
# DEVELOPMENT ONLY - DO NOT COMMIT TO GIT!
twilio.account.sid=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
twilio.auth.token=your_actual_auth_token_here
twilio.phone.number=+1234567890
```

4. **Save the file**

---

## **STEP 6: Start the Application**

```bash
cd backend
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

### What you should see:
✅ Application starts successfully  
✅ No "SMS NOT CONFIGURED" errors  
✅ Console shows: "Application started in X.XXX seconds"

---

## **STEP 7: Test the SMS Feature**

### Create a booking to trigger SMS:

**Using PowerShell:**
```powershell
$body = @{
    customerName = "Test Customer"
    customerPhone = "+1234567890"
    address = "123 Test St, Test City"
    description = "Test Service"
    provider = @{ id = 1 }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/bookings" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Using curl (Windows PowerShell):**
```powershell
curl -X POST http://localhost:8080/api/bookings `
  -H "Content-Type: application/json" `
  -d '{
    "customerName": "Test Customer",
    "customerPhone": "+1234567890",
    "address": "123 Test St",
    "description": "Test Service",
    "provider": {"id": 1}
  }'
```

### Expected Results:

**Success** ✅
```
Console shows:
✅ SMS sent successfully. SID: SMxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**If Twilio Not Configured** 📝
```
Console shows:
📱 [SMS NOT CONFIGURED] To: +1234567890, Message: 🔔 New Service Booking!...
```

---

## 🔍 Verify Your Setup

### Check if configuration loaded:

Look in console output for:
```
✅ SMS sent successfully       → All configured correctly!
📱 [SMS NOT CONFIGURED]        → Credentials missing/empty
❌ Failed to send SMS          → Invalid credentials
```

### Troubleshooting:

| Problem | Check |
|---------|-------|
| "SMS NOT CONFIGURED" | Env vars set? Restart app after setting env vars |
| "Invalid credentials" | Copy Account SID and Auth Token exactly (no spaces) |
| "Invalid phone number" | Format must be +countrycode (e.g., +1234567890) |
| Environment var not working | Restart terminal/IDE after setting env var |

---

## 📞 Phone Number Format Examples

Your Twilio phone number MUST be in E.164 format:

| Country | Example | Format |
|---------|---------|--------|
| USA | (212) 555-1234 | +12125551234 |
| UK | +44 20 7946 0958 | +442079460958 |
| Canada | (416) 555-1234 | +14165551234 |
| India | +91 98765 43210 | +919876543210 |
| Germany | +49 30 3465 4567 | +493034654567 |

**Format**: `+[country code][phone number]` (no spaces, dashes, parentheses)

---

## 🔒 Security Best Practices

### DO ✅
- Use environment variables for production
- Rotate auth tokens every 90 days
- Keep auth token secret
- Monitor Twilio usage in console

### DON'T ❌
- Hardcode credentials in source code
- Commit credentials to Git/GitHub
- Share auth token in emails/chat
- Use same token across environments
- Disable account security features

---

## 💰 Costs & Limits

### Free Trial:
- ✅ $15 credit (enough for ~2000 SMS)
- ✅ 1 phone number included
- ✅ Send to verified numbers only
- ✅ Test environment

### Production:
- SMS cost: ~$0.0075 per message (varies by country)
- Monthly fee: Starting from $1/month
- See: https://www.twilio.com/sms/pricing

### Check Balance:
1. Go to: https://www.twilio.com/console/billing/usage
2. View current usage and remaining balance
3. Set up alerts for low balance

---

## ⚡ Quick Reference

### Copy-Paste Template (Environment Variables)

```powershell
# Windows PowerShell - Replace with YOUR values!
$env:TWILIO_ACCOUNT_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:TWILIO_AUTH_TOKEN = "your_auth_token_here"
$env:TWILIO_PHONE_NUMBER = "+1234567890"
```

### Where to Get Each Value:

```
Twilio Console
├─ https://www.twilio.com/console/account/settings/general
│  └─ Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
│  └─ Auth Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
│
└─ https://www.twilio.com/console/phone-numbers/incoming
   └─ Phone Number: +1234567890
```

---

## 📝 Verification Checklist

- [ ] Created Twilio account
- [ ] Found Account SID
- [ ] Found Auth Token
- [ ] Got Twilio phone number
- [ ] Set environment variables
- [ ] Application starts without errors
- [ ] Created test booking
- [ ] Provider received SMS (or logged in console)
- [ ] Verified phone number format (+1234567890)

---

## 🆘 Can't Find Your Number?

If you don't see "Get your first Twilio phone number":

1. **Try**: https://www.twilio.com/console/phone-numbers/incoming
2. **Click**: "Buy a Number"
3. **Search**: Country + capabilities (SMS)
4. **Select**: Any available number
5. **Buy**: Accept and checkout

Free trial numbers are instant - no waiting!

---

## 🎉 You're Set!

Once configured:
1. ✅ Restart application
2. ✅ Create a booking
3. ✅ Provider gets SMS! 📱

Need help? Check the [QUICK_START_SMS.md](../QUICK_START_SMS.md) guide for more details.

---

**Last Updated**: May 7, 2026
