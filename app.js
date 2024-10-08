const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const authRouter = require("./routes/auth_routes");
const postRouter = require("./routes/post_routes");
const userRouter = require("./routes/user_routes");
const testRouter = require("./routes/test_routes");
const chatRouter = require("./routes/chat_routes");
const messageRouter = require("./routes/message_routes");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/test", testRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

app.listen(3003, () => {
  console.log("server started");
});
