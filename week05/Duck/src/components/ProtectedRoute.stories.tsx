import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthStore } from "../store/authStore";

const meta: Meta<typeof ProtectedRoute> = {
  title: "Components/ProtectedRoute",
  component: ProtectedRoute,
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
type Story = StoryObj<typeof ProtectedRoute>;

export const Authenticated: Story = {
  render: () => {
    useAuthStore.getState().setLogin("mock-access-token", "mock-refresh-token");
    return (
      <ProtectedRoute>
        <div className="p-4 bg-[#202020] text-white rounded-lg">
          보호된 콘텐츠입니다. 로그인된 사용자만 볼 수 있습니다.
        </div>
      </ProtectedRoute>
    );
  },
};

export const Unauthenticated: Story = {
  render: () => {
    useAuthStore.getState().setLogout();
    return (
      <ProtectedRoute>
        <div className="p-4 bg-[#202020] text-white rounded-lg">
          이 콘텐츠는 로그인 페이지로 리다이렉트됩니다.
        </div>
      </ProtectedRoute>
    );
  },
};
