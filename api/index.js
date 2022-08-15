require("dotenv").config();
var cors = require("cors");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT || 8800;
var server = require("http").Server(app);
server.listen(port, () => console.log("Server running in port " + port));
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

function slugName(str) {
	str = str.toLowerCase();
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");
	str = str.replace(/ /g, "-");
	return str;
}
function format_curency(a) {
	a = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	return a;
}

function dateDecrease(date, num) {
	let lastDate = new Date(date) - 86400000 * num;
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(lastDate);
}
function decreaseDate(dateString, num) {
	let oldDate = new Date(dateString);
	let newDate = oldDate.setDate(oldDate.getDate() - num);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(newDate);
}
function increaseDate(dateString, num) {
	let oldDate = new Date(dateString);
	let newDate = oldDate.setDate(oldDate.getDate() + num);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(newDate);
}

const DbName = "VeTau";
// const DbUrl = "mongodb://localhost:27017";
// const DbUrl = `mongodb+srv://admin:admin@cluster0.aw7zh.mongodb.net/${DbName}`
const DbUrl = `mongodb+srv://admin:admin@cluster0.k7xzu.mongodb.net/${DbName}?retryWrites=true&w=majority`

const itemPerPage = 7;
//Table
const User = "User";
const Train = "Train";
const Station = "Station";
const Schedule = "Schedule";
const Ticket = "Ticket";
const Order = "Order";

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const client = new MongoClient(DbUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const colUser = client.db(DbName).collection(User);
const colOrder = client.db(DbName).collection(Order);
const colTrain = client.db(DbName).collection(Train);
const colTicket = client.db(DbName).collection(Ticket);
const colStation = client.db(DbName).collection(Station);
const colSchedule = client.db(DbName).collection(Schedule);

app.get("/", (req, res) => {
	res.send("Home page. Server running okay.");
});
// test
app.get("/demo", async (req, res) => { });

//user
// using
app.get("/api/station", async (req, res) => {
	await client.connect();
	let result = await colStation.find().toArray();
	let resultRev = await colStation.find().sort({ _id: -1 }).toArray();
	res.status(200).json({
		status: "success",
		data: result,
		dataRev: resultRev,
	});
});
// get data schedule by value search
app.post("/api/schedule", async (req, res) => {
	let { valueSchedule } = req.body;
	await client.connect();
	let resultStationFrom = await colStation.findOne({
		_id: ObjectId(valueSchedule.stationFrom),
	});
	let resultStationTo = await colStation.findOne({
		_id: ObjectId(valueSchedule.stationTo),
	});
	console.log("from" + valueSchedule.stationFrom);
	if (resultStationFrom.idShow < resultStationTo.idShow) {
		// ga xuat phat: ha noi
		if (resultStationFrom.idShow < 12) {
			//1 -11
			let schedule = await colSchedule
				.find({ dateStart: valueSchedule.date, station: "Hà Nội" })
				.toArray();
			if (schedule.length > 0) {
				res.status(200).json({
					status: "success",
					schedule: schedule,
					stationFrom: resultStationFrom,
					stationTo: resultStationTo,
				});
			} else {
				res.status(200).json({
					status: "fail",
					message: "Không có lịch trình phù hợp",
				});
			}
			console.log("12" + schedule);
		} else if (resultStationFrom.idShow > 11 && resultStationFrom.idShow < 18) {
			//12-17
			let schedule = await colSchedule
				.find({
					station: "Hà Nội",
					$or: [
						{ dateStart: decreaseDate(valueSchedule.date, 1), time: "15:20" },
						{ dateStart: valueSchedule.date, time: "6:00" },
					],
				})
				.toArray();
			if (schedule.length > 0) {
				res.status(200).json({
					status: "success",
					schedule: schedule,
					stationFrom: resultStationFrom,
					stationTo: resultStationTo,
				});
			} else {
				res.status(200).json({
					status: "fail",
					message: "Không có lịch trình phù hợp",
				});
			}
			console.log("11-18" + schedule);
		} else if (resultStationFrom.idShow > 17 && resultStationFrom.idShow < 28) {
			//18-27
			let schedule = await colSchedule
				.find({
					dateStart: decreaseDate(valueSchedule.date, 1),
					station: "Hà Nội",
				})
				.toArray();
			if (schedule.length > 0) {
				res.status(200).json({
					status: "success",
					schedule: schedule,
					stationFrom: resultStationFrom,
					stationTo: resultStationTo,
				});
			} else {
				res.status(200).json({
					status: "fail",
					message: "Không có lịch trình phù hợp",
				});
			}
			console.log("17-28" + schedule);
		} else if (resultStationFrom.idShow > 27 && resultStationFrom.idShow < 33) {
			//28 - 32
			let schedule = await colSchedule
				.find({
					station: "Hà Nội",
					$or: [
						{ dateStart: decreaseDate(valueSchedule.date, 2), time: "15:20" },
						{ dateStart: decreaseDate(valueSchedule.date, 1), time: "6:00" },
					],
				})
				.toArray();
			if (schedule.length > 0) {
				res.status(200).json({
					status: "success",
					schedule: schedule,
					stationFrom: resultStationFrom,
					stationTo: resultStationTo,
				});
			} else {
				res.status(200).json({
					status: "fail",
					message: "Không có lịch trình phù hợp",
				});
			}
			console.log("27-33" + schedule);
		}
	} else {
		//ga xuat phat sai gon
		if (resultStationFrom.idShow > 21) {
			//32-22
			let schedule = await colSchedule
				.find({ dateStart: valueSchedule.date, station: "Sài Gòn" })
				.toArray();
			if (schedule.length > 0) {
				res.status(200).json({
					status: "success",
					schedule: schedule,
					stationFrom: resultStationFrom,
					stationTo: resultStationTo,
				});
			} else {
				res.status(200).json({
					status: "fail",
					message: "Không có lịch trình phù hợp",
				});
			}
			console.log(schedule);
		} else if (resultStationFrom.idShow < 22 && resultStationFrom.idShow > 15) {
			//21-16
			let schedule = await colSchedule
				.find({
					station: "Sài Gòn",
					$or: [
						{ dateStart: decreaseDate(valueSchedule.date, 1), time: "15:20" },
						{ dateStart: valueSchedule.date, time: "6:00" },
					],
				})
				.toArray();
			if (schedule.length > 0) {
				res.status(200).json({
					status: "success",
					schedule: schedule,
					stationFrom: resultStationFrom,
					stationTo: resultStationTo,
				});
			} else {
				res.status(200).json({
					status: "fail",
					message: "Không có lịch trình phù hợp",
				});
			}
			console.log(schedule);
		} else if (resultStationFrom.idShow < 16 && resultStationFrom.idShow > 5) {
			//15-6
			let schedule = await colSchedule
				.find({
					dateStart: decreaseDate(valueSchedule.date, 1),
					station: "Sài Gòn",
				})
				.toArray();
			if (schedule.length > 0) {
				res.status(200).json({
					status: "success",
					schedule: schedule,
					stationFrom: resultStationFrom,
					stationTo: resultStationTo,
				});
			} else {
				res.status(200).json({
					status: "fail",
					message: "Không có lịch trình phù hợp",
				});
			}
			console.log(schedule);
		} else {
			//5-1
			let schedule = await colSchedule
				.find({
					station: "Sài Gòn",
					$or: [
						{ dateStart: decreaseDate(valueSchedule.date, 2), time: "15:20" },
						{ dateStart: decreaseDate(valueSchedule.date, 1), time: "6:00" },
					],
				})
				.toArray();
			if (schedule.length > 0) {
				res.status(200).json({
					status: "success",
					schedule: schedule,
					stationFrom: resultStationFrom,
					stationTo: resultStationTo,
				});
			} else {
				res.status(200).json({
					status: "fail",
					message: "Không có lịch trình phù hợp",
				});
			}
			console.log(schedule);
		}
	}
});
// get data by idSchedule + station
app.get("/api/ticket", async (req, res) => {
	let { idSchedule, idStationFrom, idStationTo } = req.query;
	console.log(idStationTo);
	await client.connect();
	let result = await colTicket
		.find({
			isShow: 1,
			idSchedule: idSchedule,
			// $or: [
			// 	{
			// 		'stationFrom.idShow': {
			// 			$gte: parseInt(idStationFrom) < parseInt(idStationTo) ? parseInt(idStationFrom) : parseInt(idStationTo),
			// 			$lte: parseInt(idStationFrom) < parseInt(idStationTo) ? parseInt(idStationTo) : parseInt(idStationFrom)
			// 		},
			// 	},
			// 	{
			// 		'stationTo.idShow': {
			// 			$gte: parseInt(idStationFrom) < parseInt(idStationTo) ? parseInt(idStationFrom) : parseInt(idStationTo),
			// 			$lte: parseInt(idStationFrom) < parseInt(idStationTo) ? parseInt(idStationTo) : parseInt(idStationFrom)
			// 		},
			// 	}]
			$or: [
				{
					'stationFrom.idShow': {
						$eq: parseInt(idStationFrom) < parseInt(idStationTo) ? parseInt(idStationFrom) : parseInt(idStationTo),
						$eq: parseInt(idStationFrom) < parseInt(idStationTo) ? parseInt(idStationTo) : parseInt(idStationFrom)
					},
				},
				{
					'stationTo.idShow': {
						$eq: parseInt(idStationFrom) < parseInt(idStationTo) ? parseInt(idStationFrom) : parseInt(idStationTo),
						$eq: parseInt(idStationFrom) < parseInt(idStationTo) ? parseInt(idStationTo) : parseInt(idStationFrom)
					},
				}]
		})
		.toArray();
	// $and: [
	// 	{
	// 	  "stationFrom.idShow": {
	// 		$eq: parseInt(idStationFrom),
	// 		$lte: parseInt(idStationTo),
	// 	  },
	// 	},
	// 	// {
	// 	//   "stationTo.idShow": {
	// 	//     $lte: parseInt(idStationFrom),
	// 	//   },
	// 	// },
	//   ],
	// })
	// .toArray();
	if (result) {
		res.status(200).json({
			status: "success",
			data: result,
		});
		// console.log(result)
	} else {
		// console.log(err);
		res.status(200).json({
			status: "success",
			data: [],
		});
	}
});
// get data schedule by id
app.get("/api/schedule-id", async (req, res) => {
	let { id } = req.query;
	await client.connect();
	let result = await colSchedule.findOne({ _id: ObjectId(id) });
	if (result) {
		res.status(200).json({
			status: "success",
			data: result,
		});
	} else {
		console.log(err);
	}
});
//get data arr seat
app.get("/api/carriage", async (req, res) => {
	let { idTrain, idCarriage } = req.query;

	await client.connect();
	let result = await colTrain.findOne({ _id: ObjectId(idTrain) });
	result.carriage.forEach((item) => {
		if (item.idShow === idCarriage) {
			res.status(200).json({
				status: "success",
				data: item,
			});
		}
	});
});
//them ve vao data
app.post("/api/ticket", async (req, res) => {
	let ts = Date.now();
	let { tickets, order, statusTicket } = req.body;
	let dataOrder = {
		idShow: order.idShow,
		customerName: order.customerName,
		// dateBirth: order.dateBirth,
		phone: order.phone,
		email: order.email,
		idCard: order.idCard,
		countTicket: order.countTicket,
		dateOrder: order.dateOrder,
		date: new Date(ts),
		totalPrice: order.totalPrice,
	};
	let dataTicket = {
		idShow: "",
		idSchedule: "",
		idOrder: "",
		nameCustomer: "",
		// dateBirth: new Date(),
		idCart: "",
		seat: "",
		carriage: "",
		timeStart: "",
		dataStart: "",
		stationFrom: {
			idShow: "",
			name: "",
		},
		stationTo: {
			idShow: "",
			name: "",
		},
		price: "",
		status: "",
	};
	await client.connect();
	let resultOrder = await colOrder.insertOne(dataOrder);

	if (resultOrder.acknowledged) {
		let err = false;

		tickets.forEach(async (ticket) => {
			dataTicket = {
				idShow: ticket.idShow,
				idSchedule: ticket.idSchedule,
				idOrder: order.idShow,
				customerName: ticket.customerName,
				dateBirth: ticket.dateBirth,
				idCard: ticket.indentityCard,
				seat: ticket.idSeat,
				carriage: ticket.nameCarriage,
				timeStart: ticket.timeStart,
				dateStart: ticket.dateStart,
				date: new Date(ticket.dateStart),
				stationFrom: {
					idShow: ticket.stationFrom.idShow,
					name: ticket.stationFrom.name,
				},
				stationTo: {
					idShow: ticket.stationTo.idShow,
					name: ticket.stationTo.name,
				},
				price: ticket.priceDiscount,
				status: statusTicket,
				isShow: 1,
			};
			let resultTicket = await colTicket.insertOne(dataTicket);
			!resultTicket.acknowledged && true;
		});

		if (!err) {
			console.log("success");
			let transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 587,
				secure: false,
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASS_EMAIL,
				},
			});
			let mailOptions = {
				from: process.env.EMAIL,
				to: order.email,
				subject: "Xác thực email mua vé trên Booking Online",
				html: `
				<h1>Cảm ơn bạn đã tin tưởng và đồng hành cùng vé tàu Online</h1>
				<h4> 		+ Mã đặt: ${order.idShow}</h4>
				<h4>		+ Họ tên khách hàng: ${order.customerName}</h4>
				<h4>		+ Số điện thoại: ${order.phone}</h4>
				<h4>		+ Ngày đặt: ${new Date(ts)}</h4>
				<h4>		+ Tổng tiền: ${format_curency(order.totalPrice.toString()) + " VND"}</h4>
				<h4>		+ Tổng vé: ${order.countTicket}</h4>
				`,
			};
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
				} else {
					console.log("xac thuc thanh cong");
					res.status(200).json({
						status: "success",
						message: "Thông tin đặt vé đã được gửi đên email của bạn",
					});
					console.log("mail success");
				}
			});
		} else {
			res.status(200).json({
				status: "faile",
				message: "Lỗi hệ thống đặt vé thất bại",
			});
		}
	} else {
		res.status(200).json({
			status: "faile",
			message: "Lỗi hệ thống đặt vé thất bại",
		});
	}
});

