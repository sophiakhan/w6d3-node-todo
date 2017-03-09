
// define a node module that handles routing. module is build into node.
module.exports.setup = (router, uploads, knex) => {

    // 1. load libraries
    let moment = require('moment')

    // 2. define routes
    router.get('/todos', function(req, res) {

        knex.select().table('todos').then(function(data) {
            res.json(data)
        })
    })

    router.post('/todos', function(req, res) {
       
        let now = moment().format('YYY-MM-DD HH:mm:ss')
        let todo = {
            todo: req.body.todo.trim(),
            completed: req.body.completed ? 'yes' : 'no',
            category: req.body.category.trim(),
            due_date: moment(req.body.due_date.trim()).format('YYYY-MM-DD'),
            created_at: now,
            updated_at: now
        }

        knex.insert(todo).table('todos').returning('*').then(function(data) {
            res.json(data[0])
        })
    })

    router.get('/todos/:todoId/complete', function (req, res) {
        var update = {
            completed: 'yes'
        }
        
        knex.update(update).table('todos').where('id', '=', request.params.todoId).then(function(data) {
            response.json(true)
        })
    })

    // return the router, with new routes attached back to the express web server that's loading these
    return router
}