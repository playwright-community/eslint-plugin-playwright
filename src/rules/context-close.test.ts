import rule from '../../src/rules/context-close'
import { javascript, runRuleTester } from '../utils/rule-tester'

runRuleTester('context-close', rule, {
  invalid: [
    {
      code: javascript`
            function createContext() {
            
            }
    
            function close() {
            
            }
    
    
            (() => {
                createContext();
            })()
            `,
      errors: 1,
    },
    {
      code: javascript`
              const page = {
                close: () => 'closed'
              }
              const browser = {
                createContext: () => page
              }
      
              
              (() => {
                  const newPage = browser.createContext();
              })()
              `,
      errors: 1,
    },
  ],
  valid: [
    {
      // different scopes invocation as expression
      code: javascript`
            function createContext() { }
    
            function close() {}
    
            createContext();
            (() => {
                
                close();
            })()
            `,
    },
    {
      // invocation in same scope as expression
      code: javascript`
              function createContext() { }
      
              function close() {}
      
              (() => {
                  createContext();
                  close();
              })()
              `,
    },
    {
      // different scopes invocation as method
      code: javascript`
              const page = {
                close: () => 'closed'
              }
              const browser = {
                createContext: () => page
              }
      
              const newPage = browser.createContext();
              (() => {
                  
                  newPage.close();
              })()
              `,
    },
    {
      // invocation in same scope as method
      code: javascript`
              const page = {
                close: () => 'closed'
              }
              const browser = {
                createContext: () => page
              }
      
              
              (() => {
                  const newPage = browser.createContext();
                  newPage.close();
              })()
              `,
    },
  ],
})
