const readline = require('readline')
const fs= require("fs")

const command = process.argv[2]; 

if(command !="add" && command !== "delete"){
    console.log('please add "add" task or "delete" to delete a task')
    process.exit(1)
}

let nextId=1;

const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
})
const TASK_FILE = "task.json";
if (command === "add") {
    rl.question("add task ",(task)=>{
        fs.readFile(TASK_FILE, 'utf-8', (err, data) => {
            let tasks = [];

            if (err) {
                console.log("No existing task file, starting fresh...");
            } else {
                try {
                    tasks = JSON.parse(data);
                } catch (e) {
                    console.log("Error parsing existing tasks, starting fresh.");
                }
            }

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
    })
    })
}

if (command === "delete") {
    rl.question("Enter the ID of the task to delete: ", (taskId) => {
        const id = parseInt(taskId);
        if (isNaN(id)) {
            console.log("Invalid ID, please enter a number.");
            rl.close();
            return;
        }

        fs.readFile(TASK_FILE, 'utf-8', (err, data) => {
            let tasks = [];

            if (err) {
                console.log("No existing task file, nothing to delete.");
                rl.close();
                return;
            }

            try {
                tasks = JSON.parse(data);
            } catch (e) {
                console.log("Error parsing existing tasks.");
                rl.close();
                return;
            }

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