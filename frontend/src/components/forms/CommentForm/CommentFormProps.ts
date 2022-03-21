import { CommentFormOnSubmitData } from ".";

export type CommentFormProps = {
    onSubmit?: (data: CommentFormOnSubmitData) => void;
};
