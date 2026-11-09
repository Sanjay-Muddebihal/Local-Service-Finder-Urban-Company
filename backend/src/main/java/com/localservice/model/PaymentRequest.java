package com.localservice.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @Min(value = 1, message = "Amount must be positive")
    private Double amount;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String cardHolderName;
    private String cardNumber;
    private String expiry;
    private String cvv;

    private String upiId;
    private String bankName;
    private String accountNumber;
    private String ifsc;

    private String customerName;
    private String customerPhone;
    private Long providerId;
}
