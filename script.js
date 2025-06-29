document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const saveDataBtn = document.getElementById('saveData');
    const loadDataBtn = document.getElementById('loadData');
    const resetFormBtn = document.getElementById('resetForm');
    const generateResumeBtn = document.getElementById('generateResume');
    const downloadPDFBtn = document.getElementById('downloadPDF');
    const printResumeBtn = document.getElementById('printResume');
    const notification = document.getElementById('notification');
    const resumeForm = document.getElementById('resumeForm');
    const resumeOutput = document.getElementById('resumeOutput');

    const formFields = [
        'name', 'email', 'phone', 'linkedin', 'github',
        'summary', 'experience', 'projects', 'certifications', 'skills', 'education'
    ];

    themeToggle.addEventListener('click', toggleTheme);
    saveDataBtn.addEventListener('click', saveData);
    loadDataBtn.addEventListener('click', loadData);
    resetFormBtn.addEventListener('click', resetForm);
    resumeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        generateResume();
    });
    downloadPDFBtn.addEventListener('click', downloadPDF);
    printResumeBtn.addEventListener('click', printResume);

    // Load theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }

    // Load data if exists
    if (localStorage.getItem('resumeData')) {
        loadData();
    }

    function toggleTheme() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark
            ? '<i class="fas fa-sun"></i> Light Mode'
            : '<i class="fas fa-moon"></i> Dark Mode';
    }

    function saveData() {
        const data = {};
        formFields.forEach(id => {
            data[id] = document.getElementById(id).value;
        });
        localStorage.setItem('resumeData', JSON.stringify(data));
        showNotification('Resume data saved locally!');
    }

    function loadData() {
        const data = JSON.parse(localStorage.getItem('resumeData'));
        if (data) {
            formFields.forEach(id => {
                document.getElementById(id).value = data[id] || '';
            });
            generateResume();
            showNotification('Resume data loaded!');
        } else {
            showNotification('No saved data found.', 'warning');
        }
    }

    function resetForm() {
        if (confirm('Are you sure you want to reset all fields?')) {
            formFields.forEach(id => {
                document.getElementById(id).value = '';
            });
            resumeOutput.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>Your Resume Preview</h3>
                    <p>Fill out the form and click "Generate Resume" to see your professional resume here</p>
                </div>`;
            showNotification('Form has been reset.');
        }
    }

    function generateResume() {
        const name = document.getElementById('name').value || 'Your Name';
        const email = document.getElementById('email').value || 'email@example.com';
        const phone = document.getElementById('phone').value || '(123) 456-7890';
        const linkedin = document.getElementById('linkedin').value;
        const github = document.getElementById('github').value;
        const summary = document.getElementById('summary').value || 'Professional summary goes here...';

        const experience = processLines(document.getElementById('experience').value);
        const education = processLines(document.getElementById('education').value);
        const projects = processLines(document.getElementById('projects').value);
        const certifications = processLines(document.getElementById('certifications').value);

        const skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(Boolean);

        let output = `
            <div class="resume-header">
                <h1 class="resume-name">${name}</h1>
                <div class="resume-contact">
                    <div><i class="fas fa-phone"></i> ${phone}</div>
                    <div><i class="fas fa-envelope"></i> ${email}</div>
                    ${linkedin ? `<div><i class="fab fa-linkedin"></i> ${linkedin}</div>` : ''}
                    ${github ? `<div><i class="fab fa-github"></i> ${github}</div>` : ''}
                </div>
            </div>
            <div class="resume-section">
                <h2 class="section-title">Professional Summary</h2>
                <div class="resume-summary">${summary.replace(/\n/g, '<br>')}</div>
            </div>`;

        if (experience) {
            output += `
                <div class="resume-section">
                    <h2 class="section-title">Experience</h2>
                    <ul class="resume-list">${experience}</ul>
                </div>`;
        }

        if (projects) {
            output += `
                <div class="resume-section">
                    <h2 class="section-title">Projects</h2>
                    <ul class="resume-list">${projects}</ul>
                </div>`;
        }

        if (certifications) {
            output += `
                <div class="resume-section">
                    <h2 class="section-title">Certifications</h2>
                    <ul class="resume-list">${certifications}</ul>
                </div>`;
        }

        if (skills.length > 0) {
            output += `
                <div class="resume-section">
                    <h2 class="section-title">Technical Skills</h2>
                    <div class="skills-container">
                        ${skills.map(skill => `<div class="skill-pill">${skill}</div>`).join('')}
                    </div>
                </div>`;
        }

        if (education) {
            output += `
                <div class="resume-section">
                    <h2 class="section-title">Education</h2>
                    <ul class="resume-list">${education}</ul>
                </div>`;
        }

        resumeOutput.innerHTML = output;
    }

    function processLines(text) {
        return text
            .split('\n')
            .filter(line => line.trim())
            .map(line => `<li>${line}</li>`)
            .join('');
    }

    function downloadPDF() {
        if (resumeOutput.innerHTML.includes('empty-state')) {
            showNotification('Please generate a resume first.', 'warning');
            return;
        }

        if (typeof html2pdf !== 'undefined') {
            const opt = {
                margin: 10,
                filename: 'professional_resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(resumeOutput).save();
        } else {
            showNotification('PDF library not loaded. Please try printing instead.', 'warning');
        }
    }

    function printResume() {
        if (resumeOutput.innerHTML.includes('empty-state')) {
            showNotification('Please generate a resume first.', 'warning');
            return;
        }

        const printContent = resumeOutput.innerHTML;
        const original = document.body.innerHTML;
        document.body.innerHTML = `
            <!DOCTYPE html>
            <html><head><title>Resume</title>
            <style>
                body { font-family: 'Segoe UI'; padding: 20mm; }
                .resume-name { font-size: 24pt; }
                .section-title { font-size: 14pt; }
                .resume-contact { margin: 10px 0; }
            </style>
            </head><body>${printContent}</body></html>`;
        window.print();
        document.body.innerHTML = original;
        generateResume();
    }

    function showNotification(msg, type = 'success') {
        notification.textContent = msg;
        notification.className = 'notification show';
        notification.style.backgroundColor = (type === 'warning') ? '#ff9800' : 'var(--success)';
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});
