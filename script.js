document.getElementById('today').textContent = `【${new Date().toISOString().split('T')[0]}】`;

const otherCategories = [
  '英語','解剖学','原子物理学','線形代数学','組織学','総合',
  '熱力学','波動','発生学','病理学','無機化学','薬理学','有機化学','力学'
];

document.getElementById('start-btn').addEventListener('click', loadQuestions);

function loadQuestions() {
  const category = document.getElementById('category').value;
  if (!category) {
    alert('分野を選択してください。');
    return;
  }

  document.getElementById('quiz-area').innerHTML = '<p>問題を読み込み中...</p>';

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
