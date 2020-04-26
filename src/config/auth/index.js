import Redis from 'ioredis';
import JWTR from 'jwt-redis';

// Connect with redis ip 127.0.0.1:6379
const redis = new Redis();
const jwt = new JWTR(redis);

const generateToken = async payload => {
  try {
    const accessToken = await jwt.sign(payload, `${process.env.SECRET_KEY}`, {
      expiresIn: `${process.env.TOKEN_EXPIRATION}`
    });
    const refreshToken = await jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`);
    const jsonToken = {
      tokenType: 'bearer',
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    return jsonToken;
  } catch (e) {
    throw new Error('Something wrong during tried to generate token!');
  }
};

const getJti = async (token, secret) => {
  try {
    const { jti } = await jwt.verify(token, secret);
    return jti;
  } catch (e) {
    throw new Error('Error during tried to verify token on getJti.');
  }
};

// Middleware to check authorized request
const validationToken = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
    try {
      const auth = await jwt.verify(token, `${process.env.SECRET_KEY}`);
      next();
    } catch (e) {
      if (e.name === 'JsonWebTokenError') return res.status(401).send('Wrong authorization token.');
      else if (e.name === 'TokenExpiredError')
        return res.status(401).send('Authorization token has expired.');
      return res.status(401).send('Authorization token does not exist.');
    }
  } else {
    return res.status(401).send('Authorization token is missing.');
  }
};

const refreshToken = async (req, res) => {
  if (req.body.refreshToken) {
    const { refreshToken } = req.body;
    try {
      const existRefreshToken = await jwt.verify(
        refreshToken,
        `${process.env.REFRESH_TOKEN_SECRET}`
      );
      const payload = {
        cpf: existRefreshToken.cpf,
        id: existRefreshToken.id
      };
      await jwt.destroy(existRefreshToken.jti);
      const newToken = await generateToken(payload);
      return res.status(200).send(newToken);
    } catch (e) {
      if (e.name === 'JsonWebTokenError') return res.status(401).send('Wrong authorization token.');
      else if (e.name === 'TokenExpiredError')
        return res.status(401).send('Authorization token has expired.');
      return res.status(401).send('Authorization token does not exist.');
    }
  } else {
    return res.send(400).send('Send your refresh token to be refreshed.');
  }
};

const destroyAccessToken = async (req, res, next) => {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const accessTokenJti = await getJti(accessToken);
      await jwt.destroy(accessTokenJti);
    } catch (e) {
      console.log('destroyAccessToken');
      console.log(e);
    } finally {
      next();
    }
  } else {
    return res.send(400).send('Send your access token to be destroyed.');
  }
};

const destroyRefreshToken = async (req, res) => {
  if (req.body.refreshToken) {
    const refreshToken = req.body.refreshToken;
    try {
      const refreshTokenJti = await getJti(refreshToken);
      await jwt.destroy(refreshTokenJti);
    } catch (e) {
      console.log('destroyRefreshToken');
      console.log(e);
    } finally {
      return res.status(200).send('You has been logged out');
    }
  } else {
    return res.send(400).send('Send your refresh token to be destroyed.');
  }
};

export { generateToken, validationToken, refreshToken, destroyAccessToken, destroyRefreshToken };
