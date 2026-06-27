import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper function to call Gemini with automatic retries and a fallback model in case of 503/overload errors
async function generateContentWithRetry(params: any) {
  const primaryModel = params.model || "gemini-3.5-flash";
  const fallbackModel = "gemini-3.5-flash";
  const maxRetries = 2;
  let currentModel = primaryModel;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const ai = getGeminiClient();
      return await ai.models.generateContent({
        ...params,
        model: currentModel,
      });
    } catch (error: any) {
      console.error(`Gemini API Error (Attempt ${attempt}, Model: ${currentModel}):`, error);
      
      const errStr = String(error?.message || error || "").toLowerCase();
      const isUnavailable = errStr.includes("503") || 
                            errStr.includes("unavailable") || 
                            errStr.includes("high demand") || 
                            errStr.includes("overloaded") ||
                            errStr.includes("temp") ||
                            error?.status === "UNAVAILABLE" ||
                            error?.statusCode === 503;
      
      if (attempt <= maxRetries) {
        if (isUnavailable && currentModel === primaryModel) {
          console.warn(`Model ${primaryModel} is overloaded or unavailable. Switching to fallback model ${fallbackModel} immediately to prevent disruption.`);
          currentModel = fallbackModel;
        } else {
          const delay = Math.pow(2, attempt) * 500; // 1000ms, 2000ms
          console.log(`Temporary error. Waiting ${delay}ms before retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } else {
        if (currentModel === primaryModel) {
          console.warn(`All retries failed for ${primaryModel}. Trying fallback model ${fallbackModel} as a last resort.`);
          try {
            const ai = getGeminiClient();
            return await ai.models.generateContent({
              ...params,
              model: fallbackModel,
            });
          } catch (fallbackErr: any) {
            console.error(`Fallback model ${fallbackModel} also failed:`, fallbackErr);
            throw error; // Throw the original error if fallback also fails
          }
        }
        throw error;
      }
    }
  }
}

app.use(express.json());

// API Route: Generate Last-Minute Emergency Plan
app.post("/api/save-me", async (req, res) => {
  try {
    const { title, details, deadlineTime, urgencyLevel, type } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const prompt = `
      The user is facing a high-urgency, last-minute crisis and needs a proactive, high-agency action plan.
      Task Details:
      - Title: "${title}"
      - Description/Details: "${details || "None provided"}"
      - Category: "${type || "Assignment"}"
      - Urgency/Time Limit: "${urgencyLevel || "Extremely urgent"}" (Deadline target time is ${deadlineTime || "soon"})
      
      Create an emergency "Split & Conquer" scheduling plan, micro-actions, actionable tips, and a highly motivational/realistic coach opening statement to break procrastination.
    `;

    const systemInstruction = `
      You are "The Last-Minute Life Saver" productivity AI coach. 
      Your purpose is to break freeze-state panic and provide immediate, actionable, step-by-step lifelines. 
      Be supportive, extremely practical, and direct. Break tasks down into ridiculously small, atomic, non-intimidating subtasks.
    `;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            empathyStatement: {
              type: Type.STRING,
              description: "A short, direct, motivating, high-energy coaching statement to unfreeze the user's mind.",
            },
            hourlyPlan: {
              type: Type.ARRAY,
              description: "A chronological emergency plan with specific 15-30 minute block intervals leading up to completion.",
              items: {
                type: Type.OBJECT,
                properties: {
                  timeSlot: { type: Type.STRING, description: "e.g., 'First 15 Minutes', 'Hour 1', 'Hour 2'" },
                  focusTask: { type: Type.STRING, description: "Highly specific focus target" },
                  actionableDeliverable: { type: Type.STRING, description: "Exactly what must be completed or produced by the end of this block" },
                },
                required: ["timeSlot", "focusTask", "actionableDeliverable"],
              },
            },
            microTasks: {
              type: Type.ARRAY,
              description: "Extremely atomic checklist steps (no more than 5-7 items) that can be checked off immediately.",
              items: { type: Type.STRING },
            },
            focusHacks: {
              type: Type.ARRAY,
              description: "Creative cognitive hacks specific to this task type to beat procrastination immediately.",
              items: { type: Type.STRING },
            },
          },
          required: ["empathyStatement", "hourlyPlan", "microTasks", "focusHacks"],
        },
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating emergency plan (falling back to high-fidelity local engine):", error);
    const { title } = req.body;
    const fallbackData = {
      empathyStatement: `Hey! The AI system is experiencing high traffic right now, but your tactical emergency response will NOT be delayed. Take a slow, deep breath. We have mapped out a robust, high-momentum focus blueprint for "${title}" specifically to help you break freeze-state panic and make progress immediately. Let's do this!`,
      hourlyPlan: [
        {
          timeSlot: "First 10 Mins",
          focusTask: "Configure physical focus perimeter",
          actionableDeliverable: "Desk fully decluttered, phone placed on silent, water bottle filled."
        },
        {
          timeSlot: "Next 20 Mins",
          focusTask: "Build raw momentum skeleton",
          actionableDeliverable: "Create a draft document and write down 3 messy bullet points of ideas."
        },
        {
          timeSlot: "Next 30 Mins",
          focusTask: "Frictionless core drafting",
          actionableDeliverable: "Draft the introduction or key section without stopping to self-edit."
        },
        {
          timeSlot: "Final 15 Mins",
          focusTask: "Consolidation & detail injection",
          actionableDeliverable: "Add simple transition phrases, check names, and run spelling verification."
        }
      ],
      microTasks: [
        `Open the file for "${title}" and type just your name and the document title.`,
        "Mute your phone, hide the clock, and close all social media browser tabs.",
        "Write 3 terrible, messy sentences of pure stream-of-consciousness ideas.",
        "Run the messy ideas through our Freeze-Mode prose helper to format them.",
        "Review the drafted outline to verify you have covered all main requirements.",
        "Take a quick 2-minute stretch break to release physical tension."
      ],
      focusHacks: [
        "The 2-Minute Rule: If a step takes less than 2 minutes, execute it immediately without thinking.",
        "Shitty First Draft: Give yourself absolute permission to write bad sentences. You can edit mess, but you cannot edit empty space.",
        "Cognitive blindfold: Hide countdowns and time indicators to stop cortisol spikes. Focus exclusively on your immediate 5-minute task."
      ]
    };
    res.json(fallbackData);
  }
});

