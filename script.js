const balanceEl = document.getElementById('balance');
const listEl = document.getElementById('list');
const descEl = document.getElementById('desc');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');
const addBtn = document.getElementById('addBtn');
const themeToggle = document.getElementById('themeToggle');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateDashboard() {
  listEl.innerHTML = '';
  let total = 0;
  let income = 0;
  let expense = 0;

  transactions.forEach((tx, index) => {
    const li = document.createElement('li');
    li.classList.add(tx.type);
    li.innerHTML = `
      ${tx.desc} - ₹${tx.amount}
      <button onclick="deleteTx(${index})">❌</button>
    `;
    listEl.appendChild(li);

    tx.type === 'income' ? income += tx.amount : expense += tx.amount;
    total = income - expense;
  });

  balanceEl.textContent = total.toFixed(2);
  updateChart(income, expense);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

addBtn.addEventListener('click', () => {
  const desc = descEl.value.trim();
  const amount = parseFloat(amountEl.value);
  const type = typeEl.value;

  if (!desc || isNaN(amount)) {
    alert('Please enter valid details.');
    return;
  }

  transactions.push({ desc, amount, type });
  descEl.value = '';
  amountEl.value = '';
  updateDashboard();
});

function deleteTx(index) {
  transactions.splice(index, 1);
  updateDashboard();
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent =
    document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

let chart;
function updateChart(income, expense) {
  const ctx = document.getElementById('financeChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

updateDashboard();
