package com.sadms.backend.controller;

import com.sadms.backend.model.*;
import com.sadms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CustomerRepository customerRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        return ResponseEntity.ok(Map.of(
            "totalCustomers", customerRepository.count(),
            "totalShops", shopRepository.count(),
            "todaySales", transactionRepository.sumTotalAmountByDate(start, end),
            "totalTransactions", transactionRepository.count(),
            "totalStock", productRepository.findAll().stream().mapToInt(Product::getAvailableQuantity).sum(),
            "blockedCustomers", customerRepository.findAll().stream().filter(Customer::isBlocked).count()
        ));
    }

    @GetMapping("/customers")
    public ResponseEntity<?> getCustomers() {
        List<Map<String, Object>> result = customerRepository.findAll().stream().map(c -> Map.<String, Object>of(
            "id", c.getId(),
            "name", c.getName(),
            "mobile", c.getMobile(),
            "aadhaarId", c.getAadhaarId() != null ? c.getAadhaarId() : "",
            "rfidCard", c.getRfidCard() != null ? c.getRfidCard() : "",
            "age", c.getAge(),
            "verified", c.isVerified(),
            "blocked", c.isBlocked()
        )).toList();
        return ResponseEntity.ok(result);
    }

    @PutMapping("/customers/{id}/block")
    public ResponseEntity<?> blockCustomer(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Customer c = customerRepository.findById(id).orElseThrow();
        c.setBlocked(body.get("blocked"));
        customerRepository.save(c);
        return ResponseEntity.ok(Map.of("message", "Updated"));
    }

    @GetMapping("/shops")
    public ResponseEntity<?> getShops() {
        List<Map<String, Object>> result = shopRepository.findAll().stream().map(s -> {
            Map<String, Object> m = new java.util.HashMap<>();
            m.put("id", s.getId());
            m.put("name", s.getName());
            m.put("locationType", s.getLocationType() != null ? s.getLocationType() : "City");
            m.put("locationName", s.getLocationName() != null ? s.getLocationName() : "");
            m.put("ownerName", s.getOwnerName() != null ? s.getOwnerName() : "Government of Tamil Nadu (TASMAC)");
            m.put("licenseNumber", s.getLicenseNumber() != null ? s.getLicenseNumber() : "");
            m.put("address", s.getAddress() != null ? s.getAddress() : "");
            m.put("active", s.isActive());
            return m;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/shops")
    public ResponseEntity<?> createShop(@RequestBody Map<String, Object> body) {
        Shop s = new Shop();
        s.setName((String) body.getOrDefault("name", "Government Wine Shop"));
        s.setLocationType((String) body.getOrDefault("locationType", "City"));
        s.setLocationName((String) body.getOrDefault("locationName", ""));
        s.setOwnerName((String) body.getOrDefault("ownerName", "Government of Tamil Nadu (TASMAC)"));
        s.setLicenseNumber((String) body.getOrDefault("licenseNumber", "TASMAC-TN-" + (System.currentTimeMillis() % 10000)));
        s.setAddress((String) body.getOrDefault("address", ""));
        s.setActive(true);
        s.setShopCode("TASMAC-" + (shopRepository.count() + 1));
        Shop saved = shopRepository.save(s);
        return ResponseEntity.ok(Map.of("message", "Shop created successfully", "id", saved.getId()));
    }

    @PutMapping("/shops/{id}/toggle")
    public ResponseEntity<?> toggleShop(@PathVariable Long id) {
        Shop s = shopRepository.findById(id).orElseThrow();
        s.setActive(!s.isActive());
        shopRepository.save(s);
        return ResponseEntity.ok(Map.of("message", "Shop status updated", "active", s.isActive()));
    }

    @GetMapping("/inventory")
    public ResponseEntity<?> getInventory() {
        List<Map<String, Object>> result = productRepository.findAll().stream().map(p -> Map.<String, Object>of(
            "id", p.getId(),
            "name", p.getName(),
            "category", p.getCategory() != null ? p.getCategory() : "",
            "price", p.getPrice(),
            "availableQuantity", p.getAvailableQuantity()
        )).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions() {
        List<Map<String, Object>> result = transactionRepository.findAll().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .map(t -> Map.<String, Object>of(
                "id", t.getId(),
                "billNumber", t.getBillNumber(),
                "customerName", t.getCustomer().getName(),
                "shopName", t.getShop().getName(),
                "productName", t.getProduct().getName(),
                "quantity", t.getQuantity(),
                "totalAmount", t.getTotalAmount(),
                "createdAt", t.getCreatedAt().toString()
            )).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        List<Product> products = productRepository.findAll();
        long inStock = products.stream().filter(p -> p.getAvailableQuantity() > 5).count();
        long lowStock = products.stream().filter(p -> p.getAvailableQuantity() > 0 && p.getAvailableQuantity() <= 5).count();
        long outOfStock = products.stream().filter(p -> p.getAvailableQuantity() == 0).count();
        double totalRevenue = transactionRepository.findAll().stream().mapToDouble(Transaction::getTotalAmount).sum();

        List<Map<String, Object>> shopSales = shopRepository.findAll().stream().map(s -> Map.<String, Object>of(
            "shopName", s.getName(),
            "totalSales", transactionRepository.sumTotalAmountByShop(s)
        )).toList();

        return ResponseEntity.ok(Map.of(
            "todaySales", transactionRepository.sumTotalAmountByDate(start, end),
            "totalRevenue", totalRevenue,
            "totalTransactions", transactionRepository.count(),
            "todayTransactions", transactionRepository.countByDate(start, end),
            "inStockCount", inStock,
            "lowStockCount", lowStock,
            "outOfStockCount", outOfStock,
            "shopSales", shopSales
        ));
    }
}
