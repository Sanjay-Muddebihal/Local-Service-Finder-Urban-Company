# 🎯 Quick Visual Reference: Where to Find Everything in Twilio

## 📍 Twilio Console Navigation Map

```
📊 Twilio Dashboard
│
├─ 🔐 Account Settings
│  ├─ Settings → General
│  │  ├─ Account SID (copy this!)
│  │  └─ Auth Token (keep secret!)
│  │
│  └─ Settings → Keys & Credentials
│     └─ View/manage credentials
│
├─ 📱 Phone Numbers
│  ├─ Buy a Number
│  │  ├─ Search by Country
│  │  ├─ Select Capabilities (SMS)
│  │  └─ Complete Purchase
│  │
│  └─ Manage Numbers → Active Numbers
│     └─ Your phone number (copy this!)
│
├─ 📧 SMS
│  ├─ Send Test SMS
│  └─ View Message Logs
│
├─ 💰 Billing
│  ├─ Usage
│  ├─ Pricing
│  └─ Alerts & Settings
│
└─ 🛠️ Developer Console
   └─ View Logs & Activity
```

---

## 🔑 Step-by-Step: Find Your 3 Credentials

### **1️⃣ ACCOUNT SID**

```
Path: Settings ⚙️ → General
┌─────────────────────────────────────┐
│  ACCOUNT INFORMATION                │
│                                     │
│  Account SID                        │
│  ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx│  ← COPY THIS
│                                     │
│  Auth Token                         │
│  ••••••••••••••••••••••••••••••••••  │
└─────────────────────────────────────┘

Location: Top-left section
Looks like: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (42 characters)
Where to use: twilio.account.sid or TWILIO_ACCOUNT_SID
```

### **2️⃣ AUTH TOKEN**

```
Path: Settings ⚙️ → General
┌─────────────────────────────────────┐
│  ACCOUNT INFORMATION                │
│                                     │
│  Account SID                        │
│  ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx│
│                                     │
│  Auth Token                         │
│  ••••••••••••••••••••••••••••••••••  │  ← CLICK 'SHOW'
│  [SHOW]                             │
│                                     │
│  Auth Token                         │
│  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx │  ← COPY THIS
│                                     │
└─────────────────────────────────────┘

Location: Below Account SID
Click: [SHOW] to reveal the token
Where to use: twilio.auth.token or TWILIO_AUTH_TOKEN
⚠️  KEEP THIS SECRET!
```

### **3️⃣ PHONE NUMBER**

```
Path: Phone Numbers → Manage Numbers → Active Numbers
┌──────────────────────────────────────────┐
│  ACTIVE PHONE NUMBERS                    │
│                                          │
│  Your Phone Numbers:                     │
│  • +1 (212) 555-1234     ← Your number   │
│    Friendly Name: (optional)             │
│    SMS Enabled: ✅                       │
│    Voice Enabled: ✅                     │
│    Capabilities: SMS, Voice              │
│                                          │
│  [+ Buy a Number]                        │
└──────────────────────────────────────────┘

Copy format: +1234567890 (E.164 format)
Example: +12125551234
Where to use: twilio.phone.number or TWILIO_PHONE_NUMBER
```

---

## 🚀 Getting Your First Number (If You Don't Have One)

### **Option 1: Auto-Assign (Easiest)**

```
Twilio Console Home
    ↓
[Get your first Twilio phone number] ← Click this
    ↓
"Here's your number: +1 (212) 555-1234"
    ↓
[Accept]
    ↓
Number is yours! ✅
```

### **Option 2: Search & Buy**

```
Phone Numbers (sidebar)
    ↓
Buy a Number
    ↓
┌─────────────────────────────────┐
│ Search for a Phone Number       │
├─────────────────────────────────┤
│ Country: [United States ▼]      │
│ Area Code: [212      ]          │
│ Capabilities: [SMS ✓] [Voice ✓] │
│ [SEARCH]                        │
└─────────────────────────────────┘
    ↓
Select number from results
    ↓
[BUY NOW]
    ↓
Complete payment
    ↓
Number is yours! ✅
```

---

## 💻 Configuration Setup (Quick Copy-Paste)

### **Windows PowerShell Setup**

1. **Open PowerShell**
   - Right-click Start → Windows PowerShell
   - Or: Win+R → powershell

2. **Copy-paste these commands** (one at a time):

```powershell
# Step 1: Set Account SID
$env:TWILIO_ACCOUNT_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Step 2: Set Auth Token  
$env:TWILIO_AUTH_TOKEN = "your_auth_token_here"

# Step 3: Set Phone Number
$env:TWILIO_PHONE_NUMBER = "+1234567890"

# Step 4: Verify all are set
echo "Account SID: $env:TWILIO_ACCOUNT_SID"
echo "Auth Token: $env:TWILIO_AUTH_TOKEN"  
echo "Phone Number: $env:TWILIO_PHONE_NUMBER"
```

