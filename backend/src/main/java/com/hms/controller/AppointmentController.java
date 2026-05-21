package com.hms.controller;

import com.hms.entity.Appointment;
import com.hms.repository.AppointmentRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin("*")
public class AppointmentController {

    private final AppointmentRepository repository;

    public AppointmentController(AppointmentRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        appointment.setAppointmentId(UUID.randomUUID().toString().substring(0, 8));
        appointment.setStatus("BOOKED");
        return repository.save(appointment);
    }

    @GetMapping
    public List<Appointment> getAppointments() {
        return repository.findAll();
    }

    @PutMapping("/{id}")
    public Appointment update(@PathVariable Long id, @RequestBody Appointment data) {
        Appointment existing = repository.findById(id).orElseThrow();
        existing.setPatient(data.getPatient());
        existing.setDoctor(data.getDoctor());
        existing.setAppointmentDate(data.getAppointmentDate());
        existing.setAppointmentTime(data.getAppointmentTime());
        existing.setSymptoms(data.getSymptoms());
        existing.setStatus(data.getStatus());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Appointment Deleted Successfully";
    }
}
