import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { AuthHeader } from "./AuthHeader";

const meta: Meta<typeof AuthHeader> = {
  title: "Components/AuthHeader",
  component: AuthHeader,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "헤더에 표시될 제목",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuthHeader>;

export const Login: Story = {
  args: {
    title: "로그인",
  },
};

export const Signup: Story = {
  args: {
    title: "회원가입",
  },
};

export const Custom: Story = {
  args: {
    title: "커스텀 제목",
  },
};
