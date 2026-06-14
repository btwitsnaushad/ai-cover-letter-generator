/**
 * Generates an ultra-tailored prompt analyzing both manual skills and parsed Resume text.
 */
export const buildCoverLetterPrompt = ({ name, role, company, skills, resumeText }) => {
    let backgroundInfo = ``;

    if (skills) backgroundInfo += `\n- Manually Provided Skills: ${skills}`;
    if (resumeText) backgroundInfo += `\n- Extracted Resume Raw Content:\n\"\"\"\n${resumeText}\n\"\"\"`;

    return `
You are an elite executive career writer. Write a compelling, highly customized cover letter.

Candidate Metadata:
- Name: ${name}
- Target Role: ${role}
- Target Company: ${company}
${backgroundInfo}

Strict Execution Directives:
1. Deep Analysis: Carefully scan the Provided Skills and/or Extracted Resume Content above. Extract relevant work history, tech stacks, or key projects that perfectly align with a ${role} position.
2. Structure: Start directly with a modern professional greeting like "Dear Hiring Team at ${company},".
3. Value Proposition: Do not just list skills. Explain how the candidate's background enables them to hit the ground running and solve challenges for ${company}.
4. Zero Placeholders: Absolutely no bracketed text like '[Insert Date]', '[Phone]', or '[Manager Name]'. 
5. Output Cleanliness: Provide raw markdown-free or clean-spaced text ready to be instantly copied into a document.
`;
};