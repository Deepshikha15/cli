const readline = require('readline')
const fs= require("fs")

const command = process.argv[2]; 

if(command !="add" && command !== "delete" && command !="update" && command !== "mark-in-progress" && command !== "mark-done" && command !== "list" && command !== "pending" && command !=="done"){
    console.log('Please use "add" to add a task, "delete" to delete a task, "update" to update a task, "mark-in-progress" to mark a task as in-progress, or "mark-done" to mark a task as done');
    process.exit(1)
}

let nextId=1;

const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
})
const TASK_FILE = "task.json";

function loadTasks(callback) {
    fs.readFile(TASK_FILE, 'utf-8', (err, data) => {
        let tasks = [];
        if (err) {
            console.log("No existing task file, starting fresh...");
            callback(tasks);
        } else {
            try {
                tasks = JSON.parse(data);
            } catch (e) {
                console.log("Error parsing existing tasks, starting fresh.");
            }
            callback(tasks);
        }
    });
}

if (command === "add") {
    rl.question("Add task: ", (task) => {
        loadTasks((tasks) => {
            nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

            const task_name = {
                id: nextId,
                task: task,
                status: "pending"
            };

            tasks.push(task_name);

            fs.writeFile(TASK_FILE, JSON.stringify(tasks, null, 4), (err) => {
                if (err) {
                    console.log("Error writing to file:", err);
                } else {
                    console.log(`Task "${task}" has been saved to ${TASK_FILE}.`);
                }
                rl.close();
            });
        });
    });
}

if (command === "delete") {
    rl.question("Enter the ID of the task to delete: ", (taskId) => {
        const id = parseInt(taskId);
        if (isNaN(id)) {
            console.log("Invalid ID, please enter a number.");
            rl.close();
            return;
        }

        loadTasks((tasks) => {
            const updatedTasks = tasks.filter(task => task.id !== id);

            if (updatedTasks.length === tasks.length) {
                console.log(`Task with ID ${id} not found.`);
            } else {
                fs.writeFile(TASK_FILE, JSON.stringify(updatedTasks, null, 4), (err) => {
                    if (err) {
                        console.log("Error writing to file:", err);
                    } else {
                        console.log(`Task with ID ${id} has been deleted.`);
                    }
                    rl.close();
                });
            }
        });
    });
}

if (command === "update") {
    rl.question("Enter the ID of the task to update: ", (taskId) => {
        const id = parseInt(taskId);
        if (isNaN(id)) {
            console.log("Invalid ID, please enter a number.");
            rl.close();
            return;
        }

        rl.question("Enter the new task description: ", (newTask) => {
            loadTasks((tasks) => {
                const taskIndex = tasks.findIndex(task => task.id === id);

                if (taskIndex === -1) {
                    console.log(`Task with ID ${id} not found.`);
                } else {
                    tasks[taskIndex].task = newTask;

                    fs.writeFile(TASK_FILE, JSON.stringify(tasks, null, 4), (err) => {
                        if (err) {
                            console.log("Error writing to file:", err);
                        } else {
                            console.log(`Task with ID ${id} has been updated.`);
                        }
                        rl.close();
                    });
                }
            });
        });
    });
}


if (command === "mark-in-progress") {
    rl.question("Enter the ID of the task to mark as in-progress: ", (taskId) => {
        const id = parseInt(taskId);
        if (isNaN(id)) {
            console.log("Invalid ID, please enter a number.");
            rl.close();
            return;
        }

        loadTasks((tasks) => {
            const taskIndex = tasks.findIndex(task => task.id === id);

            if (taskIndex === -1) {
                console.log(`Task with ID ${id} not found.`);
            } else {
                tasks[taskIndex].status = "in-progress";

                fs.writeFile(TASK_FILE, JSON.stringify(tasks, null, 4), (err) => {
                    if (err) {
                        console.log("Error writing to file:", err);
                    } else {
                        console.log(`Task with ID ${id} has been marked as in-progress.`);
                    }
                    rl.close();
                });
            }
        });
    });
}

if (command === "mark-done") {
    rl.question("Enter the ID of the task to mark as done: ", (taskId) => {
        const id = parseInt(taskId);
        if (isNaN(id)) {
            console.log("Invalid ID, please enter a number.");
            rl.close();
            return;
        }

        loadTasks((tasks) => {
            const taskIndex = tasks.findIndex(task => task.id === id);

            if (taskIndex === -1) {
                console.log(`Task with ID ${id} not found.`);
            } else {
                tasks[taskIndex].status = "done";

                fs.writeFile(TASK_FILE, JSON.stringify(tasks, null, 4), (err) => {
                    if (err) {
                        console.log("Error writing to file:", err);
                    } else {
                        console.log(`Task with ID ${id} has been marked as done.`);
                    }
                    rl.close();
                });
            }
        });
    });
}

if (command === "list") {
    loadTasks((tasks) => {
        if (tasks.length === 0) {
            console.log("No tasks found.");
        } else {
            console.log("All Tasks:");
            tasks.forEach(task => {
                console.log(`ID: ${task.id} | Task: ${task.task} | Status: ${task.status}`);
            });
        }
        rl.close();
    });
}

if (command === "pending") {
    loadTasks((tasks) => {
        const pendingTasks = tasks.filter(task => !task.status || task.status === "pending");

        if (pendingTasks.length === 0) {
            console.log("No pending tasks found.");
        } else {
            console.log("Pending Tasks:");
            pendingTasks.forEach(task => {
                console.log(`ID: ${task.id} | Task: ${task.task} | Status: pending`);
            });
        }
        rl.close();
    });
}

if (command === "done") {
    loadTasks((tasks) => {
        const doneTasks = tasks.filter(task => !task.status || task.status === "done");

        if (doneTasks.length === 0) {
            console.log("No done tasks found.");
        } else {
            console.log("done Tasks:");
            doneTasks.forEach(task => {
                console.log(`ID: ${task.id} | Task: ${task.task} | Status: done`);
            });
        }
        rl.close();
    });
}