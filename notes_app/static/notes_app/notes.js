document.querySelector("form").addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.querySelector("form input[name='title']").value;
    const content = document.querySelector("form textarea[name='content']").value;
    if (content.length == 0) return
    const note = {
        title: title,
        content: content
    };
    let request = await fetch('/notes/', {
        method: 'POST',
        body: JSON.stringify(note)
    })
    request = await request.json();
    if (request.status == 0) {
        document.querySelectorAll("form input, form textarea").forEach(field => (!field.dataset["submit"]) ? field.value = "": null);
        document.querySelector("form textarea").style.height = "30px";
        await updateNoteList();
        await addOnClicks();
        return;
    }
});

async function updateNoteList() {
    const response = await fetch('/notes/');
    const data = await response.json();
    if (data.status == 0) {
        const notes = data.notes;
        const notesList = document.querySelector(".notes");
        notesList.innerHTML = "";
        notes.forEach(note => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note")
            noteElement.dataset.id = note.id;
            const noteTitle = document.createElement("div");
            noteTitle.classList.add("note-title");
            noteTitle.dataset.id = note.id;
            noteTitle.textContent = note.title;
            noteElement.appendChild(noteTitle);
            const noteContent = document.createElement("div");
            noteContent.classList.add("note-content");
            noteContent.dataset.id = note.id;
            noteContent.textContent = note.note;
            noteElement.appendChild(noteContent);
            const noteActions = document.createElement("div");
            noteActions.classList.add("note-actions");
            noteActions.dataset.id = note.id;
            const noteEdit = document.createElement("button");
            noteEdit.classList.add("note-edit");
            noteEdit.dataset.id = note.id;
            noteEdit.textContent = "Edit";
            noteActions.appendChild(noteEdit);
            const noteDelete = document.createElement("button");
            noteDelete.classList.add("note-delete");
            noteDelete.dataset.id = note.id;
            noteDelete.textContent = "Delete";
            noteActions.appendChild(noteDelete);
            noteElement.appendChild(noteActions);
            notesList.appendChild(noteElement);
        });
    }
}

async function addOnClicks() {
    document.querySelectorAll(".note-delete").forEach(button => {
        button.addEventListener('click', async e => {
            const noteId = {id: e.target.dataset.id};
            let request = await fetch(`/delete/`, {
                method: 'POST',
                body: JSON.stringify(noteId)
            })
            request = await request.json();
            if (request.status == 0) {
                await updateNoteList();
                await addOnClicks();
            }
        });
    })
    document.querySelectorAll(".note-edit").forEach(button => {
        button.addEventListener('click', async e => {
            const noteId = {id: e.target.dataset.id};
            const noteTitleElement = document.querySelector(`.note-title[data-id="${noteId.id}"]`);
            const noteContentElement = document.querySelector(`.note-content[data-id="${noteId.id}"]`);
            const noteContentEdit = document.createElement("textarea");
            noteContentEdit.classList.add("note-content-edit");
            noteContentEdit.dataset.id = noteId.id;
            noteContentEdit.value = document.querySelector(`.note-content[data-id="${noteId.id}"]`).textContent;
            noteContentEdit.placeholder = "Content";
            noteContentEdit.style.display = "block";
            noteContentElement.replaceWith(noteContentEdit);
            const noteTitleEdit = document.createElement("input");
            noteTitleEdit.classList.add("note-title-edit");
            noteTitleEdit.dataset.id = noteId.id;
            noteTitleEdit.type = "text";
            noteTitleEdit.name = "title";
            noteTitleEdit.placeholder = "Title";
            noteTitleEdit.value = document.querySelector(`.note-title[data-id="${noteId.id}"]`).textContent;
            noteTitleElement.replaceWith(noteTitleEdit);
            const noteSaveButton = document.createElement("button");
            noteSaveButton.classList.add("note-save");
            noteSaveButton.dataset.id = noteId.id;
            noteSaveButton.textContent = "Save";
            noteSaveButton.addEventListener('click', async e => {
                const note = {
                    id: e.target.dataset.id,
                    title: document.querySelector(`.note-title-edit[data-id="${noteId.id}"]`).value,
                    content: document.querySelector(`.note-content-edit[data-id="${noteId.id}"]`).value
                };
                if (note.content.length === 0) return
                let request = await fetch(`/edit/`, {
                    method: 'POST',
                    body: JSON.stringify(note)
                })
                request = await request.json();
                if (request.status == 0) {
                    await updateNoteList();
                    await addOnClicks();
                }
            })
            document.querySelector(`.note-actions[data-id="${noteId.id}"]`).appendChild(noteSaveButton);
            const noteCancelEditButton = document.createElement("button");
            noteCancelEditButton.classList.add("note-cancel-edit");
            noteCancelEditButton.dataset.id = noteId.id;
            noteCancelEditButton.innerHTML = "&#x2715;";
            noteCancelEditButton.addEventListener('click', async e => {await updateNoteList(); await addOnClicks();})
            document.querySelector(`.note-actions[data-id="${noteId.id}"]`).appendChild(noteCancelEditButton);

        });
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    await updateNoteList();
    addOnClicks();
})