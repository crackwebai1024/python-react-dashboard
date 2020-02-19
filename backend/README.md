### Serverless Lambda Template

This is the template we use when developing new serverless python code on AWS. It includes a number of basic but simple improvements to the standard `aws-python3` template that serverless offers out of the box:

- `./common`: Common configurations for improved readability in yml files
- `./local_server`: A dockerized flask application which is useful if you're building an API. This can be connected to our `local_mysql` container.
- `./modules`: Reusable, tested python code for common things such as database I/O.
- `./functions`: This is where your lambda handlers should go. We include an example of one function that calls into one of our modules.
- `./tests`: Pytest tests for testing modules in `./modules`

---

### Managing Auth with Cognito

We outsource our user auth to AWS Cognito. This means we don't need to maintain our own oauth service, and token exchange, user roles, and token validation, are all outsourced to AWS.

To setup Auth, first add a piece of code to your React app, which will wrap your app in a HOC, so that a valid cognito token is required to access any screens beyond App.tsx.

```
import Amplify, { Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    // identityPoolId: "us-east-1-xxxxxx",
    region: "us-east-1",
    userPoolId: "us-east-1_xxxxxxx",
    userPoolWebClientId: "xxxxxx"
  }
});
```

In the AWS dashboard, navigate to Cognito, and create a new user pool. Record your `Pool ID`, `Web Client ID`, and `Region`. Now, all users who login or create an account on your app will be issued Cognito auth tokens that can be tied to the Lambda functions you'll create in your backend API.

### Building APIs with Lambda

Writing your backend APIs with Lambda functions allows you to outsource authentication to Cognito, like we discussed above. [In your Cognito console, you can configure Lambda function callbacks for all auth actions](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-events.html). Want to create an account in your database after a new user is created in Cognito? Just write your `create_user` lambda function, which accepts an AWS event payload, and is called each time a cognito user is created in your React app with AWS Amplify.

**Note**: when writing Lambda functions to interact with Cognito, each Lambda _must_ return the exact event payload it recieved, with the exception of one field in the event that can be modified with arbitrary response data. Any additional data that you'd like to return to the user must be contained in the `body` field of the request.

### Developing Lambda Functions

To get started, you need to have serverless installed: `npm install -g serverless`

Then, to create a new project using our template, run:

`sls create --template-url https://github.com/smartshare-labs/aws-serverless-api-template --path NEW_PROJECT_PATH`

To deploy your code to lambda:

`sls deploy --stage dev`

or for production:

`sls deploy --stage prod`

Refer to the serverless documentation (https://serverless.com/framework/docs/) for more useful commands.

Note: A good rule of thumb when developing is to keep core application logic out of your lambda handlers. This is the pattern we try to employ with the `./modules` folder. Keeping your complexity in tested, reusable modules such as these allows for simple integration testing of the lambda handlers themselves.

When your function is ready to test, activate your virtualenv and run `python -m functions.NAME_OF_YOUR_LAMBDA_FUNCTION.handler`, which will source a sample JSON payload from `./test_events`.

---

### Using the local flask server

We assume you already have docker installed. From the `./local_server` folder, run `docker-compose up --build`. For each lambda handler that you want to expose in the local flask app, add a route in `./local_server/app.py` that forwards the appropriate event/context to your function.

---

### Testing

Write your tests in the `./tests` folder. Then:

1. Create a virtual environment in `./tests`: `virtualenv -p python3 venv`
2. Source it: `source venv/bin/activate`
3. Install requirements: `pip install -U requirements.txt`

Finally, to run tests: `python -m pytest tests` from the root directory.
