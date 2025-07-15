// Kimi API处理工具
const OpenAI = require('openai');
const base64 = require('base64-js');

// 创建OpenAI客户端实例
const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.cn/v1",
});

/**
 * 将文本日程转换为ICS格式
 * @param {string} scheduleInput - 用户输入的日程描述
 * @returns {Promise<string>} - ICS格式的日程数据
 */
async function convertScheduleToICS(scheduleInput) {
  try {
    // 添加延迟防止速率限制
    await new Promise(resolve => setTimeout(resolve, 2000));

    const completion = await client.chat.completions.create({
      model: "moonshot-v1-8k",
      messages: [
        {
          role: "system",
          content: "你是 Kimi，由 Moonshot AI 提供的人工智能助手。你的任务是将用户输入的日程转换为ICS格式的代码，并且不得输出ICS代码以外的任何内容，包括提示性的文件。ICS是一种日历事件的标准格式，请确保输出的内容符合ICS规范。"
        },
        {
          role: "user",
          content: `请将以下日程转换为ICS代码：\n${scheduleInput}`
        }
      ],
      temperature: 0.3
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error converting schedule to ICS:', error);
    throw error;
  }
}

/**
 * 将图片中的日程信息转换为ICS格式
 * @param {string} imageData - Base64编码的图片数据
 * @returns {Promise<string>} - ICS格式的日程数据
 */
async function convertImageToICS(imageData) {
  try {
    // 确保图片数据有正确的前缀
    const imageDataWithPrefix = imageData.startsWith('data:image') 
      ? imageData 
      : `data:image/png;base64,${imageData}`;
    
    const messages = [
      {
        role: "system",
        content: "你是 Kimi，由 Moonshot AI 提供的人工智能助手。你的任务是从提供的图片中提取日程信息并转换为ICS格式的代码，并且不得输出ICS代码以外的任何内容。ICS是一种日历事件的标准格式，请确保输出的内容符合ICS规范。"
      },
      {
        role: "user",
        content: [
          {type: "text", text: "请分析这张图片中的日程信息，并将其转换为ICS格式的代码："},
          {type: "image_url", image_url: {url: imageDataWithPrefix}}
        ]
      }
    ];
    
    const completion = await client.chat.completions.create({
      model: "moonshot-v1-128k-vision-preview",
      messages,
      temperature: 0.3
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error converting image to ICS:', error);
    throw error;
  }
}

module.exports = {
  convertScheduleToICS,
  convertImageToICS
};