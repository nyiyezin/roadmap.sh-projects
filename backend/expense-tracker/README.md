# Expense Tracker CLI

Solution for the [expense-tracker](https://roadmap.sh/projects/expense-tracker) challenge from [roadmap.sh](https://roadmap.sh)

## How to run

Clone the repository and run the following command

```bash
git clone https://github.com/nyiyezin/roadmap.sh-projects
cd backend/expense-tracker
```

add new expense:

```bash
# node index.mjs add --description <description> --amount <amount> [--category <category>]
node index.mjs add --description "Groceries" --amount 150 --category "Food"
```

update an expense:

```bash
# node index.mjs update --id <id> [--description <description>] [--amount <amount>] [--category <category>]
node index.mjs update --id 1 --description "Snacks" --amount 20
```

delete an expense:

```bash
# node index.mjs delete --id <id>
node index.mjs delete --id 1
```

list all expense:

```bash
# node index.mjs list
node index.mjs list
```

view summary of expense:

```bash
# node index.mjs summary [--month <month>]
node index.mjs summary --month 11
```

check budget:

```bash
# node index.mjs budget --budget <budget> [--month <month>]
node index.mjs budget --budget 200 --month 11
```

export all expenses as csv

```bash
# node index.mjs export [--filename <filename>]
node index.mjs export --filename my-expenses.csv
```
