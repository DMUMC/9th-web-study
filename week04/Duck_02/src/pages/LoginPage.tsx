import useForm from "./hooks/userForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";

export default function LoginPage() {
  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleLogin = () => {
    console.log(values);
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          name="email"
          className="border border-[#ccc] w-[300px] p-2 focus:border-[#333] rounded-md"
          type="email"
          placeholder="Email"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors?.email}</div>
        )}
        <input
          {...getInputProps("password")}
          className="border border-[#ccc] w-[300px] p-2 focus:border-[#333] rounded-md"
          type="password"
          placeholder="password"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors?.password}</div>
        )}
        <button
          type="button"
          onClick={handleLogin}
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Login
        </button>
      </div>
    </div>
  );
}
