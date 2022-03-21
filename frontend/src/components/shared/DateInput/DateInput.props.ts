import { InputProps } from "components/shared/Input";

export type DateInputProps = Omit<InputProps, "icon" | "type"> & { icon?: string };
