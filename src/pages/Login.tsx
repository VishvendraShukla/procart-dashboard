import React, { useState } from "react";
import { Package } from "lucide-react";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const authService = new AuthenticationApiService();

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(authService.login(username, password));
//     if (username === "admin" && password === "password") {
//       localStorage.setItem("isAuthenticated", "true");
//       navigate("/");
//     } else {
//       console.log("here");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="p-6 bg-white shadow rounded w-96 space-y-4"
//       >
//         <h1 className="text-2xl text-center font-bold text-gray-900 mb-6">
//           Login
//         </h1>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Username
//           </label>
//           <input
//             type="text"
//             className="mt-1 block w-full py-1 border border-gray-200 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div>
//           <div className="flex items-center justify-between">
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <a
//               href="https://www.google.com"
//               className="text-sm text-blue-600 hover:underline"
//             >
//               Forgot Password?
//             </a>
//           </div>
//           <input
//             type="password"
//             className="mt-1 block w-full py-1 border border-gray-200 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Login
//         </button>
//       </form>
//       <Toaster position="top-right" />
//     </div>
//   );
// };

// export default Login;
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (error) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ProCart Admin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              label="Email address"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
