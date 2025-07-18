#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { convertScheduleToICS, convertImageToICS } from './utils/kimiApiHandler.js';

const server = new Server(
  {
    name: 'calendar-format-conversion-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册文本转ICS工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'convert_text_to_ics',
        description: '将文本格式的日程信息转换为标准ICS日历文件格式',
        inputSchema: {
          type: 'object',
          properties: {
            scheduleText: {
              type: 'string',
              description: '文本格式的日程信息，例如：明天下午3点到5点在会议室开会'
            }
          },
          required: ['scheduleText']
        }
      },
      {
        name: 'convert_image_to_ics',
        description: '将图片中的日程信息转换为标准ICS日历文件格式',
        inputSchema: {
          type: 'object',
          properties: {
            imageData: {
              type: 'string',
              description: '图片的base64编码数据'
            }
          },
          required: ['imageData']
        }
      }
    ]
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'convert_text_to_ics') {
      const icsContent = await convertScheduleToICS(args.scheduleText);
      return {
        content: [
          {
            type: 'text',
            text: icsContent
          }
        ]
      };
    } else if (name === 'convert_image_to_ics') {
      const icsContent = await convertImageToICS(args.imageData);
      return {
        content: [
          {
            type: 'text',
            text: icsContent
          }
        ]
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `错误: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// 启动MCP服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Calendar Format Conversion MCP server running on stdio');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
  });
}

export default server;