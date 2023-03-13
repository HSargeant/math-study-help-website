const Task = require('../models/Task')

module.exports = {
    getAssignments: async (req,res)=>{
        try{
            const taskItems = await Task.find({user:req.user.id,completed:false}).lean().sort({dueDate: 1})
            res.json(taskItems)
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req,res)=>{
        try{
            await Task.findOneAndUpdate({_id: req.params.id},{
                completed: true       
            })
            res.send("completed")
            console.log('deleted')
        }catch(err){
            console.log(err)
        }
    },
    addTask: async (req,res)=>{
        try{
            await Task.create({
                name: req.body.taskItem,
                user: req.user.id,
                dueDate: req.body.dueDate +" 12:59:59"
            })
            res.send('added')
            console.log('task added')
        }catch(err){
            console.log(err)
        }
    },
}