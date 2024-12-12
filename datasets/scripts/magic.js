const { render, renderFile } = require('template-file');

const { createReadStream, readFileSync } = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const { join } = require('path');
const { stripIndent, oneLine } = require('common-tags');

const DSL_SYNTAX = readFileSync(join(__dirname, 'grammars.ebnf'), {
  encoding: 'utf-8',
});
const configuration = new Configuration({
  organization: 'org-mF9bl8FPNyBmHZOpgFXswVrN',
});
const openai = new OpenAIApi(configuration);
(async () => {
  try {
    const task = `I want to build a website that shows a list of coupons, each with a coupon code, related store, description and coupon image. the store will be decoubled from the coupons as a coupun can be for many stores, each store should have an image and a name, store link.`;
    const promptTemplate = await renderFile(join(__dirname, 'prompt'), {
      TASK: task,
      DSL_SYNTAX: oneLine(DSL_SYNTAX.split('\n').join(';')),
    });

    const { data } = await openai.createCompletion({
      temperature: 0,
      best_of: 1,
      user: 'faslh-training',
      echo: false,
      max_tokens: 1500,
      frequency_penalty: 0.5,
      model: 'curie:ft-personal:last-2023-04-18-12-46-45',
      presence_penalty: 0,
      stop: '###',
      top_p: 0,
      prompt: stripIndent(promptTemplate),
    });

    console.log(data);
  } catch (error) {
    let data = '';
    if ('toJSON' in error) {
      data = error.toJSON();
    } else if ('message' in error) {
      data = error.message + '\n' + error.stack;
    }
    console.log(data);
  }
})();
