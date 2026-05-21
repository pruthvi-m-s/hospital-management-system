import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/templates/DashboardLayout/DashboardLayout";
import { getDashboard } from "../../services/dashboardService";

const PatientIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
  </svg>
);
const DoctorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const BillingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const PharmacyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.5 20.5L3.5 13.5a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const LabIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const modules = [
  {
    path: "/patients",
    title: "Patients",
    desc: "Register and manage patient records including personal details, blood group, and contact information.",
    icon: <PatientIcon />,
    iconClass: "mod-icon-blue",
  },
  {
    path: "/doctors",
    title: "Doctors",
    desc: "Maintain doctor profiles with specializations, qualifications, and contact details.",
    icon: <DoctorIcon />,
    iconClass: "mod-icon-green",
  },
  {
    path: "/appointments",
    title: "Appointments",
    desc: "Schedule and track patient appointments with doctors, including date, time, and symptoms.",
    icon: <CalendarIcon />,
    iconClass: "mod-icon-purple",
  },
  {
    path: "/billing",
    title: "Billing",
    desc: "Generate and manage patient bills covering consultation, medicine, lab fees, taxes, and discounts.",
    icon: <BillingIcon />,
    iconClass: "mod-icon-orange",
  },
  {
    path: "/pharmacy",
    title: "Pharmacy",
    desc: "Track medicine inventory with stock levels and pricing for the hospital pharmacy.",
    icon: <PharmacyIcon />,
    iconClass: "mod-icon-teal",
  },
  {
    path: "/laboratory",
    title: "Laboratory",
    desc: "Record and monitor lab test reports linked to patients with test results and status tracking.",
    icon: <LabIcon />,
    iconClass: "mod-icon-red",
  },
];

export default function Dashboard(){
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const fetchDashboard = async() => {
    try{
      const response = await getDashboard();
      setData(response.data);
    }catch(error){
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return(
    <DashboardLayout>
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>Welcome to HMS</h2>
          <p>Hospital Management System — manage patients, doctors, appointments,<br/>billing, pharmacy, and lab reports from one place.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-blue"><PatientIcon /></div>
          <div>
            <div className="stat-card-label">Total Patients</div>
            <div className="stat-card-value">{data.totalPatients ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green"><DoctorIcon /></div>
          <div>
            <div className="stat-card-label">Total Doctors</div>
            <div className="stat-card-value">{data.totalDoctors ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-purple"><CalendarIcon /></div>
          <div>
            <div className="stat-card-label">Total Appointments</div>
            <div className="stat-card-value">{data.totalAppointments ?? 0}</div>
          </div>
        </div>
      </div>

      <div className="modules-section-title">System Modules</div>
      <div className="modules-section-sub">Quick access to all hospital management sections</div>

      <div className="grid">
        {modules.map((mod) => (
          <div key={mod.path} className="module-card" onClick={() => navigate(mod.path)}>
            <div className="module-card-header">
              <div className={`mod-icon-wrap ${mod.iconClass}`}>{mod.icon}</div>
              <ArrowIcon />
            </div>
            <h3>{mod.title}</h3>
            <p>{mod.desc}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
