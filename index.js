import { Telegraf, Markup } from 'telegraf';
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

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
      [Markup.button.url('📖 Passage 1', `https://YOUR-NETLIFY-LINK.netlify.app/passage1.html?user=${ctx.from.id}`)],
      [Markup.button.url('📖 Passage 2', `https://YOUR-NETLIFY-LINK.netlify.app/passage2.html?user=${ctx.from.id}`)],
      [Markup.button.callback('⬅️ Back', 'back')]
    ])
  );
});

bot.action('help', (ctx) => {
  ctx.editMessageText(
    'Botdan foydalanish oson:\n\n1️⃣ Passage tanlang\n2️⃣ Web sahifada highlight va test bajaring\n✅ Natijani ko‘ring!',
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

// === API ENDPOINT ===
app.post('/result', async (req, res) => {
  const { userId, correct, total } = req.body;
  const message = `📊 Natijangiz:\n✅ To‘g‘ri: ${correct}/${total}\n🔥 Davom eting!`;

  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: userId, text: message })
  });

  res.json({ status: 'ok' });
});

// ✅ Railway uchun PORT sozlash
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API ishlayapti: ${PORT}`));

bot.launch();
console.log('✅ Bot ishga tushdi...');
