package com.sadms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "shops")
@Data
@NoArgsConstructor
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String shopCode;

    private String locationType; // "City" or "Village"
    private String locationName; // e.g. "Anna Nagar, Chennai" or "Alanganallur Village, Madurai"
    private String ownerName;
    private String licenseNumber;
    private String address;
    private boolean active = true;
}
