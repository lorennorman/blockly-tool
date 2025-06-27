import { singleLineTemplate, multilineLineTemplate } from "#app/blocks/shadows.js"


export default {
  type: "action_email",
  bytecodeKey: "emailAction",
  name: "Email",
  description: `Sends an email with given subject and body templates`,
  primaryCategory: 'Actions',
  color: "0",

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  inputs: {
    SUBJECT: {
      description: "a template for generating the email subject",
      bytecodeProperty: "subjectTemplate",
      shadow: singleLineTemplate,
    },

    BODY: {
      description: "a multi-line template for generating the email body",
      bytecodeProperty: "bodyTemplate",
      shadow: multilineLineTemplate,
    }
  },

  template: `
    📧 Email |CENTER
    Subject: %SUBJECT
    Body: %BODY
  `,
}
