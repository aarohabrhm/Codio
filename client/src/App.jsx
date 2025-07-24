import { useEffect,useState } from 'react'
import './App.css'

function App() {
  const [msg,setMsg] = useState('')
    useEffect(() => {
        fetch('http://localhost:8000')
            .then(res => res.json())
            .then(data => setMsg(data.message))
            .catch(err => console.error(err));
    }, []);

  return (
    <div>
        <h1>Hai</h1>
        <h2>{msg}</h2>
    </div>
  )
}

export default App
