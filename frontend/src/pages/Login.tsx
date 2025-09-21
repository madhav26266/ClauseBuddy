import { GoogleLogin } from "@react-oauth/google";

export default function Login({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <GoogleLogin
        onSuccess={(response) => {
          console.log("Google Login Success:", response);
          onLoginSuccess(response);
        }}
        onError={() => console.log("Google Login Failed")}
      />
    </div>
  );
}

