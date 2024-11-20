import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "json2csv";
import { Command } from "commander";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expenseFile = path.join(__dirname, "expenses.json");
let expenses = [];

function initializeExpenses() {
  if (!fs.existsSync(expenseFile)) {
    fs.writeFileSync(expenseFile, "[]");
  }
  expenses = JSON.parse(fs.readFileSync(expenseFile, "utf-8"));
}

function writeExpenses() {
  fs.writeFileSync(expenseFile, JSON.stringify(expenses, null, 2));
}

function addExpense(description, amount, category = "Miscellaneous") {
  if (!description || !amount) {
    console.error("Description and Amount are required");
    return;
  }

  if (amount <= 0) {
    console.error("Amount must be greater than 0.");
    return;
  }

  const newExpense = {
    id: expenses.length ? expenses[expenses.length - 1].id + 1 : 1,
    description,
    amount: parseFloat(amount),
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  expenses.push(newExpense);
  writeExpenses();
  console.log(`Expense added successfully (ID: ${newExpense.id})`);
}

function updateExpense(id, updates) {
  const expense = expenses.find((item) => item.id === id);
  if (!expense) {
    console.error(`Expense with ID ${id} not found!`);
    return;
  }
  if (Object.keys(updates).length === 0) {
    console.error("No updates provided, No changes made");
    return;
  }
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined && key in expense && key !== "id") {
      expense[key] = updates[key];
    }
  });
  expense.updatedAt = new Date().toISOString();
  writeExpenses();
  console.log(`Expense with ${id} updated successfully`);
}

function deleteExpense(id) {
  if (!id) {
    console.error("ID is required!");
    return;
  }
  const initialLength = expenses.length;
  expenses = expenses.filter((item) => item.id !== id);
  if (expenses.length === initialLength) {
    console.error(`Expense with ID ${id} not found!`);
    return;
  }

  writeExpenses();
  console.log(`Expense with ID ${id} deleted sucessfully!`);
}

function listExpenses() {
  console.table(
    expenses.map(
      ({ id, description, amount, category, createdAt, updatedAt }) => ({
        id,
        description,
        amount,
        category,
        createdAt,
        updatedAt,
      })
    )
  );
}

function viewSummary(month = null) {
  let filteredExpenses = expenses;

  if (month !== null) {
    const currentYear = new Date().getFullYear();
    filteredExpenses = expenses.filter((item) => {
      const expenseDate = new Date(item.createdAt);
      return (
        expenseDate.getMonth() + 1 === month &&
        expenseDate.getFullYear() === currentYear
      );
    });
  }

  const totalAmount = filteredExpenses.reduce(
    (sum, acc) => sum + parseFloat(acc.amount),
    0
  );
  console.log(
    `Total expenses${month ? ` for month ${month}` : ""}: $${totalAmount}`
  );
}

function checkBudget(month, budget) {
  let filteredExpenses = expenses;
  if ((month && month < 1) || month > 12) {
    console.error("Month must be between 1 and 12");
    return;
  }
  if (budget <= 0) {
    console.error("Budget must be greater than 0.");
    return;
  }
  if (month) {
    const currentYear = new Date().getFullYear();
    filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.createdAt);
      return (
        expenseDate.getMonth() + 1 === month &&
        expenseDate.getFullYear() === currentYear
      );
    });
  }

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );
  if (totalAmount > budget) {
    console.warn(
      `Warning: You have exceeded your budget of $${budget}. Total expenses: $${totalAmount}`
    );
  } else {
    console.log(
      `Total expenses: $${totalAmount}. Remaining budget: $${
        budget - totalAmount
      }`
    );
  }
}

function exportToCSV(filename = "expenses.csv") {
  if (expenses.length === 0) {
    console.error("No expenese available to export!");
  }
  const csv = parse(expenses);
  fs.writeFileSync(filename, csv);
  console.log(`Expenses exported to ${filename}`);
}

initializeExpenses();

const program = new Command();

program
  .command("add")
  .description("Add an expense")
  .requiredOption("--description <description>", "Expense description")
  .requiredOption("--amount <amount>", "Expense amount")
  .option("--category <category>", "Expense category", "Miscellaneous")
  .action(({ description, amount, category }) => {
    addExpense(description, amount, category);
  });

program
  .command("update")
  .description("Update an expense")
  .requiredOption("--id <id>", "Expense ID", parseInt)
  .option("--description <description>", "Updated description")
  .option("--amount <amount>", "Updated amount")
  .option("--category <category>", "Updated category")
  .action(({ id, description, amount, category }) => {
    const updates = {
      description,
      amount: amount ? parseFloat(amount) : undefined,
      category,
    };
    updateExpense(id, updates);
  });

program
  .command("delete")
  .description("Delete an expense")
  .requiredOption("--id <id>", "Expense ID", parseInt)
  .action(({ id }) => {
    deleteExpense(id);
  });

program
  .command("list")
  .description("List all expenses")
  .action(() => {
    listExpenses();
  });

program
  .command("summary")
  .description("View expense summary")
  .option("--month <month>", "Specific month (1-12)", parseInt)
  .action(({ month }) => {
    viewSummary(month);
  });

program
  .command("budget")
  .description("Check budget for a month")
  .requiredOption("--budget <budget>", "Budget limit")
  .option("--month <month>", "Specific month (1-12)", parseInt)
  .action(({ budget, month }) => {
    checkBudget(month, parseFloat(budget));
  });

program
  .command("export")
  .description("Export expenses to a CSV file")
  .option("--filename <filename>", "Filename to export", "expenses.csv")
  .action(({ filename }) => {
    exportToCSV(filename);
  });

program.parse();
