import { useEffect, useState } from "react";
import styles from "./ProgressBar.module.scss";
import { ProgressBarProps } from "./ProgressBarProps";

function ProgressBar(props: ProgressBarProps) {
    const [progress, setPropgress] = useState<number>();

    useEffect(() => {
        let progress = props.progress;

        if (progress > 100) progress = 100;
        if (progress < 0) progress = 0;

        setPropgress(progress);
    }, [props.progress]);

    return (
        <div className={[styles.progressBar, props.className].join(" ").trim()}>
            <div className={styles.progress} style={{ width: progress + "%" }}></div>
        </div>
    );
}

export { ProgressBar };
