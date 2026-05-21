package com.hms.controller;

import com.hms.entity.Bill;
import com.hms.repository.BillRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin("*")
public class BillController {

    private final BillRepository repository;

    public BillController(BillRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Bill createBill(@RequestBody Bill bill) {
        bill.setBillId(UUID.randomUUID().toString().substring(0, 8));
        bill.setTotalAmount(calcTotal(bill));
        return repository.save(bill);
    }

    @GetMapping
    public List<Bill> getBills() {
        return repository.findAll();
    }

    @PutMapping("/{id}")
    public Bill update(@PathVariable Long id, @RequestBody Bill data) {
        Bill existing = repository.findById(id).orElseThrow();
        existing.setPatient(data.getPatient());
        existing.setConsultationFee(data.getConsultationFee());
        existing.setMedicineFee(data.getMedicineFee());
        existing.setLabFee(data.getLabFee());
        existing.setTax(data.getTax());
        existing.setDiscount(data.getDiscount());
        existing.setPaymentMethod(data.getPaymentMethod());
        existing.setTotalAmount(calcTotal(data));
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Bill Deleted Successfully";
    }

    private Double calcTotal(Bill bill) {
        return bill.getConsultationFee()
                + bill.getMedicineFee()
                + bill.getLabFee()
                + bill.getTax()
                - bill.getDiscount();
    }
}
