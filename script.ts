// Types
interface Education {
    school: string;
    degree: string;
    graduationYear: string;
    gpa?: string;
}

interface Experience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Resume {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
    };
    education: Education[];
    experience: Experience[];
    skills: string[];
}

// Form Handling
class ResumeBuilder {
    private resume: Resume = {
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

    private educationCount: number = 0;
    private experienceCount: number = 0;

    constructor() {
        this.initializeEventListeners();
        this.addEducationField();
        this.addExperienceField();
    }

    private initializeEventListeners(): void {
        // Form submission
        const form = document.getElementById('resumeForm') as HTMLFormElement;
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add education and experience buttons
        document.getElementById('addEducation')?.addEventListener('click', () => this.addEducationField());
        document.getElementById('addExperience')?.addEventListener('click', () => this.addExperienceField());

        // Real-time updates
        const personalFields = ['fullName', 'email', 'phone', 'location'];
        personalFields.forEach(field => {
            document.getElementById(field)?.addEventListener('input', () => this.updatePreview());
        });

        document.getElementById('skills')?.addEventListener('input', () => this.updatePreview());
    }

    private addEducationField(): void {
        const container = document.getElementById('educationFields');
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';
        fieldGroup.innerHTML = `
            <button type="button" class="remove-btn" onclick="this.parentElement.remove();">Remove</button>
            <label>School*</label>
            <input type="text" class="education-school" required>
            <label>Degree*</label>
            <input type="text" class="education-degree" required>
            <label>Graduation Year*</label>
            <input type="text" class="education-year" required>
            <label>GPA</label>
            <input type="text" class="education-gpa">
        `;
        container?.appendChild(fieldGroup);

        // Add event listeners for real-time updates
        fieldGroup.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });

