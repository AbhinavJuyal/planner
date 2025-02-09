import { prisma } from "@/lib/prisma";
import { CreateBoardSchema, CreateBoardType } from "@/schema/create-board";
import { verifyJWT } from "@/utils/api-service";
import { ServiceResponse } from "@/utils/serviceResponse";
import { Board, User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";

async function createBoard({
  title,
  ownerEmail,
}: CreateBoardType & { ownerEmail: string }) {
  try {
    const [ownerDetails] = (await prisma.$queryRaw`
      SELECT id FROM users
      WHERE email = ${ownerEmail};
    `) as [User];

    const [{ id: boardId }] = (await prisma.$queryRaw`
      INSERT INTO boards (title, owner)
      VALUES (${title}, ${ownerDetails.id})
      RETURNING id;
    `) as [Board];

    await prisma.$queryRaw`
      INSERT INTO board_participants (board_id, owner_id)
      VALUES (${boardId}, ${ownerDetails.id});
    `;
  } catch (error) {
    console.log(error);
  }
}

export async function POST(request: Request) {
  const payload = await request.json();
  const cookieStore = cookies();
  const jwtToken = cookieStore.get("jwt");
  let decodedToken;

  try {
    if (!jwtToken) {
      throw new Error("No Token found");
    }

    decodedToken = await verifyJWT<{ email: string }>(jwtToken.value);

    if (!decodedToken) {
      throw new Error("Expired or invalid token provided");
    }
  } catch {
    const error = new Error("User not authorized!");

    return Response.json(ServiceResponse.failure(error.message, null), {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const validation = CreateBoardSchema.safeParse(payload);

  if (!validation.success) {
    return Response.json(
      ServiceResponse.failure("Proper value not added", null),
      {
        status: StatusCodes.BAD_REQUEST,
      },
    );
  }

  await createBoard({ title: payload.title, ownerEmail: decodedToken.email });

  return Response.json(
    ServiceResponse.success(
      "Board created succesfully!",
      payload,
      StatusCodes.CREATED,
    ),
    {
      status: StatusCodes.CREATED,
    },
  );
}
