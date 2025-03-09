import React from "react";
import MyPlansTable from "./my-plans-table";
import CreateBoard from "./create-board";

const MyPlans = async () => {
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_1fr] container h-full mx-auto py-10">
      <CreateBoard />
      <MyPlansTable />
    </div>
  );
};

export default MyPlans;