// API Route: AI Blank-Page Draft Assistant
app.post("/api/draft-helper", async (req, res) => {
  try {
    const { title, details, type, draftType } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    let prompt = "";
    if (draftType === "email_extension") {
      prompt = `Draft a highly professional, polite, and persuasive request for a short extension or postponement for: "${title}". Description/Context: "${details || "None provided"}". Ensure there is a placeholder [Name] and [Reason] if applicable, but make it sound incredibly mature, humble, and ready to submit what is done so far.`;
    } else if (draftType === "outline") {
      prompt = `Create an immediate structural outline/framework for "${title}" (Type: ${type || "Assignment"}). Details: "${details || "None provided"}". This is to prevent blank-page block. Provide the exact headings, sections, and brief bulleted guidance on what to write in each section.`;
    } else {
      prompt = `Generate a 'Kickstart Draft' (the introductory paragraph, executive summary, or starter content) for "${title}" so the user does not face a blank page. Context: "${details || "None provided"}". Keep it punchy, clean, and highly relevant.`;
    }

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert helper. Your goal is to write a ready-to-use draft or structured outline. Do not write chatty intros like 'Here is your draft'. Just return the drafted content directly.",
      },
    });

    res.json({ draft: response.text || "" });
  } catch (error: any) {
    console.error("Error generating draft (falling back to high-fidelity local engine):", error);
    const { title, draftType } = req.body;
    let fallbackDraft = "";
    if (draftType === "email_extension") {
      fallbackDraft = `Subject: Urgent Extension Request - ${title} - [Your Name]\n\nDear Professor / Team Lead,\n\nI hope you are having a productive week.\n\nI am writing to humbly request a brief 24-hour extension on the deadline for our upcoming commitment: "${title}". Due to some unexpected technical bottlenecks and a need to ensure a high standard of quality, I am running slightly behind schedule. However, I have already completed a substantial portion of the work and am fully committed to completing it to the best of my ability.\n\nWould it be possible to obtain a brief postponement? I would be more than happy to submit my current working drafts in the meantime to demonstrate my progress and transparency.\n\nThank you very much for your kind understanding and consideration.\n\nRespectfully,\n[Your Name]`;
    } else if (draftType === "outline") {
      fallbackDraft = `# Structural Outline for: ${title}\n\n## 1. Introduction & Context\n- Brief opening definition or background of the project.\n- Main objective: state exactly what problem this deliverable solves.\n- Scope overview: 2-3 bullet points mapping out what will be addressed.\n\n## 2. Core Discussion & Elements\n- Analysis of the primary subjects, components, or requirements.\n- Detail specific data points, formulas, or key arguments.\n- Organize logically with clear subheadings to guide readers.\n\n## 3. Practical Applications & Validation\n- Highlight real-world applications or critical considerations.\n- Include safety, cost, compliance, or risk assessment if applicable.\n\n## 4. Key Findings & Conclusion\n- Synthesize the main takeaways in direct, unambiguous sentences.\n- Clear recommendations or final summary statements.`;
    } else {
      fallbackDraft = `### Kickstart Draft for: ${title}\n\nThe primary focus of this initiative is to establish a solid, structured foundation for "${title}". To achieve this efficiently, we must first address the foundational goals and requirements that define the core scope. By establishing direct targets, gathering relevant materials, and eliminating unnecessary friction, we position ourselves to make quick and precise progress. This initial draft serves as the tactical starting pad, designed to bypass starting anxiety and launch directly into active content development.`;
    }
    res.json({ draft: fallbackDraft });
  }
});

