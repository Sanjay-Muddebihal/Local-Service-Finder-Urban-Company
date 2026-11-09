package com.localservice.controller;

import com.localservice.model.PaymentRequest;
import com.localservice.model.PaymentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
@RequiredArgsConstructor
public class PaymentController {

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody @Validated PaymentRequest paymentRequest) {
        if (paymentRequest.getAmount() == null || paymentRequest.getAmount() <= 0) {
            return ResponseEntity.badRequest().body(new PaymentResponse(null, "FAILED", paymentRequest.getAmount()));
        }
        if (paymentRequest.getPaymentMethod() == null || paymentRequest.getPaymentMethod().isBlank()) {
            return ResponseEntity.badRequest().body(new PaymentResponse(null, "FAILED", paymentRequest.getAmount()));
        }

        String method = paymentRequest.getPaymentMethod().toUpperCase().trim();
        switch (method) {
            case "CARD" -> {
                if (paymentRequest.getCardHolderName() == null || paymentRequest.getCardHolderName().isBlank()
                        || paymentRequest.getCardNumber() == null || paymentRequest.getCardNumber().isBlank()
                        || paymentRequest.getExpiry() == null || paymentRequest.getExpiry().isBlank()
                        || paymentRequest.getCvv() == null || paymentRequest.getCvv().isBlank()) {
                    return ResponseEntity.badRequest().body(new PaymentResponse(null, "FAILED", paymentRequest.getAmount()));
                }
            }
            case "UPI" -> {
                if (paymentRequest.getUpiId() == null || paymentRequest.getUpiId().isBlank()) {
                    return ResponseEntity.badRequest().body(new PaymentResponse(null, "FAILED", paymentRequest.getAmount()));
                }
            }
            case "NETBANKING" -> {
                if (paymentRequest.getBankName() == null || paymentRequest.getBankName().isBlank()
                        || paymentRequest.getAccountNumber() == null || paymentRequest.getAccountNumber().isBlank()) {
                    return ResponseEntity.badRequest().body(new PaymentResponse(null, "FAILED", paymentRequest.getAmount()));
                }
            }
            case "COD" -> {
                // Cash on Delivery requires no online payment details
            }
            default -> {
                return ResponseEntity.badRequest().body(new PaymentResponse(null, "FAILED", paymentRequest.getAmount()));
            }
        }

        String transactionId = method + "-" + UUID.randomUUID();
        PaymentResponse response = new PaymentResponse(transactionId, "SUCCESS", paymentRequest.getAmount());
        return ResponseEntity.ok(response);
    }
}
