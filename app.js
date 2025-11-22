const readline = require('readline')

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
rl.question("add task ",(task)=>{
    console.log(task, nextId)
    nextId++;
    rl.close()
})