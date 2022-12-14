import React, { useEffect, useState } from 'react'
import { axios } from '../../config/constant'
import { Pagination, Form, message } from 'antd'
import DatePicker from "react-datepicker";
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

export default function Schedule() {
  const dispatch = useDispatch();
  const reloadData = useSelector(state => state.reloadData)
  const reload = useSelector(state => state.reload)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [dataSearch, setDataSearch] = useState('')
  const [dataSchedule, setDataSchedule] = useState([])
  const [schedule, setSchedule] = useState({
    //default
    dateStart: '',
    dateReturn: '',
    time: '',
    station: '',
    stationRev: '',
    //search
    train: null,
  })
  const [showModal, setShowModal] = useState(false)
  const [messages, setMessages] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)

  async function getDataScheduleByPage(page) {
    await axios.get(`/schedule-page?page=${page}`
    ).then(function (res) {
      setDataSchedule(res.data.data)
      setTotalPage(res.data.totalPage)
    }).catch(function (err) {
      console.log(err)
    })
  }
  async function searchSchedule(page) {
    console.log(dataSearch)
    await axios.get(`/schedule-search?page=${page}&&search=${dataSearch}`
    ).then(function (res) {
      setDataSchedule(res.data.data)
      setTotalPage(res.data.totalPage)
    }).catch(function (err) {
      console.log(err)
    })
  }
  async function getDataScheduleByValue() {
    await axios.post('/schedule-value', {
      schedule: schedule
    }).then(function (res) {
      if (res.data.status === 'success') {
        setSchedule({
          ...schedule,
          train: res.data.data.train
        })
        setMessages(res.data.message)
        setIsEmpty(false)
        console.log(res.data.status)
      } else if (res.data.status === 'fail') {
        setSchedule({
          ...schedule,
          train: res.data.data
        })
        setMessages('')
        setIsEmpty(true)
      }
    }).catch(function (err) {
      console.log(err)
    })
  }

  async function createSchedule() {
    await axios.post('/schedule-add', {
      schedule: schedule
    }).then(function (res) {
      if (res.data.status === 'success') {
        message.success(res.data.message)
        setShowModal(false)
        setSchedule({
          dateStart: '',
          dateReturn: '',
          time: '',
          station: '',
          stationRev: '',
          train: {
            idShow: '',
            carriage: [],
          }
        })
        dispatch({ type: "RELOAD1" })
      } else {
        setMessages(res.data.message)
      }
    }).catch(function (err) {
      console.log(err)
    })
  }

  useEffect(() => {
    getDataScheduleByPage(currentPage - 1)
  }, [])

  useEffect(() => {
    if (reloadData) {
      getDataScheduleByValue()
      dispatch({ type: 'NO_RELOAD' })
    }
  }, [reloadData])

  useEffect(() => {
    if (reload) {
      getDataScheduleByPage(currentPage - 1)
      dispatch({ type: 'NO_RELOAD1' })
    }
  }, [reload])

  return (
    <div>
      <div className="schedule-width" style={{marginLeft:'30%',marginTop:'30px'}}>
        <div className="">
          <div className="d-fix">
            <div className="width25percent">
              <div className="padding-5px">
                <input style={{fontSize:'17px',borderRadius:'10px'}} className="form-control form-group" type="text" placeholder="M?? t??u / Gi??? ??i / Ng??y ??i / Ga kh???i h??nh"
                  onChange={(e) => {
                    setDataSearch(e.target.value)
                  }}
                />
              </div>
            </div>
            <span style={{ height: '40px', fontSize: '14px', cursor: 'pointer' }} className="btn-search-f" onClick={() => {
              setCurrentPage(1)
              searchSchedule(0)
            }}
            ><i class="fa fa-search"></i> T??m ki???m</span>
            <span style={{ height: '40px', fontSize: '14px', cursor: 'pointer' }} className="btn-search-f" onClick={() => {
              setShowModal(true)
            }}
            >Th??m l???ch tr??nh</span>
          </div>

        </div>

      </div>
      <div className="margin-10px">
        <div className="row form-group table-responsive list-ticket-deskhop margin-auto" >
          <table className="table table-bordered">
            <thead class="thead-dark" style={{ color: '#ffffff' }}>
              <tr>
                <th className="ng-binding train-in-header" style={{ width: '15%' }}>Ng??y ??i</th>
                <th className="ng-binding train-in-header" style={{ width: '15%' }}>Gi??? ??i</th>
                <th className="ng-binding train-in-header" style={{ width: '20%' }}>M?? t??u</th>
                <th className="ng-binding train-in-header" style={{ width: '20%' }}>Ga kh???i h??nh</th>
                <th className="ng-binding train-in-header" style={{ width: '15%' }}>S??? l?????ng toa</th>
                <th className="ng-binding train-in-header" style={{ width: '15%' }}>S??? l?????ng ch???</th>
              </tr>
            </thead>
            <tbody style={{backgroundColor:'#F0FFFF'}}>
              {dataSchedule.map((item, index) => {
                return (
                  <tr>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.dateStart}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.time.split(':')[0] + "h" + item.time.split(':')[1] + "p"}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.train.idShow}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.station}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.train.carriage.length}</td>
                    <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>420</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pagination defaultPageSize={1} current={currentPage} total={totalPage}
            onChange={(page) => {
              setCurrentPage(page)
              if (dataSearch.trim() === '') {
                getDataScheduleByPage(page - 1)
              } else {
              }
            }}
          >
          </Pagination>
        </div>
      </div>
      <Modal show={showModal} size='sm'>
        <Modal.Header>
          <Modal.Title>Th??m l???ch tr??nh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form >
            <Form.Item >
              <DatePicker className="form-control select-style-sarch"
                placeholderText="Ng??y ??i"
                onChange={(date) => {
                  var date2 = new Date(date.getTime() + 86400000 * 2)
                  var dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
                  var dateFormat2 = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date2)
                  setSchedule({
                    ...schedule,
                    dateStart: dateFormat,
                    dateReturn: dateFormat2,
                    station: 'H?? N???i',
                    stationRev: 'S??i G??n'
                  })
                  dispatch({ type: "RELOAD" })
                }}
                value={schedule.dateStart}
                minDate={new Date()}
              />
            </Form.Item>
            <Form.Item>
              <select
                defaultValue=""
                className="form-control select-style-sarch width95percent"
                onChange={(e) => {
                  setSchedule({
                    ...schedule,
                    time: e.target.value,
                    station: 'H?? N???i',
                    stationRev: 'S??i G??n'
                  })
                  dispatch({ type: "RELOAD" })
                }}
              >
                <option value="" disabled >Th???i gian ch???y</option>
                <option value='6:00'>6 gi???</option>
                <option value='15:20'>15 gi??? 20</option>
              </select>
            </Form.Item>
            <Form.Item>
              <label className='col-6'>
                <b>T??u: </b>
              </label>
              <span>{schedule.train && 'T??u ' + schedule.train.idShow + " - " + schedule.train.carriage.length + " toa"}</span>
            </Form.Item>
            <Form.Item>
              <label className='col-6'>
                <b>Gi??? kh???i h??nh: </b>
              </label>
              <span>{schedule.time}</span>
            </Form.Item>
            <Form.Item>
              <label className='col-6'>
                <b>Ng??y ??i: </b>
              </label>
              <span>{schedule.dateStart}</span>
            </Form.Item>
            <Form.Item>
              <label className='col-6'>
                <b>Ga ??i: </b>
              </label>
              <span>{schedule.station}</span>
            </Form.Item>
            <Form.Item>
              <label className='col-6'>
                <b>Ng??y v???: </b>
              </label>
              <span>{schedule.dateReturn}</span>
            </Form.Item>
            <Form.Item>
              <label className='col-6'>
                <b>Ga v???: </b>
              </label>
              <span>{schedule.stationRev}</span>
            </Form.Item>
            <h6 style={{ textAlign: 'center', color: 'red' }}>{messages}</h6>
            <Modal.Footer>
              <button className='btn btn-light' onClick={() => {
                setShowModal(false)
                setMessages('')
                setSchedule({
                  dateStart: '',
                  dateReturn: '',
                  time: '',
                  station: '',
                  stationRev: '',
                  train: {
                    idShow: '',
                    carriage: [],
                  }
                })
              }}>
                ????ng
              </button>
              <button className='btn btn-success' onClick={() => {
                isEmpty ? createSchedule() : setMessages('Th??ng tin kh??ng h???p l???')
              }}>
                ?????ng ??
              </button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}
