const express = require('express');
const axios = require('axios');
const { genkit, z } = require('genkit');
const { googleAI, gemini15Pro } = require('@genkit-ai/googleai');

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Pro,
});

const app = express();
app.use(express.json());

// Orchestrator Flow: Negotiates between multiple intersections
const cityOrchestrationFlow = ai.defineFlow(
  {
    name: 'cityOrchestrationFlow',
    inputSchema: z.object({
      cityRegion: z.string(),
      intersections: z.array(z.object({
        id: z.string(),
        url: z.string(),
        lastState: z.any(),
      })),
      externalFactors: z.object({
        floodWarnings: z.boolean(),
        publicEvents: z.array(z.string()),
      }),
    }),
    outputSchema: z.object({
      globalStrategy: z.string(),
      overrides: z.array(z.object({
        intersectionId: z.string(),
        command: z.string(),
        reason: z.string(),
      })),
      rejectedStrategy: z.string(),
    }),
  },
  async (input) => {
    // 1. Gather all local agent decisions (Simulated for this hackathon demo)
    const localDecisions = input.intersections.map(i => i.lastState);

    const prompt = `
      You are the WiraLalu City Orchestrator (Gemini Pro) for ${input.cityRegion}.
      You oversee multiple Intersection Agents (Gemini Flash).
      
      LOCAL DECISIONS:
      ${JSON.stringify(localDecisions)}
      
      EXTERNAL FACTORS:
      - Flood Warnings: ${input.externalFactors.floodWarnings}
      - Events: ${input.externalFactors.publicEvents.join(', ')}
      
      TASK:
      1. Review local decisions for conflicts (e.g., two neighbors creating a gridlock).
      2. If a flood is detected, override local logic to force traffic away from low ground.
      3. Create a "Global Strategy" for the next 15 minutes.
      4. Provide a "rejectedStrategy" - what was the runner-up approach?
      
      Output in JSON.
    `;

    const { output } = await ai.generate({
      prompt,
      output: { format: 'json', schema: cityOrchestrationFlow.outputSchema },
    });

    return output;
  }
);

app.get('/', (req, res) => {
  res.send('WiraLalu City Orchestrator is ONLINE. Use POST /orchestrate to interact.');
});

app.post('/orchestrate', async (req, res) => {
  try {
    const result = await cityOrchestrationFlow(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WiraLalu City Orchestrator ${PORT} is active.`);
});