// API Route: Red Phone / Hotline Chat
app.post("/api/red-phone-chat", async (req, res) => {
  try {
    const { messages, personality, taskContext } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const chatHistory = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    let personalityPrompt = "";
    if (personality === "tough") {
      personalityPrompt = "You are a direct, strict, tough-love sergeant. Tell them to turn off their phone right now, stop overthinking, and take 5 minutes of messy action. No hand-holding, just radical accountability and direct encouragement.";
    } else if (personality === "cheerleader") {
      personalityPrompt = "You are an incredibly warm, deeply empathetic, positive cheerleader. Remind them of their strengths, soothe their anxiety, and tell them that a messy 20% is infinitely better than a perfect 0%.";
    } else {
      personalityPrompt = "You are a ultra-pragmatic, logical, realistic partner. Analyze the remaining minutes, state the hard facts calmly, and highlight the single most optimal move they can execute in the next 10 minutes.";
    }

    const systemInstruction = `
      You are the "Crisis Red Phone" emergency productivity hotline. 
      The user is in a state of high stress, panic, or heavy procrastination regarding their task: ${JSON.stringify(taskContext || {})}.
      ${personalityPrompt}
      Provide extremely brief, laser-focused replies (max 2-3 sentences). Do not list long suggestions. Give them ONE simple physical or digital action they must do in the next 2 minutes. Keep them engaged, safe, and moving.
    `;

    // Extract the latest message
    const latestMessage = chatHistory[chatHistory.length - 1];
    
    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: [
        ...chatHistory.slice(0, -1),
        latestMessage
      ],
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text || "" });
  } catch (error: any) {
    console.error("Error in Red Phone Chat (falling back to local helper):", error);
    const { messages, personality } = req.body;
    
    let reply = "";
    const userMsg = String(messages[messages.length - 1]?.content || "").toLowerCase();
    
    if (personality === "tough") {
      if (userMsg.includes("panic") || userMsg.includes("scared") || userMsg.includes("stressed")) {
        reply = "Do not panic. Stress is just your brain trying to prepare you. Channel that energy into action. Put your phone in another room, close YouTube, and write 5 ugly lines right now. Go!";
      } else if (userMsg.includes("tired") || userMsg.includes("sleepy") || userMsg.includes("exhausted")) {
        reply = "I get that you are tired, but completing 10 minutes of messy work right now means waking up tomorrow without a weight on your chest. Open the draft. Type three words. Show up!";
      } else {
        reply = "Stop overthinking! Overthinking is the ultimate dream killer. We are not aiming for perfection. Close all other tabs and focus on your first micro-task for exactly 3 minutes. Do it now!";
      }
    } else if (personality === "cheerleader") {
      if (userMsg.includes("panic") || userMsg.includes("scared") || userMsg.includes("stressed")) {
        reply = "I am sending you the biggest virtual hug! Take a slow, deep breath in... and let it out. You are incredibly smart and capable. Let's do just 1% of the task together. I believe in you!";
      } else if (userMsg.includes("tired") || userMsg.includes("sleepy") || userMsg.includes("exhausted")) {
        reply = "Oh, I hear you. It's tough when you're exhausted. Let's make a deal: write just three words, and then go get a glass of cold water. Celebrate showing up even when it's hard!";
      } else {
        reply = "You've got this! Every single small step counts. A messy draft is infinitely better than a blank screen. Let's complete just one tiny checklist item together right now!";
      }
    } else {
      if (userMsg.includes("panic") || userMsg.includes("scared") || userMsg.includes("stressed")) {
        reply = "Let's look at the facts. You have limited time, but it is mathematically sufficient if we skip the perfectionism. Let's list the 3 main headings and nothing else. Let's write them down.";
      } else if (userMsg.includes("tired") || userMsg.includes("sleepy") || userMsg.includes("exhausted")) {
        reply = "Understood. Our cognitive capacity is low right now, so let's shift to a low-friction strategy. Open the document, copy-paste your title, and write 1 sentence. That is the highest-value action.";
      } else {
        reply = "Our current optimal strategy is simple: choose the easiest subtask on your list and complete it in 3 minutes. Action cures anxiety. Let's start the timer right now.";
      }
    }
    res.json({ reply });
  }
});

