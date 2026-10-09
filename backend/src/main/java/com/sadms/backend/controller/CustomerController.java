package com.sadms.backend.controller;

import com.sadms.backend.model.Customer;
import com.sadms.backend.model.Transaction;
import com.sadms.backend.model.User;
import com.sadms.backend.repository.CustomerRepository;
import com.sadms.backend.repository.TransactionRepository;
import com.sadms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private Customer getCustomer(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        return customerRepository.findByUser(user).orElseThrow();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        Customer c = getCustomer(auth);
        return ResponseEntity.ok(Map.of(
            "id", c.getId(),
            "name", c.getName(),
            "dateOfBirth", c.getDateOfBirth().toString(),
            "mobile", c.getMobile(),
            "aadhaarId", c.getAadhaarId() != null ? c.getAadhaarId() : "",
            "rfidCard", c.getRfidCard() != null ? c.getRfidCard() : "",
            "verified", c.isVerified(),
            "age", c.getAge()
        ));
    }

    @GetMapping("/purchase-summary")
    public ResponseEntity<?> getPurchaseSummary(Authentication auth) {
        Customer c = getCustomer(auth);
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        int todayPurchased = transactionRepository.sumQuantityByCustomerAndDate(c, start, end);
        return ResponseEntity.ok(Map.of(
            "todayPurchased", todayPurchased,
            "dailyLimit", c.getDailyLimit(),
            "remaining", Math.max(0, c.getDailyLimit() - todayPurchased)
        ));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<?>> getTransactions(Authentication auth) {
        Customer c = getCustomer(auth);
        List<Transaction> txns = transactionRepository.findByCustomerOrderByCreatedAtDesc(c);
        List<Map<String, Object>> result = txns.stream().map(t -> Map.<String, Object>of(
            "id", t.getId(),
            "billNumber", t.getBillNumber(),
            "shopName", t.getShop().getName(),
            "productName", t.getProduct().getName(),
            "quantity", t.getQuantity(),
            "totalAmount", t.getTotalAmount(),
            "createdAt", t.getCreatedAt().toString()
        )).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bills/{id}")
    public ResponseEntity<?> getBill(@PathVariable Long id, Authentication auth) {
        Customer c = getCustomer(auth);
        Transaction t = transactionRepository.findById(id).orElse(null);
        if (t == null || !t.getCustomer().getId().equals(c.getId())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of(
            "billNumber", t.getBillNumber(),
            "customerName", t.getCustomer().getName(),
            "shopName", t.getShop().getName(),
            "productName", t.getProduct().getName(),
            "quantity", t.getQuantity(),
            "unitPrice", t.getUnitPrice(),
            "totalAmount", t.getTotalAmount(),
            "createdAt", t.getCreatedAt().toString()
        ));
    }
}
