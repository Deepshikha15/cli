const readline = require('readline')
const fs= require("fs")

const command = process.argv[2]; 

if(command !="add" && command !== "delete" && command !="update"){
    console.log('Please use "add" to add a task, "delete" to delete a task, or "update" to update a task');
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
                task: task
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