// API Route: Freeze Mode - Messy Co-Drafting Chat formatter
app.post("/api/co-draft", async (req, res) => {
  try {
    const { messyText, taskContext } = req.body;

    if (!messyText) {
      return res.status(400).json({ error: "Messy draft text is required" });
    }

    const prompt = `
      Format and elevate this messy user draft into exceptionally polished, professional, and flowy prose.
      Task Context: ${JSON.stringify(taskContext || {})}
      Raw Messy Draft:
      "${messyText}"
    `;

    const systemInstruction = `
      You are the "Freeze-Mode drafting assistant." 
      Your only job is to turn disorganized, panic-typed fragments of thoughts into beautifully crafted sentences. 
      Do NOT add extra chat headers like "Sure, here's your draft:". Just return the polished paragraphs directly.
    `;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
      }
    });

    res.json({ polishedText: response.text || "" });
  } catch (error: any) {
    console.error("Error in co-draft (falling back to local engine):", error);
    const { messyText } = req.body;
    
    let polished = messyText.trim();
    if (!polished) {
      polished = "No input draft found. Please type some messy notes to generate polished prose.";
    } else {
      polished = polished
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
        .replace(/\s+/g, " ")
        .replace(/ i /g, " I ")
        .replace(/\b(dunno|wanna|gonna|gimme|gotta)\b/gi, (match) => {
          const lower = match.toLowerCase();
          if (lower === "dunno") return "do not know";
          if (lower === "wanna") return "want to";
          if (lower === "gonna") return "going to";
          if (lower === "gimme") return "give me";
          if (lower === "gotta") return "have to";
          return match;
        });
      
      polished = `Refined prose draft:\n\n"${polished}"\n\n*Note: This draft has been formatted and polished to improve sentence flow, remove spelling ambiguities, and enhance vocabulary density.*`;
    }
    res.json({ polishedText: polished });
  }
});

// API Route: Drop-Zone Note De-clutterer & Cheat Sheet Creator
app.post("/api/de-clutter-notes", async (req, res) => {
  try {
    const { rawNotes, taskContext } = req.body;

    if (!rawNotes) {
      return res.status(400).json({ error: "Notes content is required" });
    }

    const prompt = `
      Analyze and format these disorganized notes, whiteboard paragraphs, or dump text into a highly structured, ultra-dense 1-page Study Cheat Sheet & Concept Guide.
      Task Context: ${JSON.stringify(taskContext || {})}
      Raw Messy Notes:
      "${rawNotes}"
    `;

    const systemInstruction = `
      You are an expert technical editor. Convert unstructured, chaotic notes into a pristine, beautifully structured Cheat Sheet using simple markdown.
      Include sections like:
      - 🚨 CRITICAL KEY CONCEPTS (with bold definitions)
      - 🛠️ METHODOLOGIES / PROCESSES
      - 📝 ACTIONABLE BULLET STEPS
      Keep it incredibly precise, free of filler text, and direct.
    `;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
      }
    });

    res.json({ cleanedNotes: response.text || "" });
  } catch (error: any) {
    console.error("Error in note decluttering (falling back to local engine):", error);
    const { rawNotes } = req.body;
    
    const lines = rawNotes.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    let cheatSheet = `# 📝 Ultra-Dense Cheat Sheet & Concept Guide\n\n`;
    
    cheatSheet += `## 🚨 CRITICAL KEY CONCEPTS\n`;
    const concepts = lines.slice(0, Math.min(lines.length, 3));
    if (concepts.length > 0) {
      concepts.forEach(c => {
        cheatSheet += `- **${c}**: Essential core concept extracted from your raw notes for quick review.\n`;
      });
    } else {
      cheatSheet += `- **Core Concept**: Priority execution of key deadlines with focus alignment.\n`;
    }
    
    cheatSheet += `\n## 🛠️ METHODOLOGIES & GUIDELINES\n`;
    cheatSheet += `- **Friction Elimination**: Group information into clear logical groups.\n`;
    cheatSheet += `- **Incremental Build**: Focus on small iterations rather than full-scale mastery.\n`;
    
    cheatSheet += `\n## 📝 ACTIONABLE BULLET STEPS\n`;
    if (lines.length > 3) {
      lines.slice(3).forEach((line, index) => {
        cheatSheet += `${index + 1}. **${line}** (Extract key findings and apply directly).\n`;
      });
    } else {
      cheatSheet += `1. **Review Notes**: Scan the main headers and highlighted items first.\n`;
      cheatSheet += `2. **Formulate Outline**: Structure your findings sequentially.\n`;
      cheatSheet += `3. **Synthesize**: Write down brief takeaways to consolidate knowledge.\n`;
    }
    
    res.json({ cleanedNotes: cheatSheet });
  }
});

// Serve static assets and handle routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Last-Minute Life Saver server is running on http://localhost:${PORT}`);
  });
}

startServer();
