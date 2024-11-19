import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tasksFile = path.join(__dirname, "tasks.json");
let tasks = [];

function initializeTasks() {
  if (!fs.existsSync(tasksFile)) fs.writeFileSync(tasksFile, "[]");
  tasks = JSON.parse(fs.readFileSync(tasksFile, "utf-8"));
}

function writeTasks() {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

function addTask(description) {
  if (!description) {
    console.log("Description is required!");
    return;
  }

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  writeTasks();
  console.log(`Task added successfully (ID: ${newTask.id})`);
}

function updateTask(id, newDescription) {
  if (!id || !newDescription) {
    console.log("ID and new description are required!");
    return;
  }
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`Task with ID ${id} not found!`);
    return;
  }
  task.description = newDescription;
  task.updatedAt = new Date().toISOString();
  writeTasks();
  console.log("Task updated successfully");
}

function deleteTask(id) {
  if (!id) {
    console.log("ID is required");
    return;
  }
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length === initialLength) {
    console.log(`Task with ID ${id} not found!`);
    return;
  }

  writeTasks();
  console.log("Task deleted successfully");
}

function markTask(id, status) {
  if (!id || !status) {
    console.log("ID and status are required.");
    return;
  }

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();
  writeTasks();
  console.log(`Task marked as ${status}.`);
}

function listTasks(status) {
  const filteredTasks = status
    ? tasks.filter((t) => t.status === status)
    : tasks;
  if (!filteredTasks.length) {
    console.log("No task found!");
    return;
  }
  console.table(
    filteredTasks.map(({ id, description, status, createdAt, updatedAt }) => ({
      id,
      description,
      status,
      createdAt,
      updatedAt,
    }))
  );
}

function main() {
  initializeTasks();
  const [action, ...args] = process.argv.slice(2);
  switch (action) {
    case "add":
      addTask(args.join(" "));
      break;
    case "update":
      updateTask(parseInt(args[0]), args.slice(1).join(" "));
      break;
    case "delete":
      deleteTask(parseInt(args[0]));
      break;
    case "mark-in-progress":
      markTask(parseInt(args[0]), "in-progress");
      break;
    case "mark-done":
      markTask(parseInt(args[0]), "done");
      break;
    case "list":
      listTasks(args[0]);
      break;
    default:
      console.log(
        "Invalid command. Use 'add', 'update', 'delete', 'mark-in-progress', 'mark-done', or 'list'."
      );
  }
}

main();