        this.educationCount++;
    }

    private addExperienceField(): void {
        const container = document.getElementById('experienceFields');
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';
        fieldGroup.innerHTML = `
            <button type="button" class="remove-btn" onclick="this.parentElement.remove();">Remove</button>
            <label>Company*</label>
            <input type="text" class="experience-company" required>
            <label>Position*</label>
            <input type="text" class="experience-position" required>
            <label>Start Date*</label>
            <input type="text" class="experience-start" required>
            <label>End Date*</label>
            <input type="text" class="experience-end" required>
            <label>Description*</label>
            <textarea class="experience-description" required></textarea>
        `;
        container?.appendChild(fieldGroup);

        // Add event listeners for real-time updates
        fieldGroup.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });

        this.experienceCount++;
    }

    private validateForm(): boolean {
        let isValid = true;
        const errors: { [key: string]: string } = {};

        // Validate personal information
        const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;

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
        Object.keys(errors).forEach(key => {
            const errorElement = document.getElementById(`${key}Error`);
            if (errorElement) {
                errorElement.textContent = errors[key];
            }
        });

        return isValid;
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.collectFormData();
        this.updatePreview();
    }

    private collectFormData(): void {
        // Personal Information
        this.resume.personalInfo = {
            fullName: (document.getElementById('fullName') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            phone: (document.getElementById('phone') as HTMLInputElement).value,
            location: (document.getElementById('location') as HTMLInputElement).value
        };

        // Education
        this.resume.education = Array.from(document.querySelectorAll('.field-group'))
            .filter(group => group.querySelector('.education-school'))
            .map(group => ({
                school: (group.querySelector('.education-school') as HTMLInputElement).value,
                degree: (group.querySelector('.education-degree') as HTMLInputElement).value,
                graduationYear: (group.querySelector('.education-year') as HTMLInputElement).value,
                gpa: (group.querySelector('.education-gpa') as HTMLInputElement).value
            }));

        // Experience
        this.resume.experience = Array.from(document.querySelectorAll('.field-group'))
            .filter(group => group.querySelector('.experience-company'))
            .map(group => ({
                company: (group.querySelector('.experience-company') as HTMLInputElement).value,
                position: (group.querySelector('.experience-position') as HTMLInputElement).value,
                startDate: (group.querySelector('.experience-start') as HTMLInputElement).value,
                endDate: (group.querySelector('.experience-end') as HTMLInputElement).value,
                description: (group.querySelector('.experience-description') as HTMLTextAreaElement).value
            }));

        // Skills
        const skillsInput = (document.getElementById('skills') as HTMLTextAreaElement).value;
        this.resume.skills = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);
    }

    private updatePreview(): void {
        this.collectFormData();

        // Update personal information
        document.getElementById('previewName')!.textContent = this.resume.personalInfo.fullName;
        document.getElementById('previewContact')!.innerHTML = `
            ${this.resume.personalInfo.email} | ${this.resume.personalInfo.phone}
            ${this.resume.personalInfo.location ? ` | ${this.resume.personalInfo.location}` : ''}
        `;

        // Update education
        const educationHTML = this.resume.education
            .map(edu => `
                <div class="education-item">
                    <h3>${edu.school}</h3>
                    <p>${edu.degree} - ${edu.graduationYear}</p>
                    ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                </div>
            `)
            .join('');
        document.getElementById('previewEducation')!.innerHTML = educationHTML;

        // Update experience
        const experienceHTML = this.resume.experience
            .map(exp => `
                <div class="experience-item">
                    <h3>${exp.position} at ${exp.company}</h3>
                    <p>${exp.startDate} - ${exp.endDate}</p>
                    <p>${exp.description}</p>
                </div>
            `)
            .join('');
        document.getElementById('previewExperience')!.innerHTML = experienceHTML;

        // Update skills
        const skillsHTML = this.resume.skills
            .map(skill => `<span class="skill-tag">${skill}</span>`)
            .join('');
        document.getElementById('previewSkills')!.innerHTML = skillsHTML;
    }

    // Helper method to create error messages
    private showError(elementId: string, message: string): void {
        const errorElement = document.getElementById(`${elementId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = '#e74c3c';
        }
    }

    // Helper method to clear error messages
    private clearError(elementId: string): void {
        const errorElement = document.getElementById(`${elementId}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Method to clear all form fields
    public clearForm(): void {
        const form = document.getElementById('resumeForm') as HTMLFormElement;
        form.reset();

        // Clear education fields
        const educationFields = document.getElementById('educationFields');
        if (educationFields) {
            educationFields.innerHTML = '';
            this.addEducationField(); // Add one empty education field
        }

        // Clear experience fields
        const experienceFields = document.getElementById('experienceFields');
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
    }

    // Method to validate email format
    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Method to validate phone format
    private validatePhone(phone: string): boolean {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Method to export resume as PDF (placeholder - actual PDF generation would require additional library)
    public exportPDF(): void {
        alert('PDF export functionality would be implemented here using a PDF generation library');
        // In a real implementation, you would use a library like jsPDF or html2pdf
        // to generate a PDF from the resume preview
    }
}

// Initialize the Resume Builder
document.addEventListener('DOMContentLoaded', () => {
    const resumeBuilder = new ResumeBuilder();

    // Add export button functionality if needed
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export as PDF';
    exportButton.className = 'export-btn';
    exportButton.onclick = () => resumeBuilder.exportPDF();
    document.querySelector('.resume-preview')?.appendChild(exportButton);

    // Add animation for form submission feedback
    const form = document.getElementById('resumeForm');
    form?.addEventListener('submit', () => {
        const preview = document.querySelector('.resume-preview');
        preview?.classList.add('updated');
        setTimeout(() => {
            preview?.classList.remove('updated');
        }, 500);
    });
});

// Add these additional styles to the existing CSS
const additionalStyles = `
    .export-btn {
        margin-top: 20px;
        background: #27ae60;
    }

    .export-btn:hover {
        background: #2ecc71;
    }

    .updated {
        animation: highlight 0.5s ease-out;
    }

    @keyframes highlight {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
        100% {
            transform: scale(1);
        }
    }

    .experience-item, .education-item {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }

    .experience-item:last-child, .education-item:last-child {
        border-bottom: none;
    }

    .experience-item h3, .education-item h3 {
        color: #2c3e50;
        margin-bottom: 5px;
    }

    .experience-item p, .education-item p {
        color: #666;
        line-height: 1.5;
    }
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);



        // PDF Generation Function
        function generatePDF() {
            // Get the resume preview element
            const element = document.getElementById('resumePreview');
            const exportButton = document.getElementById('exportPdf');
            
            // Add loading state
            exportButton.classList.add('loading');
            exportButton.textContent = 'Generating PDF...';

            // Configure PDF options
            const opt = {
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
            html2pdf().from(element).set(opt).save().then(() => {
                // Remove loading state
                exportButton.classList.remove('loading');
                exportButton.textContent = 'Export as PDF';
            }).catch(error => {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
                exportButton.classList.remove('loading');
                exportButton.textContent = 'Export as PDF';
            });
        }

        // Add click event listener to export button
        document.getElementById('exportPdf').addEventListener('click', generatePDF);


