# Shieldpay SST Example
## Summary

Project developed as infrastructure as code (IaaS) with serverless stack to publish any message to phone numbers which are exists in AWS SNS Sandbox.
* Project developed with Typescript.
* User need to add phone number as verified, then user can send sms to phone number.
* AWS automatically sends all phone numbers that exists in SNS Sandbox.
* All Project can build and run with any AWS free tier account.
* Default stack is dev for local.

**Do not forget to set REGION parameter on environment files and on sst.json file**
### Used Technologies
- Serverless Stack (AWS Serverless Framework)
- AWS API Gateway
- AWS SQS
- AWS SNS
- AWS Lambda
- [Vitest](https://vitest.dev "Vitest") (Similar to Jest)

### Project Steps
- Installing Project
- Starting Project
- Add phone number to AWS SNS Sandbox via addPhoneNumber API (/phone/add)
- Verify your phone number via verifyPhoneNumber API (phone/verify)
- Publish your message with phone number via sendSmsToUser API (sms/send)

## Installation

Project tested with typescript's last version. (4.9.4)

Install the dependencies and devDependencies for start the project.
```sh
yarn
yarn start
```
For production environments...
```sh
npm install --production
REGION=YOUR_AWS_REGION
```

## Endpoints

API GATEWAY Endpoints Table:

| Endpoint | Body | Method | Response
| ------ | ------ | ------ | ------ |
| /phone |        |  GET   | 200 - Phone List |
| /phone/add | { phoneNumber } |  POST   | 201 |
| /phone/verify |  { phoneNumber, OneTimePassword }  |  POST   | 200 |
| /sms/send | { phoneNumber, message }  |  POST   | 200 |

## Testing

To test it locally, please run project paralelly at the second terminal.
Provide testing variables on general.test.ts
Run test on first terminal.
```sh
yarn test
```

## License

MIT

