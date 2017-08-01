'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');

const s3 = new AWS.S3();

module.exports.hello = (event, context, callback) => {
  const BUCKET = process.env.BUCKET;
  const STAGE = process.env.STAGE;
  const params = {
    Bucket: BUCKET,
    Key: path.join(STAGE, 'breadcrumb.txt'),
  };
  //fetch breadcrumb.txt to find live SHA for environment
  s3.getObject(params, function(err, data) {
    if (err) {
      console.log(err)
    } else {
      const liveSha = data.Body.toString().trim();
      console.log('live sha for '+STAGE+' is '+liveSha);
      params.Key = path.join(STAGE, liveSha, 'prefix-index.html');

      //fetch prefix html to get <head> code
      s3.getObject(params, function(err, data) {
        if (err) {
          console.log(err)
        } else {
          const prefix = data.Body.toString().trim();
          let content = prefix;

          //add tokens to <head>
          content += '<script>window.token=\'' + process.env.TOKEN + '\';window.globalToken=\''+ process.env.GLOBAL_VAR+'\';</script>';

          //get postfix html (post <head>)
          params.Key = path.join(STAGE, liveSha, 'postfix-index.html');

          s3.getObject(params, function(err, data) {
            if (err) {
              console.log(err)
            } else {
              const postfix = data.Body.toString().trim();
              content += postfix;

              //replace stage placeholder
              content = content.replace(/<%REPLACE_WITH_STAGE%>/g, STAGE);

              //replace sha placeholder with liveSha
              content = content.replace(/<%REPLACE_WITH_SHA%>/g, liveSha);
              const response = {
                statusCode: 200,
                headers: {
                  'Content-type': 'text/html',
                },
                body: content,
              };
              callback(null, response);
            }
          })
        }
      });
    }

  });


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
