## How it works

[> Check here the screenshots of the working solution <](https://github.com/andreybleme/api_enhancement/tree/master/screenshots) 

The `employee-api` uses the built in API Gateway cache solution: [https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html).

It contains a GET `/employees` endpoint that has a custom integration with DynamoDB to retrieve records and cache results for 300 seconds (default TTL).

## Setup instructions

### 1. Cloudformation stacks

Navigate into the folder `cloudformation-stack` and run the following commands to create the infrastructure needed.

**1.1.** API Gateway with enabled cache:

`aws cloudformation create-stack --stack-name employees-api --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --template-body file://api.yml`

**1.2.** DynamoDB with partition key, sorting key and secondary global index:

`aws cloudformation create-stack --stack-name employees-db --template-body file://dynamodb.yml`

**1.3.** Insert mock data into DynamoDB: 

`aws dynamodb batch-write-item --request-items file://../mock.json`

**Note:** Make sure the step 1.3 only runs after the 1.2 is completed, otherwise the mock data will not be correctly inserted. 


### 2. Postman

Navigate into the folder `postman` and having the Postman software running, import the following files:

`employees-api.postman_collection.json`

and `employees-api.postman_environment.json`

**Note:** You need to update the `host` variable after you have imported the files, in order to perform requests against the running API Gatewat stage. 
You can use ` https://4u31f8kq2i.execute-api.us-east-1.amazonaws.com/dev` to access my API running in my account if you want. 


### 3. Frontend

Navigate into the folder `frontend/frontend` and follow the steps:

**3.1** Install the dependencies by running `npm install`.

**3.2** Update the API URL:

Open the file `src/main.js` and change the variable `baseURL` to point to a valid API Gateway URL.

**3.3** Start the application:

`npm run serve`

## Highlights of the implementation

**1.** The built-in API Gateway cache solution drastically improves the reading cost of DynamoDB records (both financial costs and saving computational resources), since it prevents requests of reaching the database as you can see in [this cloudwatch panel](https://github.com/andreybleme/api_enhancement/blob/master/screenshots/energicos-cache-without-invalidation.png).

**2.** I have created a DynamoDB Secondary Global Index to make Query operations faster and more flexible as well.

**3.** All API endpoints, except for the GET `/employees`, are of the type `mock`, so they do not perform any operatinos in DynamoDB, it just retrieves dummy data.

**4.** I am using the [vuetify data-table component](https://vuetifyjs.com/pt-BR/components/data-tables) with server side pagination.

**5.** There is a ready [Elasticache Redis cloudformation file here](https://github.com/andreybleme/api_enhancement/commit/7ed95be0a2a2ef51221c6b8c146dd8aed1174ecc#diff-84778dc6450b7f38d4f9edaf02023657) in case we want to have a more fine grained control over caching, pagination and try caching strategies such as lazy-loading and write-through.
I have created it in the begining of the challenge, before we make clear that we must use a custom integration with DynamoDB.



## Improvements to be done

Assuming the deadline and my free time for the challenge, there are some points of improvement when considering to take this into production.

The API cloudformation stack template could be cleaner without the swagger file definition:

> To achieve this I would have to create a new stack to create a s3 bucket and upload the swagger file into it. The API stack template would only make a reference to this bucket.

AWS resources creation could be done with a single command:

> To achieve this I would have use Make and create a makefile to automate the 3 necessary commands described in section 1 of this document.

Frontend should use parametized values for API URL instead of plain text value:

> I would have to create a `.env` file and define a variable in there, or better, create an externalized/centralized secure configuration key using AWS KMS. 

Frontend should not request for GET `/employees/count` every time (depends on the real world scenario):

> Depending on how often the DynamoDB table gets updated, we would not need to perform an extra count request everytime a new page is loaded. We could store this count value in a vuex state for example and get it from the state instead of getting from API all the time.

Invalidate cache requires AWS Signature Authentication and it is properly securely not working

> The endpoint POST `/employees/clear-cache` should have an easier way than AWS Signature Authentication to allow cache invalidation. 
I have not validated if sending the header `Cache-Control: max-age=0` with this Authentication schema is really destroying the cache because I didn't have time to map this headers on the swaggerfile.
Anyway, there is a button in the console that flushes the cache as we can see in this documentation page: [https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html#flush-api-caching](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html#flush-api-caching)

Unfortunately I didn't have time at the end for these above items.

