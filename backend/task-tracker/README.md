# Task Tracker CLI

Solution for the [task-tracker](https://roadmap.sh/projects/task-tracker) challenge from [roadmap.sh](https://roadmap.sh)

## How to run

Clone the repository and run the following command

```bash
git clone https://github.com/nyiyezin/roadmap.sh-projects
cd backend/task-tracker
```

Command to add new task:

```bash
# node index.js <description>
node index.js "Buy milk"
```

Command to update the task:

```bash
# node index.js <id> <description>
node index.js 1 "Buy milk and beer"
```

Command to delete the task:

```bash
# node index.js <id>
node index.js 1
```

Command to change the task's status:

```bash
# node index.js <action> <id>
node index.js mark-in-progress 1
node index.js mark-done 1
```

Command to list all tasks

```bash
# node index.js list
node index.js list
```

Command to list task by status

```bash
# node index.js list <status>
node index.js list done
node index.js list todo
node index.js list in-progress
```
