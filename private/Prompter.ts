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
        chalk.gray.dim(`\nStart Symbol:\n<KEYWORD>\n\nTerminal Symbol:\n{hoot,hu,woo}\n\nProduction Rules:\n<EXP> => <KEYWORD>\n<EXP> => <EXP>\n<EXP> => <EXP> <EXP>\n<EXP> => <OWL_HOOT> | <OWL_BARK> | <OWL_WHISTLE>\n<OWL_HOOT> => hoot hoot hu <KEYWORD>\n<OWL_BARK> => hu hoot <KEYWORD> hoot\n<OWL_WHISTLE> => hu woo woo hoot <KEYWORD>\n`) + 
        chalk.white(`Please insert any of the 🦉\'s action(s) (`)+chalk.green('hoot')+'/'+chalk.green('hu')+'/'+chalk.green('woo')+chalk.white(') with spaces:\n'),
        validate: input => input === null || input.match(/^ *$/) !== null ? `Input is required!` : true
      });
    
      let runner = new Runner(response.input);
      runner.runLexer();
      runner.runParser();
    })();
  }

}
