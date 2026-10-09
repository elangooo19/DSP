package com.sadms.backend.controller;

import com.sadms.backend.model.*;
import com.sadms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopRepository shopRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private Shop getShop(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        return shopRepository.findByUser(user).orElseThrow();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Authentication auth) {
        Shop shop = getShop(auth);
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        double todaySales = transactionRepository.sumTotalAmountByDate(start, end);
        long todayTxns = transactionRepository.countByDate(start, end);
        int totalStock = productRepository.findAll().stream().mapToInt(Product::getAvailableQuantity).sum();
        long lowStock = productRepository.findByAvailableQuantityLessThanEqual(5).size();
        return ResponseEntity.ok(Map.of(
            "todaySales", todaySales,
            "todayTransactions", todayTxns,
            "totalStock", totalStock,
            "lowStockCount", lowStock
        ));
    }

    @PostMapping("/verify-rfid")
    public ResponseEntity<?> verifyRfid(@RequestBody Map<String, String> body) {
        String rfid = body.get("rfidCard");
        Customer c = customerRepository.findByRfidCard(rfid).orElse(null);
        if (c == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Customer not found for RFID: " + rfid));
        }
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        int todayPurchased = transactionRepository.sumQuantityByCustomerAndDate(c, start, end);
        int remaining = Math.max(0, c.getDailyLimit() - todayPurchased);
        boolean ageEligible = c.getAge() >= 18;
        boolean limitAvailable = remaining > 0;

        return ResponseEntity.ok(Map.of(
            "id", c.getId(),
            "name", c.getName(),
            "mobile", c.getMobile(),
            "rfidCard", c.getRfidCard(),
            "age", c.getAge(),
            "verified", c.isVerified() && !c.isBlocked(),
            "ageEligible", ageEligible,
            "limitAvailable", limitAvailable,
            "todayPurchased", todayPurchased,
            "remaining", remaining
        ));
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sell(@RequestBody Map<String, Object> body, Authentication auth) {
        Shop shop = getShop(auth);
        Long customerId = Long.valueOf(body.get("customerId").toString());
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = Integer.parseInt(body.get("quantity").toString());

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!customer.isVerified() || customer.isBlocked()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Customer is not verified or is blocked"));
        }
        if (customer.getAge() < 18) {
            return ResponseEntity.badRequest().body(Map.of("message", "Customer is under 18"));
        }
        if (product.getAvailableQuantity() < quantity) {
            return ResponseEntity.badRequest().body(Map.of("message", "Insufficient stock"));
        }

        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        int todayPurchased = transactionRepository.sumQuantityByCustomerAndDate(customer, start, end);
        int remaining = customer.getDailyLimit() - todayPurchased;

        if (quantity > remaining) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Purchase exceeds daily limit. Remaining: " + (remaining * 250) + " ml (" + remaining + " bottle(s))"
            ));
        }

        product.setAvailableQuantity(product.getAvailableQuantity() - quantity);
        productRepository.save(product);

        Transaction txn = new Transaction();
        txn.setBillNumber("BILL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        txn.setCustomer(customer);
        txn.setShop(shop);
        txn.setProduct(product);
        txn.setQuantity(quantity);
        txn.setUnitPrice(product.getPrice());
        txn.setTotalAmount(product.getPrice() * quantity);
        transactionRepository.save(txn);

        return ResponseEntity.ok(Map.of(
            "billNumber", txn.getBillNumber(),
            "customerName", customer.getName(),
            "shopName", shop.getName(),
            "productName", product.getName(),
            "quantity", txn.getQuantity(),
            "unitPrice", txn.getUnitPrice(),
            "totalAmount", txn.getTotalAmount(),
            "createdAt", txn.getCreatedAt().toString()
        ));
    }

    @GetMapping("/products")
    public ResponseEntity<?> getProducts() {
        List<Map<String, Object>> result = productRepository.findAll().stream().map(p -> Map.<String, Object>of(
            "id", p.getId(),
            "name", p.getName(),
            "category", p.getCategory(),
            "price", p.getPrice(),
            "availableQuantity", p.getAvailableQuantity()
        )).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> body) {
        Product p = new Product();
        p.setName(body.get("name").toString());
        p.setCategory(body.get("category").toString());
        p.setPrice(Double.parseDouble(body.get("price").toString()));
        p.setAvailableQuantity(Integer.parseInt(body.get("availableQuantity").toString()));
        productRepository.save(p);
        return ResponseEntity.ok(Map.of("message", "Product added", "id", p.getId()));
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(Authentication auth) {
        Shop shop = getShop(auth);
        List<Transaction> txns = transactionRepository.findByShopOrderByCreatedAtDesc(shop);
        List<Map<String, Object>> result = txns.stream().map(t -> Map.<String, Object>of(
            "id", t.getId(),
            "billNumber", t.getBillNumber(),
            "customerName", t.getCustomer().getName(),
            "productName", t.getProduct().getName(),
            "quantity", t.getQuantity(),
            "totalAmount", t.getTotalAmount(),
            "createdAt", t.getCreatedAt().toString()
        )).toList();
        return ResponseEntity.ok(result);
    }
}
