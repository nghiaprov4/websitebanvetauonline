import React, { useEffect, useState } from 'react'
import { axios } from '../../config/constant'
import { Pagination, Form, message, Popconfirm } from 'antd'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'



export default function Order() {

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [dataOrder, setDataOrder] = useState([])
  const [dataSearch, setDataSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [dataTickets, setDataTickets] = useState([])


  function format_curency(a) {
    a = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return a;
  }
  async function getDataOrderByPage(page) {
    await axios.get(`/order-page?page=${page}`
    ).then(function (res) {
      setDataOrder(res.data.data)
      setTotalPage(res.data.totalPage)
    }).catch(function (err) {
      console.log(err)
    })
  }
  async function searchOrder(page) {
    console.log(dataSearch)
    await axios.get(`/order-search?page=${page}&&search=${dataSearch}`
    ).then(function (res) {
      setDataOrder(res.data.data)
      setTotalPage(res.data.totalPage)
    }).catch(function (err) {
      console.log(err)
    })
  }
  async function getDataTickets(idOrder) {
    await axios.get(`/ticket-idorder?idOrder=${idOrder}`
    ).then(function (res) {
      if (res.data.status === 'success') {
        setDataTickets(res.data.data)
      }
    }).catch(function (err) {
      console.log(err)
    })
  }
  // async function updateStatusTickets() {
  //   dataTickets.forEach(async ticket => {
  //     await axios.put(`/ticket-status?id=${ticket._id}`
  //     ).then(function (res) {
  //       if (res.data.status === 'success') {
  //       }
  //     })
  //   })
  //   message.success('In vé thành công')
  // }
  // async function deleteTickets(idOrder) {
  //   await axios.put(`/tickets-delete?idOrder=${idOrder}`
  //   ).then(function (res) {
  //     if (res.data.status === 'success') {
  //       message.success(res.data.message)
  //     }
  //   }).catch(function (err) {
  //     console.log(err)
  //   })
  // }

  useEffect(() => {
    getDataOrderByPage(currentPage - 1)
  }, [])

  return (
    <div>
      <div>
        <div className="schedule-width" style={{ marginLeft: '30%', marginTop: '30px' }}>
          <div className="">

            <div className="d-fix">
              <div className="width25percent">
                <div className="padding-5px">

                  <input style={{ fontSize: '17px', borderRadius: '10px' }} className="form-control form-group" type="text" placeholder=" Tên / Email / SDT đặt vé"
                    onChange={(e) => {
                      setDataSearch(e.target.value)
                    }}
                  />
                </div>
              </div>

              <span style={{ height: '40px', fontSize: '14px', cursor: 'pointer' }} className="btn-search-f" onClick={() => {
                setCurrentPage(1)
                searchOrder(0)
              }}
              ><i class="fa fa-search"></i> Tìm kiếm</span>



            </div>

          </div>
        </div>

        <div id='info' style={{ display: 'block' }} >
          <div className="margin-10px">
            <div className="row form-group table-responsive list-ticket-deskhop margin-auto" >
              <table className="table table-bordered">
                <thead class="thead-dark" style={{ color: '#ffffff' }}>
                  <tr>
                    <th className="ng-binding train-in-header" style={{ width: '16%' }}>Họ tên</th>
                    <th className="ng-binding train-in-header" style={{ width: '13%' }}>Phone</th>
                    <th className="ng-binding train-in-header" style={{ width: '20%' }}>Email</th>
                    <th className="ng-binding train-in-header" style={{ width: '11%' }}>Căn cước</th>
                    <th className="ng-binding train-in-header" style={{ width: '11%' }}>Ngày đi</th>
                    <th className="ng-binding train-in-header" style={{ width: '7%' }}>Số vé</th>
                    <th className="ng-binding train-in-header" style={{ width: '12%' }}>Tổng tiền</th>
                    <th className="ng-binding train-in-header" style={{ width: '10%' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#F0FFFF' }}>
                  {dataOrder.map((item, index) => {
                    return (
                      <tr key={index} >
                        <td className="et-table-cell tabl-cell">{item.customerName}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.phone}</td>
                        <td className="et-table-cell tabl-cell">{item.email}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.idCard}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.date}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.countTicket}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'right' }}>{format_curency(item.totalPrice.toString()) + " VND"} </td>
                        <td className="et-table-cell tabl-cell">
                          {/* <button className='btn btn-primary'
                            onClick={() => {
                              setShowModal(true)
                              getDataTickets(item.idShow)
                            }}
                          >In vé</button>{"  "}
                          
                          <Popconfirm title="Xác nhận hủy hết vé" okText="Yes" cancelText="No"
                            onConfirm={() => {
                              deleteTickets(item._id)
                            }}
                          >
                            <button className='btn btn-primary'>Hủy</button>
                          </Popconfirm>{"  "} */}
                          <Link to={`/ticket/${item.idShow}`} className='btn btn-primary'>Xem Chi Tiết</Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <Pagination defaultPageSize={1} current={currentPage} total={totalPage}
                onChange={(page) => {
                  setCurrentPage(page)
                  if (dataSearch.trim() === '') {
                    getDataOrderByPage(page - 1)
                  } else {
                  }
                }}
              >
              </Pagination>
            </div>
          </div>
        </div>
      </div>

      {/* <Modal show={showModal} size='sm'>
        <Modal.Header>
          <Modal.Title>Thông tin vé</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {dataTickets.map((item, index) => {
            return (
              <Form >
                <h4>{"Customer: " + (index + 1)}</h4>
                <Form.Item>
                  <label className='col-4'>
                    <b>Mã vé: </b>
                  </label>
                  <span>
                    {item.idShow.replace(/-/g, "").slice(0, -14)}
                  </span>
                </Form.Item>
                <Form.Item>
                  <label className='col-4'>
                    <b>Họ tên: </b>
                  </label>
                  <span>
                    {item.customerName}
                  </span>
                </Form.Item>
                <Form.Item>
                  <label className='col-4'>
                    <b>Ghế: </b>
                  </label>
                  <span>
                    {item.seat}
                  </span>
                </Form.Item>
                <Form.Item>
                  <label className='col-4'>
                    <b>Giờ đi: </b>
                  </label>
                  <span>
                    {item.timeStart.split(':')[0] + "h" + item.timeStart.split(':')[1] + "p"}
                  </span>
                </Form.Item>
                <Form.Item>
                  <label className='col-4'>
                    <b>Ngày: </b>
                  </label>
                  <span>
                    {item.dateStart}
                  </span>
                </Form.Item>
                <Form.Item>
                  <label className='col-4'>
                    <b>Ga đi: </b>
                  </label>
                  <span>
                    {item.stationFrom.name}
                  </span>
                </Form.Item>
                <Form.Item>
                  <label className='col-4'>
                    <b>Ga đến: </b>
                  </label>
                  <span>
                    {item.stationTo.name}
                  </span>
                </Form.Item>
                <Form.Item>
                  <label className='col-4'>
                    <b>Gía vé: </b>
                  </label>
                  <span>
                    {format_curency(item.price.toString()) + " VND"}
                  </span>
                </Form.Item>
              </Form>
            )
          })}
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-light' onClick={() => {
            setShowModal(false)
          }}>
            Close
          </button>
          <button className='btn btn-success' onClick={() => {
            updateStatusTickets()
            setShowModal(false)
          }}>
            Accept
          </button>
        </Modal.Footer>
      </Modal> */}
    </div>
  )
}
