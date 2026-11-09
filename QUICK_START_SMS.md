# Quick Start: Test SMS Notifications

## 🎯 TL;DR - Test in 5 Minutes

### 1. **Get Free Twilio Account** (2 min)
- Go to https://www.twilio.com/try-twilio
- Sign up with your number
- Copy your credentials:
  - Account SID
  - Auth Token  
  - Twilio Phone Number

### 2. **Configure Backend** (1 min)
Edit `backend/src/main/resources/application.properties`:
```properties
twilio.account.sid=YOUR_ACCOUNT_SID
twilio.auth.token=YOUR_AUTH_TOKEN
twilio.phone.number=+YOUR_TWILIO_PHONE_NUMBER
```

### 3. **Start Backend** (1 min)
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### 4. **Create a Booking** (1 min)
Use Postman, curl, or any REST client:

**POST** `http://localhost:8080/api/bookings`
```json
{
  "customerName": "Test User",
  "customerPhone": "+1234567890",
  "address": "123 Test St, City",
  "description": "Test Service",
  "provider": {
    "id": 1
  }
}
```

**Result**: Provider with ID 1 gets an SMS! 📱

---

## 📝 Test Cases

### Test Case 1: SMS Successfully Sent
**When**: Create booking with valid provider
**Expected**: 
- ✅ HTTP 200 response
- 📱 Provider gets SMS
- 📊 Console shows: "✅ SMS sent successfully. SID: ..."

### Test Case 2: No Twilio Configured
**When**: Booking created without Twilio config
**Expected**:
- ✅ HTTP 200 response
- 📝 Console shows: "📱 [SMS NOT CONFIGURED] To: +1234567890..."
- ✅ Booking still created

### Test Case 3: Invalid Phone Number Format
**When**: Provider phone = "invalid"
**Expected**:
- ✅ Booking created
- 📊 Console shows SMS error: "❌ Failed to send SMS..."
- ✅ No booking failure

### Test Case 4: Phone Number Auto-Formatting
**When**: Provider phone = "2125551234" (US 10-digit)
**Expected**:
- ✅ Auto-formatted to: "+12125551234"
- 📱 SMS sent successfully

---

## 🛠️ Debugging

### Check Logs
```bash
# Run with verbose output
.\mvnw.cmd spring-boot:run -X
```

### Common Console Messages

**Success**:
```
✅ SMS sent successfully. SID: SMxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**No Config**:
```
📱 [SMS NOT CONFIGURED] To: +1234567890, Message: ...
```

**Error**:
```
❌ Failed to send SMS to +1234567890: Authentication failed
```

---

## 🔗 API Endpoints

### Create Booking
```
POST /api/bookings
```
**Required Fields**:
- `customerName`: String
- `customerPhone`: String (with country code, e.g., +1234567890)
- `address`: String
- `provider`: Object with `id`

**Optional Fields**:
- `description`: String (service type)
- `scheduledAt`: DateTime

**Response**: Booking object with ID

### Example with cURL
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Alice Smith",
    "customerPhone": "+15551234567",
    "address": "456 Oak Ave, Boston, MA",
    "description": "Electrical repair",
    "provider": {"id": 2}
  }'
```

### Example with PowerShell
```powershell
$body = @{
    customerName = "Bob Johnson"
    customerPhone = "+15559876543"
    address = "789 Pine Rd, Seattle, WA"
    description = "Plumbing repair"
    provider = @{ id = 3 }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/bookings" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## 📱 What Provider Receives

Provider SMS Format:
```
🔔 New Service Booking!
Customer: Alice Smith
Phone: +15551234567
Service: Electrical repair
Address: 456 Oak Ave, Boston, MA
Status: PENDING
Please log in to confirm or decline.
```

---

## ⚙️ Configuration Files Modified

### 1. `backend/pom.xml`
- ✅ Added Twilio SDK dependency

### 2. `backend/src/main/resources/application.properties`
- ✅ Added Twilio configuration properties

### 3. `backend/src/main/java/com/localservice/service/NotificationService.java`
- ✅ Implemented Twilio SMS sending
- ✅ Added phone formatting
- ✅ Added error handling

### 4. `backend/src/main/java/com/localservice/model/Booking.java`
- ✅ Added `description` field

### 5. `backend/src/main/java/com/localservice/service/LocalService.java`
- ✅ Fixed `book()` method
- ✅ Added SMS notification call
- ✅ Added validation

---

## 🆚 Before vs After

### Before
```java
// ❌ Code had bugs - called non-existent methods
booking.getProviderId()      // ❌ Method doesn't exist
booking.getServiceType()     // ❌ Method doesn't exist
// 📝 NotificationService just logged to console
System.out.println("Sending SMS...");
```

### After
```java
// ✅ Fixed - uses correct object references
booking.getProvider().getId()           // ✅ Correct
booking.getDescription()                 // ✅ Correct
// 📱 NotificationService sends real SMS
Message smsMessage = Message.creator(...).create();
// ✅ Rich formatted message with all details
String message = "🔔 New Service Booking!\n...";
```

---

## 🚀 Production Deployment

### Step 1: Secure Credentials
```bash
# Use environment variables (never in code!)
set TWILIO_ACCOUNT_SID=your_account_sid
set TWILIO_AUTH_TOKEN=your_auth_token  
set TWILIO_PHONE_NUMBER=+your_number
```

### Step 2: Build
```bash
.\mvnw.cmd clean package
```

### Step 3: Deploy
```bash
java -jar target/local-service-finder-0.0.1-SNAPSHOT.jar
```

### Step 4: Monitor
Check logs for SMS sending status:
```bash
tail -f application.log | grep "SMS\|✅\|❌"
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `twilio.account.sid` not found | Check application.properties has Twilio config |
| SMS fails with 401 | Verify Account SID and Auth Token (copy from Twilio Console) |
| SMS fails with 400 | Check phone format (+countrycode number, e.g., +1234567890) |
| Compilation fails | Run `.\mvnw.cmd clean install` |
| Booking created but SMS not sent | Check console logs for error details |
| Timeout on booking creation | SMS call might be slow - check Twilio API status |

---

## 📚 Resources

- [Twilio Console](https://www.twilio.com/console)
- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Twilio Java SDK](https://github.com/twilio/twilio-java)
- [Project Setup Guide](./SMS_NOTIFICATIONS_SETUP.md)
- [Implementation Details](./NOTIFICATION_IMPLEMENTATION.md)

---

**Last Updated**: May 7, 2026
