"use client";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/quiz")}
      type="primary"
      size="large"
      className="flex items-center justify-center px-8 py-4 text-xl font-semibold shadow-lg transition duration-300 ease-in-out rounded-full"
      icon={<ArrowRightOutlined />}
      style={{
        color: "white",
        backgroundColor: "#FFD700",
        borderColor: "#FFD700",
        border: "none",
      }}
    >
      Start Quiz
    </Button>
  );
}
