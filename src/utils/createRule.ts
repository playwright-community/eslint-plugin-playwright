import { Rule } from 'eslint'
import { Settings } from './types'

export function createRule(rule: Rule.RuleModule): Rule.RuleModule {
  return {
    create(context: Rule.RuleContext) {
      const messages = (context.settings as Settings)?.playwright?.messages

      /** Custom wrapper around `context.report` to support custom messages. */
      const report = (options: Rule.ReportDescriptor) => {
        // Support overriding the default messages from global settings
        if (messages && 'messageId' in options) {
          const { messageId, ...rest } = options
          const message = messages?.[messageId]

          // If the message is not found, fallback to the default messageId
          // in the options.
          return context.report(message ? { ...rest, message } : options)
        }

        return context.report(options)
      }

      return rule.create({ ...context, report })
    },
    meta: rule.meta,
  }
}
