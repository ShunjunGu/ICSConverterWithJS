# MCP服务使用说明

## 项目简介
本项目已升级为支持双重模式运行：
1. **Web API模式** - 原有的HTTP接口服务
2. **MCP服务模式** - 符合Model Context Protocol标准的服务

## 功能特性

### Web API模式
- 文本转ICS：`POST /convert-to-ics/`
- 图片转ICS：`POST /convert-to-ics/image`

### MCP服务模式
- 工具名称：`convert_text_to_ics`
- 工具名称：`convert_image_to_ics`

## 安装与启动

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
创建 `.env` 文件：
```
MOONSHOT_API_KEY=your_moonshot_api_key_here
PORT=3000
```

### 3. 启动Web API服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```
服务将在 http://localhost:3000 启动

### 4. 启动MCP服务
```bash
# 独立运行MCP服务
npm run mcp

# 或使用npx调试
npx @modelcontextprotocol/inspector npm run mcp

# 使用npx直接运行（在项目目录下）
npx node src/mcp-server.js

# 使用npx运行（指定项目路径）
npx node /Users/gushunjun/Documents/CalendarFormatConversionJavaScript/src/mcp-server.js
```

## MCP服务使用示例

### 在Claude Desktop中使用
在 `claude_desktop_config.json` 中添加：

#### 方式一：直接使用node（推荐）
```json
{
  "mcpServers": {
    "calendar-converter": {
      "command": "node",
      "args": ["/Users/gushunjun/Documents/CalendarFormatConversionJavaScript/src/mcp-server.js"],
      "env": {
        "MOONSHOT_API_KEY": "your_moonshot_api_key_here"
      }
    }
  }
}
```

#### 方式二：使用npx（需要全局安装或指定路径）
```json
{
  "mcpServers": {
    "calendar-converter": {
      "command": "npx",
      "args": ["node", "/Users/gushunjun/Documents/CalendarFormatConversionJavaScript/src/mcp-server.js"],
      "env": {
        "MOONSHOT_API_KEY": "your_moonshot_api_key_here"
      }
    }
  }
}
```

### npx配置示例

#### 在VS Code中使用npx配置
在 `.vscode/mcp.json` 中：

```json
{
  "servers": {
    "calendar-converter": {
      "command": "npx",
      "args": ["node", "/Users/gushunjun/Documents/CalendarFormatConversionJavaScript/src/mcp-server.js"],
      "env": {
        "MOONSHOT_API_KEY": "your_moonshot_api_key_here"
      }
    }
  }
}
```

#### 在Cursor中使用npx配置
在 `.cursor/mcp.json` 中：

```json
{
  "mcpServers": {
    "calendar-converter": {
      "command": "npx",
      "args": ["node", "/Users/gushunjun/Documents/CalendarFormatConversionJavaScript/src/mcp-server.js"],
      "env": {
        "MOONSHOT_API_KEY": "your_moonshot_api_key_here"
      }
    }
  }
}
```

### 使用MCP工具

#### 转换文本到ICS
```javascript
// 调用 convert_text_to_ics 工具
const result = await mcpClient.callTool("convert_text_to_ics", {
  text: "明天下午3点和团队开会，讨论项目进展"
});
```

#### 转换图片到ICS
```javascript
// 调用 convert_image_to_ics 工具
const result = await mcpClient.callTool("convert_image_to_ics", {
  imageData: "base64编码的图片数据"
});
```

## API接口文档

### 文本转ICS接口
```
POST /convert-to-ics/
Content-Type: application/json

{
  "text": "明天下午2点去图书馆还书"
}
```

### 图片转ICS接口
```
POST /convert-to-ics/image
Content-Type: application/json

{
  "imageData": "base64编码的图片数据"
}
```

## 响应格式

成功响应：
```json
{
  "success": true,
  "icsContent": "BEGIN:VCALENDAR...",
  "eventDetails": {
    "title": "会议标题",
    "startTime": "2024-01-15T14:00:00",
    "endTime": "2024-01-15T15:00:00",
    "description": "会议描述"
  }
}
```

错误响应：
```json
{
  "success": false,
  "error": "错误描述"
}
```

## 测试方法

### Web API测试
```bash
# 测试文本转换
curl -X POST http://localhost:3000/convert-to-ics/ \
  -H "Content-Type: application/json" \
  -d '{"text":"明天上午10点开会"}'

# 测试图片转换
curl -X POST http://localhost:3000/convert-to-ics/image \
  -H "Content-Type: application/json" \
  -d '{"imageData":"base64图片数据"}'
```

### MCP服务测试
```bash
# 使用MCP Inspector
npx @modelcontextprotocol/inspector npm run mcp

# 然后在浏览器中打开 http://localhost:6274 进行测试
```

## 注意事项

1. 确保已正确配置MOONSHOT_API_KEY环境变量
2. MCP服务使用stdio通信，不支持HTTP请求
3. Web API和MCP服务可以同时运行，互不干扰
4. 图片数据需要使用base64编码
5. 支持中文日程描述

## 故障排除

### 常见问题

1. **模块导入错误**：确保所有文件使用ES模块语法
2. **环境变量未加载**：检查.env文件是否存在且配置正确
3. **端口冲突**：修改PORT环境变量或关闭占用端口的程序
4. **API密钥无效**：检查MOONSHOT_API_KEY是否正确

### 日志查看
```bash
# 查看Web API日志
npm run dev

# 查看MCP服务日志
DEBUG=* npm run mcp
```