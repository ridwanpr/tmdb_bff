import { hash, verify } from "@node-rs/argon2";

export const hashValue = async (value: string) => {
  return await hash(value, {
    algorithm: 2, // argon2id
    memoryCost: 19456, // 19mb
    timeCost: 2,
    parallelism: 1,
  });
};

export const verifyValue = async (rawValue: string, hashedValue: string) => {
  return await verify(hashedValue, rawValue);
};
