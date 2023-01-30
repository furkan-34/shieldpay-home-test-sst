import { StackContext, Queue, Topic, Function } from "@serverless-stack/resources";


export function ResourceStack({ stack }: StackContext) {

    const sqsQueue = new Queue(stack, "sqs-queue", {
        consumer: {
            function: {
                handler: "functions/message/actions.sqsConsumer",
                timeout: 10,
            },
            cdk: {
                eventSource: {
                  batchSize: 10,
                },
            }
        },
        cdk: {
            queue: {
              queueName: `shieldpay-${stack.stage}-sqs-queue`
            },
          },
    });

    const snsTopic = new Topic(stack, "snsTopic", {
        subscribers: {
          subscriber: sqsQueue
        },
        cdk: {
            topic: {
              topicName: `shieldpay-${stack.stage}-sns-topic`,
            },
        },
    });

    
    const snsTopicToPublishSms = new Topic(stack, "snsTopicForSms", {
        cdk: {
            topic: {
              topicName: `shieldpay-${stack.stage}-sns-topic-for-sms`,
            },
        },
    });

    sqsQueue.attachPermissions([
        "sns:Subscribe",
        "sns:Publish",
    ])
    

    return { 
        sqsQueue,
        snsTopic,
        snsTopicToPublishSms
    };
}