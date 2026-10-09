package com.sadms.backend.controller;

import com.sadms.backend.model.Shop;
import com.sadms.backend.model.Transaction;
import com.sadms.backend.repository.ShopRepository;
import com.sadms.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ShopRepository shopRepository;
    private final TransactionRepository transactionRepository;

    @GetMapping("/shops")
    public ResponseEntity<?> getPublicShops() {
        List<Map<String, Object>> shops = shopRepository.findAll().stream()
            .filter(Shop::isActive)
            .map(s -> {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", s.getId());
                map.put("name", s.getName());
                map.put("locationName", s.getLocationName());
                map.put("locationType", s.getLocationType());
                map.put("licenseNumber", s.getLicenseNumber());
                map.put("address", s.getAddress());
                return map;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(shops);
    }

    @GetMapping("/shop/{shopId}/sales/overview")
    public ResponseEntity<?> getShopSalesOverview(@PathVariable Long shopId) {
        Shop shop = shopRepository.findById(shopId).orElse(null);
        if (shop == null) {
            return ResponseEntity.notFound().build();
        }

        List<Transaction> txns = transactionRepository.findByShopAndStatus(shop, Transaction.Status.SUCCESS);
        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();
        int currentMonth = today.getMonthValue();

        double todaySales = 0;
        int todayBottles = 0;
        int todayCount = 0;

        double monthSales = 0;
        int monthBottles = 0;
        int monthCount = 0;

        double yearSales = 0;
        int yearBottles = 0;
        int yearCount = 0;

        for (Transaction t : txns) {
            LocalDateTime dt = t.getCreatedAt();
            LocalDate tDate = dt.toLocalDate();

            if (tDate.getYear() == currentYear) {
                yearSales += t.getTotalAmount();
                yearBottles += t.getQuantity();
                yearCount++;

                if (tDate.getMonthValue() == currentMonth) {
                    monthSales += t.getTotalAmount();
                    monthBottles += t.getQuantity();
                    monthCount++;

                    if (tDate.isEqual(today)) {
                        todaySales += t.getTotalAmount();
                        todayBottles += t.getQuantity();
                        todayCount++;
                    }
                }
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("shopId", shop.getId());
        response.put("shopName", shop.getName());
        response.put("locationName", shop.getLocationName());
        response.put("licenseNumber", shop.getLicenseNumber());

        response.put("today", Map.of(
            "amount", todaySales,
            "bottles", todayBottles,
            "transactions", todayCount
        ));

        response.put("monthly", Map.of(
            "amount", monthSales,
            "bottles", monthBottles,
            "transactions", monthCount
        ));

        response.put("yearly", Map.of(
            "amount", yearSales,
            "bottles", yearBottles,
            "transactions", yearCount
        ));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/shop/{shopId}/sales/weekly")
    public ResponseEntity<?> getShopWeeklySales(@PathVariable Long shopId) {
        Shop shop = shopRepository.findById(shopId).orElse(null);
        if (shop == null) return ResponseEntity.notFound().build();

        List<Transaction> txns = transactionRepository.findByShopAndStatus(shop, Transaction.Status.SUCCESS);
        LocalDate today = LocalDate.now();
        // Start from Monday of current week
        LocalDate monday = today.minusDays(today.getDayOfWeek().getValue() - 1);

        String[] dayNames = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        List<Map<String, Object>> weeklyData = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = monday.plusDays(i);
            double amount = 0;
            int bottles = 0;
            int count = 0;

            for (Transaction t : txns) {
                if (t.getCreatedAt().toLocalDate().isEqual(date)) {
                    amount += t.getTotalAmount();
                    bottles += t.getQuantity();
                    count++;
                }
            }

            Map<String, Object> dayMap = new LinkedHashMap<>();
            dayMap.put("label", dayNames[i]);
            dayMap.put("dayIndex", i + 1);
            dayMap.put("date", date.toString());
            dayMap.put("amount", amount);
            dayMap.put("bottles", bottles);
            dayMap.put("transactions", count);
            weeklyData.add(dayMap);
        }

        return ResponseEntity.ok(weeklyData);
    }

    @GetMapping("/shop/{shopId}/sales/daily")
    public ResponseEntity<?> getShopDailySales(@PathVariable Long shopId) {
        Shop shop = shopRepository.findById(shopId).orElse(null);
        if (shop == null) return ResponseEntity.notFound().build();

        List<Transaction> txns = transactionRepository.findByShopAndStatus(shop, Transaction.Status.SUCCESS);
        LocalDate now = LocalDate.now();
        int daysInMonth = now.lengthOfMonth();

        List<Map<String, Object>> dailyData = new ArrayList<>();
        for (int d = 1; d <= daysInMonth; d++) {
            LocalDate date = now.withDayOfMonth(d);
            double amount = 0;
            int bottles = 0;
            int count = 0;

            for (Transaction t : txns) {
                if (t.getCreatedAt().toLocalDate().isEqual(date)) {
                    amount += t.getTotalAmount();
                    bottles += t.getQuantity();
                    count++;
                }
            }

            Map<String, Object> dayMap = new LinkedHashMap<>();
            dayMap.put("label", "Day " + d);
            dayMap.put("day", d);
            dayMap.put("date", date.toString());
            dayMap.put("amount", amount);
            dayMap.put("bottles", bottles);
            dayMap.put("transactions", count);
            dailyData.add(dayMap);
        }

        return ResponseEntity.ok(dailyData);
    }

    @GetMapping("/shop/{shopId}/sales/monthly")
    public ResponseEntity<?> getShopMonthlySales(@PathVariable Long shopId) {
        Shop shop = shopRepository.findById(shopId).orElse(null);
        if (shop == null) return ResponseEntity.notFound().build();

        List<Transaction> txns = transactionRepository.findByShopAndStatus(shop, Transaction.Status.SUCCESS);
        int currentYear = LocalDate.now().getYear();

        List<Map<String, Object>> monthlyData = new ArrayList<>();
        for (Month month : Month.values()) {
            double amount = 0;
            int bottles = 0;
            int count = 0;

            for (Transaction t : txns) {
                LocalDateTime dt = t.getCreatedAt();
                if (dt.getYear() == currentYear && dt.getMonth() == month) {
                    amount += t.getTotalAmount();
                    bottles += t.getQuantity();
                    count++;
                }
            }

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("label", month.getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            m.put("monthNumber", month.getValue());
            m.put("amount", amount);
            m.put("bottles", bottles);
            m.put("transactions", count);
            monthlyData.add(m);
        }

        return ResponseEntity.ok(monthlyData);
    }

    @GetMapping("/shop/{shopId}/sales/yearly")
    public ResponseEntity<?> getShopYearlySales(@PathVariable Long shopId) {
        Shop shop = shopRepository.findById(shopId).orElse(null);
        if (shop == null) return ResponseEntity.notFound().build();

        List<Transaction> txns = transactionRepository.findByShopAndStatus(shop, Transaction.Status.SUCCESS);
        int currentYear = LocalDate.now().getYear();

        List<Map<String, Object>> yearlyData = new ArrayList<>();
        for (int y = currentYear - 2; y <= currentYear; y++) {
            double amount = 0;
            int bottles = 0;
            int count = 0;

            for (Transaction t : txns) {
                if (t.getCreatedAt().getYear() == y) {
                    amount += t.getTotalAmount();
                    bottles += t.getQuantity();
                    count++;
                }
            }

            Map<String, Object> yMap = new LinkedHashMap<>();
            yMap.put("label", String.valueOf(y));
            yMap.put("year", y);
            yMap.put("amount", amount);
            yMap.put("bottles", bottles);
            yMap.put("transactions", count);
            yearlyData.add(yMap);
        }

        return ResponseEntity.ok(yearlyData);
    }
}
