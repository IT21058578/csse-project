import { Route, Routes } from "react-router-dom"
import RoutePaths from './config'
import Splash from './Screens/Splash'

function App() {

  return (
   <Routes>
      <Route path={RoutePaths.home} element={<Splash />}></Route>
   </Routes>
  )
}

export default App
