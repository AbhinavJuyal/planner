import React from "react";
import MyPlansTable from "./my-plans-table";
import { Board } from "@prisma/client";
import CreateBoard from "./create-board";

const getData = async (): Promise<Board[] | undefined> => {
  try {
    const response = await fetch("http://localhost:3000/api/all-boards", {
      cache: "no-store",
    });
    const responseData = await response.json();
    const { data } = responseData;
    return data.buckets;
  } catch (error) {
    console.log(error, "error");
  }
};

const MyPlans = async () => {
  const tableData = await getData();

  return (
    <div className="container mx-auto py-10">
      <CreateBoard />
      <MyPlansTable tableData={tableData} />
    </div>
  );
};

export default MyPlans;
