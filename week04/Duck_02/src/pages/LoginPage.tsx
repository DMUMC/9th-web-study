import useForm from "../hooks/userForm";
import { useLocalStorage } from "../hooks/UseLocalStorage";
import { LocalStorageKey } from "../constants/key";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { postLogin } from "../apis/auth";
import InPutCompoent from "../components/InPutCompoent";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage(LocalStorageKey.accessToken);
  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleLogin = async () => {
    console.log(values);
    try {
      const response = await postLogin(values);
      setItem(response.data.accessToken);
      console.log(response);
      navigate("/mypage");
    } catch (error) {
      console.log(error);
    }
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <div className="flex flex-col gap-3">
        <InPutCompoent
          type="email"
          placeholder="Email"
          {...getInputProps("email")}
        />

        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors?.email}</div>
        )}

        <InPutCompoent
          type="password"
          placeholder="password"
          {...getInputProps("password")}
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
