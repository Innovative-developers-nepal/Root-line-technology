import { LottieLoader } from "@/components/lottie-loader";

export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <LottieLoader size="lg" />
    </div>
  );
}
