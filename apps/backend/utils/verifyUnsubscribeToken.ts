import * as jwt from "jsonwebtoken";

const SECRET = process.env.UNSUBSCRIBE_JWT_SECRET as string;

type UnsubscribePayload = {
  mailId: string;
  type: "unsubscribe";
  iat: number;
  exp: number;
};

export const verifyUnsubscribeToken = (
  token: string
): UnsubscribePayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET, {
      algorithms: ["HS256"],
      issuer: "realtygenie-mail",
      audience: "unsubscribe",
    }) as UnsubscribePayload;

    if (decoded.type !== "unsubscribe") {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};
