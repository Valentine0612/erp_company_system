export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    withoutStyles?: boolean;
    styleType?: "green" | "red" | "white";
}
