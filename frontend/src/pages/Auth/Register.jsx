import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <div className="h-screen bg-cover bg-center" 
         style={{ backgroundImage: "url('https://i.pinimg.com/originals/3c/79/7f/3c797fdf8bb4f54d899e07d6103d2348.jpg')" }}>
      <section className="pl-[11rem] flex flex-wrap" style={{ transform: "scale(0.70)" }}>
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-4xl text-black font-bold mb-4">REGISTER</h1>

          <form onSubmit={submitHandler} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label
                htmlFor="name"
                className="block text-xl font-medium text-black"
              >
                NAME
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-xl font-medium text-black"
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="password"
                className="block text-xl font-medium text-white"
              >
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="confirmPassword"
                className="block text-xl font-medium text-white"
              >
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 text-xl text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isLoading ? "Registering..." : "REGISTER"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-4">
            <p className="block text-xl font-medium text-white">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-xl font-bold text-black hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
