import * as jwt from "jsonwebtoken";

const SECRET = process.env.UNSUBSCRIBE_JWT_SECRET as string;

if (!SECRET) {
  throw new Error("UNSUBSCRIBE_JWT_SECRET is not defined");
}

type UnsubscribePayload = {
  mailId: string;
  type: "unsubscribe";
};

export const generateUnsubscribeToken = (
  mailId: string
): string => {
  const payload: UnsubscribePayload = {
    mailId,
    type: "unsubscribe",
  };

  return jwt.sign(payload, SECRET, {
    algorithm: "HS256",
  });
};
