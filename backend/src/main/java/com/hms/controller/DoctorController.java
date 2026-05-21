package com.hms.controller;

import com.hms.entity.Doctor;
import com.hms.repository.DoctorRepository;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin("*")
public class DoctorController {

    private final DoctorRepository repository;

    public DoctorController(DoctorRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Doctor createDoctor(@Valid @RequestBody Doctor doctor) {
        return repository.save(doctor);
    }

    @GetMapping
    public List<Doctor> getDoctors() {
        return repository.findAll();
    }

    @PutMapping("/{id}")
    public Doctor update(@PathVariable Long id, @RequestBody Doctor data) {
        Doctor existing = repository.findById(id).orElseThrow();
        existing.setDoctorId(data.getDoctorId());
        existing.setDoctorName(data.getDoctorName());
        existing.setSpecialization(data.getSpecialization());
        existing.setQualification(data.getQualification());
        existing.setEmail(data.getEmail());
        existing.setPhone(data.getPhone());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Doctor Deleted Successfully";
    }
}
