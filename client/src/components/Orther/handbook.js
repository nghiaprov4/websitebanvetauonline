import React, { useState } from 'react'
import { Banner } from '../_App/Index'
import { Carousel, Image } from 'react-bootstrap'

export default function Handbook() {
  const [more, setMore] = useState(false);
  return (
    <div>
      <Banner />
    
      <div className="txt-muave" style={{ textAlign: 'center' }}>HƯỚNG DẪN ĐẶT VÉ</div>
      <p className='hd'>Đây là giao diện chính (trang chủ) khi khách hàng đăng nhập vào trang web:</p>
      <center>
      <Image src="images/hd_trangchu.png" alt="image" style={{ width: '50%', height: '50%' }} />
      </center>
      <h2 className='hd1'>1.     Tìm vé</h2>
      <p className='hd'> Chọn thông tin  Hành trình  vào ga đi, ga đến  .</p>
      <center>
      <Image src="images/hd_gdgd2.png" alt="image" style={{ width: '50%', height: '50%' }} />
      </center>
      <p className='hd'>Chọn Thời gian  Ngày đi và ngày về (Nếu là vé khứ hồi)</p>
      <center>
      <Image src="images/hd_time.png" alt="image" style={{ width: '20%', height: '20%' }} />
      </center>
      <h2 className='hd1'>2.     Chọn chỗ</h2>
      <p className='hd'>        Dựa vào tiêu chí tìm kiếm của khách hàng, hệ thống sẽ đưa ra danh sách các đoàn tàu xuất phát trong ngày cần đi của hành khách.

·        </p>
   <p className='hd'>Hệ thống chọn mặc định 1 đoàn tàu có thời gian gần nhất so với thời gian tìm kiếm. Khách hàng có thể chọn đoàn tàu khác có trên màn hình. </p>
   <p className='hd'>Đoàn tàu được chọn sẽ được đổi màu xanh để phân biệt với các đoàn tàu còn lại.</p>
     <center>
      <Image src="images/hd_chongoi.png" alt="image" style={{ width: '50%', height: '50%' }} />
      </center>
      <p className='hd'>  Trạng thái của chỗ sẽ được hiển thị thông qua màu của chỗ như sau:</p>
      <center>
      <Image src="images/hd_tt.png" alt="image" style={{ width: '50%', height: '50%' }} />
      </center>
     
      <p className='hd'>   Khách hàng chỉ có thể chọn các chỗ màu trắng  hoặc bỏ ra khỏi giỏ vé. Sau khi click vào các chỗ màu trắng, chỗ sẽ được chuyển sang trạng thái màu xanh (chỗ đang chọn), và chuyển vào giỏ vé. Tại giỏ vé, khách hàng sẽ nhìn thấy các chỗ đã chọn và thời gian hệ thống tạm giữ các chỗ này. Nếu khách hàng click vào các chỗ màu xanh, hệ thống xóa vé khỏi giỏ và chuyển lại trạng thái thành màu trắng.</p>
      <p className='hd'>    Khách hàng có thể xóa chỗ trong giỏ vé nếu click vào biểu tượng Thùng rác bên cạnh mỗi vé trong giỏ. Con số trên biểu tượng Thùng rác là số giây vé tạm giữ cho khách hàng.</p>
      <center>
      <Image src="images/hd_gh.png" alt="image" style={{ width: '20%', height: '20%' }} />
      </center>
     
      <h2 className='hd1'> 3.     Nhập thông tin hành khách</h2>
      <h2 className='hd1'> &ensp; 3.1.                     Nhập thông tin hành khách đi tàu</h2>
     
      <p className='hd'>  Màn hình nhập thông tin hành khách hiển thị như sau</p>
      <center>
      <Image src="images/hd_ttkh.png" alt="image" style={{ width: '50%', height: '50%' }} />
      </center>
      <p className='hd'>  Trên màn hình hiển thị các dòng thông tin tương ứng với số vé khách đặt, bao gồm Họ tên, Số CMND/Hộ chiếu/Ngày tháng năm sinh, Đối tượng khách hàng.</p>
      <p className='hd'>     Khách hàng nhập Họ tên, Số giấy tờ (Số chứng minh nhân dân hoặc số hộ chiếu hoặc số giấy phép lái xe đường bộ được pháp luật Việt Nam công nhận hoặc ngày tháng năm sinh nếu là trẻ em hoặc thẻ sinh viên nếu là sinh viên)</p>
      <p className='hd'>  Tại mục Đối tượng</p>
      <p className='hd'> &emsp; Trẻ em dưới 6 tuổi: Được miễn vé và đi cùng người lớn</p>
      <p className='hd'> &emsp; Trẻ em từ 6 tuổi – 10 tuổi: Mua vé trẻ em với giá vé giảm 25% giá vé người lớn</p>
      <p className='hd'> &emsp; Người cao tuổi (trên 60 tuổi): được mua vé giảm 15% giá vé người lớn.</p>
      <p className='hd'> &emsp; Sinh viên: được mua vé giảm 10% giá vé người lớn</p>
       <p className='hd'> Chú ý: Các thông tin cần nhập chính xác vì các thông tin này sẽ được in ra trên vé và có thể được kiểm tra khi lên tàu.</p>
    <p className='hd'> Khách hàng có thể xóa vé khi ấn vào biểu tượng thùng rác.</p>
    <h2 className='hd1'> &ensp; 3.2.                     Nhập thông tin hành khách đặt vé tàu</h2>
    <p className='hd'>  Nhập thông tin người đặt vé:</p>
    <p className='hd'>

Nhập chính xác Họ và tên, Số CMND/Hộ chiếu, Email, Số di động.</p>
<p className='hd'>Sau khi thực hiện các bước đặt chỗ trực tuyến trên Website, đến bước thanh toán khách hàng có thể chọn một trong 2 hình thức thanh toán gồm: Thanh toán trực tuyến qua các cổng thanh toán Paypal và thanh toán tại quày</p>
<center>
      <Image src="images/hd_ttnd.png" alt="image" style={{ width: '50%', height: '50%' }} />
      </center>
      <p className='hd'>Trường hợp thanh toán bằng PayPal</p>
      <p className='hd'>Chọn hinh thức thanh toán bằng Paypal và đăng nhập vào Paypal</p>
      <center>
      <Image src="images/hd_paypal.png" alt="image" style={{ width: '30%', height: '30%' }} />
      </center>
      <p className='hd'>Chọn "Pay Now " đê thanh toán</p>
      <center>
      <Image src="images/hd_paypal2.png" alt="image" style={{ width: '30%', height: '30%' }} />
      </center>
      <p className='hd'>Trường hợp thanh toán Tại quày thì khách hàng sau khi đặt vé thành công vui long đến quày tại Ga và cung cấp thông tin đặt vé để lấy vé tàu</p>
    <p className='hd'> Sau khi thanh toán hệ thống sẽ thông báo đặt vé thành công và gửi thông tin đặt vé về email mà khách hàng đã cung cấp khi đặt vé</p>
    <center>
      <Image src="images/hd_email.png" alt="image" style={{ width: '50%', height: '50%' }} />
      </center>
    </div>
  )
}
