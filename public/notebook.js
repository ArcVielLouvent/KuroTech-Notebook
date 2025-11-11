const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notes-container");
const token = localStorage.getItem("token");

// Logout
function logout(){
  localStorage.clear();
  window.location.href="login.html";
}

// Fetch notes
async function fetchNotes(){
  const res = await fetch("/api/notebook",{
    headers:{Authorization:`Bearer ${token}`}
  });
  const notes = await res.json();
  renderNotes(notes);
}

// Render notes (max 3 per row)
function renderNotes(notes){
  notesContainer.innerHTML="";
  notes.forEach(note=>{
    const div = document.createElement("div");
    div.className="note";
    div.innerHTML=`<h3>${note.title}</h3><p>${note.content}</p>
      <div>
        <button onclick="editNote(${note.id})">Edit</button>
        <button onclick="deleteNote(${note.id})">Delete</button>
      </div>`;
    notesContainer.appendChild(div);
  });
}

// Add note
addNoteBtn.addEventListener("click", async()=>{
  if(!noteTitle.value||!noteContent.value)return;
  await fetch("/api/notebook",{
    method:"POST",
    headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`},
    body: JSON.stringify({title:noteTitle.value, content:noteContent.value})
  });
  noteTitle.value=""; noteContent.value="";
  fetchNotes();
});

// Edit & delete (simplified)
window.editNote=async(id)=>{
  const newTitle=prompt("Edit title");
  const newContent=prompt("Edit content");
  if(newTitle && newContent){
    await fetch(`/api/notebook/${id}`,{
      method:"PUT",
      headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`},
      body: JSON.stringify({title:newTitle, content:newContent})
    });
    fetchNotes();
  }
};

window.deleteNote=async(id)=>{
  if(confirm("Delete this note?")){
    await fetch(`/api/notebook/${id}`,{
      method:"DELETE",
      headers:{Authorization:`Bearer ${token}`}
    });
    fetchNotes();
  }
};

fetchNotes();
