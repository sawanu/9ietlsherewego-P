import { GoogleGenAI, Type } from "@google/genai";
import { VocabCard, CategoryId, DifficultyLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVocabulary = async (
  category: CategoryId, 
  topicLabel: string,
  difficulty: DifficultyLevel,
  excludeWords: string[] = []
): Promise<VocabCard[]> => {
  const model = "gemini-2.5-flash";
  
  // Customizing prompt based on category to ensure relevance
  let contextInstruction = "";
  if (category === CategoryId.DAILY) {
    contextInstruction = "Topic: Daily Life / Casual. Focus on vocabulary used by native speakers in daily life (Travel, Food, Lifestyle).";
  } else {
    // WORK_SCHOOL covers both Marketing and General Business
    contextInstruction = "Topic: Professional Work & Academic Environment. Focus on formal vocabulary suitable for Marketing, Business Management, and Office communication.";
  }

  // Define band-specific instructions
  let bandInstruction = "";
  switch (difficulty) {
    case DifficultyLevel.EASY:
      bandInstruction = "LEVEL: IELTS Band 0 - 5.0 (Basic/Elementary). Provide simple, foundational words.";
      break;
    case DifficultyLevel.MEDIUM:
      bandInstruction = "LEVEL: IELTS Band 5.0 - 7.0 (Intermediate). Provide common academic or business words useful for general communication.";
      break;
    case DifficultyLevel.HARD:
      bandInstruction = "LEVEL: IELTS Band 7.0 - 9.0 (Advanced/Proficiency). Provide sophisticated, nuanced, or C1/C2 level words found in high-level texts.";
      break;
  }

  // Format excluded words for the prompt
  const exclusionNote = excludeWords.length > 0 
    ? `3. ANTI-REPETITION: DO NOT generate any of the following words: ${excludeWords.join(", ")}.`
    : "";

  const prompt = `
    Role: You are 'Gemini IELTS Coach', a personal vocabulary trainer for Yune. 
    Goal: Help Yune reach the target IELTS Band based on the difficulty selection.

    Task: Create a vocabulary list for the Topic: "${topicLabel}".
    
    CRITICAL RULES:
    1. ${bandInstruction}
    2. CONTEXT: ${contextInstruction}
    ${exclusionNote}
    4. QUANTITY: Generate exactly 5 words.

    For each item, provide:
    - word: The vocabulary term.
    - pronunciation: IPA transcription.
    - definition: Clear English definition (appropriate for the band level).
    - vietnameseMeaning: Accurate Vietnamese meaning.
    - example: A sentence showing usage.
    - exampleVietnamese: Vietnamese translation of the example.
    - wordFamily: Related forms (e.g., Noun, Verb, Adj).
    - collocations: List 2-3 common collocations.
    - synonyms: List 2 synonyms appropriate for the level.
    - distractors: 3 other random words related to the topic (for quiz generation).
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              pronunciation: { type: Type.STRING },
              definition: { type: Type.STRING },
              vietnameseMeaning: { type: Type.STRING },
              example: { type: Type.STRING },
              exampleVietnamese: { type: Type.STRING },
              wordFamily: { type: Type.STRING },
              collocations: { type: Type.ARRAY, items: { type: Type.STRING } },
              synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
              distractors: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["word", "pronunciation", "definition", "vietnameseMeaning", "example", "exampleVietnamese", "distractors"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Transform and shuffle options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawData.map((item: any, index: number) => {
      const options = [...(item.distractors || []), item.word];
      // Shuffle options using Fisher-Yates
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      return {
        id: `vocab-${index}-${Date.now()}`,
        word: item.word,
        pronunciation: item.pronunciation,
        definition: item.definition,
        vietnameseMeaning: item.vietnameseMeaning,
        example: item.example,
        exampleVietnamese: item.exampleVietnamese,
        wordFamily: item.wordFamily,
        collocations: item.collocations,
        synonyms: item.synonyms,
        quizOptions: options
      };
    });

  } catch (error) {
    console.error("Error generating vocabulary:", error);
    // Fallback data
    return [
      {
        id: 'error-1',
        word: 'Resilience',
        pronunciation: '/rɪˈzɪliəns/',
        definition: 'The capacity to recover quickly from difficulties; toughness.',
        vietnameseMeaning: 'Sự kiên cường',
        example: 'Building resilience is crucial for navigating the uncertainties of the modern market.',
        exampleVietnamese: 'Xây dựng sự kiên cường là rất quan trọng để điều hướng những điều không chắc chắn của thị trường hiện đại.',
        wordFamily: 'Resilient (adj), Resiliently (adv)',
        collocations: ['Build resilience', 'Show resilience'],
        synonyms: ['Toughness', 'Adaptability'],
        quizOptions: ['Resilience', 'Weakness', 'Fragility', 'Inability']
      }
    ];
  }
};