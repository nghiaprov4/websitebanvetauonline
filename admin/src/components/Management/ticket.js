import React, { useEffect, useState } from 'react'
import { axios } from '../../config/constant'
import { Pagination, Form, message, Popconfirm } from 'antd'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print';
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';

export default function Ticket(props) {
  const dispatch = useDispatch();
  const idOrder = props.match.params.idorder
  const reloadData = useSelector(state => state.reloadData)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const [dataTicket, setDataTicket] = useState([])
  const [dataSearch, setDataSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [indexTicket, setIndexTicket] = useState(0)



  function format_curency(a) {
    a = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return a;
  }

  async function getDataTicketByPage(page) {
    await axios.get(`/ticket-page?page=${page}`
    ).then(function (res) {
      setDataTicket(res.data.data)
      setTotalPage(res.data.totalPage)
    }).catch(function (err) {
      console.log(err)
    })
  }
  async function searchTicket(page) {
    await axios.get(`/ticket-search?page=${page}&&search=${dataSearch}`
    ).then(function (res) {
      setDataTicket(res.data.data)
      setTotalPage(res.data.totalPage)
    }).catch(function (err) {
      console.log(err)
    })
  }

  async function searchTicket1(page, idOrder) {
    await axios.get(`/ticket-search?page=${page}&&search=${idOrder}`
    ).then(function (res) {
      setDataTicket(res.data.data)
      setTotalPage(res.data.totalPage)
    }).catch(function (err) {
      console.log(err)
    })
  }
  async function updateStatusTicket(id) {
    await axios.put(`/ticket-status?id=${id}`
    ).then(function (res) {
      if (res.data.status === 'success') {
        message.success(res.data.message)
        dispatch({ type: "RELOAD" })
      }
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
  //   message.success('In v?? th??nh c??ng')
  // }
  const componentRef = useRef();
  const handlePrint = useReactToPrint({

    content: () => componentRef.current,
    copyStyles: true,
    // onAfterPrint: (index) => {
    //   setIndexTicket(index)

    //   updateStatusTicket(dataTicket[indexTicket]._id)
    // }

  });
  async function cancelTicket(id) {
    await axios.put(`/ticket-delete?id=${id}`
    ).then(function (res) {
      if (res.data.status === 'success') {
        message.success(res.data.message)
        dispatch({ type: "RELOAD" })
      }
    })
  }

  useEffect(() => {
    if (reloadData) {
      getDataTicketByPage(currentPage - 1)
      dispatch({ type: 'NO_RELOAD' })
    }
  }, [reloadData])

  useEffect(() => {
    if (idOrder === 'all') {
      getDataTicketByPage(currentPage - 1)
    } else {
      searchTicket1(currentPage - 1, idOrder)
    }
  }, [])

  return (
    <div>
      <div class="noPrint">
        <div className="schedule-width" style={{ marginLeft: '30%', marginTop: '30px' }}>
          <div className="">
            <div className="d-fix">
              <div className="width25percent">
                <div className="padding-5px">
                  <input style={{ fontSize: '17px', borderRadius: '10px' }} className="form-control form-group" type="text" placeholder="M?? / T??n / CMND/CCCD tr??n v??"
                    onChange={(e) => {
                      setDataSearch(e.target.value)
                    }}
                  />
                </div>
              </div>
              <span style={{ height: '40px', fontSize: '14px', cursor: 'pointer' }} className="btn-search-f" onClick={() => {
                setCurrentPage(1)
                searchTicket(0)
              }}
              ><i class="fa fa-search"></i> T??m ki???m</span>
            </div>
          </div>

        </div>
        <div id='info' style={{ display: 'block' }} >
          <div className="margin-10px">
            <div className="row form-group table-responsive list-ticket-deskhop margin-auto" >
              <table className="table table-bordered">
                <thead class="thead-dark" style={{ color: '#ffffff' }}>
                  <tr>
                    <th className="ng-binding train-in-header" style={{ width: '15%' }}>H??? t??n</th>
                    <th className="ng-binding train-in-header" style={{ width: '15%' }}>S??? cmnd/cccd</th>
                    <th className="ng-binding train-in-header" style={{ width: '10%' }}>M?? gh???</th>
                    <th className="ng-binding train-in-header" style={{ width: '10%' }}>Lo???i gh???</th>
                    <th className="ng-binding train-in-header" style={{ width: '7%' }}>Gi??? ??i</th>
                    <th className="ng-binding train-in-header" style={{ width: '10%' }}>Ng??y ??i</th>
                    <th className="ng-binding train-in-header" style={{ width: '9%' }}>Ga ??i</th>
                    <th className="ng-binding train-in-header" style={{ width: '9%' }}>Ga ?????n</th>
                    <th className="ng-binding train-in-header" style={{ width: '8%' }}>Tr???ng th??i</th>
                    <th className="ng-binding train-in-header" style={{ width: '10%' }}>Gi?? v??</th>
                    <th className="ng-binding train-in-header" style={{ width: '12%' }}>Thao t??c</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#F0FFFF' }}>
                  {dataTicket.map((item, index) => {
                    return (
                      <tr key={index}>
                        {/* <td className="et-table-cell tabl-cell">{item._id}</td> */}
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.customerName}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.idCard}</td>

                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.seat}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.carriage}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.timeStart.split(':')[0] + "h" + item.timeStart.split(':')[1] + "p"}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.dateStart}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.stationFrom.name}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.stationTo.name}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.status === 0 ? "Thanh to??n t???i qu???y" : item.status === 1 ? "???? thanh to??n" : item.status === 2 ? "???? in" : item.status === 3 ? "Y??u c???u h???y" : "???? h???y"}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'right' }}>{format_curency(item.price.toString()) + " VND"} </td>
                        <td className="et-table-cell tabl-cell">
                          <button className='btn btn-primary'
                            onClick={() => {
                              setShowModal(true)
                              setIndexTicket(index)
                            }}
                          >In v?? </button>{"  "}
                          {/* <ReactToPrint
                          trigger={() => {
                            return <button className='btn btn-primary'
                              onClick={() => {
                                setShowModal(true)
                                setIndexTicket(index)
                              }}
                            // onClick={handlePrint}
                            >In v??</button>
                          }}
                          content={() => componentRef.current}
                          documentTitle='Th??ng tin v?? t??u'
                          pageStyle="print"



                        /> */}
                          {/* 
                        <button className='btn btn-primary'
                          onClick={() => {
                            handlePrint(setIndexTicket(index))
                          }}
                        >In v??</button> */}



                          <Popconfirm title="X??c nh???n h???y v??" okText="C??" cancelText="Kh??ng"
                            onConfirm={() => {
                              cancelTicket(item._id)
                            }}
                          >
                            <button className='btn btn-danger'>H???y</button>
                          </Popconfirm>
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
                    getDataTicketByPage(page - 1)
                  } else {
                    searchTicket(page - 1)
                  }
                }}
              >
              </Pagination>
            </div>
          </div>
        </div>
      </div>
      {/* <div ref={componentRef} >
        <label className='col-4'>
          <b>WEBSITE B??N V?? T??U ONLINE <br />
            TH??? L??N T??U H???A
          </b>

        </label>
        <br />
        <label className='col-4'>
          <b>M?? v??: </b>
        </label>
        <span style={{ marginLeft: "-300px" }}>
          {dataTicket[indexTicket] && dataTicket[indexTicket].idShow.replace(/-/g, "").slice(0, -14)}
        </span>
        <br />

        <label className='col-4'>
          <b>H??? t??n: </b>
        </label>
        <span style={{ marginLeft: "-300px" }}>
          {dataTicket[indexTicket] && dataTicket[indexTicket].customerName}
        </span>
        <br />


        <label className='col-4'>
          <b>Gh???: </b>
        </label>
        <span style={{ marginLeft: "-300px" }}>
          {dataTicket[indexTicket] && dataTicket[indexTicket].seat}
        </span>
        <br />


        <label className='col-4'>
          <b>Gi??? ??i: </b>
        </label>
        <span style={{ marginLeft: "-300px" }}>
          {dataTicket[indexTicket] && dataTicket[indexTicket].timeStart.split(':')[0] + "h" + dataTicket[indexTicket].timeStart.split(':')[1] + "p"}
        </span>

        <br />

        <label className='col-4'>
          <b>Ng??y ??i: </b>
        </label>
        <span style={{ marginLeft: "-300px" }}>
          {dataTicket[indexTicket] && dataTicket[indexTicket].dateStart}
        </span>
        <br />

        <label className='col-4'>
          <b>Ga ??i: </b>
        </label>
        <span style={{ marginLeft: "-300px" }}>
          {dataTicket[indexTicket] && dataTicket[indexTicket].stationFrom.name}
        </span>
        <br />

        <label className='col-4'>
          <b>Ga ?????n: </b>
        </label>
        <span style={{ marginLeft: "-300px" }}>
          {dataTicket[indexTicket] && dataTicket[indexTicket].stationTo.name}
        </span>
        <br />

        <label className='col-4'>
          <b>Gi?? v??: </b>
        </label>
        <span style={{ marginLeft: "-300px" }}>
          {dataTicket[indexTicket] && format_curency(dataTicket[indexTicket].price.toString()) + " VND"}
        </span>

      </div> */}
      <div >
        <Modal show={showModal} size='sm'  >
          <Modal.Header>
            <Modal.Title>Th??ng tin v?? l??n t??u</Modal.Title>
          </Modal.Header>
          <Form>
            <Form.Item>
              <label className='col-4'>
                <b>M?? v??: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && dataTicket[indexTicket].idShow.replace(/-/g, "").slice(0, -14)}
              </span>
            </Form.Item>
            <Form.Item>
              <label className='col-4'>
                <b>H??? t??n: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && dataTicket[indexTicket].customerName}
              </span>
            </Form.Item>
            <Form.Item>
              <label className='col-5'>
                <b>CMND/CCCD: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && dataTicket[indexTicket].idCard}
              </span>
            </Form.Item>
            <Form.Item>
              <label className='col-4'>
                <b>Gh???: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && dataTicket[indexTicket].seat}
              </span>
            </Form.Item>
            <Form.Item>
              <label className='col-4'>
                <b>Lo???i gh???: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && dataTicket[indexTicket].carriage}
              </span>
            </Form.Item>
            <Form.Item>
              <label className='col-4'>
                <b>Gi??? ??i: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && dataTicket[indexTicket].timeStart.split(':')[0] + "h" + dataTicket[indexTicket].timeStart.split(':')[1] + "p"}
              </span>
            </Form.Item>
            <Form.Item>
              <label className='col-4'>
                <b>Ng??y ??i: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && dataTicket[indexTicket].dateStart}
              </span>
            </Form.Item>
            <Form.Item>
              <label className='col-4'>
                <b>Ga ??i: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && dataTicket[indexTicket].stationFrom.name}
              </span>
            </Form.Item>
            <Form.Item>
              <label className='col-4'>
                <b>Ga ?????n: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && dataTicket[indexTicket].stationTo.name}
              </span>
            </Form.Item>
            <Form.Item>
              <label className='col-4'>
                <b>Gi?? v??: </b>
              </label>
              <span>
                {dataTicket[indexTicket] && format_curency(dataTicket[indexTicket].price.toString()) + " VND"}
              </span>
            </Form.Item>
          </Form>
          <div class="noPrint">
            <Modal.Footer >
              <button className='btn btn-light' onClick={() => {
                setShowModal(false)
              }}>
                H???y
              </button>
              <button className='btn btn-success' onClick={() => {
                window.print()
                updateStatusTicket(dataTicket[indexTicket]._id)
                setShowModal(false)


              }}  >
                ?????ng ??

              </button>
            </Modal.Footer>
          </div>

        </Modal>

      </div>

    </div >
  )
}
