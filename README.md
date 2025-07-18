# 日程格式转换工具 (Calendar Format Converter)

一个基于 AI 的日程格式转换工具，支持将自然语言描述或图片中的日程信息转换为标准的 ICS (iCalendar) 格式文件。

##  功能特性

### 核心功能
- **文本转ICS**: 将自然语言描述的日程转换为标准ICS格式
- **图片转ICS**: 从图片中提取日程信息并转换为ICS格式
- **Web API**: 提供RESTful API接口
- **MCP服务**: 支持Model Context Protocol标准协议
- **可视化界面**: 简洁易用的Web界面

### 支持格式
- **输入格式**: 自然语言文本、图片文件
- **输出格式**: 标准ICS文件（兼容Google Calendar、Apple Calendar等）

### AI能力
- **自然语言理解**: 准确解析中文日程描述
- **图像识别**: 识别图片中的时间、地点、事件信息
- **智能格式化**: 自动规范化日程数据

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器
- Moonshot AI API Key

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/ShunjunGu/ICSConverterWithJS.git
cd ICSConverterWithJS
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件，添加你的 Moonshot AI API Key：
```env
MOONSHOT_API_KEY=你的_api_key_here
PORT=3000
```

4. **启动服务**

**Web API模式**:
```bash
npm start
# 或开发模式
npm run dev
```

**MCP服务模式**:
```bash
npm run mcp
```

## 📖 使用说明

### Web界面使用

1. 启动服务后，访问 http://localhost:3000
2. 选择转换模式：文本输入或图片上传
3. 输入日程信息或上传图片
4. 点击"转换"按钮获取ICS文件

### API使用

#### 文本转ICS接口
```http
POST /convert-to-ics
Content-Type: application/json

{
  "text": "明天下午3点和客户开会"
}
```

#### 图片转ICS接口
```http
POST /convert-image-to-ics
Content-Type: multipart/form-data

file: [图片文件]
```

#### 响应格式
```json
{
  "success": true,
  "ics": "BEGIN:VCALENDAR...",
  "filename": "calendar.ics"
}
```

### MCP服务使用

#### 配置Claude Desktop

在 `claude_desktop_config.json` 中添加：
```json
{
  "mcpServers": {
    "calendar-converter": {
      "command": "node",
      "args": ["/path/to/your/project/src/mcp-server.js"],
      "env": {
        "MOONSHOT_API_KEY": "你的_api_key"
      }
    }
  }
}
```

#### 使用npx配置

```json
{
  "mcpServers": {
    "calendar-converter": {
      "command": "npx",
      "args": ["-y", "node", "src/mcp-server.js"],
      "env": {
        "MOONSHOT_API_KEY": "你的_api_key"
      }
    }
  }
}
```

#### MCP工具

**convert_text_to_ics**: 将文本转换为ICS
- 参数: `text` (string) - 日程描述文本
- 返回: ICS格式字符串

**convert_image_to_ics**: 将图片转换为ICS
- 参数: `imageData` (string) - Base64编码的图片数据
- 返回: ICS格式字符串

## 🛠️ 开发指南

### 项目结构
```
ICSConverterWithJS/
├── src/
│   ├── index.js          # Web服务入口
│   ├── mcp-server.js     # MCP服务
│   ├── routes/
│   │   └── icsConverterRoute.js
│   └── utils/
│       └── kimiApiHandler.js
├── public/
│   └── index.html        # Web界面
├── package.json
├── .env.example
└── README.md
```

### 开发模式

1. **启动开发服务器**
```bash
npm run dev
```

2. **测试MCP服务**
```bash
# 使用MCP Inspector
npx @modelcontextprotocol/inspector npm run mcp
```

3. **调试API**
```bash
# 测试文本转换
curl -X POST http://localhost:3000/convert-to-ics \
  -H "Content-Type: application/json" \
  -d '{"text":"明天下午3点开会"}'
```

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| MOONSHOT_API_KEY | Moonshot AI API密钥 | sk-xxx... |
| PORT | 服务端口 | 3000 |

### 依赖包

- **@modelcontextprotocol/sdk**: MCP服务框架
- **openai**: AI API客户端
- **express**: Web框架
- **cors**: 跨域支持
- **dotenv**: 环境变量管理

## 📝 使用示例

### 文本转换示例

**输入**:
```
明天下午3点到5点在会议室A和产品团队开会，讨论新功能发布计划
```

**输出**:
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Calendar Converter//EN
BEGIN:VEVENT
UID:20241220T150000@calendar-converter
DTSTART:20241221T150000
DTEND:20241221T170000
SUMMARY:产品团队会议 - 新功能发布计划
LOCATION:会议室A
DESCRIPTION:和产品团队讨论新功能发布计划
END:VEVENT
END:VCALENDAR
```

### 图片转换示例

支持从会议通知截图、日程表图片等提取信息并转换为ICS格式。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙋‍♂️ 支持与联系

- **Issues**: [GitHub Issues](https://github.com/ShunjunGu/ICSConverterWithJS/issues)
- **Email**: 项目维护者邮箱

## 🔗 相关链接

- [Moonshot AI](https://platform.moonshot.cn/) - AI服务提供商
- [iCalendar标准](https://icalendar.org/) - ICS格式规范
- [MCP协议](https://modelcontextprotocol.io/) - Model Context Protocol

---

**⭐ 如果这个项目对你有帮助，请给个Star！**
