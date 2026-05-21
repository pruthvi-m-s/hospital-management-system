import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout/DashboardLayout";
import { getAll, createData, updatePatient, deletePatient } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

const EMPTY = { patientId: "", name: "", age: "", gender: "", phone: "", address: "", bloodGroup: "" };

export default function Patients() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPatients = async () => {
    try { setPatients((await getAll()).data); } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (editId) {
        await updatePatient(editId, formData);
        setSuccessMsg("Patient updated successfully.");
      } else {
        await createData(formData);
        setSuccessMsg("Patient saved successfully.");
      }
      setFormData(EMPTY);
      setEditId(null);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchPatients();
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data || e.message || "Failed to save patient.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to save patient.");
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setFormData({ patientId: p.patientId, name: p.name, age: p.age, gender: p.gender, phone: p.phone, address: p.address || "", bloodGroup: p.bloodGroup || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setEditId(null); setFormData(EMPTY); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient? This will also remove linked appointments, bills and lab reports.")) return;
    try { await deletePatient(id); fetchPatients(); } catch (e) { console.log(e); }
  };

  return (
    <DashboardLayout>
      <div className="card">
        <h2 className="page-title">Patients</h2>

        <p className="section-header">{editId ? "EDIT PATIENT" : "ADD NEW PATIENT"}</p>
        {successMsg && <p className="success-text">{successMsg}</p>}
        {errorMsg && <p className="login-error">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient ID</label>
              <input name="patientId" placeholder="e.g. P001" value={formData.patientId} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input name="name" placeholder="Full name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <input name="gender" placeholder="Male / Female" value={formData.gender} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" placeholder="10-digit number" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <input name="bloodGroup" placeholder="e.g. O+" value={formData.bloodGroup} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit">{editId ? "Update Patient" : "Save Patient"}</button>
            {editId && <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>

        <p className="section-header" style={{ marginTop: "30px" }}>ALL PATIENTS</p>
        <table>
          <thead>
            <tr>
              <th>Patient ID</th><th>Name</th><th>Age</th><th>Gender</th>
              <th>Phone</th><th>Address</th><th>Blood Group</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.patientId}</td><td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td>
                <td>{p.phone}</td><td>{p.address}</td><td>{p.bloodGroup}</td>
                {isAdmin && (
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
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
