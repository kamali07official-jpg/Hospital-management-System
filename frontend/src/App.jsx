import { useEffect, useMemo, useState } from "react";
import { getPatients, createPatient, updatePatient, deletePatient } from "./api";

const emptyForm = {
  full_name: "",
  age: "",
  gender: "",
  email: "",
  phone: "",
  blood_group: "",
  disease: "",
  admission_date: "",
};

const fields = [
  ["full_name", "Full Name", "text"],
  ["age", "Age", "number"],
  ["email", "Email", "email"],
  ["phone", "Phone", "tel"],
  ["disease", "Disease / Problem", "text"],
  ["admission_date", "Admission Date", "date"],
];

export default function App() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setPatients(await getPatients());
    } catch (error) {
      showMessage("Backend is not available. Start the Django server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    for (const [key] of fields) {
      if (!String(form[key]).trim()) return "Please fill all mandatory fields.";
    }
    if (!form.gender || !form.blood_group) return "Please select gender and blood group.";
    if (Number(form.age) < 1 || Number(form.age) > 120) return "Age must be between 1 and 120.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
    return "";
  };

  const readableError = (error) => {
    if (typeof error === "string") return error;
    if (error?.detail) return error.detail;
    if (typeof error === "object") {
      const firstKey = Object.keys(error)[0];
      if (firstKey) {
        const value = Array.isArray(error[firstKey]) ? error[firstKey][0] : error[firstKey];
        return `${firstKey.replace("_", " ")}: ${value}`;
      }
    }
    return "Something went wrong.";
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return showMessage(validationError, "error");

    const payload = { ...form, age: Number(form.age) };
    try {
      if (editingId) {
        await updatePatient(editingId, payload);
        showMessage("Patient updated successfully.", "success");
      } else {
        await createPatient(payload);
        showMessage("Patient added successfully.", "success");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadPatients();
    } catch (error) {
      showMessage(readableError(error), "error");
    }
  };

  const editPatient = (patient) => {
    setForm({
      full_name: patient.full_name,
      age: patient.age,
      gender: patient.gender,
      email: patient.email,
      phone: patient.phone,
      blood_group: patient.blood_group,
      disease: patient.disease,
      admission_date: patient.admission_date,
    });
    setEditingId(patient.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(id);
      showMessage("Patient deleted successfully.", "success");
      loadPatients();
    } catch (error) {
      showMessage(error.message || "Delete failed.", "error");
    }
  };

  const filteredPatients = useMemo(() => {
    const term = search.toLowerCase();
    return patients.filter((p) => {
      const matchesSearch = [p.full_name, p.email, p.phone, p.disease, p.blood_group]
        .join(" ").toLowerCase().includes(term);
      const matchesGender = genderFilter === "All" || p.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [patients, search, genderFilter]);

  return (
    <div className="app">
      <header>
        <div>
          <h1>🏥 Hospital Management System</h1>
          <p>Complete CRUD-Based Web Application</p>
        </div>
        <div className="stat">{patients.length}<span>Total Patients</span></div>
      </header>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <main>
        <section className="form-card">
          <h2>{editingId ? "Update Patient" : "Add New Patient"}</h2>
          <form onSubmit={submitForm}>
            <div className="form-grid">
              {fields.map(([name, label, type]) => (
                <label key={name}>
                  {label}
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={onChange}
                    min={name === "age" ? "1" : undefined}
                    max={name === "age" ? "120" : undefined}
                    required
                  />
                </label>
              ))}

              <label>
                Gender
                <select name="gender" value={form.gender} onChange={onChange} required>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Blood Group
                <select name="blood_group" value={form.blood_group} onChange={onChange} required>
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((x) =>
                    <option key={x}>{x}</option>
                  )}
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit">{editingId ? "Update Patient" : "Add Patient"}</button>
              {editingId && (
                <button type="button" className="secondary" onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="list-card">
          <div className="list-head">
            <div>
              <h2>Patient Records</h2>
              <p>{filteredPatients.length} record(s) displayed</p>
            </div>
            <div className="filters">
              <input
                placeholder="Search name, disease, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                <option>All</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th>
                  <th>Blood</th><th>Disease</th><th>Admission</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" className="center">Loading records...</td></tr>
                ) : filteredPatients.length === 0 ? (
                  <tr><td colSpan="9" className="center">No patient records found.</td></tr>
                ) : filteredPatients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td><strong>{p.full_name}</strong><br/><small>{p.email}</small></td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td>{p.phone}</td>
                    <td>{p.blood_group}</td>
                    <td>{p.disease}</td>
                    <td>{p.admission_date}</td>
                    <td className="actions">
                      <button className="edit" onClick={() => editPatient(p)}>Edit</button>
                      <button className="delete" onClick={() => removePatient(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer>React • Django REST Framework • SQLite • CRUD</footer>
    </div>
  );
}
