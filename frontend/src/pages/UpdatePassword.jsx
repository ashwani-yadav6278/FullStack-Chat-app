import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import AuthImagePattern from "../components/AuthImagePttern";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    oldpassword: "",
    newpassword: "",
  });
  const navigate=useNavigate();

  const { isResetPassword, resetPassword } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.oldpassword) return toast.error("Old Password is required to change password");
    if (formData.newpassword.length < 8)
      return toast.error("Password must be at least 8 characters");

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();



  try {
    await resetPassword(formData);
    navigate('/login'); //Redirect only on success
  } catch (err) {
    
    console.error("Reset failed:", err.message);
  }
};


  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary z-40" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Update your password</h1>
              <p className="text-base-content/60">
                Enter Your Email & OldPassword to update your  password
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/30 z-10" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Old Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter your old password"
                  value={formData.oldpassword}
                  onChange={(e) =>
                    setFormData({ ...formData, oldpassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="size-5 text-base-content/40" />
                  ) : (
                    <EyeOff className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">New Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter new password"
                  value={formData.newpassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newpassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="size-5 text-base-content/40" />
                  ) : (
                    <EyeOff className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isResetPassword}
            >
              {isResetPassword ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>

    
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Welcome to our community"
        subtitle=" Update your password at least once a month to help secure your account and protect it from phishing or unauthorized access."
      />
    </div>
  );
};

export default ResetPassword ;
