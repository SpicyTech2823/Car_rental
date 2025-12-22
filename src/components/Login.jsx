import { useState } from "react";

export default function Login() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray py-12 px-4 sm:px-6 lg:px-8 mt-6">
      {/* Login Form */}
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-50 rounded-lg shadow-md border border-gray-200">
        {showLogin && (
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-red-800">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <label
                    for="email"
                    className="block text-sm/6 font-medium text-red-900 "
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      autocomplete="email"
                      class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border-2 border-red-900 outline-1 -outline-offset-1 outline-white/10 placeholder:text-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-900 sm:text-sm/6 "
                    />
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between">
                    <label
                      for="password"
                      class="block text-sm/6 font-medium text-red-900"
                    >
                      Password
                    </label>
                    <div class="text-sm">
                      <a
                        href="#"
                        class="font-semibold text-indigo-400 hover:text-indigo-300"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div class="mt-2">
                    <input
                      id="password"
                      type="password"
                      name="password"
                      required
                      autocomplete="current-password"
                      class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border-2 border-red-900 text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    class="flex w-full justify-center rounded-md bg-red-900 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-red-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p class="mt-10 text-center text-sm/6 text-gray-400">
                Not a member?
                <a
                  href="#"
                  class="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Start a 14 day free trial
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
