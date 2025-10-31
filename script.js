// =================== LOGIN PAGE LOGIC ===================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username === "admin" && password === "pict123") {
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("loginMessage").innerText =
          "Invalid credentials!";
      }
    });
  }
});

// =================== DASHBOARD LOGIC ===================
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const tableBody = document.querySelector("#patientTable tbody");
  const addModal = document.getElementById("addModal");
  const modalAddBtn = document.getElementById("modalAddBtn");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const addBtn = document.getElementById("addPatientBtn");
  const delBtn = document.getElementById("deletePatientBtn");
  const undoBtn = document.getElementById("undoBtn");
  const sortBtn = document.getElementById("sortBtn");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const filterUrgency = document.getElementById("filterUrgency");

  // Data structures
  const patientList = new LinkedList();
  const deletedStack = new Stack();
  const waitingQueue = new Queue();

  // Load from localStorage or use defaults
  const storedData = JSON.parse(localStorage.getItem("patients")) || [
    {
      id: 1,
      name: "Rahul Mehta",
      age: 45,
      disease: "Fever",
      urgency: "Medium",
      date: "2025-10-29",
    },
    {
      id: 2,
      name: "Neha Sharma",
      age: 22,
      disease: "Accident",
      urgency: "High",
      date: "2025-10-30",
    },
    {
      id: 3,
      name: "Amit Desai",
      age: 31,
      disease: "Cold",
      urgency: "Low",
      date: "2025-10-30",
    },
  ];

  storedData.forEach((p) => {
    patientList.add(p);
    if (p.urgency === "High") waitingQueue.enqueue(p);
  });

  // =================== POPUP UTILITY ===================
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");
  const popupOkBtn = document.getElementById("popupOkBtn");

  function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = "flex";
  }

  popupOkBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Utility: Save to localStorage
  function saveToLocalStorage() {
    localStorage.setItem("patients", JSON.stringify(patientList.display()));
  }

  // Render functions
  function renderTable(patients = patientList.display()) {
    tableBody.innerHTML = "";
    patients.forEach((p) => {
      const row = `<tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.disease}</td>
        <td>${p.urgency}</td>
        <td>${p.date}</td>
      </tr>`;
      tableBody.innerHTML += row;
    });
  }

  function updateAll() {
    renderTable();
    saveToLocalStorage();
  }

  // Initial Render
  updateAll();

  // =================== ADD PATIENT (Modal) ===================
  addBtn.addEventListener("click", () => {
    addModal.style.display = "flex";
  });

  modalCloseBtn.addEventListener("click", () => {
    addModal.style.display = "none";
  });

  modalAddBtn.addEventListener("click", () => {
    const id = parseInt(document.getElementById("modalId").value);
    const name = document.getElementById("modalName").value.trim();
    const age = parseInt(document.getElementById("modalAge").value);
    const disease = document.getElementById("modalDisease").value.trim();
    const urgency = document.getElementById("modalUrgency").value;
    const date = new Date().toISOString().split("T")[0];

    if (!id || !name || !disease) {
      showPopup("Please fill all details!");
      return;
    }

    const newPatient = { id, name, age, disease, urgency, date };
    patientList.add(newPatient);
    if (urgency === "High") waitingQueue.enqueue(newPatient);

    updateAll();
    addModal.style.display = "none";

    // Clear modal fields
    document.querySelectorAll("#addModal input").forEach((i) => (i.value = ""));
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target == addModal) addModal.style.display = "none";
  });

  // =================== UNDO DELETE ===================
  undoBtn.addEventListener("click", () => {
    if (deletedStack.isEmpty()) return showPopup("Nothing to undo!");
    const restored = deletedStack.pop();
    patientList.add(restored);
    showPopup(`Restored patient: ${restored.name}`);
    updateAll();
  });

  // =================== SEARCH PATIENT ===================
  searchBtn.addEventListener("click", () => {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) return renderTable();

    const all = patientList.display();
    const results = all.filter(
      (p) => p.name.toLowerCase().includes(term) || p.id.toString() === term
    );

    if (results.length === 0) showPopup("No matching patient found!");
    renderTable(results);
  });

  // =================== SORT PATIENTS ===================
  sortBtn.addEventListener("click", () => {
    const urgencyOrder = { High: 1, Medium: 2, Low: 3 };
    const sorted = patientList
      .display()
      .sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
    renderTable(sorted);
  });

  // =================== FILTER BY URGENCY ===================
  filterUrgency.addEventListener("change", () => {
    const selected = filterUrgency.value;
    if (selected === "All") {
      renderTable();
    } else {
      const filtered = patientList
        .display()
        .filter((p) => p.urgency === selected);
      renderTable(filtered);
    }
  });

  // =================== DELETE PATIENT (Modal) ===================
  delBtn.addEventListener("click", () => {
    deleteModal.style.display = "flex";
  });

  closeDeleteBtn.addEventListener("click", () => {
    deleteModal.style.display = "none";
  });

  confirmDeleteBtn.addEventListener("click", () => {
    const id = parseInt(document.getElementById("deleteId").value);
    if (!id) {
      showPopup("Please enter a valid ID!");
      return;
    }

    const deleted = patientList.delete(id);
    if (deleted) {
      deletedStack.push(deleted);
      showPopup(`Deleted patient: ${deleted.name}`);
    } else {
      showPopup("No patient found with that ID!");
    }

    updateAll();
    deleteModal.style.display = "none";
    document.getElementById("deleteId").value = "";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target == deleteModal) deleteModal.style.display = "none";
  });
});
