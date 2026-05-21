import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout/DashboardLayout";
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from "../../services/appointmentService";
import { getAll as getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import { useAuth } from "../../context/AuthContext";

const EMPTY = { patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "", symptoms: "", status: "BOOKED" };

export default function Appointments() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const [aRes, pRes, dRes] = await Promise.all([getAppointments(), getPatients(), getDoctors()]);
      setAppointments(aRes.data);
      setPatients(pRes.data);
      setDoctors(dRes.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const payload = {
        patient: { id: Number(formData.patientId) },
        doctor: { id: Number(formData.doctorId) },
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        symptoms: formData.symptoms,
        status: formData.status,
      };
      if (editId) {
        await updateAppointment(editId, payload);
      } else {
        await createAppointment(payload);
      }
      setFormData(EMPTY);
      setEditId(null);
      fetchData();
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data || e.message || "Failed to save appointment.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to save appointment.");
    }
  };

  const handleEdit = (a) => {
    setEditId(a.id);
    setFormData({ patientId: a.patient?.id || "", doctorId: a.doctor?.id || "", appointmentDate: a.appointmentDate || "", appointmentTime: a.appointmentTime || "", symptoms: a.symptoms || "", status: a.status || "BOOKED" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setEditId(null); setFormData(EMPTY); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try { await deleteAppointment(id); fetchData(); } catch (e) { console.log(e); }
  };

  return (
    <DashboardLayout>
      <div className="card">
        <h2 className="page-title">Appointments</h2>

        <p className="section-header">{editId ? "EDIT APPOINTMENT" : "BOOK APPOINTMENT"}</p>
        {errorMsg && <p className="login-error">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient</label>
              <select name="patientId" value={formData.patientId} onChange={handleChange}>
                <option value="">Select Patient</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.patientId} — {p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Doctor</label>
              <select name="doctorId" value={formData.doctorId} onChange={handleChange}>
                <option value="">Select Doctor</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.doctorName} — {d.specialization}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Symptoms</label>
              <input name="symptoms" placeholder="Symptoms" value={formData.symptoms} onChange={handleChange} />
            </div>
            {editId && (
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="BOOKED">BOOKED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit">{editId ? "Update Appointment" : "Book Appointment"}</button>
            {editId && <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>

        <p className="section-header" style={{ marginTop: "30px" }}>ALL APPOINTMENTS</p>
        <table>
          <thead>
            <tr>
              <th>Appointment ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.appointmentId}</td><td>{a.patient?.name}</td>
                <td>{a.doctor?.doctorName}</td><td>{a.appointmentDate}</td><td>{a.status}</td>
                {isAdmin && (
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(a)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(a.id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
