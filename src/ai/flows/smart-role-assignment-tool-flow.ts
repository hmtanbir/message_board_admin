'use server';
/**
 * @fileOverview An AI tool that suggests appropriate user roles and permissions
 *   based on the user's provided job title or department description.
 *
 * - smartRoleAssignmentTool - A function that handles the role assignment process.
 * - SmartRoleAssignmentToolInput - The input type for the smartRoleAssignmentTool function.
 * - SmartRoleAssignmentToolOutput - The return type for the smartRoleAssignmentTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    .array(z.enum(['Admin', 'User']))
    .describe('A list of suggested user roles. Must be either "Admin" or "User".'),
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
  prompt: `You are an expert in user access management, security, and best practices for role-based access control (RBAC).
Your task is to suggest appropriate user roles and fine-grained permissions based on the provided job title and/or department description.

CRITICAL: You MUST only suggest roles from the following list: ['Admin', 'User'].
- 'Admin': For users requiring elevated management privileges, organizational settings access, or security oversight.
- 'User': For standard employees, contributors, and team members who need to perform daily tasks without administrative overhead.

Consider the principle of least privilege, ensuring users have only the necessary access to perform their duties.

If a job title is provided, prioritize it. If a department description is provided, use it to infer broader access needs.
If both are provided, use the job title for specific roles and permissions, and the department description to validate or refine broader access requirements.

Input:
{{#if jobTitle}}
Job Title: {{{jobTitle}}}
{{/if}}
{{#if departmentDescription}}
Department Description: {{{departmentDescription}}}
{{/if}}

Provide the suggested roles and permissions, along with a clear reasoning for your choices. Focus on granular permissions (e.g., 'read:users', 'write:products', 'delete:reports', 'manage:billing').`,
});

const smartRoleAssignmentToolFlow = ai.defineFlow(
  {
    name: 'smartRoleAssignmentToolFlow',
    inputSchema: SmartRoleAssignmentToolInputSchema,
    outputSchema: SmartRoleAssignmentToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
