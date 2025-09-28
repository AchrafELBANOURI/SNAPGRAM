import "./global.css";
import { Routes , Route } from "react-router-dom";

import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";
import { Home } from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />}></Route>
          <Route path="/sign-up" element={<SignUpForm />}></Route>
        </Route>
 
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />}></Route>
        </Route>

      </Routes>

      <Toaster />

    </main>
  )
}

export default App;