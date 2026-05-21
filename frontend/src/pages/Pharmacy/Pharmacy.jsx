import { useEffect, useState } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout/DashboardLayout";
import { getMedicines, createMedicine, updateMedicine, deleteMedicine } from "../../services/medicineService";
import { useAuth } from "../../context/AuthContext";

const EMPTY = { medicineId: "", medicineName: "", stock: "", price: "" };

export default function Pharmacy() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchMedicines = async () => {
    try { setMedicines((await getMedicines()).data); } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (editId) {
        await updateMedicine(editId, formData);
      } else {
        await createMedicine(formData);
      }
      setFormData(EMPTY);
      setEditId(null);
      fetchMedicines();
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data || e.message || "Failed to save medicine.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to save medicine.");
    }
  };

  const handleEdit = (m) => {
    setEditId(m.id);
    setFormData({ medicineId: m.medicineId, medicineName: m.medicineName, stock: m.stock, price: m.price });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setEditId(null); setFormData(EMPTY); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try { await deleteMedicine(id); fetchMedicines(); } catch (e) { console.log(e); }
  };

  return (
    <DashboardLayout>
      <div className="card">
        <h2 className="page-title">Pharmacy</h2>

        <p className="section-header">{editId ? "EDIT MEDICINE" : "ADD MEDICINE"}</p>
        {errorMsg && <p className="login-error">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Medicine ID</label>
              <input name="medicineId" placeholder="e.g. M001" value={formData.medicineId} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Medicine Name</label>
              <input name="medicineName" placeholder="Medicine name" value={formData.medicineName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input name="stock" placeholder="Quantity" value={formData.stock} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input name="price" placeholder="0.00" value={formData.price} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit">{editId ? "Update Medicine" : "Save Medicine"}</button>
            {editId && <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>

        <p className="section-header" style={{ marginTop: "30px" }}>ALL MEDICINES</p>
        <table>
          <thead>
            <tr>
              <th>Medicine ID</th><th>Name</th><th>Stock</th><th>Price</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id}>
                <td>{m.medicineId}</td><td>{m.medicineName}</td><td>{m.stock}</td><td>{m.price}</td>
                {isAdmin && (
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(m)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(m.id)}>Delete</button>
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
