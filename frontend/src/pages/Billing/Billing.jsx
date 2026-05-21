import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout/DashboardLayout";
import { getBills, createBill, updateBill, deleteBill } from "../../services/billService";
import { getAll as getPatients } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

const EMPTY = { patientId: "", consultationFee: "", medicineFee: "", labFee: "", tax: "", discount: "", paymentMethod: "" };

export default function Billing() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const [bRes, pRes] = await Promise.all([getBills(), getPatients()]);
      setBills(bRes.data);
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
        consultationFee: Number(formData.consultationFee),
        medicineFee: Number(formData.medicineFee),
        labFee: Number(formData.labFee),
        tax: Number(formData.tax),
        discount: Number(formData.discount),
        paymentMethod: formData.paymentMethod,
      };
      if (editId) {
        await updateBill(editId, payload);
      } else {
        await createBill(payload);
      }
      setFormData(EMPTY);
      setEditId(null);
      fetchData();
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data || e.message || "Failed to save bill.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to save bill.");
    }
  };

  const handleEdit = (b) => {
    setEditId(b.id);
    setFormData({ patientId: b.patient?.id || "", consultationFee: b.consultationFee, medicineFee: b.medicineFee, labFee: b.labFee, tax: b.tax, discount: b.discount, paymentMethod: b.paymentMethod || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setEditId(null); setFormData(EMPTY); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    try { await deleteBill(id); fetchData(); } catch (e) { console.log(e); }
  };

  return (
    <DashboardLayout>
      <div className="card">
        <h2 className="page-title">Billing</h2>

        <p className="section-header">{editId ? "EDIT BILL" : "GENERATE BILL"}</p>
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
              <label>Consultation Fee</label>
              <input name="consultationFee" placeholder="0.00" value={formData.consultationFee} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Medicine Fee</label>
              <input name="medicineFee" placeholder="0.00" value={formData.medicineFee} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Lab Fee</label>
              <input name="labFee" placeholder="0.00" value={formData.labFee} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tax</label>
              <input name="tax" placeholder="0.00" value={formData.tax} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Discount</label>
              <input name="discount" placeholder="0.00" value={formData.discount} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <input name="paymentMethod" placeholder="Cash / Card / UPI" value={formData.paymentMethod} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit">{editId ? "Update Bill" : "Generate Bill"}</button>
            {editId && <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>

        <p className="section-header" style={{ marginTop: "30px" }}>ALL BILLS</p>
        <table>
          <thead>
            <tr>
              <th>Bill ID</th><th>Patient</th><th>Total</th><th>Payment</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.id}>
                <td>{b.billId}</td><td>{b.patient?.name}</td>
                <td>₹ {b.totalAmount}</td><td>{b.paymentMethod}</td>
                {isAdmin && (
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(b)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(b.id)}>Delete</button>
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
