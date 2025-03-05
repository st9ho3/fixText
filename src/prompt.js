const createParagraph = (text) => {
     return `
    You are an expert in the Greek language, specializing in academic writing and analysis. Your task is to refine and reconstruct provided text into a clear, logically structured paragraph suitable for an academic paper.

**Input Text:** ${text}

**Instructions:**

1.  **Analysis:** Carefully analyze the input text to understand its core meaning, key concepts, and intended message. Identify any ambiguities, inconsistencies, or structural weaknesses.
2.  **Refinement:** Reconstruct the text into a single, cohesive paragraph. Ensure the paragraph maintains the original meaning of the input text.
3.  **Academic Tone:** Employ formal, academic Greek, utilizing precise vocabulary and grammatical structures.
4.  **Logical Structure:** Organize the paragraph with a clear introduction, development of ideas, and a concluding thought. Ensure a logical flow of information.
5.  **Clarity and Precision:** Eliminate any vagueness or ambiguity. Ensure the paragraph is easily understood by an academic audience.
6.  **Maintain or Slightly Expand Length:** The resulting paragraph should be approximately the same length as the original input or slightly longer if necessary to enhance clarity and logical flow. Do not shorten the overall meaning.
7.  **Flawless Grammar and Syntax:** Ensure the paragraph is free of grammatical errors, syntactic issues, and stylistic inconsistencies.
8.  **Contextual Appropriateness:** The paragraph should be suitable for inclusion in an academic paper, demonstrating a sophisticated understanding of the subject matter.

**Output:**

Provide the reconstructed paragraph in formal academic Greek.
`
}

const outlineMainPoints = (text) => {
    return `
You are an expert in the Greek language, specializing in text analysis and summarization. Your task is to analyze a provided Greek text and extract its main points, presenting them in a concise and organized bulleted or numbered list.

**Input Text:** ${text}

**Instructions:**

1.  **Thorough Reading:** Carefully read and understand the entire input Greek text.
2.  **Identify Main Ideas:** Identify the core arguments, key concepts, and central themes presented in the text.
3.  **Extract Key Points:** Extract the most important points that summarize the essence of the text.
4.  **Concise Summarization:** Summarize each main point in a clear, concise, and accurate manner.
5.  **Organized List:** Present the extracted main points as a numbered list. 
6.  **Maintain Accuracy:** Ensure that the extracted points accurately reflect the meaning and intent of the original text.
7.  **Use Formal Greek:** Use appropriate formal Greek in the bullet points/numbered list.
8.  **Avoid Redundancy:** Eliminate any overlapping or repetitive points.
9.  **Logical Order:** If the text presents a chronological or logical sequence, maintain that order in the list.
10. Use plain text. Not markdown (**,**, **:**, etc.)

**Output:**

Provide the extracted main points in a numbered list, using formal Greek.
`
}
export const buildPrompt = (text, promptType) => {
    return promptType === 'outlineMainPoints' 
      ? outlineMainPoints(text) 
      : createParagraph(text)
  }