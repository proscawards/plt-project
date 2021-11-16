import { Runner } from './Runner';
import prompts from 'prompts';

export class Prompter{

  private runner: any;

  constructor(){}

  run(){
    (async () => {
      const response = await prompts({
        type: 'text',
        name: 'input',
        message: 'Please insert any of the owl\'s action(s) (hoot/hu/woo) with spaces:\n'
      });
    
      let runner = new Runner(response.input);
      runner.runLexer();
      runner.runParser();
    })();
  }

}
