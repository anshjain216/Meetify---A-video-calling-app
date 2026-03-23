import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import link from "../../environment";




export function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
   const [loading,setLoading] = useState(false);

  const { setUser, setUserAvailable } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !username || !password) {
      setError("Please fill all fields");
      return;
    }

    setError("");

    const response = await axios.post(`${link}/register`, {
      name,
      username,
      password
    });

    localStorage.setItem("token", response.data.token);
    setUser({
  name: response.data.result.name,
  avatar: response.data.result.name.charAt(0).toUpperCase(),
  status: "Online"
});
setUserAvailable(true);
setLoading(false);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf4ee] px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2b1f18] mb-2">Create Account</h2>
        <p className="text-gray-500 mb-6">Start connecting with people</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="choose_username"
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
            {loading?"Loading...":"Signup"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}