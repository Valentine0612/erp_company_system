import { AvatarProps } from "./AvatarProps";
import styles from "./Avatar.module.scss";

function Avatar(props: AvatarProps) {
    let avatarSizeStyle = styles.mediumAvatar;

    if (props.size === "large") avatarSizeStyle = styles.largeAvatar;
    if (props.size === "small") avatarSizeStyle = styles.smallAvatar;

    return (
        <div
            // href="/"
            className={[styles.avatarWrapper, avatarSizeStyle, props.className].join(" ").trim()}
        >
            <img src={props.src} alt={props.alt} />
        </div>
    );
}

export { Avatar };
