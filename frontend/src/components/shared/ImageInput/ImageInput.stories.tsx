import React from "react";
import { Meta, Story } from "@storybook/react";
import { ImageInput } from ".";
import { ImageInputProps } from "./ImageInputProps";
import { acceptedImagesTypes } from "constants/acceptedFilesTypes";

export default {
    component: ImageInput,
    title: "Components/ImageInput",
} as Meta;

const Template: Story<ImageInputProps> = (args: ImageInputProps) => <ImageInput {...args} />;

export const PrimaryImageInput = Template.bind({});
PrimaryImageInput.args = { placeholder: "Поле", accept: acceptedImagesTypes };

export const ErrorImageInput = Template.bind({});
ErrorImageInput.args = { placeholder: "Поле", accept: acceptedImagesTypes, error: true };

export const ImageInputWithDefault = Template.bind({});
ImageInputWithDefault.args = {
    placeholder: "Поле",
    accept: acceptedImagesTypes,
    defaultValue: "https://html5css.ru/howto/img_avatar.png",
};
