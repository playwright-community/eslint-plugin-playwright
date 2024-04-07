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

      // ESLint does not allow modifying the context object, so we have to create
      // a new context object. Also, destructuring the context object will not work
      // because the properties are not enumerable, so we have to manually copy
      // the properties we need.
      const ruleContext = Object.freeze({
        ...context,
        cwd: context.cwd,
        filename: context.filename,
        id: context.id,
        options: context.options,
        parserOptions: context.parserOptions,
        parserPath: context.parserPath,
        physicalFilename: context.physicalFilename,
        report,
        settings: context.settings,
        sourceCode: context.sourceCode,
      })

      return rule.create(ruleContext)
    },
    meta: rule.meta,
  }
}
