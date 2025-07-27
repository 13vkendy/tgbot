import { Telegraf, Markup } from 'telegraf';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // ✅ CORS ruxsat berildi

// ✅ Telegram bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// === BOT MENUSI ===
bot.start((ctx) => {
  ctx.reply(
    `Salom, ${ctx.from.first_name}! IELTS Practice Botga xush kelibsiz.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('📚 Reading Passages', 'reading')],
      [Markup.button.callback('ℹ️ Help', 'help')]
    ])
  );
});

bot.action('reading', (ctx) => {
  ctx.editMessageText(
    'Quyidagi IELTS passagelardan birini tanlang:',
    Markup.inlineKeyboard([
      [Markup.button.url('📖 Passage 1', `https://cdieltsuz.netlify.app/index.html?user=${ctx.from.id}`)],
      [Markup.button.url('📖 Passage 2', `https://cdieltsuz.netlify.app/index.html?user=${ctx.from.id}`)],
      [Markup.button.callback('⬅️ Back', 'back')]
    ])
  );
});

bot.action('help', (ctx) => {
  ctx.editMessageText(
    'Botdan foydalanish oson:\n\n1️⃣ Passage tanlang\n2️⃣ Web sahifada test bajaring\n✅ Natijani ko‘ring!',
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'back')]])
  );
});

bot.action('back', (ctx) => {
  ctx.editMessageText(
    `Salom, ${ctx.from.first_name}! IELTS Practice Botga xush kelibsiz.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('📚 Reading Passages', 'reading')],
      [Markup.button.callback('ℹ️ Help', 'help')]
    ])
  );
});

// === API ENDPOINT (Natija botga yuborish) ===
app.post('/result', async (req, res) => {
  const { userId, correct, total } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId topilmadi' });
  }

  const message = `📊 Natijangiz:\n✅ To‘g‘ri: ${correct}/${total}\n🔥 Davom eting!`;

  try {
    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: userId, text: message })
    });

    console.log(`✅ Natija yuborildi foydalanuvchi: ${userId}`);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('❌ Telegramga yuborishda xato:', err);
    res.status(500).json({ error: 'Xabar yuborilmadi' });
  }
});

// ✅ Railway uchun PORT sozlash
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API ishlayapti: ${PORT}`));

bot.launch();
console.log('✅ Bot ishga tushdi...');
