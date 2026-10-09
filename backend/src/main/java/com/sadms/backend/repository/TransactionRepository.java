package com.sadms.backend.repository;

import com.sadms.backend.model.Customer;
import com.sadms.backend.model.Shop;
import com.sadms.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCustomerOrderByCreatedAtDesc(Customer customer);

    List<Transaction> findByShopOrderByCreatedAtDesc(Shop shop);

    List<Transaction> findByShopAndStatus(Shop shop, Transaction.Status status);

    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM Transaction t WHERE t.customer = :customer AND t.createdAt >= :start AND t.createdAt < :end")
    int sumQuantityByCustomerAndDate(@Param("customer") Customer customer,
                                     @Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.totalAmount), 0) FROM Transaction t WHERE t.createdAt >= :start AND t.createdAt < :end")
    double sumTotalAmountByDate(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.createdAt >= :start AND t.createdAt < :end")
    long countByDate(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.totalAmount), 0) FROM Transaction t WHERE t.shop = :shop")
    double sumTotalAmountByShop(@Param("shop") Shop shop);
}
