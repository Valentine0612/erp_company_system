import React from "react";
import { useMedia } from "react-use";
import { Card } from "components/shared/Card";
import { Container } from "components/shared/Container";
import { Logo } from "components/shared/Logo";
import styles from "./FormPageWrapper.module.scss";
import { FormPageWrapperProps } from "./FormPageWrapperProps";

function FormPageWrapper(props: FormPageWrapperProps) {
    const isMobile = useMedia("(max-width: 500px)", false);

    return (
        <Container className={styles.page}>
            <Logo size={isMobile ? "medium" : "large"} className={styles.logo} />
            <Card className={styles.card}>{props.children}</Card>
        </Container>
    );
}

export { FormPageWrapper };
