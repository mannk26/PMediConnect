package com.pm.appointmentservice.service;

import com.pm.appointmentservice.model.Appointment;
import java.util.List;

public interface AppointmentService {
    Appointment scheduleAppointment(Appointment appointment);
    Appointment updateAppointment(Long id, Appointment appointment);
    void cancelAppointment(Long id);
    Appointment getAppointmentById(Long id);
    List<Appointment> getAllAppointments();
    List<Appointment> getAppointmentsByPatientId(Long patientId);
}
