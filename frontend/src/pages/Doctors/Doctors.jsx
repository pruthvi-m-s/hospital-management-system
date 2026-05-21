import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout/DashboardLayout";
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from "../../services/doctorService";
import { useAuth } from "../../context/AuthContext";

const EMPTY = { doctorId: "", doctorName: "", specialization: "", qualification: "", email: "", phone: "" };

export default function Doctors() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchDoctors = async () => {
    try { setDoctors((await getDoctors()).data); } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (editId) {
        await updateDoctor(editId, formData);
        setSuccessMsg("Doctor updated successfully.");
      } else {
        await createDoctor(formData);
        setSuccessMsg("Doctor saved successfully.");
      }
      setFormData(EMPTY);
      setEditId(null);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchDoctors();
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data || e.message || "Failed to save doctor.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to save doctor.");
    }
  };

  const handleEdit = (d) => {
    setEditId(d.id);
    setFormData({ doctorId: d.doctorId, doctorName: d.doctorName, specialization: d.specialization, qualification: d.qualification || "", email: d.email || "", phone: d.phone || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setEditId(null); setFormData(EMPTY); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor? This will also remove linked appointments.")) return;
    try { await deleteDoctor(id); fetchDoctors(); } catch (e) { console.log(e); }
  };

  return (
    <DashboardLayout>
      <div className="card">
        <h2 className="page-title">Doctors</h2>

        <p className="section-header">{editId ? "EDIT DOCTOR" : "ADD NEW DOCTOR"}</p>
        {successMsg && <p className="success-text">{successMsg}</p>}
        {errorMsg && <p className="login-error">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Doctor ID</label>
              <input name="doctorId" placeholder="e.g. D001" value={formData.doctorId} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Doctor Name</label>
              <input name="doctorName" placeholder="Full name" value={formData.doctorName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input name="specialization" placeholder="e.g. Cardiology" value={formData.specialization} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Qualification</label>
              <input name="qualification" placeholder="e.g. MBBS, MD" value={formData.qualification} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" placeholder="Email address" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" placeholder="10-digit number" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit">{editId ? "Update Doctor" : "Save Doctor"}</button>
            {editId && <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>

        <p className="section-header" style={{ marginTop: "30px" }}>ALL DOCTORS</p>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Specialization</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id}>
                <td>{d.doctorId}</td><td>{d.doctorName}</td><td>{d.specialization}</td>
                {isAdmin && (
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(d)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(d.id)}>Delete</button>
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
