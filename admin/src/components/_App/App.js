import './App.css';
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, Login, Schedule, Navigation, Home, Order, Ticket, Revenue } from './Index';
import { useSelector } from 'react-redux';

export default function App() {
  const [islogin, setIsLogin] = useState(localStorage.getItem('user-id') !== '' ? true : false)
  const display = useSelector(state => state.isActive)

  useEffect(() => {
  }, [])
  return islogin ?
    <Router>

      <div >
        <div className="menu-bodername">
          <Header />
          <Switch>

            <Route exact path='/schedule' component={Schedule} />
            <Route path='/order' component={Order} />
            <Route path='/ticket/:idorder' component={Ticket} />
            <Route path='/revenue' component={Revenue} />
            {/* <Route path='/ticket' component={Ticket} /> */}

          </Switch>
        </div>
      </div>

    </Router> : <Login />

}
