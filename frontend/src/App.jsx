import { Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Test from './Test.jsx';
import './index.css'

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/helloworld" element={<Test />} />
      </Routes>
    </>
  )
}

export default App
