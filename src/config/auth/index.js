import Redis from 'ioredis';
import JWTR from 'jwt-redis';

// Connect with redis ip 127.0.0.1:6379
const redis = new Redis(process.env.REDIS_URL);
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
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split(' ')[1]; // Bearer <token>
    try {
      const auth = await jwt.verify(token, `${process.env.SECRET_KEY}`);
      next();
    } catch (e) {
      if (e.name === 'JsonWebTokenError')
        return res.status(401).json({ error: 'Wrong authorization token.' });
      else if (e.name === 'TokenExpiredError')
        return res.status(401).json({ error: 'Authorization token has expired.' });
      return res.status(401).json({ error: 'Authorization token does not exist.' });
    }
  } else {
    return res.status(400).json({ error: 'Authorization token is missing.' });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    try {
      const { cpf, id, jti } = await jwt.verify(
        refreshToken,
        `${process.env.REFRESH_TOKEN_SECRET}`
      );
      const payload = {
        cpf,
        id
      };
      await jwt.destroy(jti);
      const newToken = await generateToken(payload);
      return res.status(200).send(newToken);
    } catch (e) {
      if (e.name === 'JsonWebTokenError')
        return res.status(401).json({ error: 'Wrong refresh token.' });
      else if (e.name === 'TokenExpiredError')
        return res.status(401).json({ error: 'Refresh token has expired.' });
      return res.status(401).json({ error: 'Refresh token does not exist.' });
    }
  } else {
    return res.status(400).json({ error: 'Refresh token is missing.' });
  }
};

const destroyAccessToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const accessToken = authorization.split(' ')[1];
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
    return res.status(401).json({ error: 'Access token is missing.' });
  }
};

const destroyRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
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
    return res.status(400).json({ error: 'Refresh token is missing.' });
  }
};

export { generateToken, validationToken, refreshToken, destroyAccessToken, destroyRefreshToken };
