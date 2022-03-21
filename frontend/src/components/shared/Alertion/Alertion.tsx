import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "store";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import styles from "./Alertion.module.scss";

function Alertion() {
    const alertionState = useSelector((state: IState) => state.alertion);
    const dispatch = useDispatch();

    const [closeTimeout, setCloseTimeout] = useState<number | null>(null);

    useEffect(() => {
        if (closeTimeout) clearTimeout(closeTimeout);

        if (alertionState.isShown) {
            const timeoutID = window.setTimeout(() => {
                dispatch(AlertionActionCreator.closeAlerion());
                setCloseTimeout(null);
            }, alertionState.showTime);

            setCloseTimeout(timeoutID);
        }

        return () => {
            if (closeTimeout) clearTimeout(closeTimeout);
        };
    }, [alertionState]);

    return (
        <div
            className={[
                styles.alertionWrapper,
                (alertionState.isShown && styles.shown) || "",
                (alertionState.type === "error" && styles.error) || "",
            ]
                .join(" ")
                .trim()}
        >
            <div className={styles.alertion}>
                <span>{alertionState.message}</span>

                <FontAwesomeIcon
                    icon={faPlus}
                    className={styles.closeButton}
                    onClick={() => dispatch(AlertionActionCreator.closeAlerion())}
                />
            </div>
        </div>
    );
}

export { Alertion };
