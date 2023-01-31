import { describe, expect, test } from "vitest";
import axios from "axios"

describe("Message-Service", () => {
  const baseUrl = "baseUrl"
  const phoneNumber = "phoneNumber"

  const responseType = {
    statusCode: expect.any(Number),
    payload: expect.anything()
  }

  test("List Numbers", async () => {
    const response = await axios.get(baseUrl + "/phone");
    console.log(response.data)
    expect(response.data).toEqual(responseType)
    expect(response.data.statusCode).toBe(200);
    expect(response.data.payload).toHaveProperty('PhoneNumbers');
  });

  test("Add Number", async () => {
    const response = await axios.post(baseUrl + "/phone/add", {
      phoneNumber: phoneNumber
    });

    expect(response.data).toEqual(responseType)
    expect(response.data.statusCode).toBe(201);
    expect(response.data.payload).toHaveProperty('message');
  });

  test("Verify Number", async () => {
    const response = await axios.post(baseUrl + "/phone/verify", {
      phoneNumber: phoneNumber,
      OneTimePassword: "123123"
    });

    expect(response.data).toEqual(responseType)
    expect(response.data.statusCode).toBe(200);
    expect(response.data.payload).toHaveProperty('message');
  });

  test("Send SMS to User", async () => {
    const response = await axios.post(baseUrl + "/sms/send", {
      phoneNumber: phoneNumber,
      message: "Hello this is test message."
    });

    expect(response.data).toEqual(responseType)
    expect(response.data.statusCode).toBe(200);
    expect(response.data.payload).toHaveProperty('message');
  });
});
