var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


// const User = require('./Usuarios');
// const Task = require('./Tareas');

// User.hasMany(Task, { foreignKey: 'userId' });
// Task.belongsTo(User, { foreignKey: 'userId' });

// module.exports = { User, Task };