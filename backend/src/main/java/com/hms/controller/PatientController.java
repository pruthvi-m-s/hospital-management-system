package com.hms.controller;

import com.hms.entity.Patient;
import com.hms.repository.PatientRepository;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin("*")
public class PatientController {

    private final PatientRepository repository;

    public PatientController(PatientRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Patient create(@RequestBody Patient data) {
        return repository.save(data);
    }

    @GetMapping
    public List<Patient> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Patient getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Patient update(@PathVariable Long id, @RequestBody Patient data) {
        Patient existing = repository.findById(id).orElseThrow();
        existing.setPatientId(data.getPatientId());
        existing.setName(data.getName());
        existing.setAge(data.getAge());
        existing.setGender(data.getGender());
        existing.setPhone(data.getPhone());
        existing.setAddress(data.getAddress());
        existing.setBloodGroup(data.getBloodGroup());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Patient Deleted Successfully";
    }
}
