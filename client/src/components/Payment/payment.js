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
          mesErr = "Tên khách đi tàu không hợp lệ";
        } else {
          mesErr = "CNMD khách đi tàu không hợp lệ";
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
              message.error("CMND người đặt không hợp lệ");
            }
          } else {
            message.error("Email không hợp lệ");
          }
        } else {
          message.error("Số điện thoại không hợp lệ");
        }
      } else {
        message.error("Chưa nhập đủ thông tin người đặt vé");
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
          mesErr = "Tên khách đi tàu không hợp lệ";
        } else {
          mesErr = "CNMD khách đi tàu không hợp lệ";
        }

        // else {
        //   Modal.warning({
        //     title: 'Thông báo',
        //     content: 'Trẻ em dưới 6 tuổi không cần mua vé nếu sử dụng chung chỗ của người lớn đi cùng. Bạn muốn tiếp tục mua vé riêng cho trẻ em này',
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
              message.error("CMND người đặt không hợp lệ");
            }
          } else {
            message.error("Email không hợp lệ");
          }
        } else {
          message.error("Số điện thoại không hợp lệ");
        }
      } else {
        message.error("Chưa nhập đủ thông tin người đặt vé");
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
            message: "Thông tin đặt vé đã được gửi đên email của bạn. Vui lòng kiểm tra email ",
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
            message: "Thông tin đặt vé đã được gửi đên email của bạn. Vui lòng kiểm tra email ",
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
        //   title: "Thông báo",
        //   content:
        //     "Trẻ em dưới 6 tuổi không cần mua vé nếu sử dụng chung chỗ của người lớn đi cùng. Bạn muốn tiếp tục mua vé riêng cho trẻ em này",
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
        Thanh toán
      </div>
      <div>
        <i style={{ color: "red" }}>
          Quý khách vui lòng điền đầy đủ, chính xác tất cả các thông tin về hành
          khách đi tàu bao gồm: Họ tên đầy đủ, số giấy tờ tùy thân (Số chứng
          minh nhân dân hoặc số hộ chiếu hoặc số giấy phép lái xe đường bộ được
          pháp luật Việt Nam công nhận hoặc ngày tháng năm sinh nếu là trẻ em
          hoặc thẻ sinh viên nếu là sinh viên). Để đảm bảo an toàn, minh bạch
          trong quá trình bán vé các thông tin này sẽ được nhân viên soát vé
          kiểm tra trước khi lên tàu theo đúng các quy định của Tổng công ty
          Đường sắt Việt Nam.
          <br />
          <h5 style={{ color: "red" }}>Đối tượng được giảm giá vé</h5>
          <ul>
            <li>Trẻ em dưới 6 tuổi: Miễn vé và sử dụng chung chỗ của người lớn đi kèm.

            </li>
            <li>Trẻ em từ 6 đến dưới 10 tuổi: Giảm 25% giá vé
            </li>
            <li>Người cao tuổi từ 60 tuổi trở lên: Giảm 15% giá vé.
            </li>
            <li>Học sinh, sinh viên: Giảm 10% giá vé.
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
                Họ tên
                {/*Họ tên*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "15%" }}
                className="ng-binding"
              >
                Thông tin chỗ
                {/*Thông tin chỗ*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "13%" }}
                className="ng-binding"
              >
                Giá vé
                {/*Giá vé*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "14%" }}
                className="ng-binding"
              >
                Giảm đối tượng
                {/*Giảm đối tượng*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "15%" }}
                className="ng-binding"
              >
                Khuyến mại
                {/*Khuyến mại*/}
              </th>
              <th
                style={{ backgroundColor: "lavender", width: "15%" }}
                className="ng-binding"
              >
                Thành tiền (VNĐ)
                {/*Thành tiền (VNĐ)*/}
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
                        Họ tên
                      </span>
                      <input
                        type="text"
                        placeholder="Thông tin hành khách"
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
                        Ngày sinh
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
                        Đối tượng
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
                              data: "Vui lòng mang CCCD/CCMND khi lên tàu",
                            });
                          }
                          if (e.target.value == "0.25") {
                            setContent({
                              data: "Trẻ em dưới 6 tuổi không cần mua vé và sử dụng chung chỗ của người lớn đi cùng. Bạn muốn tiếp tục mua vé riêng cho trẻ em này!!!Lưu ý: Trẻ em phải đi tàu có sự giám hộ của người lớn!! Vui lòng nhập cmnd/cccd của người giám hộ",
                            });
                          }
                          if (e.target.value == "0.15") {
                            setContent({
                              data: "Người cao tuổi từ 60 tuổi trở lên. Vui lòng mang CMND/CCCD khi lên tàu ",
                            });
                          }
                          if (e.target.value == "0.1") {
                            setContent({
                              data: "Vui lòng mang theo thẻ sinh viên/ sinh viên khi lên tàu ",
                            });
                          }

                          dispatch({ type: "RELOAD_CART" });
                        }}
                      >
                        <option value={0}>Người lớn</option>
                        <option value={0.25} label="Trẻ em">
                          Trẻ em
                        </option>
                        <option value={0.15} label="Người cao tuổi">
                          Người cao tuổi
                        </option>
                        <option value={0.1} label="Sinh viên">
                          Sinh viên
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
                        Số giấy tờ
                      </span>
                      <input
                        type="text"
                        placeholder="Số CMND/ CCCD/ Ngày tháng năm sinh trẻ em"
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
                      <span className="ng-binding">Giữ trong <span className="text-danger">544</span> giây</span>
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
                              GIẢM GIÁ ĐỐI TƯỢNG THEO CĐ 75/VTSG{" "}
                            </span>
                            <span
                              style={{ fontSize: "12px" }}
                              className="ng-binding"
                            >
                              (giảm {item.price - item.priceDiscount} VND)
                            </span>
                          </div>
                          {/* <div style={{ fontSize: '12px' }}>
                            <div className="text-danger ng-binding">
                              * Lưu ý:
                              <span className="ng-binding">Đây là vé áp dụng khuyến mại, đề nghị quý khách đọc kỹ</span>
                            </div>
                          </div> */}
                        </div>
                        {/* <div style={{ fontSize: '12px' }}>
                          <Link to='/regulation' className="ng-binding">
                            Các quy định về điều kiện mua vé, trả vé, đổi vé và hủy vé
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
                  <strong className="ng-binding">Tổng tiền</strong>
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
        <h5 className="ng-binding">Thông tin người đặt vé</h5>
        <div className="row text-info ng-binding">
          Quý khách vui lòng điền đẩy đủ và chính xác các thông tin về người mua
          vé dưới đây. Các thông tin này sẽ được sử dụng để xác minh người mua
          vé và lấy vé tại ga trước khi lên tàu theo đúng các quy định của Tổng
          công ty Đường sắt Việt Nam.
        </div>
        <div className="form-horizontal et-col-md-12 form-group">
          <div style={{ width: "100%", height: "10px", float: "left" }} />
          <div className="row" style={{ paddingLeft: "5px" }}>
            <div className="et-col-md-2">
              <label className="ng-binding mobi-display-none">
                HỌ TÊN<span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <br />
              <label className="ng-binding mobi-display-none">
                SỐ ĐIỆN THOẠI<span style={{ color: "red" }}>*</span>
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
                placeholder="Họ và tên"
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
                placeholder="Số di động"
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
                Số CMND / CCCD<span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <br />
            </div>
            <div className="et-col-md-4 mb-w-100">
              <input
                type="text"
                className="form-control input-sm ng-pristine ng-invalid ng-invalid-required"
                placeholder="Số CMND / CCCD"
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
                  Thanh toán tại quầy
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
                  Thanh toán qua Paypal
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
            Đăng ký vé
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
