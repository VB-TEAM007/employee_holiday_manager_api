import jwt from 'jsonwebtoken';
import 'dotenv/config'
import tokenModel from '../models/token.model.js';

function generateTokens(payload: any) {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30s'});
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1m'});

  return {
    accessToken,
    refreshToken
  }
}

function validateAccessToken(token: string) {
  try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
  } catch (e) {
      return null;
  }
}

function validateRefreshToken(token: string) {
  try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
  } catch (e) {
      return null;
  }
}

async function saveToken(employee: any, refreshToken: string) {
  const tokenData = await tokenModel.findOne({ employee });
  
  if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
  }

  return await tokenModel.create({ employee, refreshToken});
}

async function removeToken(refreshToken: string) {
  const tokenData = await tokenModel.deleteOne({ refreshToken })
  return tokenData;
}

async function findToken(refreshToken: string) {
  const tokenData = await tokenModel.findOne({ refreshToken })
  return tokenData;
}


export const tokenService = {
  generateTokens,
  saveToken,
  removeToken,
  validateAccessToken,
  validateRefreshToken,
  findToken
}
