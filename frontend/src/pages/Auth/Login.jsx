import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg')" }}>
<section className="pl-[11rem] flex flex-wrap" style={{ transform: "scale(0.78)" }}>
      
        <div className="mr-[1rem] mt-[5rem]">
          <h1 className="text-4xl font-bold mb-4 text-black">SIGN IN</h1>

          <form onSubmit={submitHandler} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-xl font-medium text-black times-new-roman"
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full text-lg times-new-roman"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-xl font-medium text-black times-new-roman"
              >
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full text-lg times-new-roman"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-purple-500 text-xl text-white px-4 py-2 rounded cursor-pointer my-[1rem] hover:bg-purple-600"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-4">
            <p className="text-xl text-black text-bold times-new-roman">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-white text-lg text-bold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
        
      </section>
    </div>
  );
};

export default Login;
