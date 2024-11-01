import { StartQuizBtn } from "../components";

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-md">
        Welcome to the Ultimate Quiz Challenge
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-10 max-w-lg text-center text-white/90">
        Test your knowledge across a variety of categories. Click below to
        begin!
      </p>

      <StartQuizBtn />
    </div>
  );
}
