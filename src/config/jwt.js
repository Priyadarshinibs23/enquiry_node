const { SignJWT, jwtVerify } = require('jose');

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

exports.signToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.JWT_EXPIRES_IN)
    .sign(secret);
};

exports.verifyToken = async (token) => {
  return await jwtVerify(token, secret);
};
