const firebaseConfig = { apiKey: "AIzaSyAdF9umElHCNQcclyWRkKVFXyNSqXS3FIM", databaseURL: "https://free-income-48f88-default-rtdb.firebaseio.com/" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let balance = parseFloat(localStorage.getItem('my_balance')) || 0;
let userId = localStorage.getItem('user_id') || 'U' + Math.floor(Math.random()*900000);
let logs = JSON.parse(localStorage.getItem('income_logs')) || {};
let myChart = null;

function updateUI(animate = false) {
    const balEl = document.getElementById('mainBal');
    balEl.innerText = "৳ " + balance.toFixed(2);
    if(animate) {
        balEl.classList.add('animate-money');
        setTimeout(() => balEl.classList.remove('animate-money'), 800);
    }
    localStorage.setItem('my_balance', balance);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('income_logs', JSON.stringify(logs));
    db.ref('users/' + userId).update({ userId, balance });
}

function toggleMode() {
    document.getElementById('bodyTag').classList.toggle('light-mode');
    document.getElementById('modeIcon').classList.toggle('fa-sun');
}

function startTask() {
    let btn = document.getElementById('adBtn'), txt = document.getElementById('secTxt');
    btn.disabled = true; txt.style.display = 'block';
    let time = 7;
    let itv = setInterval(() => {
        txt.innerText = "নিরাপত্তা যাচাই করা হচ্ছে... " + time + "s";
        time--;
        if(time < 0) {
            clearInterval(itv);
            txt.style.display = 'none'; btn.disabled = false;
            window.open("https://www.effectivegatecpm.com/cw7zme40?key=b2f6a0eee9615ab068e8d9750dd0fab4", "_blank");
            balance += 3.7; logIncome(3.7); updateUI(true);
        }
    }, 1000);
}

function logIncome(amt) {
    const date = new Date().toLocaleDateString('bn-BD');
    if(!logs[date]) logs[date] = { ads: 0, total: 0 };
    logs[date].ads += 1; logs[date].total += amt;
}

function openHistory() {
    document.getElementById('historyModal').style.display = 'block';
    const body = document.getElementById('historyBody');
    body.innerHTML = "";
    const keys = Object.keys(logs).reverse().slice(0, 7);
    keys.forEach(k => {
        body.innerHTML += `<tr><td>${k}</td><td>${logs[k].ads}টি</td><td>৳${logs[k].total.toFixed(1)}</td></tr>`;
    });
    renderChart(keys);
}

function renderChart(keys) {
    const ctx = document.getElementById('incomeChart').getContext('2d');
    if(myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'line',
        data: { labels: keys.reverse(), datasets: [{ label: 'ইনকাম', data: keys.map(k=>logs[k].total), borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.2)', fill: true, tension: 0.3 }] }
    });
}

function closeHistory() { document.getElementById('historyModal').style.display = 'none'; }

function withdraw() {
    let n = document.getElementById('wNum').value, a = parseFloat(document.getElementById('wAmt').value), m = document.getElementById('method').value;
    if(n.length >= 11 && a >= 1000 && balance >= a) {
        balance -= a; updateUI();
        db.ref('withdraws').push({ userId, method: m, number: n, amount: a, time: new Date().toLocaleString() });
        alert("আবেদন সফল হয়েছে!");
    } else alert("১০০০ - ১০০০০ টাকার সঠিক তথ্য দিন।");
}

updateUI();
