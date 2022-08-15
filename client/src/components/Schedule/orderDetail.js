import React, { useEffect, useState } from 'react';
import { Banner } from '../_App/Index'
import { axios } from '../../config/constant';
import { Popconfirm, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux';

export default function OrderDetail() {
  const dispatch = useDispatch();
  const reloadCart = useSelector(state => state.reloadCart)

  const [dataTickets, setDataTickets] = useState([])
  const [dataSearch, setDataSearch] = useState('')

  function format_curency(a) {
    a = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return a;
  }
  async function cancelTicket(id) {
    await axios.put(`/ticket-status-3?id=${id}`
    ).then(function (res) {
      if (res.data.status === 'success') {
        message.success(res.data.message)
      }
    })
  }

  async function getDataTickets() {
    await axios.get(`/ticket-idorder-4?idOrder=${dataSearch}`
    ).then(function (res) {

      if (res.data.status === 'success') {
        setDataTickets(res.data.data)
        console.log(res.data.data)
      }
    }).catch(function (err) {
      console.log(err)
    })

  }

  useEffect(() => {
    if (reloadCart) {
      getDataTickets()
      dispatch({ type: 'NO_RELOAD_CART' })
    }
  }, [reloadCart])
  return (

    <div>
      <Banner />
      <div className="container backgroud-white">
        <div className="title-h1">KIỂM TRA VÉ</div>
        <div className="padding-20-50">
          <div className="d-fix form-group">
            <div className="label-form">Mã đặt vé</div>
            <input className="form-control col-6" type="text" placeholder="Nhập mã đặt vé"
              onChange={(e) => { setDataSearch(e.target.value) }}
            />
            <button className="btn btn-check-price" onClick={() => { getDataTickets() }}>Kiểm tra vé</button>
          </div>
        </div>
      </div>
      <div className="margin-10px container-fluid">
        <div className="row form-group table-responsive list-ticket-deskhop margin-auto" >
          <table className="table table-bordered">
            <thead className="et-table-header">
              <tr>
                <th className="ng-binding train-in-header" style={{ width: '10%' }}>Mã vé</th>
                <th className="ng-binding train-in-header" style={{ width: '15%' }}>Họ tên</th>
                <th className="ng-binding train-in-header" style={{ width: '10%' }}>Mã ghế</th>
                <th className="ng-binding train-in-header" style={{ width: '9%' }}>Loại ghế</th>
                <th className="ng-binding train-in-header" style={{ width: '7%' }}>Giờ đi</th>
                <th className="ng-binding train-in-header" style={{ width: '8%' }}>Ngày đi</th>
                <th className="ng-binding train-in-header" style={{ width: '8%' }}>Ga đi</th>
                <th className="ng-binding train-in-header" style={{ width: '8%' }}>Ga đến</th>
                <th className="ng-binding train-in-header" style={{ width: '9%' }}>Trạng thái</th>
                <th className="ng-binding train-in-header" style={{ width: '10%' }}>Giá vé</th>
                <th className="ng-binding train-in-header" style={{ width: '8%' }}></th>
              </tr>
            </thead>
            <tbody>
              {dataTickets.map((item, index) => {
                return (
                  <tr key={index}>
                    <th className="et-table-cell tabl-cell" style={{ textAlign: 'left' }}>{item.idShow.replace(/-/g, "").slice(0, -14)}</th>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.customerName}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.seat}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.carriage}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.timeStart.split(':')[0] + "h" + item.timeStart.split(':')[1] + "p"}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.dateStart}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.stationFrom.name}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.stationTo.name}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>
                      {item.status === 0 ? 'Chờ thanh toán' : item.status === 1 ? 'Đã thanh toán' : item.status === 3 ? 'Chờ hủy vé' : 'Vé đã in'}
                    </td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'right' }}>{format_curency(item.price.toString()) + " VND"} </td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: '' }}>
                      <Popconfirm title="Xác nhận hủy vé" okText="Yes" cancelText="No"
                        onConfirm={() => {
                          cancelTicket(item._id)
                          dispatch({ type: 'RELOAD_CART' })
                        }}
                      >
                        <button className='btn btn-danger'>Gửi yêu cầu hủy vé</button>
                      </Popconfirm>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ backgroundColor: '#FF6600', width: '60%', textAlign: 'center', marginLeft: '20%', border: 'solid 1px' }}>
        <h3>Quy định đổi, trả vé từ ngày 01/3 đến ngày 27/4 và từ ngày 4/5 đến 31/5/2022</h3>

      </div>
      <div style={{ width: '60%', marginLeft: '20%', border: 'solid 1px' }}>
        &emsp;1. Thời gian, mức phí đổi trả vé:<br></br>

        &emsp;- Đổi vé: Vé cá nhân đổi trước giờ tàu chạy 24 giờ trở lên, lệ phí là 20.000 đồng/vé; không áp dụng đổi vé đối với vé tập thể.<br></br>

        &emsp;- Trả vé:<br></br>

        &emsp;&emsp;+ Vé cá nhân: Trả vé trước giờ tàu chạy từ 4 giờ đến dưới 24 giờ, lệ phí là 20% giá vé; từ 24 giờ trở lên lệ phí là 10% giá vé.<br></br>

        &emsp;&emsp;+ Vé tập thể: Trả vé trước giờ tàu chạy từ 24 giờ đến dưới 72 giờ, lệ phí là 20% giá vé; từ 72 giờ trở lên lệ phí là 10% giá vé.

        <br></br>
        <br></br>
        &emsp;2. Hình thức trả vé.<br></br>

        &emsp;- Khi hành khách mua vé và thanh toán online qua website bán vé của Ngành Đường sắt, app bán vé hoặc các ứng dụng mua vé tàu hỏa của các &emsp;đối tác thứ ba thì có thể trả vé online qua các website bán vé của Ngành Đường sắt hoặc đến trực tiếp nhà ga.<br></br>

        &emsp;- Khi hành khách mua vé bằng các hình thức khác, muốn đổi vé, trả vé hành khách đến trực tiếp nhà ga kèm theo giấy tờ tùy thân bản chính của &emsp;người đi tàu (hoặc người mua vé) cho nhân viên đường sắt. Đồng thời, thông tin trên thẻ đi tàu phải trùng khớp với giấy tờ tùy thân của hành &emsp; &emsp;khách.<br></br>

        &emsp;Trân trọng cảm ơn!.
      </div>

    </div>


  )
}
