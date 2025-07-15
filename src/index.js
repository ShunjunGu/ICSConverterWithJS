// 项目入口文件
require('dotenv').config(); // 加载 .env 文件中的环境变量
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 引入路由
const icsConverterRoute = require('./routes/icsConverterRoute');
app.use('/convert-to-ics', icsConverterRoute);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});