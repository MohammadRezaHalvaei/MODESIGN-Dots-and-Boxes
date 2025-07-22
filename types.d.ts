import { ReactNode } from "react";

type DataItem = {
  time: number;
  value: number;
  color: string;
};

type CaseProps = {
  children: ReactNode;
  condition: boolean;
};

type DefaultProps = {
  children: ReactNode;
};
