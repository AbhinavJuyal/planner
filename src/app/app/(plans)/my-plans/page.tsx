import React from "react";
import MyPlansTable from "./my-plans-table";
import CreateBoard from "./create-board";

const MyPlans = async () => {
  return (
    <div className="h-full grid grid-cols-1 grid-rows-[min-content_1fr] gap-8">
      <CreateBoard />
      <MyPlansTable />
    </div>
  );
};

export default MyPlans;
