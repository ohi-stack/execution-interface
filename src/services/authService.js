import crypto from 'node:crypto';
import { issueToken, verifyToken } from './jwtService.js';

const defaultUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'issuer', password: 'issuer123', role: 'issuer' },
  { username: 'maintainer', password: 'maintainer123', role: 'maintainer' },
  { username: 'release_manager', password: 'release123', role: 'release_manager' },
];

const configuredUsers = process.env.AUTH_USERS
  ? JSON.parse(process.env.AUTH_USERS)
  : defaultUsers;

const hashPassword = (password) => crypto
  .createHash('sha256')
  .update(password)
  .digest('hex');

const users = configuredUsers.map((user) => ({
  ...user,
  passwordHash: hashPassword(user.password),
}));

export const login = ({ username, password }) => {
  if (!username || !password) {
    return {
      ok: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Username and password are required.',
    };
  }

  const user = users.find((candidate) => candidate.username === username);
  if (!user) {
    return {
      ok: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid username or password.',
    };
  }

  const candidateHash = hashPassword(password);
  if (candidateHash !== user.passwordHash) {
    return {
      ok: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid username or password.',
    };
  }

  const token = issueToken({
    sub: user.username,
    role: user.role,
    claims: {
      roles: [user.role],
    },
  });

  return {
    ok: true,
    token,
    token_type: 'Bearer',
    expires_in: Number(process.env.JWT_TTL_SECONDS || 3600),
    user: {
      username: user.username,
      role: user.role,
    },
  };
};

export const validateAccessToken = (token) => verifyToken(token);
