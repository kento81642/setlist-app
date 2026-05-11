import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <main 
      className="flex min-h-screen items-center justify-center bg-contain bg-center px-2"
      style={{ backgroundImage: "url('/LIKE A AKID LOGO 2025.png')", backgroundPosition: "center 70%"}}>
      <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-md">
        <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">
          ログイン
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          アカウントにサインイン
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
