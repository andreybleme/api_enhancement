# API Enhancements

## Intro

We have an existing API that works with API Gateway service from AWS.
The idea is to enhance the API and reduce the costs of DynamoDB.
To do that, the following items must be implemented:

1. Cache results with Elastic Cache
2. Return the items paginated.

## 1. Cache results

- Propose a solution for caching the results of the API. Elastic Cache can be an option but feel free to suggest any other service.
- It's very important to note that all the configuration must be automated using Cloudformation.
- Make sure that the API cache is destroyed once a POST request is sent for a specific resource.

## 2. Pagination

- Propose a solution that allows us to return the data paginated from the API.
- You must create the proper documentation to explain how the existing APIs should be updated in order to return the data paginated and how the frontend should deal with those changes.
- Update frontend API/Service Layer and Table component in order to support pagination.

## 3. Test the API

Provide screenshots and a tutorial about how to test the API through POSTMAN.
Include collections file if you can, so it can be easily imported by any other team member.

## 4. Provided by us

- Access to our AWS Environment
- Github Access
- Any question can be discussed with the team

## 5. Deliverables

- Existing API swagger files and cloudformation stacks with the proper changes to achieve the abovementioned features
- Cloudformation stacks with the Elastic Cache or service used for the configuration. If any lambda function is needed, it must be written in Nodejs 10 and should have the proper cloudformation files too with its definition.
- Frontend updated, in order to work with pagination.
- Documentation about how to test and how does it work.

## 6. Compensation

- the test is being compensated, if successful and delivered within the project term, with **500 USD**

## 7. Timeline

- Project Term: 2 weeks
