import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaypalExpressBtn from "react-paypal-express-checkout";
import { useSelector, useDispatch } from "react-redux";
import { axios } from "../../config/constant";
import { DatePicker, message } from "antd";
import "antd/dist/antd.css";
import { notification } from "antd";
import ModalCustomer from "./ModalCustomer";

export default function Payment() {
  const dispatch = useDispatch();
  const reloadCart = useSelector((state) => state.reloadCart);

  const [dataCart, setDataCart] = useState(
    JSON.parse(localStorage.getItem("cart"))
  );
  const [disable, setDisable] = useState(true);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState({});

  const [dataOrder, setDataOrder] = useState({
    idShow: "",
    customerName: "",
    dateBirth: "",
    phone: "",
    email: "",
    idCard: "",
    countTicket: "",
    dateOrder: "",
    totalPrice: "",
  });

  const handleOk = (e) => {
    console.log(e);
    setVisible(false);
  };

  const handleCancel = (e) => {
    console.log(e);
    setVisible(false);
  };

  function totalPrice() {
    let total = 0;
    dataCart.forEach((element) => {
      total += element.priceDiscount;
    });
    return total;
  }

  function format_curency(a) {
    a = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return a;
  }
  function handleOrder() {
    let err = false;
    const regEmail =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const regSDT =
      /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    const regCMND = /^([0-9]{9})$/;
    const current = new Date().getFullYear();

    let mesErr = "";

    dataCart.forEach((element) => {
      const ngaysinh = element.dateBirth;
      const namsinh = new Date(ngaysinh).getFullYear();
      const tuoi = Number(current - namsinh);
      if (
        element.customerName.trim().length < 3 ||
        !regCMND.test(element.indentityCard)
      ) {
        if (element.customerName.trim().length < 3) {
          mesErr = "T??n kh??ch ??i t??u kh??ng h???p l???";
        } else {
          mesErr = "CNMD kh??ch ??i t??u kh??ng h???p l???";
        }

        err = true;
      }
    });
    if (!err) {
      if (
        dataOrder.customerName.trim().length > 2 &&
        dataOrder.phone.trim() !== "" &&
        dataOrder.email.trim() !== "" &&
        dataOrder.idCard.trim() !== ""
      ) {
        if (regSDT.test(dataOrder.phone)) {
          if (regEmail.test(dataOrder.email)) {
            if (regCMND.test(dataOrder.idCard)) {
              setDisable(false);
            } else {
              message.error("CMND ng?????i ?????t kh??ng h???p l???");
            }
          } else {
            message.error("Email kh??ng h???p l???");
          }
        } else {
          message.error("S??? ??i???n tho???i kh??ng h???p l???");
        }
      } else {
        message.error("Ch??a nh???p ????? th??ng tin ng?????i ?????t v??");
      }
    } else {
      message.error(mesErr);
    }
  }

  function handleOrderCOD() {
    let err = false;
    const regEmail =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const regSDT =
      /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    const regCMND = /^([0-9]{9})$/;
    const current = new Date().getFullYear();

    let mesErr = "";

    dataCart.forEach((element) => {
      const ngaysinh = element.dateBirth;
      const namsinh = new Date(ngaysinh).getFullYear();
      const tuoi = Number(current - namsinh);
      console.log("tuoi la:", tuoi);
      if (
        element.customerName.trim().length < 3 ||
        !regCMND.test(element.indentityCard)
      ) {
        if (element.customerName.trim().length < 3) {
          mesErr = "T??n kh??ch ??i t??u kh??ng h???p l???";
        } else {
          mesErr = "CNMD kh??ch ??i t??u kh??ng h???p l???";
        }

        // else {
        //   Modal.warning({
        //     title: 'Th??ng b??o',
        //     content: 'Tr??? em d?????i 6 tu???i kh??ng c???n mua v?? n???u s??? d???ng chung ch??? c???a ng?????i l???n ??i c??ng. B???n mu???n ti???p t???c mua v?? ri??ng cho tr??? em n??y',
        //   });
        // }
        err = true;
      }
    });
    if (!err) {
      if (
        dataOrder.customerName.trim().length > 2 &&
        dataOrder.phone.trim() !== "" &&
        dataOrder.email.trim() !== "" &&
        dataOrder.idCard.trim() !== ""
      ) {
        if (regSDT.test(dataOrder.phone)) {
          if (regEmail.test(dataOrder.email)) {
            if (regCMND.test(dataOrder.idCard)) {
              paymentCOD();
            } else {
              message.error("CMND ng?????i ?????t kh??ng h???p l???");
            }
          } else {
            message.error("Email kh??ng h???p l???");
          }
        } else {
          message.error("S??? ??i???n tho???i kh??ng h???p l???");
        }
      } else {
        message.error("Ch??a nh???p ????? th??ng tin ng?????i ?????t v??");
      }
    } else {
      message.error(mesErr);
    }
  }
  function getDataOrderDefault() {
    setDataOrder({
      ...dataOrder,
      idShow: "ORDER-" + new Date().toISOString(),
      countTicket: dataCart.length,
      dateOrder: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
      totalPrice: totalPrice(),
    });
  }
  async function paymentPaypal() {
    await axios
      .post("/ticket", {
        tickets: dataCart,
        order: dataOrder,
        statusTicket: 1,
      })
      .then(function (res) {
        if (res.data.status === "success") {
          notification.success({
            message: "Th??ng tin ?????t v?? ???? ???????c g???i ????n email c???a b???n. Vui l??ng ki???m tra email ",
          })
          localStorage.setItem("cart", []);
          setTimeout(() => {
            window.location.pathname = "/";
          }, 1000);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  async function paymentCOD() {
    await axios
      .post("/ticket", {
        tickets: dataCart,
        order: dataOrder,
        statusTicket: 0,
      })
      .then(function (res) {
        if (res.data.status === "success") {
          notification.success({
            message: "Th??ng tin ?????t v?? ???? ???????c g???i ????n email c???a b???n. Vui l??ng ki???m tra email ",
          })
          localStorage.setItem("cart", []);
          setTimeout(() => {
            window.location.pathname = "/";
          }, 1000);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  const onCancel = (data) => {
    console.log("The payment was cancelled!", data);
  };
  const onError = (err) => {
    console.log("Error!", err);
  };
  const onSuccess = (payment) => {
    console.log("The payment was succeeded!", payment);
    paymentPaypal();
  };

  const handleDiscountWhenDateBirthChange = (dateBirth, index) => {
    const _ngaySinh = dateBirth;

    const namsinh = new Date(_ngaySinh).getFullYear();
    const current = new Date().getFullYear();
    const tuoi = Number(current - namsinh);

    console.log("tuoi", tuoi);

    let _dataCard = dataCart;

    let _discount = 0;

    if (tuoi <= 10) {
      _discount = 0.25;
    }

    // if (tuoi > 11 && tuoi < 61) {
    //   if (!(tuoi >= 18 && tuoi <= 22)) {
    //     _discount = 0.1;
    //   }
    //   _discount = 0;

    // }

    if (tuoi >= 60) {
      _discount = 0.15;
    }

    console.log("discount", _discount);

    const _price = dataCart?.[index]?.price;

    _dataCard = [
      ..._dataCard?.slice(0, index),
      {
        ..._dataCard?.[index],
        discount: _discount,
        dateBirth: _ngaySinh,
        priceDiscount: _price - _price * _discount,
      },
      ..._dataCard?.slice(index + 1),
    ];

    return _dataCard;
  };

  const handleDoiTuong = (index) => {
    const _ngaySinh = dataCart?.[index]?.dateBirth;

    const namsinh = new Date(_ngaySinh).getFullYear();
    const current = new Date().getFullYear();
    const tuoi = Number(current - namsinh);

    if (tuoi <= 10) {
      if (tuoi < 6) {
        // Modal.warning({
        //   title: "Th??ng b??o",
        //   content:
        //     "Tr??? em d?????i 6 tu???i kh??ng c???n mua v?? n???u s??? d???ng chung ch??? c???a ng?????i l???n ??i c??ng. B???n mu???n ti???p t???c mua v?? ri??ng cho tr??? em n??y",
        // });
        // setVisible(true);
        return 0.25;
      }
      return 0.25;
    }
    // if (tuoi > 11) {
    //   return;
    // }
    if (tuoi >= 60) {
      return 0.15;
    }
    return;
  };
  useEffect(() => {
    getDataOrderDefault();
  }, []);
  useEffect(() => {
    if (reloadCart) {
      dispatch({ type: "NO_RELOAD_CART" });
    }
  }, [reloadCart]);

  console.log("dataCart", dataCart);

  return (
    <div className="container" style={{ marginTop: "-5px", padding: "20px" }}>
      <div className="dayrunto text-center" style={{ width: "100%" }}>
        Thanh to??n
      </div>
      <div>
        <i style={{ color: "red" }}>
          Qu?? kh??ch vui l??ng ??i???n ?????y ?????, ch??nh x??c t???t c??? c??c th??ng tin v??? h??nh
          kh??ch ??i t??u bao g???m: H??? t??n ?????y ?????, s??? gi???y t??? t??y th??n (S??? ch???ng
          minh nh??n d??n ho???c s??? h??? chi???u ho???c s??? gi???y ph??p l??i xe ???????ng b??? ???????c
          ph??p lu???t Vi???t Nam c??ng nh???n ho???c ng??y th??ng n??m sinh n???u l?? tr??? em
          ho???c th??? sinh vi??n n???u l?? sinh vi??n). ????? ?????m b???o an to??n, minh b???ch
          trong qu?? tr??nh b??n v?? c??c th??ng tin n??y s??? ???????c nh??n vi??n so??t v??
          ki???m tra tr?????c khi l??n t??u theo ????ng c??c quy ?????nh c???a T???ng c??ng ty
          ???????ng s???t Vi???t Nam.
          <br />
          <h5 style={{ color: "red" }}>?????i t?????ng ???????c gi???m gi?? v??</h5>
          <ul>
            <li>Tr??? em d?????i 6 tu???i: Mi???n v?? v?? s??? d???ng chung ch??? c???a ng?????i l???n ??i k??m.

            </li>
            <li>Tr??? em t??? 6 ?????n d?????i 10 tu???i: Gi???m 25% gi?? v??
            </li>
            <li>Ng?????i cao tu???i t??? 60 tu???i tr??? l??n: Gi???m 15% gi?? v??.
            </li>
            <li>H???c sinh, sinh vi??n: Gi???m 10% gi?? v??.
            </li>
          </ul>
        </i>
      </div>
      <div
        className="row form-group table-responsive list-ticket-deskhop"
        style={{ margin: "auto" }}
      >
        <table
          className="table table-bordered"
          style={{ width: "100%", paddingRight: "0" }}
        >
          <thead className="et-table-header">
            <tr>
              <th
                style={{ backgroundColor: "lavender", width: "23%" }}
                className="ng-binding"
              >
                H??? t??n
                {/*H??? t??n*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "15%" }}
                className="ng-binding"
              >
                Th??ng tin ch???
                {/*Th??ng tin ch???*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "13%" }}
                className="ng-binding"
              >
                Gi?? v??
                {/*Gi?? v??*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "14%" }}
                className="ng-binding"
              >
                Gi???m ?????i t?????ng
                {/*Gi???m ?????i t?????ng*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "15%" }}
                className="ng-binding"
              >
                Khuy???n m???i
                {/*Khuy???n m???i*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "15%" }}
                className="ng-binding"
              >
                Th??nh ti???n (VN??)
                {/*Th??nh ti???n (VN??)*/}
              </th>
              <th style={{ backgroundColor: "lavender", width: "5%" }} />
            </tr>
          </thead>

          <tbody>
            {dataCart.map((item, index) => {
              console.log("item", item);

              return (
                <tr key={index}>
                  <td
                    className="et-table-cell"
                    style={{
                      padding: "10px 0",
                      paddingRight: "10px",
                      borderBottom: "solid 2px #ccc",
                    }}
                  >
                    <div
                      className="input-group input-group-sm"
                      style={{ marginBottom: "6px", width: "100%" }}
                    >
                      <span
                        className="input-group-addon text-left ng-binding"
                        style={{ width: "84px" }}
                      >
                        H??? t??n
                      </span>
                      <input
                        type="text"
                        placeholder="Th??ng tin h??nh kh??ch"
                        className="form-control input-sm ng-pristine ng-invalid ng-invalid-required"
                        style={{
                          borderTopRightRadius: "4px !important",
                          borderBottomRightRadius: "4px !important",
                        }}
                        onChange={(e) => {
                          dataCart[index].customerName = e.target.value;
                          setDataCart([...dataCart]);
                          // return handleTuoi()
                        }}
                      />
                    </div>
                    {/* <div
                      className="input-group input-group-sm"
                      style={{ width: "100%" }}
                    >
                      <span
                        className="input-group-addon text-left ng-binding"
                        style={{ width: "84px" }}
                      >
                        Ng??y sinh
                      </span>

                      <input
                        type="date"
                        className="form-control input-sm ng-pristine ng-valid"
                        style={{
                          borderTopRightRadius: "4px !important",
                          borderBottomRightRadius: "4px !important",
                        }}
                        onChange={(e) => {
                          const _dataCard = handleDiscountWhenDateBirthChange(
                            e.target.value,
                            index
                          );

                          setDataCart([..._dataCard]);
                        }}
                      />
                    </div> */}
                    <div
                      className="input-group input-group-sm"
                      style={{ marginBottom: "6px", width: "100%" }}
                    >
                      <span
                        className="input-group-addon text-left ng-binding"
                        style={{ width: "84px" }}
                      >
                        ?????i t?????ng
                      </span>
                      <select
                        className="form-control input-sm ng-pristine ng-valid ng-valid-required"
                        style={{
                          borderTopRightRadius: "4px !important",
                          borderBottomRightRadius: "4px !important",
                        }}
                        value={handleDoiTuong(index, false)}
                        onChange={(e) => {
                          dataCart[index].discount = e.target.value;
                          dataCart[index].priceDiscount =
                            item.price - item.price * e.target.value;
                          setDataCart([...dataCart]);
                          setVisible(true);
                          if (e.target.value == "0") {
                            setContent({
                              data: "Vui l??ng mang CCCD/CCMND khi l??n t??u",
                            });
                          }
                          if (e.target.value == "0.25") {
                            setContent({
                              data: "Tr??? em d?????i 6 tu???i kh??ng c???n mua v?? v?? s??? d???ng chung ch??? c???a ng?????i l???n ??i c??ng. B???n mu???n ti???p t???c mua v?? ri??ng cho tr??? em n??y!!!L??u ??: Tr??? em ph???i ??i t??u c?? s??? gi??m h??? c???a ng?????i l???n!! Vui l??ng nh???p cmnd/cccd c???a ng?????i gi??m h???",
                            });
                          }
                          if (e.target.value == "0.15") {
                            setContent({
                              data: "Ng?????i cao tu???i t??? 60 tu???i tr??? l??n. Vui l??ng mang CMND/CCCD khi l??n t??u ",
                            });
                          }
                          if (e.target.value == "0.1") {
                            setContent({
                              data: "Vui l??ng mang theo th??? sinh vi??n/ sinh vi??n khi l??n t??u ",
                            });
                          }

                          dispatch({ type: "RELOAD_CART" });
                        }}
                      >
                        <option value={0}>Ng?????i l???n</option>
                        <option value={0.25} label="Tr??? em">
                          Tr??? em
                        </option>
                        <option value={0.15} label="Ng?????i cao tu???i">
                          Ng?????i cao tu???i
                        </option>
                        <option value={0.1} label="Sinh vi??n">
                          Sinh vi??n
                        </option>
                      </select>
                    </div>

                    <div
                      className="input-group input-group-sm"
                      style={{ width: "100%" }}
                    >
                      <span
                        className="input-group-addon text-left ng-binding"
                        style={{ width: "84px" }}
                      >
                        S??? gi???y t???
                      </span>
                      <input
                        type="text"
                        placeholder="S??? CMND/ CCCD/ Ng??y th??ng n??m sinh tr??? em"
                        className="form-control input-sm ng-pristine ng-valid"
                        style={{
                          borderTopRightRadius: "4px !important",
                          borderBottomRightRadius: "4px !important",
                        }}
                        onChange={(e) => {
                          dataCart[index].indentityCard = e.target.value;
                          setDataCart([...dataCart]);
                        }}
                      />
                    </div>
                  </td>
                  <td
                    style={{ fontSize: "10px", borderBottom: "solid 2px #ccc" }}
                  >
                    <div
                      className="text-center ng-hide"
                      ng-show="ve.seat.Status.Status != 6"
                    ></div>
                    {/* <div className="text-center text-info" ng-show="ve.seat.Status.Status == 6">
                      <span className="ng-binding">Gi??? trong <span className="text-danger">544</span> gi??y</span>
                    </div> */}
                    <div>
                      <div className="ng-binding">
                        {item.idSeat.split("-")[0] +
                          " " +
                          item.stationFrom.name +
                          " - " +
                          item.stationTo.name}
                      </div>
                      <div className="ng-binding">
                        {item.dateStart + " " + item.timeStart + "p"}
                      </div>
                      <div className="ng-binding">
                        {"Carriage: " +
                          item.idSeat.split("-")[1] +
                          " - Seat: " +
                          item.idSeat.split("-")[2]}
                      </div>
                      <div className="ng-binding">{item.nameCarriage}</div>
                    </div>
                  </td>
                  <td
                    className="et-table-cell text-right ng-binding"
                    style={{ borderBottom: "solid 2px #ccc" }}
                  >
                    {format_curency(item.price.toString()) + " VND"}
                  </td>
                  <td
                    className="et-table-cell text-right ng-binding"
                    style={{ borderBottom: "solid 2px #ccc" }}
                  >
                    {item.discount !== 0
                      ? item.discount * 100 + "%"
                      : item.discount}
                  </td>
                  <td
                    className="et-table-cell text-left"
                    style={{ borderBottom: "solid 2px #ccc" }}
                  >
                    <div style={{ display: item.discount === 0 && "none" }}>
                      <div className="ng-binding ng-hide"></div>
                      <div>
                        <div>
                          <div>
                            <span
                              style={{ fontSize: "12px" }}
                              className="ng-binding"
                            >
                              GI???M GI?? ?????I T?????NG THEO C?? 75/VTSG{" "}
                            </span>
                            <span
                              style={{ fontSize: "12px" }}
                              className="ng-binding"
                            >
                              (gi???m {item.price - item.priceDiscount} VND)
                            </span>
                          </div>
                          {/* <div style={{ fontSize: '12px' }}>
                            <div className="text-danger ng-binding">
                              * L??u ??:
                              <span className="ng-binding">????y l?? v?? ??p d???ng khuy???n m???i, ????? ngh??? qu?? kh??ch ?????c k???</span>
                            </div>
                          </div> */}
                        </div>
                        {/* <div style={{ fontSize: '12px' }}>
                          <Link to='/regulation' className="ng-binding">
                            C??c quy ?????nh v??? ??i???u ki???n mua v??, tr??? v??, ?????i v?? v?? h???y v??
                          </Link>
                        </div> */}
                      </div>
                    </div>
                  </td>
                  <td
                    className="et-table-cell text-right ng-binding"
                    style={{ borderBottom: "solid 2px #ccc" }}
                  >
                    {format_curency(item.priceDiscount.toString()) + " VND"}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                      borderBottom: "solid 2px #ccc",
                    }}
                  >
                    <span
                      className="et-btn-cancel"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        dataCart.splice(index, 1);
                        dispatch({ type: "RELOAD_CART" });
                      }}
                    ></span>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tbody className="ng-hide">
            <tr className="et-table-group-header">
              <td colSpan={7}></td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="info">
              <td colSpan={5}>
                <span className="pull-right">
                  <strong className="ng-binding">T???ng ti???n</strong>
                </span>
              </td>
              <td className="text-right">
                <strong className="ng-binding">
                  {format_curency(totalPrice().toString()) + " VND"}
                </strong>
              </td>
              <td>&nbsp;</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="et-register-block">
        <h5 className="ng-binding">Th??ng tin ng?????i ?????t v??</h5>
        <div className="row text-info ng-binding">
          Qu?? kh??ch vui l??ng ??i???n ?????y ????? v?? ch??nh x??c c??c th??ng tin v??? ng?????i mua
          v?? d?????i ????y. C??c th??ng tin n??y s??? ???????c s??? d???ng ????? x??c minh ng?????i mua
          v?? v?? l???y v?? t???i ga tr?????c khi l??n t??u theo ????ng c??c quy ?????nh c???a T???ng
          c??ng ty ???????ng s???t Vi???t Nam.
        </div>
        <div className="form-horizontal et-col-md-12 form-group">
          <div style={{ width: "100%", height: "10px", float: "left" }} />
          <div className="row" style={{ paddingLeft: "5px" }}>
            <div className="et-col-md-2">
              <label className="ng-binding mobi-display-none">
                H??? T??N<span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <br />
              <label className="ng-binding mobi-display-none">
                S??? ??I???N THO???I<span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <br />
              <label className="ng-binding mobi-display-none">
                EMAIL<span style={{ color: "red" }}>*</span>
              </label>
            </div>
            <div className="et-col-md-4 mb-w-100">
              <input
                type="text"
                className="form-control input-sm ng-pristine ng-invalid ng-invalid-required"
                placeholder="H??? v?? t??n"
                onChange={(e) => {
                  setDataOrder({
                    ...dataOrder,
                    customerName: e.target.value,
                  });
                }}
              />
              <br />
              <input
                type="text"
                className="form-control input-sm ng-pristine ng-valid"
                placeholder="S??? di ?????ng"
                onChange={(e) => {
                  setDataOrder({
                    ...dataOrder,
                    phone: e.target.value,
                  });
                }}
              />
              <br />
              <input
                type="email"
                className="form-control input-sm ng-pristine ng-valid ng-valid-email"
                placeholder="Email"
                onChange={(e) => {
                  setDataOrder({
                    ...dataOrder,
                    email: e.target.value,
                  });
                }}
              />
            </div>
            <div className="et-col-md-2">
              <label className="ng-binding mobi-display-none">
                S??? CMND / CCCD<span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <br />
            </div>
            <div className="et-col-md-4 mb-w-100">
              <input
                type="text"
                className="form-control input-sm ng-pristine ng-invalid ng-invalid-required"
                placeholder="S??? CMND / CCCD"
                onChange={(e) => {
                  setDataOrder({
                    ...dataOrder,
                    idCard: e.target.value,
                  });
                }}
              />
              <br />
              <div style={{ width: "100%" }}>
                <input
                  type="radio"
                  className="ng-pristine ng-valid"
                  onChange={() => {
                    // handleOrder()
                    // handleTuoi()
                    setDisable(true);
                  }}
                  checked={disable}
                />
                <span className="et-align-top ng-binding">
                  Thanh to??n t???i qu???y
                </span>
              </div>
              <div style={{ width: "100%" }}>
                <input
                  type="radio"
                  className="ng-pristine ng-valid"
                  onChange={() => {
                    // handleTuoi()

                    handleOrder();
                  }}
                  checked={!disable}
                />
                <span className="et-align-top ng-binding">
                  Thanh to??n qua Paypal
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "350px",
            margin: "auto",
            display: disable ? "none" : "",
            marginTop: "20px",
          }}
        >
          <PaypalExpressBtn
            env="sandbox"
            client={{
              sandbox:
                "AW5SSL39jH1B8vMJRWU8MIODQjOVGmcE1Kt4suyG_C94OZsq1afHEsvKxExTIGl-2b5i0625Y6KKOpKq",
              product: "YOUR-PRODUCTION-APP-ID",
            }}
            currency="USD"
            total={
              // 1
              parseInt(totalPrice() / 23025)
            }
            onError={onError}
            onSuccess={onSuccess}
            onCancel={onCancel}
            style={{
              size: "large",
              color: "blue",
              shape: "rect",
              label: "checkout",
            }}
          />
        </div>
        <div
          style={{
            width: "350px",
            margin: "auto",
            display: !disable ? "none" : "",
          }}
        >
          <button
            onClick={() => {
              handleOrderCOD();
            }}
            checked={!disable}
            className="et-btn ng-binding"
            style={{ width: "100%" }}
          >
            ????ng k?? v??
          </button>
        </div>
      </div>
      {visible && (
        <ModalCustomer
          visible={visible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          content={content}
        />
      )}
    </div>
  );
}
