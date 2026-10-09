package com.sadms.backend.repository;

import com.sadms.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByAvailableQuantityLessThanEqual(int qty);
}
