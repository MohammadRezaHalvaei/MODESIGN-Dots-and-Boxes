import { CaseProps, DefaultProps } from "@/types";
import React, { ReactElement } from "react";

export default function TextWinner({ children }: DefaultProps) {
  let matchChild: ReactElement | null = null;
  let defaultCase: ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (!matchChild && React.isValidElement(child) && child.type === Case) {
      const { condition }: { condition: boolean } = child.props;

      const conditionResult = Boolean(condition);

      if (conditionResult) {
        matchChild = child;
      }
    } else if (
      !defaultCase &&
      React.isValidElement(child) &&
      child.type === Default
    ) {
      defaultCase = child;
    }
  });

  return (
    <h1 className="w-[460px] mx-auto text-center text-xl">
      {matchChild ?? defaultCase ?? null}
    </h1>
  );
}

export function Case({ children, condition }: CaseProps) {
  return condition ? children : null;
}

export function Default({ children }: DefaultProps) {
  return children;
}
