import { loginUser, quickLogin } from "../../api/authApi";
import pos_sys_image from "../../assets/pos_sys_image.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SavedUser {
  id: number;
  username: string;
  fullName: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser, user, isLoading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>([]);
  const [page, setPage] = useState(0);

  // useEffect to load saved users from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("savedUsers");
    if (stored) {
      setSavedUsers(JSON.parse(stored));
    }
  }, []);

  // redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, isLoading]);

  //hanlders
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    const newErrors = { username: "", password: "" };

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(form.username, form.password);
      const user = res.data.user;

      // it updates the auth context with the logged in user info
      setUser({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        roles: user.roles,
      });

      // Save user to localStorage for quick login
      const stored = localStorage.getItem("savedUsers");
      const existing: SavedUser[] = stored ? JSON.parse(stored) : [];

      // Only add if not already saved
      const alreadySaved = existing.find((u) => u.id === user.id);
      if (!alreadySaved) {
        const updated = [
          ...existing,
          { id: user.id, username: user.username, fullName: user.fullName },
        ];
        localStorage.setItem("savedUsers", JSON.stringify(updated));
        setSavedUsers(updated);
      }

      navigate("/dashboard");
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        username: "Invalid username or password",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userId: number) => {
    try {
      const res = await quickLogin(userId);
      setUser({
        id: res.data.id,
        username: res.data.username,
        fullName: res.data.fullName,
        roles: res.data.roles,
      });
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const visibleUsers = savedUsers.slice(page * 3, page * 3 + 3);

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if ((page + 1) * 3 < savedUsers.length) setPage((p) => p + 1);
  };

  return (
    <div
      className="h-screen w-screen flex"
      style={{
        background: "linear-gradient(to right, #628897 27%, #0C2B4E 74%)",
      }}
    >
      <div className="grid grid-cols-2 place-items-center h-full w-full">
        <div className="m-auto">
          <h1
            className="text-white font-bold text-center leading-tight"
            style={{ fontFamily: "Arial", fontSize: "96px" }}
          >
            Welcome to
            <br />
            FlowServe
          </h1>
          <img
            src={pos_sys_image}
            // This image has created by AI
            alt="POS System"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-6 h-full w-full px-12">
          <div className="w-full max-w-2xl p-8 bg-white rounded-4xl shadow-lg">
            <h2 className="text-4xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="username"
                  className="ml-4 block text-2xl font-medium text-gray-700 mt-8 mb-4"
                >
                  Username
                </label>
                <div className="ml-4 mt-1 flex items-center gap-3">
                  <User size={48} className="text-gray-800 shrink-0" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="text-2xl block w-125 px-7 py-4 pb-5 border border-dark rounded-md shadow-sm focus:outline-2 focus:outline-offset-2 ring-2 focus:ring-dark"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-lg mt-1">{errors.username}</p>
                )}
                <label
                  htmlFor="password"
                  className="ml-4 block text-2xl font-medium text-gray-700 mt-4 mb-4"
                >
                  Password
                </label>
                <div className="ml-4 mt-1 flex items-center gap-3">
                  <Lock size={48} className="text-dark shrink-0" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="mt-1 text-2xl block w-125 px-7 py-5 border border-dark rounded-md shadow-sm focus:outline-2 focus:outline-offset-2 ring-2 focus:border-dark"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-lg mt-1">{errors.password}</p>
                )}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 w-115 py-5 px-7 text-2xl rounded-md bg-[#0C2B4E] text-white font-semibold hover:bg-[#0a2340] focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:ring-offset-2"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
          <div className="w-full max-w-2xl px-8 py-5 bg-white rounded-4xl shadow-lg">
            <div className="flex items-center gap-6">
              <span className="text-xl font-semibold text-gray-800 w-1/3">
                Quick Login:
              </span>
              <div className="grid grid-cols-5 justify-items-center w-full">
                <button
                  onClick={handlePrev}
                  className="pb-3 text-gray-500 hover:text-gray-800 text-5xl"
                >
                  &#8249;
                </button>
                {visibleUsers.length === 0 ? (
                  <p className="textgray-400">No saved users yet</p>
                ) : (
                  visibleUsers.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => handleQuickLogin(u.id)}
                      title={u.fullName}
                      className="w-15 h-15 rounded-full bg-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-500 flex items-center justify-center text-xl font-bold text-gray-700"
                    >
                      {u.fullName.charAt(0).toUpperCase() +
                        u.fullName.charAt(1)}
                    </div>
                  ))
                )}
                {/* <div className="w-15 h-15 rounded-full bg-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-500" />
                <div className="w-15 h-15 rounded-full bg-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-500" />
                <div className="w-15 h-15 rounded-full bg-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-500" /> */}
                <button
                  onClick={handleNext}
                  className="pb-3 text-gray-500 hover:text-gray-800 text-5xl"
                >
                  &#8250;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
