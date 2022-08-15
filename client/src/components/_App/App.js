import './App.css';
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, Footer, Home, Schedule, DetailSchedule, Payment, Regulation, Handbook,OrderDetail } from './Index';

export default function App() {
  return (
    <div className='App'>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/schedule' component={Schedule} />
          <Route path='/ticket' component={Schedule} />
          <Route path='/detail-schedule' component={DetailSchedule} />
          <Route path='/payment' component={Payment} />
          <Route path='/regulation' component={Regulation} />
          <Route path='/handbook' component={Handbook} />
          <Route path='/order' component={OrderDetail} />
        </Switch>
        <Footer />
      </Router>
    </div>
  )
}
