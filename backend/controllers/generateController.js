import { generateCoverLetterService } from '../services/geminiService.js';
import { buildCoverLetterPrompt } from '../utils/promptBuilder.js';

export const generateCoverLetterController = async (req, res, next) => {
    try {
        const { name, role, company, skills, resumeText } = req.body;

        if (!name || !role || !company) {
            return res.status(400).json({ 
                error: 'Validation Failed: Name, Role, and Company are required.' 
            });
        }

        // प्रॉम्प्ट बिल्डर को नया डेटा सप्लाई करना
        const optimizedPrompt = buildCoverLetterPrompt({ name, role, company, skills, resumeText });

        const coverLetter = await generateCoverLetterService(optimizedPrompt);

        return res.status(200).json({ coverLetter });

    } catch (error) {
        console.error('❌ Controller Layer Error:', error);
        next(error);
    }
};