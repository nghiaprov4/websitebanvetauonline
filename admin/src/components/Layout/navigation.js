import React, { useState } from 'react'
import { Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

export default function Navigation() {
  const dispatch = useDispatch();
  const [role, setRole] = useState(parseInt(localStorage.getItem('role')));

  return (
    <div className="menu-admin">
      <div className="menu-br">
       
        <i className="fas fa-bars icon-menu-sty"
          onClick={() => { dispatch({ type: "HIDE_NAV" }) }}
        ></i>
      </div>
      <div className="backgroud-in-menu">
        <div className="padding-10">
          <div className="input-group md-form form-sm form-2 pl-0">
          </div>
       
          <div className="padding-top-10" >
            <Link to={`/ticket/all`}>
              <div className="btn-menu">
                <i className="fas fa-ticket-alt fa-menu"></i>Danh dách vé
              </div>
            </Link>
          </div>
          <div className="padding-top-10" >
            <Link to="/order">
              <div className="btn-menu">
                <i className="fa fa-cart-plus fa-menu"></i>Thông tin đặt
              </div>
            </Link>
          </div>
          <div className={role === 0 ? 'padding-top-10' : 'padding-top-10 class-hide'}>
            <Link to="/schedule">
              <div className="btn-menu">
                <i className="fas fa-calendar-week fa-menu"></i>Quản lý lịch trình
              </div>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  )
}
