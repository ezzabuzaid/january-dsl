const { spawnSync, execSync } = require('child_process');
const { createReadStream } = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const { join } = require('path');
(async () => {
  const configuration = new Configuration({
    organization: 'org-mF9bl8FPNyBmHZOpgFXswVrN',
  });
  const openai = new OpenAIApi(configuration);
  try {
    const {
      data: { data },
    } = await openai.listFineTunes();
    // execute "openai api models.delete -i" in shell
    for (const { id, fine_tuned_model } of data) {
      console.log(`openai api models.delete -i ${fine_tuned_model}`);
      if (!fine_tuned_model) {
        console.log(`No fine-tuned model found for ${id}`);
      } else {
        console.log(`ID: ${id}`);
      }
    }
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
