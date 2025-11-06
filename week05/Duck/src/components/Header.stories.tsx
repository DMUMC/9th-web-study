import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Header";
import { useAuthStore } from "../store/authStore";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
  render: () => {
    useAuthStore.getState().setLogout();
    return <Header />;
  },
};

export const LoggedIn: Story = {
  render: () => {
    useAuthStore.getState().setLogin("mock-access-token", "mock-refresh-token");
    return <Header />;
  },
};
