import React from "react";
import { FieldError } from "react-hook-form";

interface FormErrorMsgProps {
  msgObj: FieldError;
}

const FormErrorMsg = ({ msgObj }: FormErrorMsgProps) => {
  const { message } = msgObj;
  return <p className="text-xs text-red-600">{message}</p>;
};

export default FormErrorMsg;
