import { LogoProps } from "./LogoProps";
import colorLogoImage from "../../../../public/logo.svg";
import whiteLogoImage from "../../../../public/whiteLogo.png";
import styles from "./Logo.module.scss";

function Logo(props: LogoProps) {
    let logoSizeStyle = styles.mediumLogo;
    let logoSrc = colorLogoImage.src || colorLogoImage;

    if (props.size === "large") logoSizeStyle = styles.largeLogo;
    if (props.size === "small") logoSizeStyle = styles.smallLogo;

    if (props.type === "white") logoSrc = whiteLogoImage.src || whiteLogoImage;

    return (
        <a href="/" className={[styles.logoWrapper, logoSizeStyle, props.className].join(" ").trim()}>
            <img src={logoSrc} alt="CyberPay" />
        </a>
    );
}

export { Logo };
