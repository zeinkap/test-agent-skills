let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let nextId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const list = document.getElementById('todo-list');
const footer = document.getElementById('footer');
const countEl = document.getElementById('count');
const clearBtn = document.getElementById('clear-completed');
const helpToggle = document.getElementById('help-toggle');
const helpPanel = document.getElementById('help-panel');

helpToggle.addEventListener('click', () => {
  const isHidden = helpPanel.hidden;
  helpPanel.hidden = !isHidden;
  helpToggle.classList.toggle('active', isHidden);
});

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.id = `todo-${todo.id}`;
    checkbox.addEventListener('change', () => toggle(todo.id));

    const label = document.createElement('label');
    label.htmlFor = `todo-${todo.id}`;
    label.textContent = todo.text;

    const tag = document.createElement('span');
    tag.className = `priority-tag ${todo.priority || 'medium'}`;
    tag.textContent = todo.priority || 'medium';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', () => remove(todo.id));

    li.append(checkbox, label, tag, deleteBtn);
    list.appendChild(li);
  });

  const remaining = todos.filter(t => !t.completed).length;
  countEl.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
  footer.hidden = todos.length === 0;
}

function add(text, priority) {
  todos.push({ id: nextId++, text, priority, completed: false });
  save();
  render();
}

function toggle(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  save();
  render();
}

function remove(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    add(text, prioritySelect.value);
    input.value = '';
    prioritySelect.value = 'medium';
  }
});

clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  save();
  render();
});

render();
