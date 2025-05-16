document.querySelectorAll('#today').forEach(e => e.textContent = new Date().toISOString().split('T')[0]);

const otherCategories = [
  '英語','解剖学','原子物理学','線形代数学','組織学','総合',
  '熱力学','波動','発生学','病理学','無機化学','薬理学','有機化学','力学'
];

function loadQuestions() {
  const category = document.getElementById('category').value;
  if (!category) {
    alert('分野を選択してください。');
    return;
  }

  document.getElementById('quiz-area').innerHTML = '<h3>問題をロード中...</h3>';

  fetch('all-questions.json')
    .then(res => res.json())
    .then(data => {
      const today = new Date().toISOString().split('T')[0];
      const filtered = category === 'その他'
        ? data.filter(q => otherCategories.includes(q.category))
        : data.filter(q => q.category === category);

      if (filtered.length < 3) {
        document.getElementById('quiz-area').innerHTML = `<p>該当分野の問題が不足しています。</p>`;
        return;
      }

      const seed = hash(`${today}-${category}`);
      const selected = pseudoRandomSelect(filtered, seed, 3);

      displayQuestions(selected);
    })
    .catch(err => {
      document.getElementById('quiz-area').innerHTML = `<p>データ読み込みエラー: ${err.message}</p>`;
    });
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pseudoRandomSelect(array, seed, count) {
  const indices = [...Array(array.length).keys()];
  indices.sort((a, b) => pseudoRandom(seed + a) - pseudoRandom(seed + b));
  return indices.slice(0, count).map(i => array[i]);
}

function pseudoRandom(x) {
  const sin = Math.sin(x) * 10000;
  return sin - Math.floor(sin);
}

function displayQuestions(questions) {
  const area = document.getElementById('quiz-area');
  area.innerHTML = '';

  questions.forEach((q, idx) => {
    const block = document.createElement('div');
    block.className = 'question-block';
    block.innerHTML = `
      <h3>Q${idx + 1}: ${q.question}</h3>
      <div class="button-center">
        <button class="show-answer" data-idx="${idx}">解答と解説を見る</button>
      </div>
      <div class="answer-block" id="answer-${idx}" style="display:none;">
        <b>分野:</b> ${q.category}<br>
        <b>難易度:</b> ${q.difficulty}<br>
        <b>解答と解説:</b><br>${q.answer.replace(/\n/g, '<br>')}
      </div>
    `;
    area.appendChild(block);
  });

  // ボタンイベントを追加
  document.querySelectorAll('.show-answer').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-idx');
      const answerBlock = document.getElementById(`answer-${idx}`);
      if (answerBlock) {
        answerBlock.style.display = 'block';
      }
    });
  });
}
