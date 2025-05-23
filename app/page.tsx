export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 1) light / dark pattern layer */}
      <div
        className="
          absolute inset-0
          bg-repeat
          opacity-20
          z-0

          /* light mode URL */
          bg-[url('/garu2.svg')]

          /* dark mode URL */
          dark:bg-[url('/garu.svg')]
        "
        style={{ backgroundSize: "300px 300px" }}
      />

      {/* 2) tint layer */}
      <div className="absolute inset-0 from-gray-900/50 via-gray-900/40 to-gray-800/40 bg-gradient-to-br z-0" />

      {/* 3) your form on top */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {/* … */}
      </div>
    </div>
  );
}
