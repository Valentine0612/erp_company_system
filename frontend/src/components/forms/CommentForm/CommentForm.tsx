import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "components/shared/Button";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { Textarea } from "components/shared/Textarea";
import styles from "./CommentForm.module.scss";
import { CommentFormProps } from "./CommentFormProps";

function CommentForm(props: CommentFormProps) {
    const { register, formState, handleSubmit } = useForm<CommentFormOnSubmitData>();

    function onSubmit(data: CommentFormOnSubmitData) {
        if (props.onSubmit) props.onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
                rows={5}
                wrapperClassName={styles.formElement}
                placeholder="Оставить комментарий"
                error={Boolean(formState.errors.body)}
                {...register("body", { required: "Вы не ввели комментарий" })}
            />

            <FormErrorsBlock errors={formState.errors} className={styles.formElement} />
            <Button>Сохранить</Button>
        </form>
    );
}

type CommentFormOnSubmitData = {
    body: string;
};

export { CommentForm };
export type { CommentFormOnSubmitData };
