import { Runner } from './Runner';
import prompts from 'prompts';
const chalk = require("chalk");

export class Prompter{

  private runner: any;

  constructor(){}

  run(){
    (async () => {
      const response = await prompts({
        type: 'text',
        name: 'input',
        message: chalk.yellow.dim.underline("🦉 Owl's Language Compiler")+
        chalk.white(`\nPlease insert any of the 🦉\'s action(s) (`)+chalk.green('hoot')+'/'+chalk.green('hu')+'/'+chalk.green('woo')+chalk.white(') with spaces:\n'),
        validate: input => input === null || input.match(/^ *$/) !== null ? `Input is required!` : true
      });
    
      let runner = new Runner(response.input);
      runner.runLexer();
      runner.runParser();
    })();
  }

}
