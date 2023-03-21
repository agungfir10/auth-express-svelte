import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Reset } from '../entity/Reset';
import { createTransport } from 'nodemailer';
import { User } from '../entity/User';
import bcryptjs from 'bcryptjs';

export const ForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const token = Math.random().toString(20).substring(2, 12);

  await AppDataSource.getRepository(Reset).save({
    email,
    token,
  });

  const transporter = createTransport({
    host: '0.0.0.0',
    port: 1025,
  });

  const url = `http://localhost:8080/#/reset/${token}`;

  await transporter.sendMail({
    from: 'from@example.com',
    to: email,
    subject: 'Reset Your Password',
    html: `Click <a href="${url}">here</a> to reset your password`,
  });
  res.send({
    message: 'Please check your email!',
  });
};

export const ResetPassword = async (req: Request, res: Response) => {
  const { token, password, password_confirm } = req.body;

  if (password !== password_confirm) {
    res.status(400).send({
      message: 'Password do not match',
    });
  }

  const resetPassword = await AppDataSource.getRepository(Reset).findOne({
    where: {
      token,
    },
  });

  if (!resetPassword) {
    return res.status(400).send({
      messsage: 'Invalid link!',
    });
  }

  const user = await AppDataSource.getRepository(User).findOne({
    where: {
      email: resetPassword.email,
    },
  });

  if (!user) {
    return res.status(404).send({
      message: 'User not found',
    });
  }

  await AppDataSource.getRepository(User).update(user.id, {
    password: await bcryptjs.hash(password, 12),
  });

  res.send({
    message: 'success',
  });
};
