package com.pm.appointmentservice.service;

import com.pm.appointmentservice.client.PatientClient;
import com.pm.appointmentservice.model.Appointment;
import com.pm.appointmentservice.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientClient patientClient;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, PatientClient patientClient) {
        this.appointmentRepository = appointmentRepository;
        this.patientClient = patientClient;
    }

    @Override
    public Appointment scheduleAppointment(Appointment appointment) {
        // Verify patient exists before scheduling
        try {
            patientClient.getPatientById(appointment.getPatientId());
        } catch (Exception e) {
            throw new RuntimeException("Cannot schedule appointment: Patient not found with id " + appointment.getPatientId());
        }
        
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        return appointmentRepository.save(appointment);
    }

    @Override
    public Appointment updateAppointment(Long id, Appointment appointment) {
        Appointment existing = getAppointmentById(id);
        existing.setDoctorName(appointment.getDoctorName());
        existing.setAppointmentDateTime(appointment.getAppointmentDateTime());
        existing.setReason(appointment.getReason());
        existing.setStatus(appointment.getStatus());
        return appointmentRepository.save(existing);
    }

    @Override
    public void cancelAppointment(Long id) {
        Appointment existing = getAppointmentById(id);
        existing.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(existing);
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }
}
