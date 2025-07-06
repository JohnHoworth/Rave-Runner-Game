'use server';

/**
 * @fileOverview This file defines a Genkit flow for customizing rave levels based on player style.
 *
 * The flow uses generative AI to create personalized rave experiences by modifying aspects
 * of the base set of levels.
 *
 * @interface CustomizeRaveLevelsInput - The input type for the customizeRaveLevels function.
 * @interface CustomizeRaveLevelsOutput - The output type for the customizeRaveLevels function.
 * @function customizeRaveLevels - The main function that orchestrates the rave level customization.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeRaveLevelsInputSchema = z.object({
  playerStyle: z
    .string()
    .describe(
      'A description of the player style, including music preferences, visual preferences, and gameplay preferences.'
    ),
  baseLevels: z
    .array(z.string())
    .describe('An array of strings representing the base rave levels.'),
});
export type CustomizeRaveLevelsInput = z.infer<typeof CustomizeRaveLevelsInputSchema>;

const CustomizedLevelSchema = z.object({
  levelName: z.string().describe('The name of the customized level.'),
  description: z.string().describe('A description of the customized level.'),
  music: z.string().describe('A description of the music in the customized level.'),
  visuals: z.string().describe('A description of the visuals in the customized level.'),
  gameplay: z.string().describe('A description of the gameplay in the customized level.'),
});

const CustomizeRaveLevelsOutputSchema = z.object({
  customizedLevels: z
    .array(CustomizedLevelSchema)
    .describe('An array of customized rave levels.'),
});
export type CustomizeRaveLevelsOutput = z.infer<typeof CustomizeRaveLevelsOutputSchema>;

export async function customizeRaveLevels(
  input: CustomizeRaveLevelsInput
): Promise<CustomizeRaveLevelsOutput> {
  return customizeRaveLevelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeRaveLevelsPrompt',
  input: {
    schema: CustomizeRaveLevelsInputSchema,
  },
  output: {
    schema: CustomizeRaveLevelsOutputSchema,
  },
  prompt: `You are an expert rave level designer. You will customize the base rave levels based on the player's style.

Player Style: {{{playerStyle}}}
Base Levels: {{{baseLevels}}}

Customize the base levels to match the player's style.  For each level, modify aspects of the level, including the music, visuals, and gameplay, to match the player's style. Return the customized levels in the following format:

{{#each baseLevels}}
Level {{@index}}:
  Level Name: (The name of the customized level)
  Description: (A description of the customized level)
  Music: (A description of the music in the customized level)
  Visuals: (A description of the visuals in the customized level)
  Gameplay: (A description of the gameplay in the customized level)
{{/each}}

Ensure that each level is unique and tailored to the player's preferences. Each level should still be recognizable as a rave, but should also incorporate elements of the player's style.
`,
});

const customizeRaveLevelsFlow = ai.defineFlow(
  {
    name: 'customizeRaveLevelsFlow',
    inputSchema: CustomizeRaveLevelsInputSchema,
    outputSchema: CustomizeRaveLevelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
