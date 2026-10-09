package com.sadms.backend.config;

import com.sadms.backend.model.*;
import com.sadms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedShop();
        seedCustomers();
        seedProducts();
    }

    private void seedAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            User u = new User(); u.setUsername("admin");
            u.setPassword(passwordEncoder.encode("admin123")); u.setRole(User.Role.ADMIN);
            userRepository.save(u);
        }
    }

    private void seedShop() {
        // Automatically migrate any legacy "Sri Murugan Wine Shop" records
        shopRepository.findAll().forEach(s -> {
            if ("Sri Murugan Wine Shop".equalsIgnoreCase(s.getName()) || "Murugan K".equalsIgnoreCase(s.getOwnerName())) {
                s.setName("Government Wine Shop - Anna Nagar, Chennai");
                s.setLocationType("City");
                s.setLocationName("Anna Nagar, Chennai");
                s.setOwnerName("Government of Tamil Nadu (TASMAC)");
                s.setLicenseNumber("TASMAC-TN-CHN-4012");
                s.setAddress("Shop No. 4012, 2nd Avenue, Anna Nagar, Chennai - 600040");
                shopRepository.save(s);
            }
        });

        // City Outlet
        if (!userRepository.existsByUsername("shop1")) {
            User u = new User(); u.setUsername("shop1");
            u.setPassword(passwordEncoder.encode("shop123")); u.setRole(User.Role.SHOP);
            userRepository.save(u);

            Shop s = new Shop();
            s.setUser(userRepository.findByUsername("shop1").get());
            s.setName("Government Wine Shop - Anna Nagar, Chennai");
            s.setLocationType("City");
            s.setLocationName("Anna Nagar, Chennai");
            s.setOwnerName("Government of Tamil Nadu (TASMAC)");
            s.setLicenseNumber("TASMAC-TN-CHN-4012");
            s.setAddress("Shop No. 4012, 2nd Avenue, Anna Nagar, Chennai - 600040");
            shopRepository.save(s);
        }

        // Village Outlet
        if (!userRepository.existsByUsername("shop2")) {
            User u2 = new User(); u2.setUsername("shop2");
            u2.setPassword(passwordEncoder.encode("shop123")); u2.setRole(User.Role.SHOP);
            userRepository.save(u2);

            Shop s2 = new Shop();
            s2.setUser(userRepository.findByUsername("shop2").get());
            s2.setName("Government Wine Shop - Alanganallur Village, Madurai");
            s2.setLocationType("Village");
            s2.setLocationName("Alanganallur Village, Madurai");
            s2.setOwnerName("Government of Tamil Nadu (TASMAC)");
            s2.setLicenseNumber("TASMAC-TN-MDU-2105");
            s2.setAddress("Shop No. 2105, Main Bazaar Road, Alanganallur Village, Madurai - 625501");
            shopRepository.save(s2);
        }
    }

    private void seedCustomers() {
        seedCustomer("customer1", "cust123", "Arun Kumar",
                LocalDate.of(1995, 6, 15), "9876543210",
                "MOCK-XXXX-1001", "RFID-SADMS-00125", true);

        seedCustomer("customer2", "cust456", "Priya Devi",
                LocalDate.of(1998, 3, 22), "9876543211",
                "MOCK-XXXX-1002", "RFID-SADMS-00126", true);

        seedCustomer("customer3", "cust789", "Ravi Shankar",
                LocalDate.of(2007, 11, 5), "9876543212",
                "MOCK-XXXX-1003", "RFID-SADMS-00127", false);
    }

    private void seedCustomer(String username, String password, String name,
                               LocalDate dob, String mobile,
                               String aadhaar, String rfid, boolean verified) {
        if (!userRepository.existsByUsername(username)) {
            User u = new User(); u.setUsername(username);
            u.setPassword(passwordEncoder.encode(password)); u.setRole(User.Role.CUSTOMER);
            userRepository.save(u);

            Customer c = new Customer();
            c.setUser(userRepository.findByUsername(username).get());
            c.setName(name); c.setDateOfBirth(dob); c.setMobile(mobile);
            c.setAadhaarId(aadhaar); c.setRfidCard(rfid); c.setVerified(verified);
            customerRepository.save(c);
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            String[][] products = {
                {"Royal Stag Whisky", "Whisky", "450", "42"},
                {"Kingfisher Beer", "Beer", "120", "18"},
                {"Old Monk Rum", "Rum", "380", "30"},
                {"Sula Red Wine", "Wine", "520", "15"},
                {"Smirnoff Vodka", "Vodka", "650", "25"},
                {"McDowell Brandy", "Brandy", "320", "5"},
            };
            for (String[] p : products) {
                Product prod = new Product();
                prod.setName(p[0]); prod.setCategory(p[1]);
                prod.setPrice(Double.parseDouble(p[2]));
                prod.setAvailableQuantity(Integer.parseInt(p[3]));
                productRepository.save(prod);
            }
        }
    }
}
