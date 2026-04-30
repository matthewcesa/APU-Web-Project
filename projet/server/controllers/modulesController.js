/*const modules = require('../models/modulesModel');

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
}*/

const modules = require('../models/modulesModel')

// GET ALL MODULES
exports.getAllModules = (req, res) => {
  modules.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ONE MODULE
exports.getModuleById = (req, res) => {
  modules.getById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Module not found' })
    }

    res.json(results[0])
  })
}

// GET MODULES BY COURSE
exports.getModulesByCourseId = (req, res) => {
  modules.getByCourseId(req.params.courseId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// CREATE MODULE
exports.createModule = (req, res) => {
  modules.create(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.status(201).json({
      message: 'Module created successfully',
      module_id: results.insertId,
    })
  })
}

// UPDATE MODULE
exports.updateModule = (req, res) => {
  modules.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Module not found' })
    }

    res.json({ message: 'Module updated successfully' })
  })
}

// DELETE MODULE
exports.deleteModule = (req, res) => {
  modules.delete(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Module not found' })
    }

    res.json({ message: 'Module deleted successfully' })
  })
}