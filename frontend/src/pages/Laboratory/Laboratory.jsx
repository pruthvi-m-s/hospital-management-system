import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout/DashboardLayout";
import { getLabReports, createLabReport, updateLabReport, deleteLabReport } from "../../services/labReportService";
import { getAll as getPatients } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

const EMPTY = { patientId: "", testName: "", result: "", remarks: "", status: "COMPLETED" };

export default function Laboratory() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const [rRes, pRes] = await Promise.all([getLabReports(), getPatients()]);
      setReports(rRes.data);
      setPatients(pRes.data);
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
        testName: formData.testName,
        result: formData.result,
        remarks: formData.remarks,
        status: formData.status,
      };
      if (editId) {
        await updateLabReport(editId, payload);
      } else {
        await createLabReport(payload);
      }
      setFormData(EMPTY);
      setEditId(null);
      fetchData();
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data || e.message || "Failed to save lab report.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to save lab report.");
    }
  };

  const handleEdit = (r) => {
    setEditId(r.id);
    setFormData({ patientId: r.patient?.id || "", testName: r.testName || "", result: r.result || "", remarks: r.remarks || "", status: r.status || "COMPLETED" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setEditId(null); setFormData(EMPTY); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lab report?")) return;
    try { await deleteLabReport(id); fetchData(); } catch (e) { console.log(e); }
  };

  return (
    <DashboardLayout>
      <div className="card">
        <h2 className="page-title">Laboratory</h2>

        <p className="section-header">{editId ? "EDIT LAB REPORT" : "ADD LAB REPORT"}</p>
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
              <label>Test Name</label>
              <input name="testName" placeholder="e.g. Blood Count" value={formData.testName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Result</label>
              <input name="result" placeholder="Test result" value={formData.result} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Remarks</label>
              <input name="remarks" placeholder="Additional remarks" value={formData.remarks} onChange={handleChange} />
            </div>
            {editId && (
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit">{editId ? "Update Report" : "Save Report"}</button>
            {editId && <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>

        <p className="section-header" style={{ marginTop: "30px" }}>ALL REPORTS</p>
        <table>
          <thead>
            <tr>
              <th>Report ID</th><th>Patient</th><th>Test</th><th>Result</th><th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.reportId}</td><td>{r.patient?.name}</td>
                <td>{r.testName}</td><td>{r.result}</td><td>{r.status}</td>
                {isAdmin && (
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(r)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(r.id)}>Delete</button>
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