Expected output:
```
Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Auth Token: your_auth_token_here
Phone Number: +1234567890
```

3. **Then run your application:**
```powershell
cd D:\InternProject\Urban-Company-main\backend
.\mvnw.cmd spring-boot:run
```

---

## 🔍 How to Find Account SID & Auth Token - Detailed

### Desktop View
```
┌─────────────────────────────────────────────────────────┐
│ 🌐 Twilio Console - Account Settings                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [⚙️  Settings ▼]                                       │
│    • General     ← Click here                           │
│    • Keys & Credentials                                │
│    • Two-factor Auth                                   │
│    • Etc.                                              │
│                                                         │
├─ ACCOUNT INFORMATION ─────────────────────────────────┤
│                                                         │
│  Account SID                                            │
│  ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx                   │
│  [📋 Copy]                                              │
│                                                         │
│  Auth Token                                             │
│  [SHOW]                                                 │
│  ••••••••••••••••••••••••••••••••••••••••••••••••      │
│                                                         │
│  ⚠️  Keep your Auth Token safe                          │
│                                                         │
└─────────────────────────────────────────────────────────┘

Account SID:
- Starts with: AC
- Length: 34 characters
- Visible always
- Safe to share (just identifies account)

Auth Token:
- No specific prefix
- Length: ~32 characters
- Hidden by default ([SHOW])
- ⚠️  KEEP SECRET - Don't share or commit to git!
```

---

## 📱 Phone Number Format Rules

### Correct Formats ✅
```
+1234567890          ← Standard (country code + number)
+44 1234 567890      → Will auto-format to: +441234567890
+33-1-42-86-82-00    → Will auto-format to: +33142868200
+91 98765 43210      → Will auto-format to: +919876543210
```

### Incorrect Formats ❌
```
1234567890           ← Missing + and country code
212-555-1234         ← No country code, has dashes
(212) 555-1234       ← No country code, has parentheses
+1 (212) 555-1234    ← Has spaces and parentheses
```

### Auto-Formatting
The system automatically formats:
- Removes: spaces, dashes, parentheses
- Adds: + country code if missing
- Example: `2125551234` → `+12125551234`

---

## 🧪 Test Your Configuration

### After Setting Environment Variables:

1. **Start the application**
   ```bash
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

2. **Look for success message**
   ```
   Application started in 3.456 seconds ✅
   ```

3. **Create a test booking**
   ```powershell
   curl -X POST http://localhost:8080/api/bookings \
     -H "Content-Type: application/json" \
     -d '{
       "customerName": "Test",
       "customerPhone": "+1234567890",
       "address": "123 Test St",
       "description": "Test",
       "provider": {"id": 1}
     }'
   ```

4. **Check console for**
   ```
   ✅ SMS sent successfully. SID: SMxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## ❓ Frequently Asked Questions

### **Q: Where's my Account SID?**
A: Settings (⚙️) → General → Top section, labeled "Account SID"

### **Q: My Auth Token shows as dots (•••). How do I see it?**
A: Click [SHOW] button next to "Auth Token" to reveal it

### **Q: I don't have a phone number yet. Where do I get one?**
A: Phone Numbers (sidebar) → Buy a Number OR Get your first number (auto-assign)

### **Q: Do I copy the phone number with parentheses?**
A: No! Copy ONLY in format: +1234567890 (no spaces, parentheses, or dashes)

### **Q: My env variable isn't working. Why?**
A: You need to RESTART the terminal/IDE after setting env variables for changes to take effect

### **Q: Can I see my SMS logs in Twilio?**
A: Yes! Go to SMS → Logs to see all messages sent/received

### **Q: How much does SMS cost?**
A: ~$0.0075 per message. Free trial includes $15 credit (≈ 2000 SMS)

---

## ✅ Configuration Verification Checklist

Test each value individually:

```powershell
# Check if environment variables are set:
echo $env:TWILIO_ACCOUNT_SID
echo $env:TWILIO_AUTH_TOKEN
echo $env:TWILIO_PHONE_NUMBER

# Should show your actual values, not empty!
# If empty, set them again in this same PowerShell window
```

Expected output:
```
ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
your_auth_token_here
+1234567890
```

---

## 🔒 Security Reminders

| Action | Status | Notes |
|--------|--------|-------|
| Hardcode in source | ❌ NEVER | Will leak on GitHub |
| Commit to git | ❌ NEVER | Use .gitignore for .properties |
| Share in email | ❌ NEVER | Auth token is like a password |
| Post on Slack | ❌ NEVER | Anyone with it can use your account |
| Use environment vars | ✅ YES | Recommended for production |
| Use .env file (gitignored) | ✅ YES | Good for local development |

---

**Last Updated**: May 7, 2026  
**Time to Setup**: ~5 minutes  
**Difficulty**: ⭐ Easy