app.get("/api/schedule-detail", async (req, res) => {
	// console.log(req.query.idTrain)
	let idTrain = req.query.idTrain;
	await client.connect();
	let result = await colTrain.findOne({ _id: ObjectId(idTrain) });
	if (result) {
		res.status(200).json({
			status: "success",
			data: result,
		});
	}
});
app.get("/api/train", async (req, res) => {
	await client.connect();
	let result = await colTrain.find().toArray();
	res.status(200).json({
		data: result,
	});
});
app.get("/api/carriage1", async (req, res) => {
	// console.log(req.query.id)
	let idTrain = req.query.id;
	await client.connect();
	let result = await colTrain.findOne({ _id: ObjectId(idTrain) });
	res.status(200).json({
		data: result,
	});
});

//admin
app.get("/api/order-page", async (req, res) => {
	await client.connect();
	let { page } = req.query;

	let allOrder = await colOrder.find().toArray();
	let totalPage = Math.ceil(parseInt(allOrder.length) / itemPerPage);
	let result = await colOrder
		.find({})
		.sort({ _id: -1 })
		.limit(itemPerPage)
		.skip(itemPerPage * page)
		.toArray();
	res.status(200).json({
		status: "success",
		data: result,
		totalPage: totalPage,
	});
	// console.log(result)
});
app.get("/api/order-search", async (req, res) => {
	// console.log(req.query.search)
	await client.connect();
	let { page, search } = req.query;

	let searchOrder = await colOrder
		.find({
			$or: [
				{
					idShow: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					customerName: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					email: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					phone: {
						$regex: search,
						$options: "$i",
					},
				},
			],
		})
		.toArray();
	let totalPage = Math.ceil(parseInt(searchOrder.length) / itemPerPage);
	let result = await colOrder
		.find({
			$or: [
				{
					idShow: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					customerName: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					email: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					phone: {
						$regex: search,
						$options: "$i",
					},
				},
			],
		})
		.sort({ _id: -1 })
		.limit(itemPerPage)
		.skip(itemPerPage * page)
		.toArray();
	res.status(200).json({
		status: "success",
		data: result,
		totalPage: totalPage,
	});
	// console.log(result)
});
app.get("/api/ticket-page", async (req, res) => {
	await client.connect();
	let { page } = req.query;

	let allTicket = await colTicket.find({}).toArray();
	let totalPage = Math.ceil(parseInt(allTicket.length) / itemPerPage);
	let result = await colTicket
		.find({})
		.sort({ _id: -1 })
		.limit(itemPerPage)
		.skip(itemPerPage * page)
		.toArray();
	res.status(200).json({
		status: "success",
		data: result,
		totalPage: totalPage,
	});
});
app.get("/api/ticket-search", async (req, res) => {
	await client.connect();
	let { page, search } = req.query;

	let searchOrder = await colTicket
		.find({
			$or: [
				{
					idShow: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					customerName: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					idCard: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					idOrder: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					seat: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					date: {
						$regex: search,
						$options: "$i",
					},
				},
			],
		})
		.toArray();
	let totalPage = Math.ceil(parseInt(searchOrder.length) / itemPerPage);
	let result = await colTicket
		.find({
			$or: [
				{
					idShow: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					customerName: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					idOrder: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					seat: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					idCard: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					date: {
						$regex: search,
						$options: "$i",
					},
				},
			],
		})
		.sort({ _id: -1 })
		.limit(itemPerPage)
		.skip(itemPerPage * page)
		.toArray();
	res.status(200).json({
		status: "success",
		data: result,
		totalPage: totalPage,
	});
	// console.log(result)
});
app.get("/api/ticket-idorder", async (req, res) => {
	let { idOrder } = req.query;
	await client.connect();
	let result = await colTicket.find({ idOrder: idOrder }).toArray();
	res.status(200).json({
		status: "success",
		data: result,
	});
});
app.get("/api/ticket-idorder-4", async (req, res) => {
	let { idOrder } = req.query;
	await client.connect();
	let result = await colTicket
		.find({ idOrder: idOrder, status: { $ne: 4 } })
		.toArray();
	res.status(200).json({
		status: "success",
		data: result,
	});
});
app.put("/api/ticket-status", async (req, res) => {
	let { id } = req.query;
	await client.connect();
	let result = await colTicket.updateOne(
		{ _id: ObjectId(id) },
		{
			$set: {
				status: 2,
				isShow: 1,
			},
		}
	);
	res.status(200).json({
		status: "success",
		message: "In vé thành công",
	});
});
app.put("/api/ticket-delete", async (req, res) => {
	let { id } = req.query;
	await client.connect();
	await colTicket.updateOne(
		{ _id: ObjectId(id) },
		{ $set: { isShow: 0, status: 4 } }
	);
	res.status(200).json({
		status: "success",
		message: "Đã hủy vé",
	});
});
app.put("/api/tickets-delete", async (req, res) => {
	let { idOrder } = req.query;
	await client.connect();
	let result = await colTicket.find({ idOrder: idOrder }).toArray();
	result.forEach(async (ticket) => {
		await colTicket.updateOne(
			{ _id: ObjectId(ticket._id) },
			{ $set: { status: 4 } }
		);
	});
	res.status(200).json({
		status: "success",
		message: "Đã hủy vé",
	});
});
app.put("/api/ticket-status-3", async (req, res) => {
	let { id } = req.query;
	await client.connect();
	await colTicket.updateOne({ _id: ObjectId(id) }, { $set: { status: 3 } });
	res.status(200).json({
		status: "success",
		message: "Yêu cầu đã được gửi đợi BookingOnile xác nhận",
	});
});
app.get("/api/schedule-page", async (req, res) => {
	await client.connect();
	let { page } = req.query;

	let allOrder = await colSchedule.find().toArray();
	let totalPage = Math.ceil(parseInt(allOrder.length) / itemPerPage);
	let result = await colSchedule
		.find({})
		.sort({ dateStart: -1 })
		.limit(itemPerPage)
		.skip(itemPerPage * page)
		.toArray();
	res.status(200).json({
		status: "success",
		data: result,
		totalPage: totalPage,
	});
});
app.get("/api/schedule-search", async (req, res) => {
	await client.connect();
	let { page, search } = req.query;

	let searchSchedule = await colSchedule
		.find({
			$or: [
				{
					dateStart: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					time: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					"train.idShow": {
						$regex: search,
						$options: "$i",
					},
				},
				{
					station: {
						$regex: search,
						$options: "$i",
					},
				},
			],
		})
		.toArray();
	let totalPage = Math.ceil(parseInt(searchSchedule.length) / itemPerPage);
	let result = await colSchedule
		.find({
			$or: [
				{
					dateStart: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					time: {
						$regex: search,
						$options: "$i",
					},
				},
				{
					"train.idShow": {
						$regex: search,
						$options: "$i",
					},
				},
				{
					station: {
						$regex: search,
						$options: "$i",
					},
				},
			],
		})
		.sort({ _id: -1 })
		.limit(itemPerPage)
		.skip(itemPerPage * page)
		.toArray();
	res.status(200).json({
		status: "success",
		data: result,
		totalPage: totalPage,
	});
	// console.log(result)
});
app.post("/api/schedule-value", async (req, res) => {
	let dateDefault = new Date("04/20/2022");
	let dateDefault2 = new Date(req.body.schedule.dateStart);
	let numDate = (Math.abs(dateDefault2 - dateDefault) / 86400000) % 4;
	let date = req.body.schedule.dateStart;
	let time = req.body.schedule.time;

	console.log(Math.abs(dateDefault2 - dateDefault));
	console.log(numDate);
	await client.connect();
	let result = await colSchedule.findOne({
		dateStart: date,
		time: time,
		station: "Hà Nội",
	});
	if (result) {
		res.status(200).json({
			status: "success",
			message: "Đã có lịch trình",
			data: result,
		});
	} else {
		if (time === "6:00" && numDate === 0) {
			let result1 = await colTrain.findOne({ idShow: "SE1" });
			res.status(200).json({
				status: "fail",
				data: result1,
			});
		} else if (time === "15:20" && numDate === 0) {
			let result2 = await colTrain.findOne({ idShow: "SE2" });
			res.status(200).json({
				status: "fail",
				data: result2,
			});
		} else if (time === "6:00" && numDate === 1) {
			let result3 = await colTrain.findOne({ idShow: "SE3" });
			res.status(200).json({
				status: "fail",
				data: result3,
			});
		} else if (time === "15:20" && numDate === 1) {
			let result4 = await colTrain.findOne({ idShow: "SE4" });
			res.status(200).json({
				status: "fail",
				data: result4,
			});
		} else if (time === "6:00" && numDate === 2) {
			let result5 = await colTrain.findOne({ idShow: "SE5" });
			res.status(200).json({
				status: "fail",
				data: result5,
			});
		} else if (time === "15:20" && numDate === 2) {
			let result6 = await colTrain.findOne({ idShow: "SE6" });
			res.status(200).json({
				status: "fail",
				data: result6,
			});
		} else if (time === "6:00" && numDate === 3) {
			let result7 = await colTrain.findOne({ idShow: "SE7" });
			res.status(200).json({
				status: "fail",
				data: result7,
			});
		} else if (time === "15:20" && numDate === 3) {
			let result8 = await colTrain.findOne({ idShow: "SE8" });
			res.status(200).json({
				status: "fail",
				data: result8,
			});
		} else {
			res.status(200).json({
				status: "waitting",
			});
		}
	}
});
app.post("/api/schedule-add", async (req, res) => {
	let { schedule } = req.body;
	let schedule1 = {
		dateStart: schedule.dateStart,
		time: schedule.time,
		station: schedule.station,
		trainId: schedule.train._id,
		train: schedule.train,
	};
	let schedule2 = {
		dateStart: schedule.dateReturn,
		time: schedule.time,
		station: schedule.stationRev,
		trainId: schedule.train._id,
		train: schedule.train,
	};
	let result = colSchedule.insertMany([schedule1, schedule2]);
	if (result) {
		res.status(200).json({
			status: "success",
			message: "Thêm lịch trình thành công",
		});
	} else {
		res.status(200).json({
			status: "fail",
			message: "Thêm lịch thất bại",
		});
	}
});
app.post("/api/login", async (req, res) => {
	// console.log(req.body.account)
	let username = req.body.account.username;
	let password = req.body.account.password;
	await client.connect();
	let result = await colUser.findOne({ "account.username": username });
	if (!result) {
		res.status(200).json({
			status: "fail",
			message: "Tài khoản không tồn tại",
		});
	} else {
		if (result.account.password !== password) {
			res.status(200).json({
				status: "fail",
				message: "Tài khoản hoặc mật khẩu không hợp lệ",
			});
		} else {
			var secretKey = process.env.SECRET_KEY;
			var payload = {
				userID: result._id,
				role: result.role,
			};

			//7 ngày hết hạn token
			var token = jwt.sign({ payload }, secretKey, { expiresIn: 60 * 1220 * 7 });
			console.log(JSON.stringify(payload));
			res.status(200).json({
				status: "success",
				message: "Đăng nhập thành công !",
				userID: result._id,
				userName: result.account.username,
				vaiTro: result.vaiTro,
				role: result.role,
				name: result.name,
				token: token
			});
		}
	}
});
