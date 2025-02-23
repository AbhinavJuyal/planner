import React from "react";
import { Board } from "@prisma/client";
import MyPlansTable from "./my-plans-table";
import CreateBoard from "./create-board";
import { appLogger } from "@/utils/logger";
import { cookies } from "next/headers";

const getData = async (): Promise<Board[] | undefined> => {
  try {
    const cookieStore = cookies();
    const response = await fetch("http://localhost:3000/api/all-boards", {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    const responseData = await response.json();
    const { data } = responseData;
    return data.boards;
  } catch (error) {
    appLogger.error(error, "error");
  }
};

const MyPlans = async () => {
  const tableData = await getData();

  return (
    <div className="container h-full mx-auto py-10">
      <CreateBoard />
      <MyPlansTable tableData={tableData} />
    </div>
  );
};

export default MyPlans;
