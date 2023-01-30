import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { 
  SNSClient,
  PublishCommand,
  CreateSMSSandboxPhoneNumberCommand,
  VerifySMSSandboxPhoneNumberCommand,
  ListSMSSandboxPhoneNumbersCommand,
  ListSMSSandboxPhoneNumbersCommandInput,
  SubscribeCommand,
} from "@aws-sdk/client-sns";
import { apiResponse } from "../../helpers/response"

export const sendSmsToUser: any = async (event: any) => {

    if (!event.body) return apiResponse(400, {error: "Bad Request"})
    event.body = JSON.parse(event.body)
    if (!event.body.phoneNumber || !event.body.message) return apiResponse(400, {error: "Bad Request"})

    const payload = {
      phoneNumber: event.body.phoneNumber,
      message: event.body.message,
      SMS_TOPIC_ARN: process.env.SNS_FOR_SMS_TOPIC_ARN
    }

    const snsClient = new SNSClient({region: process.env.REGION})
    const publishCommand = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message:  JSON.stringify(payload)
    })

    await snsClient.send(publishCommand)

    return apiResponse(200, {message: "Message Published Succesfully"})
};

export const sqsConsumer: any = async (event: any) => {

  const snsClient = new SNSClient({region: process.env.REGION})

  for (const record of event.Records){
    const body = JSON.parse(record.body)
    const payload = JSON.parse(body.Message)

    if (payload.phoneNumber && payload.message) {

      const subscribeCommand = new SubscribeCommand({
        Protocol: "sms",
        Endpoint: payload.phoneNumber,
        TopicArn: payload.SMS_TOPIC_ARN
      })
      const publishCommand = new PublishCommand({
        TopicArn: payload.SMS_TOPIC_ARN,
        Message:  payload.message
      })

      await snsClient.send(subscribeCommand)
      await snsClient.send(publishCommand)
    }

  }

  return {}
};

export const addPhoneNumber: any = async (event: any) => {

  const body: any = event.body ? JSON.parse(event.body) : {}
  const { phoneNumber } = body

  if (!phoneNumber) return apiResponse(400, {error: "Bad Request"})

  const snsClient = new SNSClient({region: process.env.REGION})
  const createSMSSandboxPhoneNumberCommand = new CreateSMSSandboxPhoneNumberCommand({
    PhoneNumber: phoneNumber
  })
  await snsClient.send(createSMSSandboxPhoneNumberCommand)

  return apiResponse(201, {message: `${phoneNumber} is registered to sandbox successfully.`})
};

export const verifyPhoneNumber: any = async (event: any) => {
  
  const body: any = event.body ? JSON.parse(event.body) : undefined
  const { phoneNumber, OneTimePassword } = body

  const snsClient = new SNSClient({region: process.env.REGION})
  const verifySMSSandboxPhoneNumberCommand = new VerifySMSSandboxPhoneNumberCommand({
    PhoneNumber: phoneNumber,
    OneTimePassword: OneTimePassword
  })

  try {
    await snsClient.send(verifySMSSandboxPhoneNumberCommand)
  } catch (error: any) {

    if (error.name === "VerificationException") return apiResponse(400, {message: "Inputs are not valid."})
    return apiResponse(500, {error: error.name})
  }
  
  return apiResponse(200, {message: `${phoneNumber} is verified on sandbox successfully.`})
};

export const listPhoneNumber: any = async (event: any) => {
  
  type QueryParams = { NextToken?: string, MaxResults?: number} | undefined;
  const queryString: QueryParams = event.queryStringParameters
  
  const snsClient = new SNSClient({region: process.env.REGION})
  const attributes: ListSMSSandboxPhoneNumbersCommandInput = queryString ? queryString : {}

  const listSMSSandboxPhoneNumbersCommand = new ListSMSSandboxPhoneNumbersCommand(attributes)
  const response = await snsClient.send(listSMSSandboxPhoneNumbersCommand)

  return apiResponse(200, {PhoneNumbers: response.PhoneNumbers})
};