document.getElementById('resumeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  generateResume();
});

function generateResume() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const linkedin = document.getElementById('linkedin').value;
  const github = document.getElementById('github').value;
  const summary = document.getElementById('summary').value;
  const projects = document.getElementById('projects').value.split('\n');
  const experience = document.getElementById('experience').value.split('\n');
  const certifications = document.getElementById('certifications').value.split('\n');
  const skills = document.getElementById('skills').value.split(',');
  const education = document.getElementById('education').value.split('\n');

  let output = `
    <div style="text-align: center; font-size: 24px; font-weight: bold;">${name}</div>
    <div style="text-align: center; font-size: 14px; margin-bottom: 10px;">Baghpat, Uttar Pradesh 250621</div>
    <div style="text-align: center; font-size: 14px; margin-bottom: 25px;">
      ${phone} &nbsp;&nbsp; ${email} &nbsp;&nbsp;
      <a href="${linkedin}" target="_blank">linkedin.com</a> &nbsp;&nbsp;
      <a href="${github}" target="_blank">github.com</a>
    </div>

    <h3>Projects</h3>
    ${projects.map(p => `<p style="margin: 5px 0;"><strong>${p}</strong></p>`).join('')}

    <h3>Experience</h3>
    ${experience.map(e => `<p style="margin: 5px 0;">${e}</p>`).join('')}

    <h3>Certifications</h3>
    ${certifications.map(c => `<p style="margin: 5px 0;">${c}</p>`).join('')}

    <h3>Technical Skills</h3>
    <p>${skills.map(s => s.trim()).join(', ')}</p>

    <h3>Education</h3>
    ${education.map(ed => `<p style="margin: 5px 0;">${ed}</p>`).join('')}
  `;

  document.getElementById('resumeOutput').innerHTML = output;
}

function downloadPDF() {
  const element = document.getElementById('resumeOutput');
  html2pdf().from(element).save('My_Resume.pdf');
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function saveData() {
  const fields = ['name','email','phone','linkedin','github','summary','projects','experience','certifications','skills','education'];
  let data = {};
  fields.forEach(id => data[id] = document.getElementById(id).value);
  localStorage.setItem('resumeData', JSON.stringify(data));
  alert('Data saved locally!');
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('resumeData'));
  if (data) {
    Object.keys(data).forEach(id => {
      if (document.getElementById(id)) {
        document.getElementById(id).value = data[id];
      }
    });
    generateResume();
    alert('Data loaded!');
  } else {
    alert('No saved data found.');
  }
}

window.onload = () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
};
