import React from 'react'

export default function Footer() {
  return (
    <div className="footer-cover">
      <div className="container footer-container" >
        <div className="width33percent text-center">
          <div className="font-size20">VÉ TÀU TRỰC TUYẾN</div>
          <a className="navbar-brand" href="/"><img className="width130" alt="Logo" src="images/Logo.png" /></a>
        </div>
        <div className="width33percent">
          <div className="font-size20">THÔNG TIN CÔNG TY</div>
          <div className="footer-info">
            <p><i className="fa fa-map-marker mr-3"></i> 12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM</p>
            <p><i className="fas fa-phone mr-3"></i> 18001515</p>
            <p><i className="fas fa-envelope mr-3"></i> vetauonline@gmail.com</p>
          </div>
        </div>
        <div className="width33percent text-center">
          <div className="font-size20">CÁC KÊNH THÔNG TIN CHÍNH THỨC</div>
          <div>
            <a href="https://www.facebook.com/"><i className="fab fa-facebook footer-icon"></i></a>
            <a href="https://www.youtube.com/"><i className="fab fa-youtube footer-icon"></i></a>
            <a href="https://www.instagram.com/"><i className="fab fa-instagram footer-icon" ></i></a>
            <a href="https://twitter.com/"><i className="fab fa-twitter footer-icon"></i></a>
          </div>
        </div>
      </div>
    </div>
  )
}
