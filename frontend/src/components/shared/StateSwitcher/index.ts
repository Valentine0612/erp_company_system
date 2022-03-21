import { StateSwitcher } from "./StateSwitcher";
import { StateSwitcherProps } from "./StateSwitcher.props";

export { StateSwitcher };
export type { StateSwitcherProps };
export type StateSwitcherItem<T = string> = { state: T; text: string };
