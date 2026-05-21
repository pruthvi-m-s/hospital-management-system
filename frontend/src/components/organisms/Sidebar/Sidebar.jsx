import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const PatientIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
  </svg>
);
const DoctorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const BillingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const PharmacyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.5 20.5L3.5 13.5a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const LabIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>HMS</h2>
        <p>Hospital Management</p>
      </div>

      <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
        <DashboardIcon /> Dashboard
      </NavLink>

      <NavLink to="/patients" className={({ isActive }) => isActive ? "active" : ""}>
        <PatientIcon /> Patients
      </NavLink>

      {isAdmin && (
        <NavLink to="/doctors" className={({ isActive }) => isActive ? "active" : ""}>
          <DoctorIcon /> Doctors
        </NavLink>
      )}

      <NavLink to="/appointments" className={({ isActive }) => isActive ? "active" : ""}>
        <CalendarIcon /> Appointments
      </NavLink>

      <NavLink to="/billing" className={({ isActive }) => isActive ? "active" : ""}>
        <BillingIcon /> Billing
      </NavLink>

      {isAdmin && (
        <NavLink to="/pharmacy" className={({ isActive }) => isActive ? "active" : ""}>
          <PharmacyIcon /> Pharmacy
        </NavLink>
      )}

      <NavLink to="/laboratory" className={({ isActive }) => isActive ? "active" : ""}>
        <LabIcon /> Laboratory
      </NavLink>
    </div>
  );
}
