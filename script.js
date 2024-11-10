// Form Handling
var ResumeBuilder = /** @class */ (function () {
    function ResumeBuilder() {
        this.resume = {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                location: ''
            },
            education: [],
            experience: [],
            skills: []
        };
        this.educationCount = 0;
        this.experienceCount = 0;
        this.initializeEventListeners();
        this.addEducationField();
        this.addExperienceField();
    }
    ResumeBuilder.prototype.initializeEventListeners = function () {
        var _this = this;
        var _a, _b, _c;
        // Form submission
        var form = document.getElementById('resumeForm');
        form.addEventListener('submit', function (e) { return _this.handleSubmit(e); });
        // Add education and experience buttons
        (_a = document.getElementById('addEducation')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return _this.addEducationField(); });
        (_b = document.getElementById('addExperience')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return _this.addExperienceField(); });
        // Real-time updates
        var personalFields = ['fullName', 'email', 'phone', 'location'];
        personalFields.forEach(function (field) {
            var _a;
            (_a = document.getElementById(field)) === null || _a === void 0 ? void 0 : _a.addEventListener('input', function () { return _this.updatePreview(); });
        });
        (_c = document.getElementById('skills')) === null || _c === void 0 ? void 0 : _c.addEventListener('input', function () { return _this.updatePreview(); });
    };
    ResumeBuilder.prototype.addEducationField = function () {
        var _this = this;
        var container = document.getElementById('educationFields');
        var fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';
        fieldGroup.innerHTML = "\n            <button type=\"button\" class=\"remove-btn\" onclick=\"this.parentElement.remove();\">Remove</button>\n            <label>School*</label>\n            <input type=\"text\" class=\"education-school\" required>\n            <label>Degree*</label>\n            <input type=\"text\" class=\"education-degree\" required>\n            <label>Graduation Year*</label>\n            <input type=\"text\" class=\"education-year\" required>\n            <label>GPA</label>\n            <input type=\"text\" class=\"education-gpa\">\n        ";
        container === null || container === void 0 ? void 0 : container.appendChild(fieldGroup);
        // Add event listeners for real-time updates
        fieldGroup.querySelectorAll('input').forEach(function (input) {
            input.addEventListener('input', function () { return _this.updatePreview(); });
        });
        this.educationCount++;
    };
    ResumeBuilder.prototype.addExperienceField = function () {
        var _this = this;
        var container = document.getElementById('experienceFields');
        var fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';
        fieldGroup.innerHTML = "\n            <button type=\"button\" class=\"remove-btn\" onclick=\"this.parentElement.remove();\">Remove</button>\n            <label>Company*</label>\n            <input type=\"text\" class=\"experience-company\" required>\n            <label>Position*</label>\n            <input type=\"text\" class=\"experience-position\" required>\n            <label>Start Date*</label>\n            <input type=\"text\" class=\"experience-start\" required>\n            <label>End Date*</label>\n            <input type=\"text\" class=\"experience-end\" required>\n            <label>Description*</label>\n            <textarea class=\"experience-description\" required></textarea>\n        ";
        container === null || container === void 0 ? void 0 : container.appendChild(fieldGroup);
        // Add event listeners for real-time updates
        fieldGroup.querySelectorAll('input, textarea').forEach(function (input) {
            input.addEventListener('input', function () { return _this.updatePreview(); });
        });
        this.experienceCount++;
    };
    ResumeBuilder.prototype.validateForm = function () {
        var isValid = true;
        var errors = {};
        // Validate personal information
        var fullName = document.getElementById('fullName').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        if (!fullName) {
            errors.fullName = 'Full name is required';
            isValid = false;
        }
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = 'Valid email is required';
            isValid = false;
        }
        if (!phone) {
            errors.phone = 'Phone number is required';
            isValid = false;
        }
        // Display errors
        Object.keys(errors).forEach(function (key) {
            var errorElement = document.getElementById("".concat(key, "Error"));
            if (errorElement) {
                errorElement.textContent = errors[key];
            }
        });
        return isValid;
    };
    ResumeBuilder.prototype.handleSubmit = function (e) {
        e.preventDefault();
        if (!this.validateForm()) {
            return;
        }
        this.collectFormData();
        this.updatePreview();
    };
    ResumeBuilder.prototype.collectFormData = function () {
        // Personal Information
        this.resume.personalInfo = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value
        };
        // Education
        this.resume.education = Array.from(document.querySelectorAll('.field-group'))
            .filter(function (group) { return group.querySelector('.education-school'); })
            .map(function (group) { return ({
            school: group.querySelector('.education-school').value,
            degree: group.querySelector('.education-degree').value,
            graduationYear: group.querySelector('.education-year').value,
            gpa: group.querySelector('.education-gpa').value
        }); });
        // Experience
        this.resume.experience = Array.from(document.querySelectorAll('.field-group'))
            .filter(function (group) { return group.querySelector('.experience-company'); })
            .map(function (group) { return ({
            company: group.querySelector('.experience-company').value,
            position: group.querySelector('.experience-position').value,
            startDate: group.querySelector('.experience-start').value,
            endDate: group.querySelector('.experience-end').value,
            description: group.querySelector('.experience-description').value
        }); });
        // Skills
        var skillsInput = document.getElementById('skills').value;
        this.resume.skills = skillsInput.split(',').map(function (skill) { return skill.trim(); }).filter(function (skill) { return skill; });
    };
    ResumeBuilder.prototype.updatePreview = function () {
        this.collectFormData();
        // Update personal information
        document.getElementById('previewName').textContent = this.resume.personalInfo.fullName;
        document.getElementById('previewContact').innerHTML = "\n            ".concat(this.resume.personalInfo.email, " | ").concat(this.resume.personalInfo.phone, "\n            ").concat(this.resume.personalInfo.location ? " | ".concat(this.resume.personalInfo.location) : '', "\n        ");
        // Update education
        var educationHTML = this.resume.education
            .map(function (edu) { return "\n                <div class=\"education-item\">\n                    <h3>".concat(edu.school, "</h3>\n                    <p>").concat(edu.degree, " - ").concat(edu.graduationYear, "</p>\n                    ").concat(edu.gpa ? "<p>GPA: ".concat(edu.gpa, "</p>") : '', "\n                </div>\n            "); })
            .join('');
        document.getElementById('previewEducation').innerHTML = educationHTML;
        // Update experience
        var experienceHTML = this.resume.experience
            .map(function (exp) { return "\n                <div class=\"experience-item\">\n                    <h3>".concat(exp.position, " at ").concat(exp.company, "</h3>\n                    <p>").concat(exp.startDate, " - ").concat(exp.endDate, "</p>\n                    <p>").concat(exp.description, "</p>\n                </div>\n            "); })
            .join('');
        document.getElementById('previewExperience').innerHTML = experienceHTML;
        // Update skills
        var skillsHTML = this.resume.skills
            .map(function (skill) { return "<span class=\"skill-tag\">".concat(skill, "</span>"); })
            .join('');
        document.getElementById('previewSkills').innerHTML = skillsHTML;
    };
    // Helper method to create error messages
    ResumeBuilder.prototype.showError = function (elementId, message) {
        var errorElement = document.getElementById("".concat(elementId, "Error"));
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = '#e74c3c';
        }
    };
    // Helper method to clear error messages
    ResumeBuilder.prototype.clearError = function (elementId) {
        var errorElement = document.getElementById("".concat(elementId, "Error"));
        if (errorElement) {
            errorElement.textContent = '';
        }
    };
    // Method to clear all form fields
    ResumeBuilder.prototype.clearForm = function () {
        var form = document.getElementById('resumeForm');
        form.reset();
        // Clear education fields
        var educationFields = document.getElementById('educationFields');
        if (educationFields) {
            educationFields.innerHTML = '';
            this.addEducationField(); // Add one empty education field
        }
        // Clear experience fields
        var experienceFields = document.getElementById('experienceFields');
        if (experienceFields) {
            experienceFields.innerHTML = '';
            this.addExperienceField(); // Add one empty experience field
        }
        // Clear preview
        this.resume = {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                location: ''
            },
            education: [],
            experience: [],
            skills: []
        };
        this.updatePreview();
    };
    // Method to validate email format
    ResumeBuilder.prototype.validateEmail = function (email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    // Method to validate phone format
    ResumeBuilder.prototype.validatePhone = function (phone) {
        var phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phone);
    };
    // Method to export resume as PDF (placeholder - actual PDF generation would require additional library)
    ResumeBuilder.prototype.exportPDF = function () {
        alert('PDF export functionality would be implemented here using a PDF generation library');
        // In a real implementation, you would use a library like jsPDF or html2pdf
        // to generate a PDF from the resume preview
    };
    return ResumeBuilder;
}());
// Initialize the Resume Builder
document.addEventListener('DOMContentLoaded', function () {
    var _a;
    var resumeBuilder = new ResumeBuilder();
    // Add export button functionality if needed
    var exportButton = document.createElement('button');
    exportButton.textContent = 'Export as PDF';
    exportButton.className = 'export-btn';
    exportButton.onclick = function () { return resumeBuilder.exportPDF(); };
    (_a = document.querySelector('.resume-preview')) === null || _a === void 0 ? void 0 : _a.appendChild(exportButton);
    // Add animation for form submission feedback
    var form = document.getElementById('resumeForm');
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', function () {
        var preview = document.querySelector('.resume-preview');
        preview === null || preview === void 0 ? void 0 : preview.classList.add('updated');
        setTimeout(function () {
            preview === null || preview === void 0 ? void 0 : preview.classList.remove('updated');
        }, 500);
    });
});
// Add these additional styles to the existing CSS
var additionalStyles = "\n    .export-btn {\n        margin-top: 20px;\n        background: #27ae60;\n    }\n\n    .export-btn:hover {\n        background: #2ecc71;\n    }\n\n    .updated {\n        animation: highlight 0.5s ease-out;\n    }\n\n    @keyframes highlight {\n        0% {\n            transform: scale(1);\n        }\n        50% {\n            transform: scale(1.02);\n        }\n        100% {\n            transform: scale(1);\n        }\n    }\n\n    .experience-item, .education-item {\n        margin-bottom: 15px;\n        padding-bottom: 15px;\n        border-bottom: 1px solid #eee;\n    }\n\n    .experience-item:last-child, .education-item:last-child {\n        border-bottom: none;\n    }\n\n    .experience-item h3, .education-item h3 {\n        color: #2c3e50;\n        margin-bottom: 5px;\n    }\n\n    .experience-item p, .education-item p {\n        color: #666;\n        line-height: 1.5;\n    }\n";
// Add styles to the document
var styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
// PDF Generation Function
function generatePDF() {
    // Get the resume preview element
    var element = document.getElementById('resumePreview');
    var exportButton = document.getElementById('exportPdf');
    // Add loading state
    exportButton.classList.add('loading');
    exportButton.textContent = 'Generating PDF...';
    // Configure PDF options
    var opt = {
        margin: [10, 10, 10, 10],
        filename: 'my_resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };
    // Generate PDF
    html2pdf().from(element).set(opt).save().then(function () {
        // Remove loading state
        exportButton.classList.remove('loading');
        exportButton.textContent = 'Export as PDF';
    }).catch(function (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
        exportButton.classList.remove('loading');
        exportButton.textContent = 'Export as PDF';
    });
}
// Add click event listener to export button
document.getElementById('exportPdf').addEventListener('click', generatePDF);
