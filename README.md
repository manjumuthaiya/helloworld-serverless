# helloworld-serverless
Serverless IO project to serve an html from an S3 bucket with dynamically injected content
https://serverless.com

How to set up:
1. Setup an S3 bucket with the following folder structure
- STAGE1
  - breadcrumb.txt - live SHA
  - SHA1 
    - prefix-index.html (contains <html> and <head> element BEGIN)
    - postfix-index.html (END </head> element and include <body>) (<link> and <script> tags should be of the format `http://s3.amazonaws.com/<bucketname>/<%REPLACE_WITH_STAGE%>/<%REPLACE_WITH_SHA%>/filename.js`)
    - assets 
  - SHA2
    - prefix-index.html (contains <html> and <head> element BEGIN)
    - postfix-index.html (END </head> element and include <body>) (<link> and <script> tags should be of the format `http://s3.amazonaws.com/<bucketname>/<%REPLACE_WITH_STAGE%>/<%REPLACE_WITH_SHA%>/filename.js`)
    - assets 
   ...
 - STAGE2
   ...
2. Change the bucket name in serverless.yml to your S3 bucket name
3. Set up serverless to work with your AWS credentials (see documentation)
