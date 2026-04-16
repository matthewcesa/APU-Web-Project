const modules = require('../modules/modulesModel');

exports.getAllModules = (req,res) => {
    modules.getAll((err, results) => { 
        if (err) throw err;
        res.json(results);
    })
}

exports.getModuleById = (req, res) => {
  Modules.getById(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results[0])
  })
}


exports.createModule= (req, res) => {
  modules.create(req.body, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}


exports.updateModule = (req, res) => {
    modules.update(req.params.id, req.body, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}


exports.deleteModule = (req, res) => {
    modules.delete(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}