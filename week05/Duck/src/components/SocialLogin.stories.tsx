import type { Meta, StoryObj } from "@storybook/react";
import { SocialLogin } from "./SocialLogin";

const meta: Meta<typeof SocialLogin> = {
  title: "Components/SocialLogin",
  component: SocialLogin,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SocialLogin>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <SocialLogin />
    </div>
  ),
};

export const InForm: Story = {
  render: () => (
    <div className="w-80 bg-black p-6">
      <SocialLogin />
      <div className="mt-4">
        <input
          type="text"
          placeholder="이메일"
          className="w-full p-3 bg-[#202020] text-white rounded-lg border border-white"
        />
      </div>
    </div>
  ),
};
