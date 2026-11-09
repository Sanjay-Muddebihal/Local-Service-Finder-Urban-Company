# SMS Notifications Setup Guide

## Overview
This document explains how to set up SMS notifications to be sent to service providers when users book their services using Twilio.

## What Was Implemented

### Features Added:
1. **Automatic SMS Notifications** - When a user books a service, the service provider receives an SMS notification with:
   - Customer name
   - Customer phone number
   - Service description/category
   - Service address
   - Booking status
   
2. **Enhanced Booking Model** - Added `description` field to capture service details

3. **Improved Notification Service** - Integrated Twilio SMS API with:
   - Phone number formatting (auto-handles US/international formats)
   - Error handling (doesn't break booking if SMS fails)
   - Development mode logging (when Twilio isn't configured)

4. **Configuration via Environment Variables** - Supports flexible configuration through:
   - Environment variables (recommended for production)
   - application.properties (for development)

## Setup Steps

### 1. Create Twilio Account
- Go to https://www.twilio.com/console
- Sign up for a free account (includes $15 trial credit)
- Verify your phone number
- Get your Twilio credentials:
  - **Account SID**: Found in Twilio Console dashboard
  - **Auth Token**: Found in Twilio Console dashboard
  - **Phone Number**: Your Twilio phone number (e.g., +1234567890)

### 2. Configure Credentials

#### Option A: Using Environment Variables (Recommended for Production)
```bash
# Windows (PowerShell)
$env:TWILIO_ACCOUNT_SID = "your_account_sid_here"
$env:TWILIO_AUTH_TOKEN = "your_auth_token_here"
$env:TWILIO_PHONE_NUMBER = "+1234567890"

# Linux/Mac
export TWILIO_ACCOUNT_SID="your_account_sid_here"
export TWILIO_AUTH_TOKEN="your_auth_token_here"
export TWILIO_PHONE_NUMBER="+1234567890"
```

#### Option B: Using application.properties (Development Only)
Edit `backend/src/main/resources/application.properties`:
```properties
twilio.account.sid=your_account_sid_here
twilio.auth.token=your_auth_token_here
twilio.phone.number=+1234567890
```

⚠️ **NEVER commit credentials to version control!**

### 3. Build and Run
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Or use the Maven wrapper:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

### 4. Test the Feature

#### Using REST API:
```bash
# Create a booking (provider will receive SMS)
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerPhone": "+1234567890",
    "address": "123 Main St, City",
    "description": "Plumbing repair",
    "provider": {
      "id": 1
    }
  }'
```

#### Expected Behavior:
- **If Twilio is configured**: SMS sent to provider's phone number
- **If Twilio is NOT configured**: Message logged to console (development mode):
  ```
  📱 [SMS NOT CONFIGURED] To: +1234567890, Message: ...
  ```

### 5. Monitor SMS Logs

Check the application console/logs for:
- ✅ SMS sent successfully with SID
- ❌ SMS send failure with error details

## Phone Number Format

The system automatically formats phone numbers:
- **US/Canada**: `1234567890` → `+11234567890`
- **With country code**: `441234567890` → `+441234567890`
- **E.164 format**: `+1234567890` → no change
- **Non-digit cleanup**: `123-456-7890` → extracts digits only

## Booking Model Update

The `Booking` entity now includes a `description` field:
```java
private String description;  // Service description/type (e.g., "Plumbing repair", "Cleaning")
```

When creating a booking via API, include:
```json
{
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "address": "123 Main St",
  "description": "Plumbing repair",
  "provider": { "id": 1 }
}
```

## Development Mode (No Twilio Configured)

If Twilio credentials are not provided, the system:
- ✓ Still creates bookings successfully
- ✓ Logs notifications to console instead of sending SMS
- ✓ Logs a configuration reminder

Example console output:
```
📱 [SMS NOT CONFIGURED] To: +1234567890, Message: 🔔 New Service Booking!
⚠️  Configure Twilio credentials in application.properties to enable SMS notifications
```

## Troubleshooting

### Issue: "SMS NOT CONFIGURED" messages
**Solution**: Set Twilio credentials in application.properties or environment variables

### Issue: SMS fails with authentication error
**Solution**: Verify Account SID and Auth Token are correct (copy from Twilio Console)

### Issue: "Invalid phone number" error
**Solution**: Ensure phone numbers include country code (e.g., +1 for US)

### Issue: SMS doesn't send but no error
**Solution**: Check Twilio account balance/trial credits

## Database Migrations

If using existing database with old booking schema, you may need to:
```sql
ALTER TABLE bookings ADD COLUMN description VARCHAR(255);
```

(Hibernate will auto-create if using `ddl-auto=update`)

## Security Notes

1. **Never hardcode credentials** in code
2. **Use environment variables** for production
3. **Rotate Auth Tokens** regularly
4. **Monitor Twilio usage** to detect abuse
5. **Validate phone numbers** on client side before sending to backend

## Costs

Twilio pricing (as of 2024):
- SMS: ~$0.0075 per message (varies by country)
- Free trial: $15 initial credit
- Monitor usage in Twilio Console → Billing

## Next Steps

1. Test with your Twilio trial account
2. Set up monitoring/logging
3. Add SMS delivery confirmations (webhooks)
4. Consider notification preferences per provider
5. Add delivery status tracking in database

## Support

For issues:
- Check [Twilio Documentation](https://www.twilio.com/docs)
- Review application logs for error messages
- Verify phone number format in API requests
- Check Twilio account status in Console

---

**Last Updated**: May 7, 2026
