const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user'); // Telegram foydalanuvchi ID

const questions = [
  {
    question: "What is CDI's focus?",
    options: ["Medicine", "Technology", "Digital Learning", "Music"],
    correct: 2
  },
  {
    question: "Why is this passage written?",
    options: ["To confuse", "For entertainment", "IELTS Practice", "News"],
    correct: 2
  }
];

function renderQuestions() {
  const container = document.getElementById("questions");
  questions.forEach((q, i) => {
    const block = document.createElement("div");
    block.className = "mb-4";
    block.innerHTML = `
      <p class="font-semibold mb-1">${i + 1}. ${q.question}</p>
      ${q.options.map((opt, idx) => `
        <label class="block">
          <input type="radio" name="q${i}" value="${idx}" class="mr-1"> ${opt}
        </label>
      `).join('')}
      <p id="result${i}" class="mt-1 font-medium"></p>
    `;
    container.appendChild(block);
  });
}

function checkAnswers() {
  let correctCount = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const result = document.getElementById(`result${i}`);
    if (selected) {
      if (parseInt(selected.value) === q.correct) {
        result.textContent = "✅ Correct";
        result.className = "text-green-600";
        correctCount++;
      } else {
        result.textContent = `❌ Incorrect. Answer: ${q.options[q.correct]}`;
        result.className = "text-red-600";
      }
    } else {
      result.textContent = "⚠️ No answer selected";
      result.className = "text-yellow-600";
    }
  });

  if (userId) {
    fetch('https://tgbot-production-010b.up.railway.app/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        correct: correctCount,
        total: questions.length
      })
    }).then(() => {
      alert(`✅ Natija botga yuborildi! Siz ${correctCount}/${questions.length} to‘g‘ri topdingiz.`);
    });
  } else {
    alert(`Siz ${correctCount}/${questions.length} to‘g‘ri topdingiz.`);
  }
}

renderQuestions();
