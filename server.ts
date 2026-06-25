import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function generateContentWithRetry(params: any) {
  const primaryModel = params.model || "gemini-2.5-flash";
  const fallbackModel = "gemini-1.5-flash";
  const maxRetries = 2;
  let currentModel = primaryModel;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
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
          const delay = Math.pow(2, attempt) * 500;
          console.log(`Temporary error. Waiting ${delay}ms before retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } else {
        if (currentModel === primaryModel) {
          console.warn(`All retries failed for ${primaryModel}. Trying fallback model ${fallbackModel} as a last resort.`);
          try {
            return await ai.models.generateContent({
              ...params,
              model: fallbackModel,
            });
          } catch (fallbackErr: any) {
            console.error(`Fallback model ${fallbackModel} also failed:`, fallbackErr);
            throw error;
          }
        }
        throw error;
      }
    }
  }
}

app.use(express.json());

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
      model: "gemini-2.5-flash", 
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
        "Shitty First Draft: Give yourself absolute permission to write poorly first, then edit later."
      ]
    };
    res.json(fallbackData);
  }
});

// FIXED: Adjusted static serving paths because server.cjs is bundled inside the dist directory
const publicPath = path.join(__dirname);
app.use(express.static(publicPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server is operating on port ${PORT}`);
});
