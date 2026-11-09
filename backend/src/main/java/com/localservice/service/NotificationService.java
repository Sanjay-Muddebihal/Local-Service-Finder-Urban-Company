package com.localservice.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    @Value("${twilio.account.sid:#{null}}")
    private String accountSid;

    @Value("${twilio.auth.token:#{null}}")
    private String authToken;

    @Value("${twilio.phone.number:#{null}}")
    private String twilioPhoneNumber;

    /**
     * Send SMS notification to provider's mobile number
     * @param phoneNumber Recipient's phone number (must be in E.164 format, e.g., +1234567890)
     * @param message Message content to send
     */
    public void sendSMS(String phoneNumber, String message) {
        try {
            // Check if Twilio is configured
            if (accountSid == null || accountSid.isEmpty() || 
                authToken == null || authToken.isEmpty() || 
                twilioPhoneNumber == null || twilioPhoneNumber.isEmpty()) {
                
                // If not configured, log the message instead (development mode)
                log.info("📱 [SMS NOT CONFIGURED] To: {}, Message: {}", phoneNumber, message);
                log.info("⚠️  Configure Twilio credentials in application.properties to enable SMS notifications");
                return;
            }

            // Initialize Twilio
            Twilio.init(accountSid, authToken);

            // Format phone number if needed (add +1 for US numbers without country code)
            String formattedNumber = formatPhoneNumber(phoneNumber);

            // Send SMS via Twilio
            Message smsMessage = Message.creator(
                    new PhoneNumber(formattedNumber),      // To number
                    new PhoneNumber(twilioPhoneNumber),    // From number
                    message                                 // Message body
            ).create();

            log.info("✅ SMS sent successfully. SID: {}", smsMessage.getSid());
            
        } catch (Exception e) {
            log.error("❌ Failed to send SMS to {}: {}", phoneNumber, e.getMessage(), e);
            // Don't throw exception to avoid breaking booking flow
        }
    }

    /**
     * Format phone number to E.164 format
     * @param phoneNumber Raw phone number
     * @return Formatted phone number in E.164 format
     */
    private String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }

        // Remove all non-digit characters except leading +
        String cleaned = phoneNumber.replaceAll("[^+\\d]", "");

        // If no country code, assume +1 (US/Canada)
        if (!cleaned.startsWith("+")) {
            if (cleaned.length() == 10) {
                cleaned = "+1" + cleaned;  // US/Canada
            } else if (cleaned.length() == 11 && cleaned.startsWith("1")) {
                cleaned = "+" + cleaned;
            } else {
                // Assume it already has country code, just add +
                cleaned = "+" + cleaned;
            }
        }

        return cleaned;
    }
}