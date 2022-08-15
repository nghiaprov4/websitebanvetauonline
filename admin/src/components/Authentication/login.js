import React, { useState } from 'react'
import { axios } from '../../config/constant'
import { message } from 'antd'

export default function Login() {
  const [account, setAccount] = useState({
    username: '',
    password: '',
  })
  async function login() {
    await axios.post('/login', {
      account: account
    }).then(function (res) {
      if (res.data.status === 'success') {
        // localStorage.setItem('role', res.data.data.role);
        localStorage.setItem('user-id', res.data.userID)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', res.data.role)
        localStorage.setItem('name', res.data.name)
        window.location.pathname = '/'
      } else {
        message.error(res.data.message)
      }
    }).catch(function (err) {
      console.log(err)
    })
  }
  return (
    <div className="container" style={{ width: '30%', height: '100vh', background: '', padding: '30px', borderRadius: '20px' }}>
      <div className="cover-login">
        <div className="img-logo-circle">
          <img src="images/Logo.png" className="img-login" alt="Hinh" />
        </div>
        <div className="cover-input-login">
          <input className="form-control input-form-control" type="text" placeholder="Username" maxLength="50"
            style={{ marginBottom: '15px' }}
            onChange={(e) => {
              setAccount({
                ...account,
                username: e.target.value,
              })
            }} />
          <input className="form-control input-form-control" type="password" placeholder="Password" maxLength="50"
            onChange={(e) => {
              setAccount({
                ...account,
                password: e.target.value,
              })
            }} />
          <button className="form-control mt-5 btn btn-primary" onClick={() => { login() }}>ĐĂNG NHẬP</button>
        </div>
      </div>
    </div>
  )
}
