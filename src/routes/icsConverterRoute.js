// ICS转换路由
const express = require('express');
const router = express.Router();
const kimiApiHandler = require('../utils/kimiApiHandler');

// 文本转换接口
router.post('/', async (req, res) => {
  try {
    const { scheduleInput } = req.body;
    if (!scheduleInput) {
      return res.status(400).json({ error: '日程输入不能为空' });
    }
    
    const icsOutput = await kimiApiHandler.convertScheduleToICS(scheduleInput);
    res.json({ ics: icsOutput });
  } catch (error) {
    console.error('Error converting schedule to ICS:', error);
    res.status(500).json({ error: '日程转换失败' });
  }
});

// 图片转换接口
router.post('/image', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: '图片数据不能为空' });
    }
    
    const icsOutput = await kimiApiHandler.convertImageToICS(image);
    res.json({ ics: icsOutput });
  } catch (error) {
    console.error('Error converting image to ICS:', error);
    res.status(500).json({ error: '图片转换失败' });
  }
});

module.exports = router;