package com.sadms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rejected_attempts")
@Data
@NoArgsConstructor
public class RejectedAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @Enumerated(EnumType.STRING)
    private ReasonCode reasonCode;

    private String reason;
    private String notificationPhone;
    private String notificationStatus;
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ReasonCode {
        UNDER_AGE, LIMIT_EXCEEDED, NOT_VERIFIED, INSUFFICIENT_STOCK
    }
}
