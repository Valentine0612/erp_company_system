import React from "react";
import { Meta, Story } from "@storybook/react";
import { Avatar } from ".";
import { AvatarProps } from "./AvatarProps";

export default {
    component: Avatar,
    title: "Components/Avatar",
} as Meta;

const Template: Story<AvatarProps> = (args: AvatarProps) => <Avatar {...args} />;

export const PrimaryAvatar = Template.bind({});
PrimaryAvatar.args = { src: "https://html5css.ru/howto/img_avatar.png", alt: "avatar" };

export const SmallAvatar = Template.bind({});
SmallAvatar.args = {
    src: "https://html5css.ru/howto/img_avatar.png",
    alt: "avatar",
    size: "small",
};

export const LargeAvatar = Template.bind({});
LargeAvatar.args = {
    src: "https://html5css.ru/howto/img_avatar.png",
    alt: "avatar",
    size: "large",
};
