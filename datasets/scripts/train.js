const { createReadStream } = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const { join } = require('path');
(async () => {
  const configuration = new Configuration({
    organization: 'org-mF9bl8FPNyBmHZOpgFXswVrN',
  });
  const openai = new OpenAIApi(configuration);
  try {
    const trainingFile = await openai.createFile(
      createReadStream(
        join(process.cwd(), 'datasets', 'output', 'dataset_prepared.jsonl')
      ),
      'fine-tune'
    );
    console.log(`Training file created: ${trainingFile.data.id}`);
    // const validateTrainingFile = await openai.createFile(
    //   createReadStream(
    //     join(
    //       process.cwd(),
    //       'datasets',
    //       'output',
    //       'dataset_prepared_valid.jsonl'
    //     )
    //   ),
    //   'fine-tune'
    // );
    // console.log(`Validation file created: ${validateTrainingFile.data.id}`);
    const response = await openai.createFineTune({
      model: 'curie',
      suffix: 'last', // we can use this to train model/user
      training_file: trainingFile.data.id,
      // validation_file: validateTrainingFile.data.id,
    });

    console.log(`Fine-tuning started: ${response.data.id}`);
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
