import { VercelRequest, VercelResponse } from '@vercel/node';
import QRCode from 'qrcode';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'テキストパラメータが必要です' });
  }

  try {
    const qrCodeDataURL = await QRCode.toDataURL(text as string);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
    
    const qrCodeBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
    res.send(qrCodeBuffer);
  } catch (error) {
    res.status(500).json({ error: 'QRコードの生成に失敗しました' });
  }
}
