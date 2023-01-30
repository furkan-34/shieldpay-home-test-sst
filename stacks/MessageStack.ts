import { StackContext, Api, Function } from "@serverless-stack/resources";
import * as sst from "@serverless-stack/resources"
import { ResourceStack } from "./ResourceStack";

export function MessageStack({ stack }: StackContext) {

  const { 
    snsTopicToPublishSms,
    snsTopic
  } = sst.use(ResourceStack);


  const api = new Api(stack, "message-service", {
    routes: {
        "POST /sms/send": {
          function: {
            handler:  "functions/message/actions.sendSmsToUser",
            environment: { 
              SNS_TOPIC_ARN: snsTopic.topicArn,
              SNS_FOR_SMS_TOPIC_ARN: snsTopicToPublishSms.topicArn
            }
          }
        },
        "GET /phone": "functions/message/actions.listPhoneNumber",
        "POST /phone/add": "functions/message/actions.addPhoneNumber",
        "POST /phone/verify": "functions/message/actions.verifyPhoneNumber",
        
    },
  });

  api.attachPermissions([
    "sns:Publish",
    "sns:VerifySMSSandboxPhoneNumber",
    "sns:ListSMSSandboxPhoneNumbers",
    "SNS:CreateSMSSandboxPhoneNumber"
  ])

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
