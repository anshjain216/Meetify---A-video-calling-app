import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import link from "../../environment";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false);

  const { setUser, setUserAvailable } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    const response = await axios.post(`${link}/login`, {
      username,
      password
    });

    localStorage.setItem("token", response.data.token);

setUser({
  name: response.data.user.name,
  avatar: response.data.user.name.charAt(0).toUpperCase(),
  status: "Online"
});
setUserAvailable(true);
setLoading(false);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf4ee] px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-[#2b1f18] mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-6">Login to continue your video calls</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            {loading?"Loading...":"Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-500 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}