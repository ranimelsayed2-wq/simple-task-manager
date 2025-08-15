require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//install cors
const cors = require("cors");
app.use(cors());

//Helper function to check for valid ObjectId
function isValidObjectId(id){
    return mongoose.Types.ObjectId.isValid(id);
}
//Middleware to parse JSON 
app.use(express.json());

//Conect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected 🚀'))
.catch(err => console.error(err));


const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
app.use(morgan('dev'));
module.exports = app;
//Routes
//Test route
app.get('/', (req,res) => {
    res.send('Test Manager API is running 🚀🚀');
});

//p.listen(PORT, () => {
  //  console.log(`Server running on https://localhost:${3000}`);
    //});
 
    //Create
   app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string.' });
    }
    const newTask = new Task({ title: title.trim() });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Read
   app.get('/tasks', async (req, res) => {
  try {
    let { page = 1, limit = 10, completed, sort } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (completed !== undefined) {
      if (completed === 'true') filter.completed = true;
      else if (completed === 'false') filter.completed = false;
    }

    // Build sort object
    let sortOption = {};
    if (sort) {
      // If starts with '-', descending
      if (sort.startsWith('-')) {
        sortOption[sort.slice(1)] = -1;
      } else {
        sortOption[sort] = 1;
      }
    }

    const tasks = await Task.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(filter);

    res.json({
      page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Update
    app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }

    const { title, completed } = req.body;

    const updateData = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title must be a non-empty string.' });
      }
      updateData.title = title.trim();
    }
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean.' });
      }
      updateData.completed = completed;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one field (title or completed) must be provided to update.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Delete
app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
//app.listen(PORT, () => {
  //console.log(`Server running on http://localhost:${PORT}`);
//});


//test
