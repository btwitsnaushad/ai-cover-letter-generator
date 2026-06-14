const API_URL = 'http://localhost:5000/api/generate';

// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const form = document.getElementById('coverLetterForm');
const submitBtn = document.getElementById('submitBtn');
const outputDiv = document.getElementById('output');
const themeToggle = document.getElementById('themeToggle');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

const DEFAULT_OUTPUT_TEXT = 'Your letter will appear here...';

// Helper Function: PDF से टेक्स्ट निकालने के लिए
async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText.trim();
}

// Handle Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const role = document.getElementById('role').value.trim();
    const company = document.getElementById('company').value.trim();
    const skills = document.getElementById('skills').value.trim();
    const resumeFile = document.getElementById('resumeUpload').files[0];

    // तगड़ा वैलिडेशन: या तो स्किल्स लिखो या रिज्यूमे अपलोड करो
    if (!skills && !resumeFile) {
        alert('Please either enter Key Skills OR upload a Resume PDF.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>⏳ Extracting & Generating...</span>`;
    outputDiv.innerText = 'Analyzing inputs and crafting your cover letter...';

    let resumeText = '';
    if (resumeFile) {
        try {
            outputDiv.innerText = 'Reading your Resume PDF... 📄';
            resumeText = await extractTextFromPDF(resumeFile);
        } catch (pdfError) {
            console.error('PDF parsing error:', pdfError);
            outputDiv.innerText = '❌ Failed to read the PDF file. Please check if it is corrupted.';
            submitBtn.disabled = false;
            submitBtn.innerText = 'Generate Cover Letter';
            return;
        }
    }

    // Prepare Payload
    const formData = { name, role, company, skills, resumeText };

    try {
        outputDiv.innerText = '🤖 AI is matching your resume profiles with target role...';
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.coverLetter) {
            outputDiv.innerText = data.coverLetter;
        } else {
            throw new Error(data.error || 'Failed to generate content.');
        }
    } catch (error) {
        outputDiv.innerHTML = `<span style="color: #ef4444; font-weight: 600;">❌ Error: ${error.message}</span>`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Generate Cover Letter';
    }
});

// Theme & Clipboard Utilities (Same as before)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') { document.body.classList.add('dark-theme'); }

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

copyBtn.addEventListener('click', async () => {
    const text = outputDiv.innerText;
    if (text && text !== DEFAULT_OUTPUT_TEXT && !text.includes('Error:')) {
        await navigator.clipboard.writeText(text);
        const orig = copyBtn.innerText; copyBtn.innerText = '✨ Copied!';
        setTimeout(() => copyBtn.innerText = orig, 2000);
    }
});

clearBtn.addEventListener('click', () => {
    form.reset();
    outputDiv.innerText = DEFAULT_OUTPUT_TEXT;
});
// ==========================================================================
// 6. PREMIUM DOWNLOAD UTILITY (DOCX FORMATTER)
// ==========================================================================
const downloadBtn = document.getElementById('downloadBtn');

downloadBtn.addEventListener('click', () => {
    const textToDownload = outputDiv.innerText;

    // वैलिडेशन: अगर आउटपुट खाली है या डिफ़ॉल्ट है तो डाउनलोड न हो
    if (!textToCopyValid(textToDownload)) {
        showTemporaryButtonState(downloadBtn, '⚠️ Nothing to Download!', '#ea580c');
        return;
    }

    // फ़ाइल का नाम डायनामिक बनाना (e.g., Company_Role_Cover_Letter.doc)
    const companyName = document.getElementById('company').value.trim() || 'Company';
    const jobRole = document.getElementById('role').value.trim() || 'Role';
    const fileName = `${companyName.replace(/\s+/g, '_')}_${jobRole.replace(/\s+/g, '_')}_Cover_Letter.doc`;

    try {
        // टेक्स्ट को Word Document फ़ॉर्मेट (HTML wrapper) में बदलना ताकि फ़ॉन्ट और स्पेसिंग सही रहे
        const baseHtml = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head><title>Cover Letter</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; font-size: 12pt; color: #333333; }
            p { margin-bottom: 12pt; white-space: pre-wrap; }
          </style>
          </head>
          <body>
            <div>${textToDownload.replace(/\n/g, '<br>')}</div>
          </body>
          </html>
        `;

        const blob = new Blob(['\ufeff' + baseHtml], {
            type: 'application/msword;charset=utf-8'
        });

        // डाउनलोड लिंक जनरेट करना और क्लिक ट्रिगर करना
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // क्लीनअप
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showTemporaryButtonState(downloadBtn, '📥 Downloaded!', '#10b981');
    } catch (err) {
        console.error('Download Error:', err);
        showTemporaryButtonState(downloadBtn, '❌ Download Failed!', '#ef4444');
    }
});

// हेल्पफुल वैलिडेशन चेकर फंक्शन (यदि पहले से नहीं बना है)
function textToCopyValid(text) {
    return text && text !== DEFAULT_OUTPUT_TEXT && !text.includes('Error:');
}