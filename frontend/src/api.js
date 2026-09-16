const API_URL = "http://127.0.0.1:8000/api/patients/";

export async function getPatients() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Unable to load patient records.");
  return response.json();
}

export async function createPatient(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
}

export async function updatePatient(id, data) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
}

export async function deletePatient(id) {
  const response = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
  if (!response.ok) throw new Error("Unable to delete patient.");
}
