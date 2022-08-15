import DatePicker from "react-datepicker";
import React, { useState } from 'react';
import { Banner } from '../_App/Index'
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Carousel, Image } from 'react-bootstrap'
import { useEffect } from "react";
import { axios } from '../../config/constant'
import { Button, notification, Space } from 'antd';

function Home() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [more, setMore] = useState(false);
  const [lockDate, setLockDate] = useState(true);
  const [dataStation, setDataStation] = useState([])
  const [valueSearchSchedule, setValueSearchSchedule] = useState({
    stationFrom: '',
    stationTo: '',
    startDate: '',
    returnDate: '',
    status: '1',
  })
  function increaseDate(dateString, num) {
    let oldDate = new Date(dateString)
    let newDate = oldDate.setDate(oldDate.getDate() + num)
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(newDate)
  }
  async function getDataStation() {
    await axios.get('/station'
    ).then(function (res) {
      setDataStation(res.data.data);
    }).catch(function (error) {
      console.log(error)
    })
  }
  async function getDataSchedule() {
    await axios.post('/schedule', {
      valueSchedule: {
        stationFrom: valueSearchSchedule.stationFrom,
        stationTo: valueSearchSchedule.stationTo,
        date: valueSearchSchedule.startDate
      }
    }).then(async function (res) {
      if (res.data.status === 'success') {
        dispatch({ type: "VALUE_SEARCH_SCHEDULE", valueSearchSchedule: valueSearchSchedule })
        history.push('/detail-schedule')
      } else {
        notification.error({
          message: "Không tìm thấy lịch trình phù hợp",
        })
      }
    }).catch(function (error) {
      console.log(error)
    })
  }
  function searchSchedule() {
    if (valueSearchSchedule.stationFrom === '' || valueSearchSchedule.stationTo === '' || valueSearchSchedule.startDate === '' || valueSearchSchedule.stationFrom === valueSearchSchedule.stationTo) {

      notification.error({
        message: "Thông tin tìm kiếm không hợp lệ",
      })
    } else {
      if (valueSearchSchedule.status === '1') {
        getDataSchedule()
      } else {
        if (valueSearchSchedule.returnDate === '') {

          notification.error({
            message: "Chưa chọn ngày về",
          })
        } else {
          if (new Date(valueSearchSchedule.startDate) < new Date(valueSearchSchedule.returnDate)) {
            getDataSchedule()
          } else {
            notification.error({
              message: "Ngày về không hợp lệ",
            })
          }
        }
      }
    }
  }
  useEffect(() => {
    getDataStation()
  }, [])
  return (
    <div>
      <div className="backgroud-search-banner">
        <h1 style={{ color: '#ffffff', textAlign: 'center', fontWeight: '1000', fontSize: '40px' }}>Website vé tàu trực tuyến</h1>
        <br></br>
        <div className="cover-contain-search-banner">

          <div className="form-group align-self-center with15percent" id="form_id">
            <select className="form-control select-style-sarch width95percent" id="form_id2"
              defaultValue=""
              onChange={(e) => {
                setValueSearchSchedule({
                  ...valueSearchSchedule,
                  stationFrom: e.target.value
                })
              }}
            >
              <option value="" disabled>Ga đi</option>
              {dataStation.map((item, index) => {
                return (
                  <option key={index} value={item._id}>{(index + 1) + item.name}</option>
                )
              })}
            </select>
          </div>
          <div className="form-group align-self-center with15percent" id="form_id" >
            <select
              defaultValue=""
              className="form-control select-style-sarch width95percent " id="form_id2"
              onChange={(e) => {
                setValueSearchSchedule({
                  ...valueSearchSchedule,
                  stationTo: e.target.value
                })
              }}
            >
              <option value="" disabled >Ga đến</option>
              {dataStation.map((item, index) => {
                return (
                  <option key={index} value={item._id}>{(index + 1) + item.name}</option>
                )
              })}
            </select>
          </div>
          <div className="form-group align-self-center with15percent" id="form_id">
            <select className="form-control select-style-sarch width95percent" id="form_id2"
              onChange={(e) => {
                setLockDate(e.target.value === '1' ? true : false)
                setValueSearchSchedule({
                  ...valueSearchSchedule,
                  status: e.target.value
                })
              }}
            >
              <option value='1'>Vé 1 chiều</option>
              <option value='2'>Vé khứ hồi</option>
            </select>
          </div>
          <div className="form-group align-self-center with15percent" id="form_id">
            <DatePicker className="form-control select-style-sarch" id="form_id2"
              placeholderText="Ngày đi"
              value={valueSearchSchedule.startDate}
              minDate={new Date()}
              onChange={(date) => {
                var dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
                setValueSearchSchedule({
                  ...valueSearchSchedule,
                  startDate: dateFormat
                })
              }}
            />
          </div>
          <div className="form-group align-self-center with15percent" style={{ marginRight: '10px', marginLeft: '10px' }} id="form_id" >
            <div className=''>
              <DatePicker className="form-control select-style-sarch" id="form_id2"
                disabled={lockDate}
                placeholderText="Ngày về"
                value={valueSearchSchedule.returnDate}
                minDate={valueSearchSchedule.startDate !== '' ? new Date(increaseDate(valueSearchSchedule.startDate, 1)) : new Date()}
                onChange={(date) => {
                  var dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
                  setValueSearchSchedule({
                    ...valueSearchSchedule,
                    returnDate: dateFormat
                  })
                }}
              />
            </div>
          </div>
          <div className="form-group align-self-center with15percent">
            <button
              id="search"
              className="form-control btn btn-submit btn-search-style"
              onClick={() => {
                searchSchedule()
              }}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
        <br></br>

      </div>

      <img
        className="d-block w-100"

        src="images/home-image1.png"
        style={{ height: '500px' }}

      />
      <br></br>

      <form>
        <h1 style={{ textAlign: 'center' }}>Tại sao nên đặt vé với chúng tôi?</h1>
        <table>
          <tr>
            <td>

              <img


                src="images/giave.jpg"
                style={{ height: '100px' }}

              />
              <br></br>
              Giá vé hợp lý
            </td>
            <td>

              <img


                src="images/kmai.jpg"
                style={{ height: '100px' }}

              />
              <br></br>
              Khuyến mãi
            </td>
            <td>

              <img


                src="images/diemth.jpg"
                style={{ height: '100px' }}

              />
              <br></br>
              Điểm thưởng
            </td>
            <td>

              <img


                src="images/sp.jpg"
                style={{ height: '100px' }}

              />
              <br></br>
              Trợ giúp chuyên nghiệp
            </td>
          </tr>
        </table>

      </form>
      <br></br>


      <div className="container" style={{ textAlign: 'center', padding: '20px 0px' }}>
        <div style={{ color: '#000', fontSize: '28px', margin: '25px 0px 10px 0px' }}> <div>  MUA VÉ TẠI WEBSITE VÉ TÀU TRỰC TUYẾN  </div><br></br>
        </div>

        <p style={{ fontSize: '14px', width: '75%', margin: 'auto' }}>Công ty vé tàu trực tuyến là nơi cung cấp các loại
          phương tiện di chuyển hàng đầu trong đó có đường sắt Việt Nam. Tàu lửa hiện nay vẫn là phương tiện giá
          rẻ nhất và an toàn nhất được sự tin dùng của nhiều hành khách. Với sự cải tiến ngày càng
          tiện dụng, đường sắt Việt nam luôn tồn tại và vững mạnh trong suốt nhiều năm qua.</p>  <br></br>
        <Image src="images/train.png" style={{ width: '40%' }} />  &emsp; &emsp;
        <Image src="images/tau2.jpg" style={{ width: '20%' }} />&emsp; &emsp;
        <Image src="images/tau3.jpg" style={{ width: '20%' }} />
        <Image src="images/gia-mao.jpg" style={{ width: '20%' }} />&emsp; &emsp;
        <Image src="images/tau1.png" style={{ width: '20%' }} />&emsp; &emsp;
        <Image src="images/duong-sat-Viet-Nam.jpg" style={{ width: '40%' }} />

        <div style={{ margin: '20px' }}>
          <div style={{ display: 'flex', textAlign: 'left' }}>
            <div style={{ width: '33.33%', margin: '10px', display: 'flex' }}>
              <i className="fas fa-check" style={{ color: '#fbab19', margin: '3px 10px', fontSize: '18px' }} />
              <div>
                Chúng tôi đảm bảo với khách hàng sẽ đặt được dịch vụ giá tốt nhất , những chương trình
                khuyến mại hấp dẫn nhất
              </div>
            </div>
            <div style={{ width: '33.33%', margin: '10px', display: 'flex' }}>
              <i className="fas fa-check" style={{ color: '#fbab19', margin: '3px 10px', fontSize: '18px' }} />
              <div>
                Đặt lợi ích khách hàng lên trên hết, chúng tôi hỗ trợ khách hàng nhanh và chính xác nhất với
                dịch vụ tin cậy, giá trị đích thực
              </div>
            </div>
            <div style={{ width: '33.33%', margin: '10px', display: 'flex' }}>
              <i className="fas fa-check" style={{ color: '#fbab19', margin: '3px 10px', fontSize: '18px' }} />
              <div>
                Chúng tôi liên kết chặt chẽ với các đối tác, khảo sát định kỳ để đảm bảo chất lượng tốt nhất
                của dịch vụ
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', textAlign: 'left' }}>
            <div style={{ width: '33.33%', margin: '10px', display: 'flex' }}>
              <i className="fas fa-check" style={{ color: '#fbab19', margin: '3px 10px', fontSize: '18px' }} />
              <div>
                Chúng tôi đảm bảo với khách hàng sẽ đặt được dịch vụ giá tốt nhất , những chương trình
                khuyến mại hấp dẫn nhất
              </div>
            </div>
            <div style={{ width: '33.33%', margin: '10px', display: 'flex' }}>
              <i className="fas fa-check" style={{ color: '#fbab19', margin: '3px 10px', fontSize: '18px' }} />
              <div>
                Đặt lợi ích khách hàng lên trên hết, chúng tôi hỗ trợ khách hàng nhanh và chính xác nhất với
                dịch vụ tin cậy, giá trị đích thực
              </div>
            </div>
            <div style={{ width: '33.33%', margin: '10px', display: 'flex' }}>
              <i className="fas fa-check" style={{ color: '#fbab19', margin: '3px 10px', fontSize: '18px' }} />
              <div>
                Chúng tôi liên kết chặt chẽ với các đối tác, khảo sát định kỳ để đảm bảo chất lượng tốt nhất
                của dịch vụ
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ backgroundColor: '#ffffff' }}>
          <div className="container" style={{ padding: '40px 0px', display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <Image src="images/van-chuyen-hang-bang-tau-hoa.jpg" style={{ width: '100%' }} />
            </div>
            <div style={{ width: '50%' }}>
              <div style={{ padding: '0px 30px' }}>
                <div style={{ fontSize: '28px', color: '#4a4a4a', textAlign: 'right', textTransform: 'uppercase' }}>Thông
                  tin về dịch vụ gửi hàng bằng tàu hỏa </div>
                <span className={more ? '' : 'description'}>Kinh tế đất nước ta ngày càng phát triển, kéo theo đó cơ sở hạ tầng cũng được cải thiện và
                  được nhà nước chú trọng đầu tư. Hiện nay, ta có thể thấy, suốt dọc chiều dài đất nước, có
                  những con đường cao tốc nối liền các tỉnh, thành
                  phố; những dải đường sắt đi dọc khắp từ Bắc vào Nam. Điều này tạo điều kiện thuận lợi cho
                  ngành vận chuyển ngày càng phát triển, hàng hóa không ngừng được giao thương. Trong đó dịch
                  vụ vận chuyển hàng hóa bằng tàu hỏa là được
                  yêu thích nhất. Bởi sự tiện lợi, nhanh chóng, an toàn và nhất là giá cả vô cùng hợp lý. Công
                  ty vận tải Bắc Nam luôn luôn nỗ lực không ngừng, cung cấp dịch vụ tốt nhất để đưa hàng hóa
                  đến với khách hàng một cách nhanh chóng
                  và an toàn nhất. Khi kinh doanh dịch vụ, một trong những vấn đề mà khách hàng quan tâm nhất
                  chính là giá vận chuyển hàng hóa bằng tàu hỏa.
                </span>
                <span className='more' onClick={() => { setMore(more ? false : true) }}>{!more ? 'Xem thêm...' : 'Ẩn'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ textAlign: 'center', padding: '20px 0px' }}>
        <h1>Các tùy chọn</h1>
        Bạn thường có thể chọn ghế cứng hoặc ghế mềm và giường cứng hoặc ngủ mềm . Và sau đó có hoặc không có điều hòa không khí . Ghế cứng là hạng rẻ nhất và thường chật kín người dân địa phương.

        Bạn có thể mang hành lý của mình vào toa xe và để vào các giá đỡ trên đầu hoặc dưới yên xe. Một số du khách cố định hành lý của họ vào giá bằng khóa xe đạp. Thậm chí có thể đi xe máy của bạn trên tàu.

        Giống như nhiều quốc gia, Việt Nam cũng có lựa chọn sử dụng tàu đêm, giúp tiết kiệm thời gian ở lại khách sạn qua đêm và di chuyển trong ngày và thường là lựa chọn thay thế tốt hơn so với đi xe buýt dài ngày. Lộ trình nhanh nhất từ ​​Hà Nội đến Thành phố Hồ Chí Minh mất khoảng 30 giờ. Tàu chạy khá chậm; thường khoảng 50 km / h thông qua cảnh quan.
      </div>
      <Carousel className='container' controls={false}>
        <Carousel.Item>
          <div className='row'>
            <div className="item col-6">
              <div style={{ backgroundColor: '#ffffff' }}>
                <Image src="images/taotaugiuongnam.jpg" alt="image" style={{ width: '100%', height: '300px' }} />
                <div>
                  <div style={{ color: '#ae8545', fontSize: '18px', marginBottom: '10px', marginTop: '5px', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center' }}>
                    Hệ thống giường nằm</div>
                  <div style={{ display: 'flex', margin: 'auto', width: '90%', textAlign: 'center' }}>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/decimal.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>3m2</div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/giuong.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>4 giường ngủ</div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/dooe.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>View cửa sổ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item col-6">
              <div style={{ backgroundColor: '#ffffff' }}>
                <Image src="images/tautaughemem.jpg" alt="image" style={{ width: '100%', height: '300px' }} />
                <div>
                  <div style={{ color: '#ae8545', fontSize: '18px', marginBottom: '10px', marginTop: '5px', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center' }}>
                    toa tàu ghế mêm</div>
                  <div style={{ display: 'flex', margin: 'auto', width: '90%', textAlign: 'center' }}>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/decimal.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>3m2</div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/giuong.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>2 ghế ngồi</div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/dooe.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>View cửa sổ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className='row'>
            <div className="item col-6">
              <div style={{ backgroundColor: '#ffffff' }}>
                <Image src="images/giuong1.jpg" alt="image" style={{ width: '100%', height: '300px' }} />
                <div>
                  <div style={{ color: '#ae8545', fontSize: '18px', marginBottom: '10px', marginTop: '5px', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center' }}>
                    Toa tàu giường nằm</div>
                  <div style={{ display: 'flex', margin: 'auto', width: '90%', textAlign: 'center' }}>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/decimal.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>3m2</div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/giuong.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>4 giường ngủ</div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/dooe.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>View cửa sổ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item col-6">
              <div style={{ backgroundColor: '#ffffff' }}>
                <Image src="images/ghecung1.jpg" alt="image" style={{ width: '100%', height: '300px' }} />
                <div>
                  <div style={{ color: '#ae8545', fontSize: '18px', marginBottom: '10px', marginTop: '5px', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center' }}>
                    toa tầu ghế cứng</div>
                  <div style={{ display: 'flex', margin: 'auto', width: '90%', textAlign: 'center' }}>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/decimal.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>3m2</div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/giuong.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>1 ghế ngồi</div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                      <Image src="images/dooe.png" style={{ width: '40px', margin: 'auto' }} />
                      <div>View cửa sổ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>



    </div >
  )
}

export default Home