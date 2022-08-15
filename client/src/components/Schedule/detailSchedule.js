import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Banner } from './../_App/Index';
import { Image } from 'react-bootstrap';
import { axios } from '../../config/constant';
import { message } from 'antd';
import _findIndex from 'lodash/findIndex'
import { useHistory } from 'react-router';


export default function DetailSchedule() {
  //new
  const history = useHistory();
  const dispatch = useDispatch();
  const valueSearchSchedule = useSelector(state => state.valueSearchSchedule)
  const reloadSeat = useSelector(state => state.reloadSeat)
  const reloadSeatReturn = useSelector(state => state.reloadSeatReturn)
  const reloadCart = useSelector(state => state.reloadCart)


  const [changeTrain, setChangeTrain] = useState(0);
  const [changeTrainReturn, setChangeTrainReturn] = useState(0);
  const [changeCarriage, setChangeCarriage] = useState(0);
  const [changeCarriageReturn, setChangeCarriageReturn] = useState(0);

  const [dataSchedule, setDataSchedule] = useState({
    scheduleDetail: [],
    stationFrom: '',
    stationTo: '',
  })
  const [dataScheduleReturn, setDataScheduleReturn] = useState({
    scheduleDetail: [],
    stationFrom: '',
    stationTo: '',
  })
  const [dataOther, setDataOther] = useState({
    idSchedule: '',
    idTrain: '',
    idShowTrain: '',
    idCarriage: '',
    idShowCarriage: '',
    nameCarriage: '',
    timeStart: ''
  })
  const [dataOtherReturn, setDataOtherReturn] = useState({
    idSchedule: '',
    idTrain: '',
    idShowTrain: '',
    idCarriage: '',
    idShowCarriage: '',
    nameCarriage: '',
    timeStart: ''
  })
  const [ticket, setTicket] = useState({
    //co gia mac dinh nhung co thể thay đổi
    idSchedule: '',
    timeStart: '',
    nameCarriage: '',
    price: '',
    priceDiscount: '',

    // chưa gán giá trị mặc đijnh
    idSeat: '',

    //giá trị có định không đổi
    dateStart: '',
    stationFrom: {
      idShow: '',
      name: '',
      minutes: '',
      distance: '',
    },
    stationTo: {
      idShow: '',
      name: '',
      minutes: '',
      distance: '',
    },
    discount: 0,
    customerName: '',
    identityCard: '',
  })
  const [ticketReturn, setTicketReturn] = useState({
    //co gia mac dinh nhung co thể thay đổi
    idSchedule: '',
    timeStart: '',
    nameCarriage: '',
    price: '',
    priceDiscount: '',

    // chưa gán giá trị mặc đijnh
    idSeat: '',

    //giá trị có định không đổi
    dateStart: '',
    stationFrom: {
      idShow: '',
      name: '',
      minutes: '',
      distance: '',
    },
    stationTo: {
      idShow: '',
      name: '',
      minutes: '',
      distance: '',
    },
    discount: 0,
    customerName: '',
    identityCard: '',
  })
  const [cart, setCart] = useState([])

  //get data from api
  const [dataCarriage, setDataCarriage] = useState([])
  const [dataCarriageReturn, setDataCarriageReturn] = useState([])
  const [dataSeat, setDataSeat] = useState([])
  const [dataSeatReturn, setDataSeatReturn] = useState([])
  const [dataTickets, setDataTickets] = useState([])
  const [dataTicketsReturn, setDataTicketsReturn] = useState([])


  function setRealTime(timeStart, timeRun) {
    let hoursStart = parseInt(timeStart.split(':')[0])
    let hoursRun = parseInt(timeRun.split(':')[0])
    let minutesRun = parseInt(timeRun.split(':')[1])
    let hours = (hoursStart + hoursRun) % 24
    return hours + ":" + minutesRun
  }
  function format_curency(a) {
    a = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return a;
  }

  async function getDataTickets(idSchedule, idStationFrom, idStationTo) {
    await axios.get(`/ticket?idSchedule=${idSchedule}&&idStationFrom=${idStationFrom}&&idStationTo=${idStationTo}`
    ).then(function (res) {
      if (res.data.status === 'success') {
        setDataTickets(res.data.data)
      }
    }).catch(function (err) {
      console.log(err)
    })
  }
  async function getDataTicketsReturn(idSchedule, idStationFrom, idStationTo) {
    await axios.get(`/ticket?idSchedule=${idSchedule}&&idStationFrom=${idStationFrom}&&idStationTo=${idStationTo}`
    ).then(function (res) {
      if (res.data.status === 'success') {
        setDataTicketsReturn(res.data.data)
      }
    }).catch(function (err) {
      console.log(err)
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
        //tinh gia ghe
        let price = parseInt(res.data.schedule[0].train.carriage[0].unitPrice) * Math.abs(parseInt(res.data.stationFrom.distance) - parseInt(res.data.stationTo.distance))
        getDataTickets(res.data.schedule[0]._id, res.data.stationFrom.idShow, res.data.stationTo.idShow)
        setDataSchedule({
          scheduleDetail: res.data.schedule,
          stationFrom: res.data.stationFrom,
          stationTo: res.data.stationTo
        })
        setDataOther({
          idSchedule: res.data.schedule[0]._id,
          idTrain: res.data.schedule[0].train._id,
          idShowTrain: res.data.schedule[0].train.idShow,
          idCarriage: res.data.schedule[0].train.carriage[0]._id,
          idShowCarriage: res.data.schedule[0].train.carriage[0].idShow,
          nameCarriage: res.data.schedule[0].train.carriage[0].name,
          timeStart: setRealTime(res.data.schedule[0].time, res.data.stationFrom.minutes)
        })
        setDataCarriage(res.data.schedule[0].train.carriage)
        setDataSeat(res.data.schedule[0].train.carriage[0].seat)
        setTicket({
          ...ticket,
          idSchedule: res.data.schedule[0]._id,
          timeStart: setRealTime(res.data.schedule[0].time, res.data.stationFrom.minutes),
          nameCarriage: res.data.schedule[0].train.carriage[0].name,
          price: price > res.data.schedule[0].train.carriage[0].minPrice ? price : res.data.schedule[0].train.carriage[0].minPrice,
          priceDiscount: price > res.data.schedule[0].train.carriage[0].minPrice ? price : res.data.schedule[0].train.carriage[0].minPrice,

          dateStart: valueSearchSchedule.startDate,
          stationFrom: {
            idShow: res.data.stationFrom.idShow,
            name: res.data.stationFrom.name,
            minutes: res.data.stationFrom.minutes,
            distance: res.data.stationFrom.distance,
          },
          stationTo: {
            idShow: res.data.stationTo.idShow,
            name: res.data.stationTo.name,
            minutes: res.data.stationTo.minutes,
            distance: res.data.stationTo.distance,
          }
        })
      }
    }).catch(function (error) {
      console.log(error)
    })
  }
  async function getDataScheduleReturn() {
    await axios.post('/schedule', {
      valueSchedule: {
        stationFrom: valueSearchSchedule.stationTo,
        stationTo: valueSearchSchedule.stationFrom,
        date: valueSearchSchedule.returnDate,
      }
    }).then(async function (res) {
      if (res.data.status === 'success') {
        //tinh gia ghe
        let price = parseInt(res.data.schedule[0].train.carriage[0].unitPrice) * Math.abs(parseInt(res.data.stationFrom.distance) - parseInt(res.data.stationTo.distance))
        getDataTicketsReturn(res.data.schedule[0]._id, res.data.stationFrom.idShow, res.data.stationTo.idShow)
        setDataScheduleReturn({
          scheduleDetail: res.data.schedule,
          stationFrom: res.data.stationFrom,
          stationTo: res.data.stationTo
        })
        setDataOtherReturn({
          idSchedule: res.data.schedule[0]._id,
          idTrain: res.data.schedule[0].train._id,
          idShowTrain: res.data.schedule[0].train.idShow,
          idCarriage: res.data.schedule[0].train.carriage[0]._id,
          idShowCarriage: res.data.schedule[0].train.carriage[0].idShow,
          nameCarriage: res.data.schedule[0].train.carriage[0].name,
          timeStart: setRealTime(res.data.schedule[0].time, res.data.stationFrom.minutes)
        })
        setDataCarriageReturn(res.data.schedule[0].train.carriage)
        setDataSeatReturn(res.data.schedule[0].train.carriage[0].seat)
        setTicketReturn({
          ...ticketReturn,
          idSchedule: res.data.schedule[0]._id,
          timeStart: setRealTime(res.data.schedule[0].time, res.data.stationFrom.minutes),
          nameCarriage: res.data.schedule[0].train.carriage[0].name,
          price: price > res.data.schedule[0].train.carriage[0].minPrice ? price : res.data.schedule[0].train.carriage[0].minPrice,
          priceDiscount: price > res.data.schedule[0].train.carriage[0].minPrice ? price : res.data.schedule[0].train.carriage[0].minPrice,

          dateStart: valueSearchSchedule.returnDate,
          stationFrom: {
            idShow: res.data.stationFrom.idShow,
            name: res.data.stationFrom.name,
            minutes: res.data.stationFrom.minutes,
            distance: res.data.stationFrom.distance,
          },
          stationTo: {
            idShow: res.data.stationTo.idShow,
            name: res.data.stationTo.name,
            minutes: res.data.stationTo.minutes,
            distance: res.data.stationTo.distance,
          }
        })
      }
    }).catch(function (error) {
      console.log(error)
    })
  }
  async function handleTrain(idSchedule) {
    // console.log(idSchedule)
    await axios.get(`/schedule-id?id=${idSchedule}`
    ).then(function (res) {
      //tinh gia ghe
      let price = parseInt(res.data.data.train.carriage[0].unitPrice) * Math.abs(parseInt(dataSchedule.stationFrom.distance) - parseInt(dataSchedule.stationTo.distance))
      getDataTickets(res.data.data._id, dataSchedule.stationFrom.idShow, dataSchedule.stationTo.idShow)
      setDataOther({
        idSchedule: res.data.data._id,
        idTrain: res.data.data.train._id,
        idShowTrain: res.data.data.train.idShow,
        idCarriage: res.data.data.train.carriage[0]._id,
        idShowCarriage: res.data.data.train.carriage[0].idShow,
        nameCarriage: res.data.data.train.carriage[0].name,
        timeStart: setRealTime(res.data.data.time, dataSchedule.stationFrom.minutes)
      })
      setDataCarriage(res.data.data.train.carriage)
      setDataSeat(res.data.data.train.carriage[0].seat)
      setTicket({
        ...ticket,
        idSchedule: res.data.data._id,
        timeStart: setRealTime(res.data.data.time, dataSchedule.stationFrom.minutes),
        nameCarriage: res.data.data.train.carriage[0].name,
        price: price > res.data.data.train.carriage[0].minPrice ? price : res.data.data.train.carriage[0].minPrice,
        priceDiscount: price > res.data.data.train.carriage[0].minPrice ? price : res.data.data.train.carriage[0].minPrice,
      })
    }).catch(function (err) {
      console.log(err)
    })
  }
  async function handleTrainReturn(idSchedule) {
    // console.log(idSchedule)
    await axios.get(`/schedule-id?id=${idSchedule}`
    ).then(function (res) {
      //tinh gia ghe
      let price = parseInt(res.data.data.train.carriage[0].unitPrice) * Math.abs(parseInt(dataScheduleReturn.stationFrom.distance) - parseInt(dataScheduleReturn.stationTo.distance))
      getDataTicketsReturn(res.data.data._id, dataScheduleReturn.stationFrom.idShow, dataScheduleReturn.stationTo.idShow)
      setDataOtherReturn({
        idSchedule: res.data.data._id,
        idTrain: res.data.data.train._id,
        idShowTrain: res.data.data.train.idShow,
        idCarriage: res.data.data.train.carriage[0]._id,
        idShowCarriage: res.data.data.train.carriage[0].idShow,
        nameCarriage: res.data.data.train.carriage[0].name,
        timeStart: setRealTime(res.data.data.time, dataScheduleReturn.stationFrom.minutes)
      })
      setDataCarriageReturn(res.data.data.train.carriage)
      setDataSeatReturn(res.data.data.train.carriage[0].seat)
      setTicketReturn({
        ...ticketReturn,
        idSchedule: res.data.data._id,
        timeStart: setRealTime(res.data.data.time, dataScheduleReturn.stationFrom.minutes),
        nameCarriage: res.data.data.train.carriage[0].name,
        price: price > res.data.data.train.carriage[0].minPrice ? price : res.data.data.train.carriage[0].minPrice,
        priceDiscount: price > res.data.data.train.carriage[0].minPrice ? price : res.data.data.train.carriage[0].minPrice,
      })
    }).catch(function (err) {
      console.log(err)
    })
  }
  async function handleCarriage(idCarriage) {
    await axios.get(`/carriage?idTrain=${dataOther.idTrain}&&idCarriage=${idCarriage}`
    ).then(function (res) {
      let price = parseInt(res.data.data.unitPrice) * Math.abs(parseInt(dataSchedule.stationFrom.distance) - parseInt(dataSchedule.stationTo.distance))
      setDataSeat(res.data.data.seat)
      setDataOther({
        ...dataOther,
        idShowCarriage: res.data.data.idShow,
        nameCarriage: res.data.data.name,
      })
      setTicket({
        ...ticket,
        nameCarriage: res.data.data.name,
        price: price > res.data.data.minPrice ? price : res.data.data.minPrice,
        priceDiscount: price > res.data.data.minPrice ? price : res.data.data.minPrice,
      })
    }).catch(function (error) {
      console.log(error)
    })
  }
  async function handleCarriageReturn(idCarriage) {
    await axios.get(`/carriage?idTrain=${dataOtherReturn.idTrain}&&idCarriage=${idCarriage}`
    ).then(function (res) {
      let price = parseInt(res.data.data.unitPrice) * Math.abs(parseInt(dataScheduleReturn.stationFrom.distance) - parseInt(dataScheduleReturn.stationTo.distance))
      setDataSeatReturn(res.data.data.seat)
      setDataOtherReturn({
        ...dataOtherReturn,
        idShowCarriage: res.data.data.idShow,
        nameCarriage: res.data.data.name,
      })
      setTicketReturn({
        ...ticketReturn,
        nameCarriage: res.data.data.name,
        price: price > res.data.data.minPrice ? price : res.data.data.minPrice,
        priceDiscount: price > res.data.data.minPrice ? price : res.data.data.minPrice,
      })
    }).catch(function (error) {
      console.log(error)
    })
  }

  useEffect(() => {
    if (valueSearchSchedule.status === '1') {
      getDataSchedule()
    } else if (valueSearchSchedule.status === '2') {
      getDataSchedule()
      getDataScheduleReturn()
    } else {
      history.push('/')
    }
  }, [])

  useEffect(() => {
    if (reloadSeat) {
      setCart(cart => [
        ...cart,
        ticket
      ])
      dispatch({ type: 'NO_RELOAD_SEAT' })
    }
  }, [reloadSeat])

  useEffect(() => {
    if (reloadSeatReturn) {
      setCart(cart => [
        ...cart,
        ticketReturn
      ])
      dispatch({ type: 'NO_RELOAD_SEAT_RETURN' })
    }
  }, [reloadSeatReturn])

  useEffect(() => {
    if (reloadCart) {
      dispatch({ type: 'NO_RELOAD_CART' })
    }
  }, [reloadCart])

  return (
    <div>
      <Banner />
      <div className="container" style={{ display: 'flex' }}>
        <div className="col-left-70">
          {/* schedule */}
          <div style={{ marginBottom: '50px' }}>
            <div className="dayrunto">Chiều đi: Ngày {valueSearchSchedule.startDate} từ {dataSchedule.stationFrom.name} đến {dataSchedule.stationTo.name}</div>
            {/* danh sach  tau */}
            <div className="margin10 backgroud-white">
              {dataSchedule.scheduleDetail.map((item, index) => {
                return (
                  <div key={index} className="col-xs-4 col-sm-3 et-col-md-2 et-train-block"
                    onClick={() => {
                      setChangeTrain(index)
                      handleTrain(item._id)
                      setChangeCarriage(0)
                    }}
                  >
                    <div className={changeTrain === index ? 'et-train-head backgroud-train-toa' : 'et-train-head'}>
                      <div className="row center-block" style={{ width: '40%', marginBottom: '3px' }}>
                        <div className="et-train-lamp text-center" style={{ color: 'rgb(85, 85, 85)' }}>{item.train.idShow}</div>
                      </div>
                      <div className="et-train-head-info">
                        <div className="row et-no-margin"><span className="pull-left et-bold " style={{ width: '30%' }}>Hours</span> <span className="pull-right " style={{ width: '70%', textAlign: 'end' }}>{setRealTime(item.time, dataSchedule.stationFrom && dataSchedule.stationFrom.minutes) + ' hours'}</span></div>
                        <div className="row et-no-margin"><span className="pull-left et-bold " style={{ width: '30%' }}>Date</span><span className="pull-right" style={{ width: '70%', textAlign: 'end' }}>{valueSearchSchedule.startDate}</span></div>
                        <div className="row et-no-margin">
                          <div className="et-col-50">
                            <div className="et-text-sm ">SL chỗ đặt</div>
                            <div className="et-text-large et-bold pull-left " style={{ marginLeft: '5px' }}>{dataTickets.length}</div>
                          </div>
                          <div className="et-col-50 text-center">
                            <div className="et-text-sm ">SL chỗ trống</div>
                            <div className="et-text-large et-bold pull-right " style={{ marginRight: '5px' }}>{420 - dataTickets.length}</div>
                          </div>
                        </div>
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
              })
              }
            </div>
            {/* danh sach toa */}
            <div className="col-md-12 et-no-margin text-center" style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'left' }}>
              {/* dautoa */}
              <div className="et-car-block ng-scope">
                <div className="et-car-block">
                  <div className="et-car-icon">
                    <Image src="images/train2.png" alt='Hinh' />
                  </div>
                  <div className="text-center text-info et-car-label ng-binding">{dataOther.idShowTrain}</div>
                </div>
              </div>
              {/* toa */}
              {dataCarriage.map((item, index) => {
                return (
                  <div key={index} className="et-car-block ng-scope">
                    <div className="et-car-block"
                      onClick={() => {
                        setChangeCarriage(index)
                        handleCarriage(item.idShow)
                      }}
                    >
                      <div className={changeCarriage === index ? "et-car-icon et-car-icon-selected" : "et-car-icon et-car-icon et-car-icon-avaiable"}>
                        <Image src="images/trainCar2.png" alt='Hinh' />
                      </div>
                      <div className="text-center text-info et-car-label ng-binding">{index + 1}</div>
                    </div>
                  </div>
                )
              })
              }
            </div>
            {/* danh sach ghe */}
            {dataOther.idShowCarriage.includes('NM') ?
              //  toa ngoi mem *
              <div>
                <div style={{ textAlign: 'center', fontSize: '20px', margin: '10px' }}>{`${dataOther.nameCarriage} (${dataOther.idShowCarriage} - TG đi ${valueSearchSchedule.startDate} - ${dataOther.timeStart}p)`}</div>
                <div className="row et-car-floor">
                  <div className="et-full-width">
                    <div className="et-car-nm-64-half-block">
                      {dataSeat.map((item, index) => {
                        return (
                          index < 20 &&
                          <div key={index} className="et-car-nm-64-sit ng-isolate-scope" style={{ width: '20%' }}
                            onClick={() => {
                              if (_findIndex(dataTickets, { seat: item }) < 0) {
                                setTicket({
                                  ...ticket,
                                  idShow: item + "-" + new Date().toISOString(),
                                  idSeat: item
                                })
                                let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule })
                                if (indexCart < 0) {
                                  dispatch({ type: 'RELOAD_SEAT' })
                                } else {
                                  cart.splice(indexCart, 1)
                                  dispatch({ type: 'RELOAD_CART' })
                                }
                              }
                            }}
                          >
                            <div className="et-car-seat-right et-seat-h-35">
                              <div className="et-col-16 et-sit-side" />
                              <div className="et-col-84 et-sit-sur-outer">
                                <div className="et-sit-sur tooltiptop text-center et-sit-avaiable"
                                  style={{
                                    background: _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTickets, { seat: item }) > -1 ? '#df5327' : '#fff'
                                  }}>
                                  <div className="et-sit-no ng-scope">
                                    <span >{index + 1}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                      }
                    </div>
                    <div className="et-car-seperator">
                      <div></div>
                      <div></div>
                    </div>
                    <div className="et-car-nm-64-half-block">
                      {dataSeat.map((item, index) => {
                        return (
                          index > 19 &&
                          <div key={index} className="et-car-nm-64-sit ng-isolate-scope" style={{ width: '20%' }}
                            onClick={() => {
                              if (_findIndex(dataTickets, { seat: item }) < 0) {
                                setTicket({
                                  ...ticket,
                                  idShow: item + "-" + new Date().toISOString(),
                                  idSeat: item
                                })
                                let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule })
                                if (indexCart < 0) {
                                  dispatch({ type: 'RELOAD_SEAT' })
                                } else {
                                  cart.splice(indexCart, 1)
                                  dispatch({ type: 'RELOAD_CART' })
                                }
                              }
                            }}
                          >
                            <div className="et-car-seat-right et-seat-h-35">
                              <div className="et-col-16 et-sit-side" />
                              <div className="et-col-84 et-sit-sur-outer">
                                <div className="et-sit-sur tooltiptop text-center et-sit-avaiable"
                                  style={{
                                    background: _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTickets, { seat: item }) > -1 ? '#df5327' : '#fff'
                                  }}>
                                  <div className="et-sit-no ng-scope">
                                    <span>{index + 1}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                      }
                    </div>
                  </div>
                </div>
              </div> :
              dataOther.idShowCarriage.includes('NC') ?
                //toa ngoi cung
                <div>
                  <div style={{ textAlign: 'center', fontSize: '20px', margin: '10px' }}>{`${dataOther.nameCarriage} (${dataOther.idShowCarriage} - TG đi ${valueSearchSchedule.startDate}- ${dataOther.timeStart}p)`}</div>
                  <div className="row et-car-floor">
                    <div className="et-full-width">
                      {dataSeat.map((item, index) => {
                        return (
                          index % 2 === 0 ?
                            <div key={index} className="et-col-1-20 et-seat-h-35 ng-isolate-scope"
                              onClick={() => {
                                if (_findIndex(dataTickets, { seat: item }) < 0) {
                                  setTicket({
                                    ...ticket,
                                    idShow: item + "-" + new Date().toISOString(),
                                    idSeat: item
                                  })
                                  let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule })
                                  if (indexCart < 0) {
                                    dispatch({ type: 'RELOAD_SEAT' })
                                  } else {
                                    cart.splice(indexCart, 1)
                                    dispatch({ type: 'RELOAD_CART' })
                                  }
                                }
                              }}
                            >
                              <div className="et-car-seat-left et-seat-h-35">
                                <div className="et-col-16 et-sit-side" />
                                <div className="et-col-84 et-sit-sur-outer">
                                  <div className="et-sit-sur tooltiptop text-center et-sit-avaiable"
                                    style={{
                                      background: _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTickets, { seat: item }) > -1 ? '#df5327' : '#fff'
                                    }}>
                                    <div className="et-sit-no ng-scope">
                                      <span>{index + 1}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div> :
                            <div key={index} className="et-col-1-20 et-seat-h-35 ng-isolate-scope"
                              onClick={() => {
                                if (_findIndex(dataTickets, { seat: item }) < 0) {
                                  setTicket({
                                    ...ticket,
                                    idShow: item + "-" + new Date().toISOString(),
                                    idSeat: item
                                  })
                                  let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule })
                                  if (indexCart < 0) {
                                    dispatch({ type: 'RELOAD_SEAT' })
                                  } else {
                                    cart.splice(indexCart, 1)
                                    dispatch({ type: 'RELOAD_CART' })
                                  }
                                }
                              }}
                            >
                              <div className="et-car-seat-left et-seat-h-35">
                                <div className="et-col-84 et-sit-sur-outer">
                                  <div className="et-sit-sur tooltiptop text-center et-sit-avaiable"
                                    style={{
                                      background: _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTickets, { seat: item }) > -1 ? '#df5327' : '#fff'
                                    }}>
                                    <div className="et-sit-no ng-scope">
                                      <span>{index + 1}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="et-col-16 et-sit-side" />
                              </div>
                            </div>
                        )
                      })
                      }
                    </div>
                  </div>
                </div> :
                dataOther.idShowCarriage.includes('N4') ?
                  //toa nam loai 4
                  <div>
                    <div style={{ textAlign: 'center', fontSize: '20px', margin: '10px' }}>{`${dataOther.nameCarriage} (${dataOther.idShowCarriage} - TG đi ${valueSearchSchedule.startDate} - ${dataOther.timeStart}p)`}</div>
                    <div className="row et-car-floor">
                      <div className="et-col-8-9 mb-w-100">
                        <div className="et-col-1-16 et-car-floor-full-height">
                          <div className="et-bed-way et-full-width" />
                          <div className="et-bed-way et-full-width text-center small ">Tầng 2</div>
                          <div className="et-bed-way et-full-width text-center small ">Tầng 1</div>
                        </div>
                        <div className="et-bed-way et-full-width et-text-sm">
                          <div className="et-col-1-8 text-center ">Khoang 1</div>
                          <div className="et-col-1-8 text-center ">Khoang 2</div>
                          <div className="et-col-1-8 text-center ">Khoang 3</div>
                          <div className="et-col-1-8 text-center ">Khoang 4</div>
                          <div className="et-col-1-8 text-center ">Khoang 5</div>
                          <div className="et-col-1-8 text-center ">Khoang 6</div>
                          <div className="et-col-1-8 text-center ">Khoang 7</div>
                        </div>
                        {dataSeat.map((item, index) => {
                          return (
                            index % 2 === 1 &&
                            <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                              onClick={() => {
                                if (_findIndex(dataTickets, { seat: item }) < 0) {
                                  setTicket({
                                    ...ticket,
                                    idShow: item + "-" + new Date().toISOString(),
                                    idSeat: item
                                  })
                                  let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule })
                                  if (indexCart < 0) {
                                    dispatch({ type: 'RELOAD_SEAT' })
                                  } else {
                                    cart.splice(indexCart, 1)
                                    dispatch({ type: 'RELOAD_CART' })
                                  }
                                }
                              }}
                            >
                              <div className="et-bed-left">
                                <div className="et-bed-outer">
                                  <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                    style={{
                                      background: _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTickets, { seat: item }) > -1 ? '#df5327' : '#fff'
                                    }}>
                                    <div className="et-sit-no ng-scope" >
                                      <span>{index + 1}</span>
                                    </div>
                                  </div>
                                  <div className="et-bed-illu" />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {/* ---- */}
                        <div className="et-col-1-16 et-seat-h-35 ng-isolate-scope" />
                        {/* ---- */}
                        {dataSeat.map((item, index) => {
                          return (
                            index % 2 === 0 &&
                            <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                              onClick={() => {
                                if (_findIndex(dataTickets, { seat: item }) < 0) {
                                  setTicket({
                                    ...ticket,
                                    idShow: item + "-" + new Date().toISOString(),
                                    idSeat: item
                                  })
                                  let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule })
                                  if (indexCart < 0) {
                                    dispatch({ type: 'RELOAD_SEAT' })
                                  } else {
                                    cart.splice(indexCart, 1)
                                    dispatch({ type: 'RELOAD_CART' })
                                  }
                                }
                              }}
                            >
                              <div className="et-bed-left">
                                <div className="et-bed-outer">
                                  <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                    style={{
                                      background: _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTickets, { seat: item }) > -1 ? '#df5327' : '#fff'
                                    }}>
                                    <div className="et-sit-no ng-scope" >
                                      <span>{index + 1}</span>
                                    </div>
                                    <div className="popover top fade in tooltip_description">
                                      <div className="arrow" />
                                    </div>
                                  </div>
                                  <div className="et-bed-illu" />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div> :
                  // toa nam loai 6
                  <div>
                    <div style={{ textAlign: 'center', fontSize: '20px', margin: '10px' }}>{`${dataOther.nameCarriage} (${dataOther.idShowCarriage} - TG đi ${valueSearchSchedule.startDate} - ${dataOther.timeStart}p)`}</div>
                    <div className="row et-car-floor">
                      <div className="et-col-8-9 mb-w-100">
                        <div className="et-col-1-18 et-car-floor-full-height">
                          <div className="et-bed-way et-full-width" />
                          <div className="et-bed-way et-full-width text-center small ng-binding">Tầng 3</div>
                          <div className="et-bed-way et-full-width text-center small ng-binding">Tầng 2</div>
                          <div className="et-bed-way et-full-width text-center small ng-binding">Tầng 1</div>
                        </div>
                        <div className="et-bed-way et-full-width et-text-sm">
                          <div className="et-col-1-8 text-center ng-binding">Khoang 1</div>
                          <div className="et-col-1-8 text-center ng-binding">Khoang 2</div>
                          <div className="et-col-1-8 text-center ng-binding">Khoang 3</div>
                          <div className="et-col-1-8 text-center ng-binding">Khoang 4</div>
                          <div className="et-col-1-8 text-center ng-binding">Khoang 5</div>
                          <div className="et-col-1-8 text-center ng-binding">Khoang 6</div>
                          <div className="et-col-1-8 text-center ng-binding">Khoang 7</div>
                        </div>
                        {dataSeat.map((item, index) => {
                          return (
                            (index + 1) % 3 === 2 &&
                            <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                              onClick={() => {
                                if (_findIndex(dataTickets, { seat: item }) < 0) {
                                  setTicket({
                                    ...ticket,
                                    idShow: item + "-" + new Date().toISOString(),
                                    idSeat: item
                                  })
                                  let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule })
                                  if (indexCart < 0) {
                                    dispatch({ type: 'RELOAD_SEAT' })
                                  } else {
                                    cart.splice(indexCart, 1)
                                    dispatch({ type: 'RELOAD_CART' })
                                  }
                                }
                              }}
                            >
                              <div className="et-bed-left">
                                <div className="et-bed-outer">
                                  <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                    style={{
                                      background: _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTickets, { seat: item }) > -1 ? '#df5327' : '#fff'
                                    }}>
                                    <div className="et-sit-no ng-scope">
                                      <span className="ng-binding">{index + 1}</span>
                                    </div>
                                  </div>
                                  <div className="et-bed-illu" />
                                </div>
                              </div>
                            </div>

                          )
                        })}
                        <div className="et-col-1-16 et-seat-h-35 ng-isolate-scope" />
                        {dataSeat.map((item, index) => {
                          return (
                            (index + 1) % 3 === 1 &&
                            <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                              onClick={() => {
                                if (_findIndex(dataTickets, { seat: item }) < 0) {
                                  setTicket({
                                    ...ticket,
                                    idShow: item + "-" + new Date().toISOString(),
                                    idSeat: item
                                  })
                                  let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule })
                                  if (indexCart < 0) {
                                    dispatch({ type: 'RELOAD_SEAT' })
                                  } else {
                                    cart.splice(indexCart, 1)
                                    dispatch({ type: 'RELOAD_CART' })
                                  }
                                }
                              }}
                            >
                              <div className="et-bed-left">
                                <div className="et-bed-outer">
                                  <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                    style={{
                                      background: _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTickets, { seat: item }) > -1 ? '#df5327' : '#fff'
                                    }}>
                                    <div className="et-sit-no ng-scope">
                                      <span className="ng-binding">{index + 1}</span>
                                    </div>
                                  </div>
                                  <div className="et-bed-illu" />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        <div className="et-col-1-16 et-seat-h-35 ng-isolate-scope" />
                        {dataSeat.map((item, index) => {
                          return (
                            (index + 1) % 3 === 0 &&
                            <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                              onClick={() => {
                                if (_findIndex(dataTickets, { seat: item }) < 0) {
                                  setTicket({
                                    ...ticket,
                                    idShow: item + "-" + new Date().toISOString(),
                                    idSeat: item
                                  })
                                  let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule })
                                  if (indexCart < 0) {
                                    dispatch({ type: 'RELOAD_SEAT' })
                                  } else {
                                    cart.splice(indexCart, 1)
                                    dispatch({ type: 'RELOAD_CART' })
                                  }
                                }
                              }}
                            >
                              <div className="et-bed-left">
                                <div className="et-bed-outer">
                                  <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                    style={{
                                      background: _findIndex(cart, { idSeat: item, idSchedule: dataOther.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTickets, { seat: item }) > -1 ? '#df5327' : '#fff'
                                    }}>
                                    <div className="et-sit-no ng-scope" >
                                      <span className="ng-binding">{index + 1}</span>
                                    </div>
                                  </div>
                                  <div className="et-bed-illu" />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>}
          </div>
          {/* CHIỀU VỀ*/}
          <div style={{ display: valueSearchSchedule.status === '1' && 'none' }}>
            {dataScheduleReturn.scheduleDetail.length > 0 ?
              <div style={{ marginBottom: '50px' }}>
                <div className="dayrunto">Chiều về: Ngày {valueSearchSchedule.returnDate} từ {dataScheduleReturn.stationFrom.name} đến {dataScheduleReturn.stationTo.name}</div>
                {/* danh sach  tau */}
                <div className="margin10 backgroud-white">
                  {dataScheduleReturn.scheduleDetail.map((item, index) => {
                    return (
                      <div key={index} className="col-xs-4 col-sm-3 et-col-md-2 et-train-block"
                        onClick={() => {
                          setChangeTrainReturn(index)
                          handleTrainReturn(item._id)
                          setChangeCarriage(0)
                        }}
                      >
                        <div className={changeTrainReturn === index ? 'et-train-head backgroud-train-toa' : 'et-train-head'}>
                          <div className="row center-block" style={{ width: '40%', marginBottom: '3px' }}>
                            <div className="et-train-lamp text-center" style={{ color: 'rgb(85, 85, 85)' }}>{item.train.idShow}</div>
                          </div>
                          <div className="et-train-head-info">
                            <div className="row et-no-margin"><span className="pull-left et-bold " style={{ width: '30%' }}>Hours</span> <span className="pull-right " style={{ width: '70%', textAlign: 'end' }}>{setRealTime(item.time, dataScheduleReturn.stationFrom && dataScheduleReturn.stationFrom.minutes) + ' hours'}</span></div>
                            <div className="row et-no-margin"><span className="pull-left et-bold " style={{ width: '30%' }}>Date</span><span className="pull-right" style={{ width: '70%', textAlign: 'end' }}>{valueSearchSchedule.returnDate}</span></div>
                            <div className="row et-no-margin">
                              <div className="et-col-50">
                                <div className="et-text-sm ">SL chỗ đặt</div>
                                <div className="et-text-large et-bold pull-left " style={{ marginLeft: '5px' }}>{dataTicketsReturn.length}</div>
                              </div>
                              <div className="et-col-50 text-center">
                                <div className="et-text-sm ">SL chỗ trống</div>
                                <div className="et-text-large et-bold pull-right " style={{ marginRight: '5px' }}>{420 - dataTicketsReturn.length}</div>
                              </div>
                            </div>
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
                  })
                  }
                </div>
                {/* danh sach toa */}
                <div className="col-md-12 et-no-margin text-center" style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'left' }}>
                  {/* dautoa */}
                  <div className="et-car-block ng-scope" style={{ display: dataScheduleReturn.scheduleDetail.length < 1 && 'none' }}>
                    <div className="et-car-block">
                      <div className="et-car-icon">
                        <Image src="images/train2.png" alt='Hinh' />
                      </div>
                      <div className="text-center text-info et-car-label ng-binding">{dataOtherReturn.idShowTrain}</div>
                    </div>
                  </div>
                  {/* toa */}
                  {dataCarriageReturn.map((item, index) => {
                    return (
                      <div key={index} className="et-car-block ng-scope">
                        <div className="et-car-block"
                          onClick={() => {
                            setChangeCarriageReturn(index)
                            handleCarriageReturn(item.idShow)
                          }}
                        >
                          <div className={changeCarriageReturn === index ? "et-car-icon et-car-icon-selected" : "et-car-icon et-car-icon et-car-icon-avaiable"}>
                            <Image src="images/trainCar2.png" alt='Hinh' />
                          </div>
                          <div className="text-center text-info et-car-label ng-binding">{index + 1}</div>
                        </div>
                      </div>
                    )
                  })
                  }
                </div>
                {/* danh sach ghe */}
                {dataOtherReturn.idShowCarriage.includes('NM') ?
                  //  toa ngoi mem *
                  <div>
                    <div style={{ textAlign: 'center', fontSize: '20px', margin: '10px' }}>{`${dataOtherReturn.nameCarriage} (${dataOtherReturn.idShowCarriage} - TG đi ${valueSearchSchedule.returnDate} - ${dataOtherReturn.timeStart}p)`}</div>
                    <div className="row et-car-floor">
                      <div className="et-full-width">
                        <div className="et-car-nm-64-half-block">
                          {dataSeatReturn.map((item, index) => {
                            return (
                              index < 20 &&
                              <div key={index} className="et-car-nm-64-sit ng-isolate-scope" style={{ width: '20%' }}
                                onClick={() => {
                                  if (_findIndex(dataTicketsReturn, { seat: item }) < 0) {
                                    setTicketReturn({
                                      ...ticketReturn,
                                      idShow: item + "-" + new Date().toISOString(),
                                      idSeat: item
                                    })
                                    let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule })
                                    if (indexCart < 0) {
                                      dispatch({ type: 'RELOAD_SEAT_RETURN' })
                                    } else {
                                      cart.splice(indexCart, 1)
                                      dispatch({ type: 'RELOAD_CART' })
                                    }
                                  }
                                }}
                              >
                                <div className="et-car-seat-right et-seat-h-35">
                                  <div className="et-col-16 et-sit-side" />
                                  <div className="et-col-84 et-sit-sur-outer">
                                    <div className="et-sit-sur tooltiptop text-center et-sit-avaiable"
                                      style={{
                                        background: _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTicketsReturn, { seat: item }) > -1 ? '#df5327' : '#fff'
                                      }}>
                                      <div className="et-sit-no ng-scope">
                                        <span >{index + 1}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                          }
                        </div>
                        <div className="et-car-seperator">
                          <div></div>
                          <div></div>
                        </div>
                        <div className="et-car-nm-64-half-block">
                          {dataSeatReturn.map((item, index) => {
                            return (
                              index > 19 &&
                              <div key={index} className="et-car-nm-64-sit ng-isolate-scope" style={{ width: '20%' }}
                                onClick={() => {
                                  if (_findIndex(dataTicketsReturn, { seat: item }) < 0) {
                                    setTicketReturn({
                                      ...ticketReturn,
                                      idShow: item + "-" + new Date().toISOString(),
                                      idSeat: item
                                    })
                                    let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule })
                                    if (indexCart < 0) {
                                      dispatch({ type: 'RELOAD_SEAT_RETURN' })
                                    } else {
                                      cart.splice(indexCart, 1)
                                      dispatch({ type: 'RELOAD_CART' })
                                    }
                                  }
                                }}
                              >
                                <div className="et-car-seat-right et-seat-h-35">
                                  <div className="et-col-16 et-sit-side" />
                                  <div className="et-col-84 et-sit-sur-outer">
                                    <div className="et-sit-sur tooltiptop text-center et-sit-avaiable"
                                      style={{
                                        background: _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTicketsReturn, { seat: item }) > -1 ? '#df5327' : '#fff'
                                      }}>
                                      <div className="et-sit-no ng-scope">
                                        <span>{index + 1}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                          }
                        </div>
                      </div>
                    </div>
                  </div> :
                  dataOtherReturn.idShowCarriage.includes('NC') ?
                    //toa ngoi cung
                    <div>
                      <div style={{ textAlign: 'center', fontSize: '20px', margin: '10px' }}>{`${dataOtherReturn.nameCarriage} (${dataOtherReturn.idShowCarriage} - TG đi ${valueSearchSchedule.returnDate}- ${dataOtherReturn.timeStart}p)`}</div>
                      <div className="row et-car-floor">
                        <div className="et-full-width">
                          {dataSeatReturn.map((item, index) => {
                            return (
                              index % 2 === 0 ?
                                <div key={index} className="et-col-1-20 et-seat-h-35 ng-isolate-scope"
                                  onClick={() => {
                                    if (_findIndex(dataTicketsReturn, { seat: item }) < 0) {
                                      setTicketReturn({
                                        ...ticketReturn,
                                        idShow: item + "-" + new Date().toISOString(),
                                        idSeat: item
                                      })
                                      let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule })
                                      if (indexCart < 0) {
                                        dispatch({ type: 'RELOAD_SEAT_RETURN' })
                                      } else {
                                        cart.splice(indexCart, 1)
                                        dispatch({ type: 'RELOAD_CART' })
                                      }
                                    }
                                  }}
                                >
                                  <div className="et-car-seat-left et-seat-h-35">
                                    <div className="et-col-16 et-sit-side" />
                                    <div className="et-col-84 et-sit-sur-outer">
                                      <div className="et-sit-sur tooltiptop text-center et-sit-avaiable"
                                        style={{
                                          background: _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTicketsReturn, { seat: item }) > -1 ? '#df5327' : '#fff'
                                        }}>
                                        <div className="et-sit-no ng-scope">
                                          <span>{index + 1}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div> :
                                <div key={index} className="et-col-1-20 et-seat-h-35 ng-isolate-scope"
                                  onClick={() => {
                                    if (_findIndex(dataTicketsReturn, { seat: item }) < 0) {
                                      setTicketReturn({
                                        ...ticketReturn,
                                        idShow: item + "-" + new Date().toISOString(),
                                        idSeat: item
                                      })
                                      let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule })
                                      if (indexCart < 0) {
                                        dispatch({ type: 'RELOAD_SEAT_RETURN' })
                                      } else {
                                        cart.splice(indexCart, 1)
                                        dispatch({ type: 'RELOAD_CART' })
                                      }
                                    }
                                  }}
                                >
                                  <div className="et-car-seat-left et-seat-h-35">
                                    <div className="et-col-84 et-sit-sur-outer">
                                      <div className="et-sit-sur tooltiptop text-center et-sit-avaiable"
                                        style={{
                                          background: _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTicketsReturn, { seat: item }) > -1 ? '#df5327' : '#fff'
                                        }}>
                                        <div className="et-sit-no ng-scope">
                                          <span>{index + 1}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="et-col-16 et-sit-side" />
                                  </div>
                                </div>
                            )
                          })
                          }
                        </div>
                      </div>
                    </div> :
                    dataOtherReturn.idShowCarriage.includes('N4') ?
                      //toa nam loai 4
                      <div>
                        <div style={{ textAlign: 'center', fontSize: '20px', margin: '10px' }}>{`${dataOtherReturn.nameCarriage} (${dataOtherReturn.idShowCarriage} - TG đi ${valueSearchSchedule.returnDate} - ${dataOtherReturn.timeStart}p)`}</div>
                        <div className="row et-car-floor">
                          <div className="et-col-8-9 mb-w-100">
                            <div className="et-col-1-16 et-car-floor-full-height">
                              <div className="et-bed-way et-full-width" />
                              <div className="et-bed-way et-full-width text-center small ">Tầng 2</div>
                              <div className="et-bed-way et-full-width text-center small ">Tầng 1</div>
                            </div>
                            <div className="et-bed-way et-full-width et-text-sm">
                              <div className="et-col-1-8 text-center ">Khoang 1</div>
                              <div className="et-col-1-8 text-center ">Khoang 2</div>
                              <div className="et-col-1-8 text-center ">Khoang 3</div>
                              <div className="et-col-1-8 text-center ">Khoang 4</div>
                              <div className="et-col-1-8 text-center ">Khoang 5</div>
                              <div className="et-col-1-8 text-center ">Khoang 6</div>
                              <div className="et-col-1-8 text-center ">Khoang 7</div>
                            </div>
                            {dataSeatReturn.map((item, index) => {
                              return (
                                index % 2 === 1 &&
                                <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                                  onClick={() => {
                                    if (_findIndex(dataTicketsReturn, { seat: item }) < 0) {
                                      setTicketReturn({
                                        ...ticketReturn,
                                        idShow: item + "-" + new Date().toISOString(),
                                        idSeat: item
                                      })
                                      let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule })
                                      if (indexCart < 0) {
                                        dispatch({ type: 'RELOAD_SEAT_RETURN' })
                                      } else {
                                        cart.splice(indexCart, 1)
                                        dispatch({ type: 'RELOAD_CART' })
                                      }
                                    }
                                  }}
                                >
                                  <div className="et-bed-left">
                                    <div className="et-bed-outer">
                                      <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                        style={{
                                          background: _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTicketsReturn, { seat: item }) > -1 ? '#df5327' : '#fff'
                                        }}>
                                        <div className="et-sit-no ng-scope" >
                                          <span>{index + 1}</span>
                                        </div>
                                      </div>
                                      <div className="et-bed-illu" />
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                            {/* ---- */}
                            <div className="et-col-1-16 et-seat-h-35 ng-isolate-scope" />
                            {/* ---- */}
                            {dataSeatReturn.map((item, index) => {
                              return (
                                index % 2 === 0 &&
                                <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                                  onClick={() => {
                                    if (_findIndex(dataTicketsReturn, { seat: item }) < 0) {
                                      setTicketReturn({
                                        ...ticketReturn,
                                        idShow: item + "-" + new Date().toISOString(),
                                        idSeat: item
                                      })
                                      let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule })
                                      if (indexCart < 0) {
                                        dispatch({ type: 'RELOAD_SEAT_RETURN' })
                                      } else {
                                        cart.splice(indexCart, 1)
                                        dispatch({ type: 'RELOAD_CART' })
                                      }
                                    }
                                  }}
                                >
                                  <div className="et-bed-left">
                                    <div className="et-bed-outer">
                                      <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                        style={{
                                          background: _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTicketsReturn, { seat: item }) > -1 ? '#df5327' : '#fff'
                                        }}>
                                        <div className="et-sit-no ng-scope" >
                                          <span>{index + 1}</span>
                                        </div>
                                        <div className="popover top fade in tooltip_description">
                                          <div className="arrow" />
                                        </div>
                                      </div>
                                      <div className="et-bed-illu" />
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div> :
                      // toa nam loai 6
                      <div>
                        <div style={{ textAlign: 'center', fontSize: '20px', margin: '10px' }}>{`${dataOtherReturn.nameCarriage} (${dataOtherReturn.idShowCarriage} - TG đi ${valueSearchSchedule.returnDate} - ${dataOtherReturn.timeStart}p)`}</div>
                        <div className="row et-car-floor">
                          <div className="et-col-8-9 mb-w-100">
                            <div className="et-col-1-18 et-car-floor-full-height">
                              <div className="et-bed-way et-full-width" />
                              <div className="et-bed-way et-full-width text-center small ng-binding">Tầng 3</div>
                              <div className="et-bed-way et-full-width text-center small ng-binding">Tầng 2</div>
                              <div className="et-bed-way et-full-width text-center small ng-binding">Tầng 1</div>
                            </div>
                            <div className="et-bed-way et-full-width et-text-sm">
                              <div className="et-col-1-8 text-center ng-binding">Khoang 1</div>
                              <div className="et-col-1-8 text-center ng-binding">Khoang 2</div>
                              <div className="et-col-1-8 text-center ng-binding">Khoang 3</div>
                              <div className="et-col-1-8 text-center ng-binding">Khoang 4</div>
                              <div className="et-col-1-8 text-center ng-binding">Khoang 5</div>
                              <div className="et-col-1-8 text-center ng-binding">Khoang 6</div>
                              <div className="et-col-1-8 text-center ng-binding">Khoang 7</div>
                            </div>
                            {dataSeatReturn.map((item, index) => {
                              return (
                                (index + 1) % 3 === 2 &&
                                <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                                  onClick={() => {
                                    if (_findIndex(dataTicketsReturn, { seat: item }) < 0) {
                                      setTicketReturn({
                                        ...ticketReturn,
                                        idShow: item + "-" + new Date().toISOString(),
                                        idSeat: item
                                      })
                                      let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule })
                                      if (indexCart < 0) {
                                        dispatch({ type: 'RELOAD_SEAT_RETURN' })
                                      } else {
                                        cart.splice(indexCart, 1)
                                        dispatch({ type: 'RELOAD_CART' })
                                      }
                                    }
                                  }}
                                >
                                  <div className="et-bed-left">
                                    <div className="et-bed-outer">
                                      <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                        style={{
                                          background: _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTicketsReturn, { seat: item }) > -1 ? '#df5327' : '#fff'
                                        }}>
                                        <div className="et-sit-no ng-scope">
                                          <span className="ng-binding">{index + 1}</span>
                                        </div>
                                      </div>
                                      <div className="et-bed-illu" />
                                    </div>
                                  </div>
                                </div>

                              )
                            })}
                            <div className="et-col-1-16 et-seat-h-35 ng-isolate-scope" />
                            {dataSeatReturn.map((item, index) => {
                              return (
                                (index + 1) % 3 === 1 &&
                                <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                                  onClick={() => {
                                    if (_findIndex(dataTicketsReturn, { seat: item }) < 0) {
                                      setTicketReturn({
                                        ...ticketReturn,
                                        idShow: item + "-" + new Date().toISOString(),
                                        idSeat: item
                                      })
                                      let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule })
                                      if (indexCart < 0) {
                                        dispatch({ type: 'RELOAD_SEAT_RETURN' })
                                      } else {
                                        cart.splice(indexCart, 1)
                                        dispatch({ type: 'RELOAD_CART' })
                                      }
                                    }
                                  }}
                                >
                                  <div className="et-bed-left">
                                    <div className="et-bed-outer">
                                      <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                        style={{
                                          background: _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTicketsReturn, { seat: item }) > -1 ? '#df5327' : '#fff'
                                        }}>
                                        <div className="et-sit-no ng-scope">
                                          <span className="ng-binding">{index + 1}</span>
                                        </div>
                                      </div>
                                      <div className="et-bed-illu" />
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                            <div className="et-col-1-16 et-seat-h-35 ng-isolate-scope" />
                            {dataSeatReturn.map((item, index) => {
                              return (
                                (index + 1) % 3 === 0 &&
                                <div key={index} className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                                  onClick={() => {
                                    if (_findIndex(dataTicketsReturn, { seat: item }) < 0) {
                                      setTicketReturn({
                                        ...ticketReturn,
                                        idShow: item + "-" + new Date().toISOString(),
                                        idSeat: item
                                      })
                                      let indexCart = _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule })
                                      if (indexCart < 0) {
                                        dispatch({ type: 'RELOAD_SEAT_RETURN' })
                                      } else {
                                        cart.splice(indexCart, 1)
                                        dispatch({ type: 'RELOAD_CART' })
                                      }
                                    }
                                  }}
                                >
                                  <div className="et-bed-left">
                                    <div className="et-bed-outer">
                                      <div className="et-bed tooltiptop text-center et-sit-avaiable"
                                        style={{
                                          background: _findIndex(cart, { idSeat: item, idSchedule: dataOtherReturn.idSchedule }) > -1 ? '#a6b727' : _findIndex(dataTicketsReturn, { seat: item }) > -1 ? '#df5327' : '#fff'
                                        }}>
                                        <div className="et-sit-no ng-scope" >
                                          <span className="ng-binding">{index + 1}</span>
                                        </div>
                                      </div>
                                      <div className="et-bed-illu" />
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>}
              </div> :
              <div className="dayrunto">Không có lịch trình cho chiều về</div>
            }
          </div>



          {/* notebook */}
          <div className="et-legend mt-3">
            <div className="width50persent" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="d-fix">
                <div className="et-car-nm-64-sit" style={{ width: '50px' }}>
                  <div className="et-col-16 et-sit-side"></div>
                  <div className="et-col-64 et-sit-sur-outer">
                    <div className="et-sit-sur text-center et-sit-bought" style={{ background: '#df5327' }}></div>
                  </div>
                </div>
                <div className="et-bed-left et-no-padding width11persent">
                  <div className="et-bed-outer">
                    <div className="et-bed text-center et-sit-bought" style={{ background: '#df5327' }}></div>
                    <div className="et-bed-illu"></div>
                  </div>
                </div>
                <div className="et-legend-label ng-binding">Chỗ đã bán, không bán</div>
              </div>
              <div className="d-fix">
                <div className="et-car-nm-64-sit" style={{ width: '50px' }}>
                  <div className="et-col-16 et-sit-side"></div>
                  <div className="et-col-64 et-sit-sur-outer">
                    <div className="et-sit-sur text-center et-sit-bought" style={{ background: '#fff' }}></div>
                  </div>
                </div>
                <div className="et-bed-left et-no-padding width11persent">
                  <div className="et-bed-outer">
                    <div className="et-bed text-center et-sit-bought" style={{ background: '#fff' }}></div>
                    <div className="et-bed-illu"></div>
                  </div>
                </div>
                <div className="et-legend-label ng-binding">Chỗ trống</div>
              </div>
              <div className="d-fix">
                <div className="et-car-nm-64-sit" style={{ width: '50px' }}>
                  <div className="et-col-16 et-sit-side"></div>
                  <div className="et-col-64 et-sit-sur-outer">
                    <div className="et-sit-sur text-center et-sit-bought" style={{ background: '#a6b727' }}></div>
                  </div>
                </div>
                <div className="et-bed-left et-no-padding width11persent">
                  <div className="et-bed-outer">
                    <div className="et-bed text-center et-sit-bought" style={{ background: '#a6b727' }}></div>
                    <div className="et-bed-illu"></div>
                  </div>
                </div>
                <div className="et-legend-label ng-binding">Chỗ đang chọn</div>
              </div>
            </div>
            <div className="width50persent">
            </div>
          </div>

        </div>
        <div className="col-right-30">
          <div className="carditem" style={{ border: '1px solid #ccc' }}>
            <div style={{ color: '#2573a0', fontWeight: 600, borderBottom: '2px solid #2573a0' }}><i className="fas fa-bars" /> Giỏ vé ({cart.length})</div>
            <div style={{ maxHeight: '700px', overflow: 'auto' }}>
              {cart.map((item, index) => {
                return (
                  <div key={index} className='padding-10 d-fix'>
                    <div className="width95percent">
                      {/* <div style={{ textAlign: 'center' }}>{ticket.idSchedule}</div> */}
                      <div>{'Station: ' + item.stationFrom.name + " - " + item.stationTo.name}</div>
                      <div>{'Date: ' + item.dateStart + " - " + item.timeStart + 'p'}</div>
                      <div>{'Seat: ' + item.idSeat}</div>
                      <div>{item.nameCarriage}</div>
                      <div>{'Price: ' + format_curency(item.price.toString()) + ' VND'}</div>
                    </div>
                    <div className="align-self-center border-0px"
                      onClick={() => {
                        cart.splice(index, 1)
                        dispatch({ type: 'RELOAD_CART' })
                      }}
                    >
                      <img className="title-quydinh" src="images/del30.png" alt="Delete" />
                    </div>
                  </div>
                )
              })}
            </div>
            <hr />
            <div style={{ backgroundColor: 'red', padding: '10px', width: '60%', margin: 'auto', textAlign: 'center', color: '#ffffff', cursor: 'pointer' }}
              onClick={() => {
                if (cart.length > 0) {
                  history.push('/payment')
                  localStorage.setItem('cart', JSON.stringify(cart))
                } else {
                  message.error('Chưa chọn ghế')
                }
              }}
            >MUA VÉ</div>
          </div>
        </div>
      </div>
    </div >
  )
}
