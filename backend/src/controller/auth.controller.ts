import bcrypjs from 'bcryptjs';
import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Token } from '../entity/Token';
import { User } from '../entity/User';

const REFRESH_TOKEN = process.env.REFRESH_TOKEN || '';
const ACCESS_SECRET = process.env.ACCESS_SECRET || '';

export const Register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, password_confirm } =
      req.body;

    if (password !== password_confirm) {
      return res.status(400).send({
        message: 'Password do not match',
      });
    }

    const {
      password: any,
      tfa_secret,
      ...user
    }: any = await AppDataSource.getRepository(User).save({
      first_name,
      last_name,
      email,
      password: await bcrypjs.hash(password, 12),
    });

    res.send(user);
  } catch (e: any) {
    return res.status(400).send({
      message: e.message,
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: any = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });
    const { id } = user;

    if (!user) {
      return res.status(400).send({
        message: 'Invalid credentials',
      });
    }

    if (!(await bcrypjs.compare(password, user.password))) {
      return res.status(400).send({
        message: 'Invalid credentials',
      });
    }

    const refreshToken = sign({ id }, REFRESH_TOKEN, { expiresIn: '1w' });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    await AppDataSource.getRepository(Token).save({
      user_id: id,
      token: refreshToken,
      expired_at,
    });

    const token = sign({ id }, ACCESS_SECRET, { expiresIn: '30s' });

    res.send({
      token,
    });
  } catch (error: any) {
    res.send({
      message: error.message,
    });
  }
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const accessToken = req.header('Authorization')?.split(' ')[1] || '';

    const payload: any = verify(accessToken, ACCESS_SECRET);

    if (!payload) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        id: payload.id,
      },
    });

    const { password, tfa_secret, ...data }: any = user;

    res.send(data);
  } catch (error) {
    return res.status(401).send({
      message: 'unauthenticated',
    });
  }
};

export const Refresh = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies['refresh_token'];
    if (cookie === undefined) {
      return res.status(401).send({
        message: 'invalid credential',
      });
    }

    const payload: any = verify(cookie, REFRESH_TOKEN);
    if (!payload) {
      return res.status(401).send({
        message: 'invalid credential',
      });
    }

    const refreshToken = await AppDataSource.getRepository(Token).findOne({
      where: {
        user_id: payload.id,
        expired_at: MoreThanOrEqual(new Date()),
      },
    });

    if (!refreshToken) {
      return res.status(401).send({
        message: 'invalid credential',
      });
    }

    const token = sign(
      {
        id: payload.id,
      },
      ACCESS_SECRET,
      {
        expiresIn: '30s',
      }
    );

    res.send({
      token,
    });
  } catch (err: any) {
    return res.status(400).send({
      message: err.message,
    });
  }
};

export const Logout = async (req: Request, res: Response) => {
  await AppDataSource.getRepository(Token).delete({
    token: req.cookies['refresh_token'],
  });

  res.cookie('refresh_token', '', { maxAge: 0 });

  res.send({
    message: 'success',
  });
};
