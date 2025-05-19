const sections = [
  { id: "materials", input: "materialsFile", list: "materialsList" },
  { id: "documents", input: "documentsFile", list: "documentsList" },
  { id: "homework", input: "homeworkFile", list: "homeworkList" },
  { id: "notebooks", input: "notebooksFile", list: "notebooksList" }
];

function getFiles(category) {
  return JSON.parse(localStorage.getItem(`files_${category}`) || "[]");
}

function saveFiles(category, files) {
  localStorage.setItem(`files_${category}`, JSON.stringify(files));
}


function createFileEntry(fileObj, category) { 
  const entry = document.createElement("div");
  entry.className = "file-entry";

  entry.innerHTML = `
    <span>📄 <strong>${fileObj.name}</strong></span>
    <span>
      <a href="${fileObj.url}" download="${fileObj.name}" target="_blank" rel="noopener">[Open]</a>
      <button class="delete-btn" data-name="${fileObj.name}" data-category="${category}">Delete</button>
    </span>
  `;

  return entry;
}



function listFiles(category, list) {
  list.innerHTML = ""; 
  const files = getFiles(category);
  if (files.length === 0) {
    list.innerHTML = "<div class='file-entry'>No files uploaded yet.</div>"; 
  } else {
   
    files.forEach(fileObj => {
        const entry = createFileEntry(fileObj, category);
        list.appendChild(entry);
    });
  }
}


function uploadFile(file, category, list) {
  const reader = new FileReader();


  const loading = document.createElement("div");
  loading.className = "file-entry";
  loading.textContent = `Loading ${file.name}...`; 
  list.appendChild(loading);

  reader.onload = function(e) {
   
    loading.remove();

    const files = getFiles(category);
    
    const existingFileIndex = files.findIndex(f => f.name === file.name);

    if (existingFileIndex > -1) {
      alert(`File "${file.name}" already exists in ${category}.`);
      return; 
    }

    files.push({ name: file.name, url: e.target.result });
    saveFiles(category, files);
    listFiles(category, list); 
  };

  reader.onerror = function() {
    loading.textContent = `❌ Failed to read ${file.name}`;
    console.error("FileReader Error:", reader.error);
  };


  reader.readAsDataURL(file);
}


sections.forEach(({ id, input, list }) => {
  const fileInput = document.getElementById(input);
  const fileList = document.getElementById(list);

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        uploadFile(file, id, fileList);
    }
    fileInput.value = "";
  });

 
  fileList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const name = e.target.getAttribute("data-name");
      const category = e.target.getAttribute("data-category");
      const entryElement = e.target.closest(".file-entry"); 
      if (name && category && entryElement) {
        
        let files = getFiles(id); 
        files = files.filter(f => f.name !== name);
        saveFiles(id, files);
        entryElement.remove();
         alert(`"${name}" deleted locally.`);
      }
    }
  });

 
  document.addEventListener("DOMContentLoaded", () => {
    listFiles(id, fileList); 
  });
});
