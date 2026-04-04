'use server';
/**
 * @fileOverview An AI tool that suggests appropriate user roles and permissions
 *   based on the user's provided job title or department description.
 *
 * - smartRoleAssignmentTool - A function that handles the role assignment process.
 * - SmartRoleAssignmentToolInput - The input type for the smartRoleAssignmentTool function.
 * - SmartRoleAssignmentToolOutput - The return type for the smartRoleAssignmentTool function.
 */

import {z} from 'genkit';

import {ai} from '@/ai/genkit';

const SmartRoleAssignmentToolInputSchema = z.object({
  jobTitle: z
    .string()
    .optional()
    .describe("The user's job title, e.g., 'Software Engineer', 'Marketing Manager'."),
  departmentDescription: z
    .string()
    .optional()
    .describe(
      "A description of the user's department and its responsibilities."
    ),
});
export type SmartRoleAssignmentToolInput = z.infer<
  typeof SmartRoleAssignmentToolInputSchema
>;

const SmartRoleAssignmentToolOutputSchema = z.object({
  suggestedRoles: z
    .array(z.enum(['User']))
    .describe('A list of suggested user roles. Must be "User".'),
  suggestedPermissions: z
    .array(z.string())
    .describe('A list of suggested permissions for the user.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested roles and permissions, based on security best practices.'
    ),
});
export type SmartRoleAssignmentToolOutput = z.infer<
  typeof SmartRoleAssignmentToolOutputSchema
>;

export async function smartRoleAssignmentTool(
  input: SmartRoleAssignmentToolInput
): Promise<SmartRoleAssignmentToolOutput> {
  return smartRoleAssignmentToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartRoleAssignmentPrompt',
  input: {schema: SmartRoleAssignmentToolInputSchema},
  output: {schema: SmartRoleAssignmentToolOutputSchema},
  prompt: `You are an expert in user access management and security.
Your task is to suggest appropriate granular permissions for a standard "User" role based on the provided job title and/or department description.

CRITICAL: The only supported role is 'User'. You must suggest this role and then focus on fine-grained permissions that match the user's responsibilities.

Consider the principle of least privilege, ensuring users have only the necessary access to perform their duties.

Input:
{{#if jobTitle}}
Job Title: {{{jobTitle}}}
{{/if}}
{{#if departmentDescription}}
Department Description: {{{departmentDescription}}}
{{/if}}

Provide the suggested permissions, along with a clear reasoning for your choices. Focus on granular permissions (e.g., 'read:users', 'write:products', 'delete:reports', 'manage:billing').`,
});

const smartRoleAssignmentToolFlow = ai.defineFlow(
  {
    name: 'smartRoleAssignmentToolFlow',
    inputSchema: SmartRoleAssignmentToolInputSchema,
    outputSchema: SmartRoleAssignmentToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Smart role assignment prompt returned no output.');
    }
    return output;
  }
);
