const readline = require('readline')
const fs= require("fs")

const command = process.argv[2]; 

if(command !="add"){
    console.log('add task')
    process.exit(1)
}

let nextId=1;

const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
})
const TASK_FILE = "task.json";
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