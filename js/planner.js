let tasks = [];
try { tasks = JSON.parse(localStorage.getItem("tasks")) || [] } catch (e) { tasks = [] }
const form = document.getElementById("taskForm"), input = document.getElementById("taskInput"), list = document.getElementById("taskList"), count = document.getElementById("count");
function save() { try { localStorage.setItem("tasks", JSON.stringify(tasks)) } catch (e) { } }
function render() {
  list.innerHTML = "";
  tasks.forEach(t => {
    const li = document.createElement("li"); li.className = t.done ? "done" : "";
    const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = t.done; cb.setAttribute("aria-label", "Mark complete");
    cb.addEventListener("change", () => { t.done = cb.checked; save(); render() });
    const s = document.createElement("span"); s.textContent = t.text;
    const del = document.createElement("button"); del.textContent = "Delete";
    del.addEventListener("click", () => { tasks = tasks.filter(x => x.id !== t.id); save(); render() });
    li.append(cb, s, del); list.appendChild(li);
  });
  const left = tasks.filter(t => !t.done).length;
  count.textContent = tasks.length ? left + " of " + tasks.length + " tasks still to do" : "No tasks yet. Add your first task above.";
}
form.addEventListener("submit", e => {
  e.preventDefault(); const text = input.value.trim(); if (!text) return;
  tasks.push({ id: Date.now(), text: text, done: false }); input.value = ""; save(); render();
});
render();