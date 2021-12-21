import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, auth.secretRefreshToken) as IPayload;

    const usersTokensRepository = new UsersTokensRepository();
    const user = await usersTokensRepository.findByUserIdAndRefreshToken(
      user_id,
      token
    );
    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    request.user = {
      id: user.id,
    };

    next();
  } catch {
    throw new AppError("Invalid token!", 401);
  }
}
