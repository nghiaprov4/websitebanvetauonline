import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

export default function Header() {
  const dispatch = useDispatch();
  const display = useSelector(state => state.isActive)
  const [logout, setLogout] = useState(false)
  const [role, setRole] = useState(parseInt(localStorage.getItem('role')));

  return (
    // <div className="name-backgr">
    //   {/* <i className="fas fa-bars icon-menu-sty" style={{ float: 'left', display: display ? "none" : "" }}
    //     onClick={() => { dispatch({ type: "SHOW_NAV" }) }}
    //   ></i> */}
    //   <div >
    //     <div className="input-group md-form form-sm form-2 pl-0">
    //     </div>

    //     <div  >
    //       <Link to={`/ticket/all`}>
    //         <div className="btn-menu">
    //           <i className=""></i>Danh dách vé
    //         </div>
    //       </Link>
    //     </div>
    //     <div  >
    //       <Link to="/order">
    //         <div className="btn-menu">
    //           <i className=""></i>Thông tin đặt
    //         </div>
    //       </Link>
    //     </div>
    //     <div className={role === 0 ? 'padding-top-10' : 'padding-top-10 class-hide'}>
    //       <Link to="/schedule">
    //         <div className="btn-menu">
    //           <i className=""></i>Quản lý lịch trình
    //         </div>
    //       </Link>
    //     </div>

    //   </div>
    //   <div className="icon-profile" onClick={() => {
    //     setLogout(logout ? false : true)
    //   }}>
    //     <i className="fas fa-user-circle icon-user"></i>
    //     <div className="none-select-text">{localStorage.getItem('name')}</div>
    //   </div>
    //   <div className={logout ? 'sub-menu-user' : 'sub-menu-user class-hide'}>
    //     <div className="text-menu" onClick={() => {
    //       window.location.pathname = '/'
    //       localStorage.setItem('user-id', '')
    //     }} >
    //       Thoát
    //     </div>
    //   </div>
    // </div>
    <div className="style-header">
      <div className="container">
        <nav className="navbar navbar-expand-sm navbar-dark">
          <div className="width280">
            <Link to='/' className="navbar-brand"><img className="width130" alt="logo" src="images/Logo.png" /></Link>
          </div>
          <div className="width100persent">
            <ul className="navbar-nav ul-cover-nav" >
              <li className="nav-item">
                <Link to={`/ticket/all`}>
                  <div className="btn-menu">
                    <i className="fas fa-ticket-alt fa-menu"></i>Danh dách vé
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/order">
                  <div className="btn-menu">
                    <i className="fa fa-cart-plus fa-menu"></i>Thông tin đặt vé
                  </div>
                </Link>              </li>
              <li className={role === 0 ? 'padding-top-8' : 'padding-top-8 class-hide'}>
                <Link to="/schedule">
                  <div className="btn-menu">
                    <i className="fas fa-calendar-week fa-menu"></i>Quản lý lịch trình
                  </div>
                </Link>
              </li>
              <li>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</li>

              <li className="nav-item">

                <div className="icon-profile" onClick={() => {
                  setLogout(logout ? false : true)
                }}>
                  <i className="fas fa-user-circle icon-user"></i>
                  <div className="none-select-text">{localStorage.getItem('name')}</div>
                </div>
                <div className={logout ? 'sub-menu-user' : 'sub-menu-user class-hide'}>
                  <div className="text-menu" onClick={() => {
                    window.location.pathname = '/'
                    localStorage.setItem('user-id', '')
                  }} >
                    Đăng xuất
                  </div>
                </div>
              </li>

            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}
