package com.sadms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Period;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(unique = true)
    private String mockAadhaarNumber;   // e.g. XXXX-XXXX-1234

    private String aadhaarId;

    @Column(unique = true)
    private String qrIdentifier;        // e.g. SADMS-CUSTOMER-1001

    private String maskedPhoneNumber;   // e.g. 98765***10

    private String mobile;

    private String rfidCard;

    @Column(nullable = false)
    private int dailyLimit = 1;          // 250 ml standard allocation (1 bottle per day)

    private boolean verified = true;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus = VerificationStatus.VERIFIED;

    private boolean blocked = false;

    public enum VerificationStatus {
        PENDING, VERIFIED, REJECTED
    }

    public boolean isVerified() {
        return (verified || verificationStatus == VerificationStatus.VERIFIED) && !blocked;
    }

    public int getAge() {
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
}

