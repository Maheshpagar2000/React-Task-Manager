import { useState, useEffect } from "react";
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Tasks from "./Components/Tasks";
import AddTask from "./Components/AddTask";
import About from "./Components/About";

function App() {
  const [showAddTask, setShowAddTask] =useState(true)
  const [tasks, setTasks] = useState([]);

useEffect(()=>{
    const getTask = async()=>{
      const taskFromServer = await fetchTasks()
      setTasks(taskFromServer)

    }
  getTask()
}, [])

// Fetch Tasks
const fetchTasks =async () =>{
    const res = await fetch('http://localhost:5000/tasks')
    const data= await res.json()
    return data

  }

  const fetchTask =async (id) =>{
    const res = await fetch(`http://localhost:5000/tasks${id}`)
    const data= await res.json()
    return data

  }

  //Add Task
  const addTask = async (task) => {
    const res= await fetch('http://localhost:5000/tasks',{
      method: 'POST',
      headers:{
        'Content-Type':'application/json',

      },
      body:JSON.stringify(task),
    })

    const data=await res.json()
    setTasks([...tasks, data])
    // const id= Math.floor(Math.random() * 10000) +1

    // const newTask ={id, ...task}
    // setTasks([...tasks, newTask])
  }

  //Delete Task
  const deleteTask =async (id) =>{
    await fetch(`http://localhost:5000/tasks/${id}`,{
      method:'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }
  
  //Toggle remider
  const toggleReminder = async(id) =>{
    const taskToToggle = await fetchTask(id)
    const updTask= { ...taskToToggle, reminder : !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks${id}`, {
      method: 'PUT',
      headers:{
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)  
    })

    const data= await res.json()

    setTasks(tasks.map((task) => 
      task.id ===id ? { ...task, reminder: data.reminder}: task
    ))
  }


  return (
    <Router>
    <div className="container" >
    
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
              ) : (
                'No Task to Show'
              )}
            </>
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer  />
    </div>
    </Router>
  );
      }

export default App;
