const express = require('express');
const { genkit, z } = require('genkit');
const { googleAI, gemini15Flash } = require('@genkit-ai/googleai');

// Initialize Genkit with Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

const app = express();
app.use(express.json());

// The Agentic Loop Flow
const intersectionFlow = ai.defineFlow(
  {
    name: 'intersectionFlow',
    inputSchema: z.object({
      intersectionId: z.string(),
      sensorData: z.object({
        carCount: z.number(),
        motorcycleCount: z.number(),
        emergencyVehicleDetected: z.boolean(),
        busDelayed: z.boolean(),
        floodRisk: z.number(), // 0 to 1
      }),
      neighboringStates: z.array(z.any()).optional(),
    }),
    outputSchema: z.object({
      action: z.enum(['EXTEND_GREEN', 'FORCE_RED', 'MAINTAIN', 'EMERGENCY_CLEAR']),
      reasoning: z.string(),
      rejectedAlternative: z.string(),
      urgencyScore: z.number().min(0).max(100),
      timestamp: z.string(),
    }),
  },
  async (input) => {
    const prompt = `
      You are the WiraLalu AI Traffic Agent for intersection ${input.intersectionId} in Malaysia.
      Your goal is to optimize traffic flow while prioritizing safety and national goals (Net Zero/Sovereignty).
      
      CONTEXT:
      - Malaysian roads have high motorcycle lane-splitting.
      - Public transport (buses) are a priority for B40 mobility.
      - Flash floods are a constant risk.
      
      INPUT:
      - Cars: ${input.sensorData.carCount}
      - Motorcycles: ${input.sensorData.motorcycleCount}
      - Emergency Vehicle: ${input.sensorData.emergencyVehicleDetected ? 'YES' : 'NO'}
      - Bus Delayed: ${input.sensorData.busDelayed ? 'YES' : 'NO'}
      - Local Flood Risk: ${input.sensorData.floodRisk * 100}%
      
      NEIGHBORS:
      ${JSON.stringify(input.neighboringStates || [])}
      
      TASK:
      1. PERCEIVE: Analyze the load and threats.
      2. REASON: Weigh priorities. Emergency > Flood Risk > Bus > General Flow.
      3. ACT: Choose the best traffic signal command.
      4. COUNTERFACTUAL: Identify the "rejectedAlternative" and explain why it was the wrong choice.
      
      Output strictly in JSON.
    `;

    const { output } = await ai.generate({
      prompt,
      output: { format: 'json', schema: intersectionFlow.outputSchema },
    });

    return {
      ...output,
      timestamp: new Date().toISOString(),
    };
  }
);

app.get('/', (req, res) => {
  res.send('WiraLalu Intersection Agent is ONLINE. Use POST /decide to interact.');
});

app.post('/decide', async (req, res) => {
  try {
    const result = await intersectionFlow(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`WiraLalu Intersection Agent ${PORT} is active.`);
});
