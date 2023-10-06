import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import { renderHeaderConditionally } from './utils/helper'
import PrivateRoute from './components/PrivateRoute'

const App = () => {
  const location = useLocation();

  return (
    <>
      {!renderHeaderConditionally(location) && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}

export default App