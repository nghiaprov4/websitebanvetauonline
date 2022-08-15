import React, { useState, useEffect } from 'react'
import { Banner } from '../_App/Index'
import DatePicker from "react-datepicker";
import { axios } from '../../config/constant'

export default function Schedule() {

  const [disableStationFrom, setDisableStationFrom] = useState(true)
  const [disableStationTo, setDisableStationTo] = useState(true)
  const [disableDate, setDisableDate] = useState(true)
  const [disableStation, setDisableStation] = useState(true)
  const [disableSchedule, setDisableSchedule] = useState(true)
  const [changeTrain, setChangeTrain] = useState(0)

  const [dataStation, setDataStation] = useState([])
  const [dataStationRev, setDataStationRev] = useState([])
  const [dataSchedule, setDataSchedule] = useState({
    stationFrom: {
      id: "",
      name: ""
    },
    stationTo: {
      id: "",
      name: ""
    },
    startDate: '',
  })

  const [dataStationForm, setDataStationForm] = useState(null)
  const [dataStationTo, setDataStationTo] = useState(null)
  const [arrDataScheduleDetail, setArrDataScheduleDetail] = useState([])
  const [dataScheduleDetail, setDataScheduleDetail] = useState(null)


  function format_curency(a) {
    a = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return a;
  }

  function setRealTime(timeStart, timeRun) {
    let hoursStart = parseInt(timeStart.split(':')[0])
    let hoursRun = parseInt(timeRun.split(':')[0])
    let minutesRun = parseInt(timeRun.split(':')[1])
    let hours = (hoursStart + hoursRun) % 24
    return hours + ":" + minutesRun
  }

  async function getDataStation() {
    await axios.get('/station'
    ).then(function (res) {
      setDataStation(res.data.data);
      setDataStationRev(res.data.dataRev)
    }).catch(function (error) {
      console.log(error)
    })
  }
  async function getDataSchedule(date) {
    await axios.post('/schedule', {
      valueSchedule: {
        stationFrom: dataSchedule.stationFrom.id,
        stationTo: dataSchedule.stationTo.id,
        date: date
      }
    }).then(function (res) {
      if (res.data.status === 'success') {
        setArrDataScheduleDetail(res.data.schedule)
        setDataStationForm(res.data.stationFrom)
        setDataStationTo(res.data.stationTo)
      }
    }).catch(function (err) {
      console.log(err)
    })
  }
  useEffect(() => {
    getDataStation()
  }, [])
  return (
    <div>
      <Banner />
      <div className="container backgroud-white">
        <div className="title-h1">THÔNG TIN HÀNH TRÌNH</div>
        <div className="padding-20-50">
          <div className="d-fix form-group">
            <div className="label-form">Ga đi</div>
            <div style={{ width: '100%' }}
              onClick={() => {
                setDisableStationFrom(false)
                setDisableStationTo(true)
                setDisableDate(true)
                setDisableStation(true)
                setDisableSchedule(true)
                setArrDataScheduleDetail([])
              }}>
              <input className="form-control" style={{ cursor: 'pointer' }} type="text" placeholder="Vui lòng chọn ga đi bên dưới" value={dataSchedule.stationFrom.name} disabled />
            </div>
          </div>
          <div className="d-fix form-group">
            <div className="label-form">Ga đến</div>
            <div style={{ width: '100%' }}
              onClick={() => {
                setDisableStationFrom(true)
                setDisableStationTo(false)
                setDisableDate(true)
                setDisableStation(true)
                setDisableSchedule(true)
                setArrDataScheduleDetail([])
              }}>
              <input className="form-control" style={{ cursor: 'pointer' }} type="text" placeholder="Vui lòng chọn ga đến bên dưới" value={dataSchedule.stationTo.name} disabled />
            </div>
          </div>
          <div className="d-fix form-group">
            <div className="label-form">Ngày đi</div>
            <div style={{ width: '100%' }}
              onClick={() => {
                setDisableStationFrom(true)
                setDisableStationTo(true)
                setDisableDate(false)
                setDisableStation(true)
                setDisableSchedule(true)
                setArrDataScheduleDetail([])
              }}>
              <input className="form-control" type="text" style={{ cursor: 'pointer' }} placeholder="Chọn ngày bên dưới" value={dataSchedule.startDate} disabled />
            </div>
          </div>
        </div>
      </div>
      <div className="container padding-20-50 display-flow-root">
        {/*chon ga di */}
        <div className={disableStationFrom ? 'class-hide' : ''}>
          <h3 style={{ textAlign: 'center' }}>Ga đi</h3>
          {dataStation.map((item, index) => {
            return (
              <input key={index} style={{ cursor: 'pointer', marginBottom: '10px' }} className="class-btn-station" value={item.name} readOnly
                onClick={() => {
                  setDisableStationFrom(true)
                  setDisableStationTo(false)
                  setDisableDate(true)
                  setDisableStation(true)
                  setDisableSchedule(true)
                  setDataSchedule({
                    ...dataSchedule,
                    stationFrom: {
                      id: item._id,
                      name: item.name
                    }
                  })
                }}
              />
            )
          })}
        </div>
        <br></br> <br></br> <br></br> <br></br> <br></br> <br></br><br></br><br></br>
        {/*chon ga den */}
        <div className={disableStationTo ? 'class-hide' : ''}>
          <h3 style={{ textAlign: 'center' }}>Ga đến</h3>
          {dataStation.map((item, index) => {
            return (
              <input key={index} style={{ cursor: 'pointer', marginBottom: '10px' }} className="class-btn-station" value={item.name} readOnly
                onClick={() => {
                  setDisableStationFrom(true)
                  setDisableStationTo(true)
                  setDisableDate(false)
                  setDisableStation(true)
                  setDisableSchedule(true)
                  setDataSchedule({
                    ...dataSchedule,
                    stationTo: {
                      id: item._id,
                      name: item.name
                    }
                  })
                }}
              />
            )
          })}
        </div>
        {/* chon ngay */}
        <div className={disableDate ? 'class-hide' : ''}>
          <div className="date-time-booking auto-w90">
            <DatePicker
              minDate={new Date()}
              style={{ cursor: 'pointer' }}
              onSelect={(date) => {
                setDisableStationFrom(true)
                setDisableStationTo(true)
                setDisableDate(true)
                setDisableStation(false)
                setDisableSchedule(true)
                var dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
                setDataSchedule({
                  ...dataSchedule,
                  startDate: dateFormat
                })
                getDataSchedule(dateFormat)
              }}
              selectsRange
              inline
            />
          </div>
        </div>
        {/* chon tau */}
        <div className={disableStation ? "class-hide" : "margin10 backgroud-white"}>
          {arrDataScheduleDetail.length > 0 ?
            arrDataScheduleDetail.map((item, index) => {
              return (
                <div key={index} className="col-xs-4 col-sm-3 et-col-md-2 et-train-block"
                  onClick={() => {
                    setChangeTrain(index)
                    setDisableSchedule(false)
                    setDataScheduleDetail(item)
                  }}
                >
                  <div className={changeTrain === index ? 'et-train-head backgroud-train-toa' : 'et-train-head'}>
                    <div className="row center-block" style={{ width: '40%', marginBottom: '3px' }}>
                      <div className="et-train-lamp text-center" style={{ color: 'rgb(85, 85, 85)' }}>{item.train.idShow}</div>
                    </div>
                    <div className="et-train-head-info">
                      <div className="row et-no-margin"><span className="pull-left et-bold " style={{ width: '30%' }}>Hours</span> <span className="pull-right " style={{ width: '70%', textAlign: 'end' }}>{(dataStationForm && setRealTime(item.time, dataStationForm.minutes)) + ' hours'}</span></div>
                      <div className="row et-no-margin"><span className="pull-left et-bold " style={{ width: '30%' }}>Date</span><span className="pull-right" style={{ width: '70%', textAlign: 'end' }}>{dataSchedule.startDate}</span></div>
                    </div>
                    <div className="row et-no-margin">
                      <div className="et-col-50"><span className="et-train-lamp-bellow-left" /></div>
                      <div className="et-col-50"><span className="et-train-lamp-bellow-right" /></div>
                    </div>
                  </div>
                  <div className="et-train-base" />
                  <div className="et-train-base-2" />
                  <div className="et-train-base-3" />
                  <div className="et-train-base-4" />
                  <div className="et-train-base-5" />
                </div>
              )
            }) :
            <h3 className="dayrunto" style={{ textAlign: 'center', margin: 'auto' }}>Chưa có lịch trình phù hợp</h3>
          }
        </div>
        {/* show shedule train */}
        <div className={disableSchedule ? "class-hide" : ""}>
          <div className='lststation row' >
            <div className="class-train-booking">
              <div className="title-es-booking">
                <i className="fas fa-train" style={{ marginRight: '10px' }}></i>{dataScheduleDetail && dataScheduleDetail.train.idShow}
              </div>
              <div className="d-fix">
                <div className="w40percent-right">
                  <div>Ga đi: {dataSchedule.stationFrom.name}</div>
                  {/* <div>Ngày đi: {dataSchedule.startDate}</div> */}
                </div>
                <div className="width20percent text-center">
                  <i className="fas fa-arrow-right font-size60" style={{ fontSize: '40px' }}></i>
                </div>
                <div className="w40percent-left">
                  <div>Ga đến: {dataSchedule.stationTo.name}</div>
                  {/* <div>Ngày đến: {setRealDate(dataScheduleDetail && dataScheduleDetail.dateStart, dataStationTo && dataStationForm && (dataStationTo.idShow > dataStationForm.idShow ? dataStationTo.minutes : dataStationTo.minutesRev))}</div> */}
                </div>
              </div>
              <div className="time-end-es-booking" style={{ marginTop: '10px' }}>Thời gian: {dataScheduleDetail && dataScheduleDetail.time} - {dataSchedule.startDate} Cự ly: {dataStationForm && dataStationTo && Math.abs(dataStationTo.distance - dataStationForm.distance)}</div>
            </div>
          </div>
          <div className='row'>
            <div className='col-6'>
              <h5 style={{ textAlign: 'center' }}>Các ga trong hành trình</h5>
              <table className="table table-bordered">
                <thead className="et-table-header">
                  <tr>
                    <th className="ng-binding train-in-header" style={{ width: '10%' }}>STT</th>
                    <th className="ng-binding train-in-header" style={{ width: '30%' }}>Ga đi</th>
                    <th className="ng-binding train-in-header" style={{ width: '30%' }}>Cự ly (km)</th>
                    <th className="ng-binding train-in-header" style={{ width: '30%' }}>Giờ xuất phát</th>
                  </tr>
                </thead>
                <tbody>
                  {(dataStationForm && dataStationTo && dataStationForm.idShow < dataStationTo.idShow) ?
                    dataStation.map((item, index) => {
                      if (item._id === dataSchedule.stationFrom.id || item._id === dataSchedule.stationTo.id) {
                        return (
                          <tr key={index}>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center', fontSize: '24px', color: '#189ada', fontWeight: 'bold' }}>{index + 1}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: '', fontSize: '24px', color: '#189ada', fontWeight: 'bold' }}>{item.name}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center', fontSize: '24px', color: '#189ada', fontWeight: 'bold' }}>{item.distance}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center', fontSize: '24px', color: '#189ada', fontWeight: 'bold' }}>{dataScheduleDetail && setRealTime(dataScheduleDetail.time, item.minutes)}</td>
                          </tr>

                        )
                      } else {
                        return (
                          <tr key={index}>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: '' }}>{item.name}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.distance}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{dataScheduleDetail && setRealTime(dataScheduleDetail.time, item.minutes)}</td>
                          </tr>
                        )
                      }

                    }) :
                    dataStationRev.map((item, index) => {
                      if (item._id === dataSchedule.stationFrom.id || item._id === dataSchedule.stationTo.id) {
                        return (
                          <tr key={index}>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center', fontSize: '24px', color: '#189ada', fontWeight: 'bold' }}>{index + 1}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: '', fontSize: '24px', color: '#189ada', fontWeight: 'bold' }}>{item.name}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center', fontSize: '24px', color: '#189ada', fontWeight: 'bold' }}>{1726 - item.distance}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center', fontSize: '24px', color: '#189ada', fontWeight: 'bold' }}>{dataScheduleDetail && setRealTime(dataScheduleDetail.time, item.minutesRev)}</td>
                          </tr>

                        )
                      } else {
                        return (
                          <tr key={index}>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: '' }}>{item.name}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{1726 - item.distance}</td>
                            <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{dataScheduleDetail && setRealTime(dataScheduleDetail.time, item.minutesRev)}</td>
                          </tr>
                        )
                      }

                    })
                  }
                </tbody>
              </table>
            </div>
          
            <div className='col-6'>
              <h5 style={{ textAlign: 'center' }}>Bảng giá vé</h5>
              <table className="table table-bordered">
                <thead className="et-table-header">
                  <tr>
                    <th className="ng-binding train-in-header" style={{ width: '45%' }}>Loại chỗ</th>
                    <th className="ng-binding train-in-header" style={{ width: '25%' }}>Mã</th>
                    <th className="ng-binding train-in-header" style={{ width: '30%' }}>Giá vé (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataScheduleDetail?.train.carriage.map((item, index) => {
                    return (
                      (index === 0 || index === 3 || index === 5 || index === 7) &&
                      <tr key={index} >
                        <td className="et-table-cell tabl-cell" style={{ textAlign: '' }}>{item.name}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{item.idShow}</td>
                        <td className="et-table-cell tabl-cell" style={{ textAlign: 'center' }}>{dataStationForm && dataStationTo && (format_curency(((Math.abs(dataStationTo.distance - dataStationForm.distance) * item.unitPrice) < item.minPrice ? item.minPrice : (Math.abs(dataStationTo.distance - dataStationForm.distance) * item.unitPrice)).toString()))}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
