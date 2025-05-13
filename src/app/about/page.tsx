"use client";

import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Twitter, ArrowRight, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// Save the SVG locally and use it from public directory
const HERO_IMAGE = "/images/earth-and-satellite.svg";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="relative mb-24"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-12 md:mb-20">
            <div className="lg:w-1/2">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Waxbarashada Mustaqbalka
              </span>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 text-gray-900 leading-tight">
                Garaad: Iftiimin mustaqbalka ardayda Soomaaliyeed
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Iyadoo la adeegsanayo hal-abuurka
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                Ka fikir adduun uu arday kasta oo Soomaali ah, meel kasta oo uu
                joogo ama xaalad kasta uu ku jiro, uu heli karo waxbarasho tayo
                leh oo awood u siinaysa inu ku guuleyso qarnigan tignoolajiyada
                ku saleysan.
              </p>
              <Link href={"/welcome"}>
                <Button className="group" size="lg">
                  Baro wax badan{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <motion.div
              className="lg:w-1/2 relative h-[300px] sm:h-[400px]"
              animate={{
                y: [0, 10, 0],
                rotate: [0, 1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Image
                src={HERO_IMAGE || "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDYwIDM5NiIgZm9jdXNhYmxlPSJmYWxzZSIgY2xhc3M9ImNoYWtyYS1pY29uIGNzcy0xdmxiYnRxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMDYuODgzIDM4Ny4zOTRWMzk1LjU2OUgxNjIuMjAxVjM4Ny4zOTRMMTM4LjQ5MyAzNjguMzE4SDEyMi4yNzJMMTA2Ljg4MyAzODcuMzk0WiIgZmlsbD0iYmxhY2siPjwvcGF0aD48cGF0aCBkPSJNOTAuNTE5NSAzODcuMzk0VjM5NS41NjlIMTQ1LjgzOFYzODcuMzk0TDEyMi4xMyAzNjguMzE4SDEwNS45MDlMOTAuNTE5NSAzODcuMzk0WiIgZmlsbD0iYmxhY2siPjwvcGF0aD48cGF0aCBkPSJNOTguMzA4NiAzODYuOTg3VjM5MS41MjlIMTM0LjkyOFYzODYuOTg3TDExOS4yMzQgMzc0LjM3MUgxMDguNDk2TDk4LjMwODYgMzg2Ljk4N1oiIGZpbGw9ImJsYWNrIj48L3BhdGg+PGxpbmUgeTE9Ii0xLjM1NTQ1IiB4Mj0iMzAuODczNSIgeTI9Ii0xLjM1NTQ1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSA5MC4xNzE5IDI3My4xOTYpIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuNzEwOSI+PC9saW5lPjxyZWN0IHdpZHRoPSIzMC44NzM1IiBoZWlnaHQ9IjM4Ljc4OTgiIHRyYW5zZm9ybT0ibWF0cml4KC0xIDAgMCAxIDkwLjE2OCAyNDAuODcxKSIgZmlsbD0iIzUzNTM1MyI+PC9yZWN0PjxsaW5lIHkxPSItMS4xODY5IiB4Mj0iMzAuODczNSIgeTI9Ii0xLjE4NjkiIHRyYW5zZm9ybT0ibWF0cml4KC0xIDAgMCAxIDkwLjE2OCAyNjMuMTM4KSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiPjwvbGluZT48bGluZSB5MT0iLTEuMTg2OSIgeDI9IjMwLjg3MzUiIHkyPSItMS4xODY5IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSA5MC4xNjggMjUzLjA4MykiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4Ij48L2xpbmU+PHBhdGggZD0iTTEyNi4xODggMjkxLjk5M0wxNDQuMTIgMzE1Ljc3OEwxNjAuNTEyIDMxMi43NjdMMTcyLjg4OSAyOTQuMDM0IiBzdHJva2U9IiNEMEQwRDAiIHN0cm9rZS13aWR0aD0iMTYuMjY1NCI+PC9wYXRoPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIxLjY3MyAyODAuMDdWMzAzLjAyOEgxMDguMjM0VjI4MC4wN0gxMjEuNjczWiIgZmlsbD0iIzUzNTM1MyI+PC9wYXRoPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTA5LjggMjgwLjA3VjMwMy4wMjhIMTIyLjYwOEwxMjguMDA4IDI5Ny43MTNWMjg0Ljc2M0wxMjMuMjM5IDI4MC4wN0gxMDkuOFoiIGZpbGw9IiM1MzUzNTMiPjwvcGF0aD48cGF0aCBkPSJNMTE5LjA2NyAyNjkuMzdIMTkuMTU0MlYyOTMuMTE5VjM4Ni4xMzVIMTM0LjUwNFYyOTMuMTE5TDExOS4wNjcgMjY5LjM3WiIgZmlsbD0iIzhFOEU4RSI+PC9wYXRoPjxyZWN0IHg9Ijc0LjA3MzYiIHk9IjMxMC45MzMiIHdpZHRoPSI0My44NTY2IiBoZWlnaHQ9IjYwLjE2NDkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4Ij48L3JlY3Q+PHJlY3QgeD0iMTE1Ljc3MyIgeT0iMzI2Ljg3MyIgd2lkdGg9IjQuODc4MDMiIGhlaWdodD0iMjkuNTA4NyIgZmlsbD0iIzhFOEU4RSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiPjwvcmVjdD48bGluZSB4MT0iMTE1LjQ4OCIgeTE9IjMzNS4zNjUiIHgyPSIxMjAuOTI3IiB5Mj0iMzM1LjM2NSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjcxMDkiPjwvbGluZT48bGluZSB4MT0iMTE1LjQ4OCIgeTE9IjM0Ni40IiB4Mj0iMTIwLjkyNyIgeTI9IjM0Ni40IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuNzEwOSI+PC9saW5lPjxwYXRoIGQ9Ik01My43NTczIDMwMy40MTRMNjMuMDQxMSAzMDcuODg1TDY1LjMzNCAzMTcuOTMxTDU4LjkwOTQgMzI1Ljk4N0g0OC42MDUxTDQyLjE4MDUgMzE3LjkzMUw0NC40NzM0IDMwNy44ODVMNTMuNzU3MyAzMDMuNDE0WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNNDcuMjc3MyAzMTQuMTdMNTMuNzQwNSAzMDguOTdMNTUuMjk1MyAzMTAuODk4TDUxLjA0OTUgMzE0LjMwN0w1MS45ODkzIDMxNS40NzNMNTYuMTYwNCAzMTIuMTFMNTcuNzE1MiAzMTQuMDM4TDUzLjU0NCAzMTcuNDAxTDU0LjQzMzIgMzE4LjUwNEw1OC44MjA3IDMxNC45MzlMNjAuMzc1NSAzMTYuODY3TDUzLjc1NTYgMzIyLjIwNUw0Ny4yNzczIDMxNC4xN1oiIGZpbGw9ImJsYWNrIj48L3BhdGg+PHBhdGggZD0iTTQzLjA3MDcgMjcxLjM1M0w1Ni45MjQyIDI5NS4xMDFNNTYuOTI0MiAyOTUuMTAxSDEzMy4zMTZNNTYuOTI0MiAyOTUuMTAxVjM3Mi4yODUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4Ij48L3BhdGg+PHBhdGggZD0iTTY5LjY2MTQgMjg4Ljc2OUg3OS45OTE0TDc1Ljk0OTQgMjgyLjgzMUg2NS42MTkzTDY5LjY2MTQgMjg4Ljc2OVpNNjQuMDAzNiAyODAuNDU3SDc0LjMzMzZMNzAuMjkxNiAyNzQuNTE5SDU5Ljk2MTVMNjQuMDAzNiAyODAuNDU3Wk03My4xNjMxIDI3NC41MTlMNzcuMjA1MiAyODAuNDU3SDg3LjUzNTJMODMuNDkzMiAyNzQuNTE5SDczLjE2MzFaTTk2LjY5NDcgMjc0LjUxOUg4Ni4zNjQ3TDkwLjQwNjcgMjgwLjQ1N0gxMDAuNzM3TDk2LjY5NDcgMjc0LjUxOVpNMTAyLjM1MyAyODIuODMxSDkyLjAyMjVMOTYuMDY0NiAyODguNzY5SDEwNi4zOTVMMTAyLjM1MyAyODIuODMxWk04Mi44NjMgMjg4Ljc2OUg5My4xOTNMODkuMTUxIDI4Mi44MzFINzguODIwOUw4Mi44NjMgMjg4Ljc2OVpNMTA1LjIyNCAyODIuODMxTDEwOS4yNjYgMjg4Ljc2OUgxMTkuNTk2TDExNS41NTQgMjgyLjgzMUgxMDUuMjI0Wk0xMDMuNjA4IDI4MC40NTdIMTEzLjkzOEwxMDkuODk2IDI3NC41MTlIOTkuNTY2M0wxMDMuNjA4IDI4MC40NTdaIiBmaWxsPSIjRkY1RDVEIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuMzczOCI+PC9wYXRoPjxwYXRoIGQ9Ik0xNi42NDQ1IDM4Ny4zOTRWMzk1LjU2OUg3MS45NjMxVjM4Ny4zOTRMNDguMjU1MSAzNjguMzE4SDMyLjAzMzlMMTYuNjQ0NSAzODcuMzk0WiIgZmlsbD0iYmxhY2siPjwvcGF0aD48cGF0aCBkPSJNMC4yNzczNDQgMzg3LjM5NFYzOTUuNTY5SDU1LjU5NTlWMzg3LjM5NEwzMS44ODc5IDM2OC4zMThIMTUuNjY2N0wwLjI3NzM0NCAzODcuMzk0WiIgZmlsbD0iYmxhY2siPjwvcGF0aD48cGF0aCBkPSJNOC4wNzc3MSAzODYuOTg3TDcuOTkyMjYgMzkxLjAyNEg0NC42MTE2TDQ0LjY5NyAzODYuOTg3TDI5LjAwMyAzNzQuMzcxSDE4LjI2NUw4LjA3NzcxIDM4Ni45ODdaIiBmaWxsPSIjNTM1MzUzIj48L3BhdGg+PHBhdGggZD0iTTIzLjk1MzYgMzc0LjM3MUgyOC45OTA1TDQ1LjEwODcgMzg2Ljk4N1YzOTEuMDI0SDI3LjY2ODhIMjAuMjM4M0wxNS42MDU1IDM4NC44NTlMMTcuMjU4OSAzNzcuNjAxTDIzLjk1MzYgMzc0LjM3MVoiIGZpbGw9IiM4RThFOEUiPjwvcGF0aD48cGF0aCBkPSJNMjQuNDUzMSAzNzUuMzgxTDMxLjE0NzggMzc4LjYxMUwzMi4wMDg1IDM4NS40NzRMMjcuOTc5IDM5MC4wMTUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4Ij48L3BhdGg+PHBhdGggZD0iTTI0LjA1ODYgMjY5LjYzN0wxNDAuNDYyIDIyNS4yMDZMMTI5LjUxMiAxOTYuNTE4TDExMC44ODkgMTg4LjE4NUwyMi4wNTUgMjIyLjA5MkwxMy4xMDg3IDI0MC45NDlMMjQuMDU4NiAyNjkuNjM3WiIgZmlsbD0iIzhFOEU4RSI+PC9wYXRoPjxwYXRoIGQ9Ik02MC4wMjczIDI1NS45MDZMMTQwLjQ1NCAyMjUuMjA4TDEyOS41MDQgMTk2LjUyTDExMC44ODEgMTg4LjE4Nkw1OC4wMjM3IDIwOC4zNjJMNDkuMDc3NCAyMjcuMjE4TDYwLjAyNzMgMjU1LjkwNloiIGZpbGw9ImJsYWNrIj48L3BhdGg+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMzMuMDc5IDIyMi4wOTFMNjMuMjI4NCAyNDguNzUzTDU1LjA5ODkgMjI3LjQ1NEw2Mi4wNzcxIDIxMi43NDZMMTEwLjcxMyAxOTQuMTgyTDEyNC45MjQgMjAwLjcyNUwxMzMuMDc5IDIyMi4wOTFaTTEyOS41MDQgMTk2LjUyTDExMC44ODEgMTg4LjE4Nkw1OC4wMjM3IDIwOC4zNjJMNDkuMDc3NCAyMjcuMjE4TDYwLjAyNzMgMjU1LjkwNkwxNDAuNDU0IDIyNS4yMDhMMTI5LjUwNCAxOTYuNTJaIiBmaWxsPSIjOEU4RThFIj48L3BhdGg+PHJlY3QgeD0iODEuNDQ1MyIgeT0iMjI0LjM3OSIgd2lkdGg9IjUuNDI3MzEiIGhlaWdodD0iNi41MTI3NyIgdHJhbnNmb3JtPSJyb3RhdGUoLTIwLjg5MTYgODEuNDQ1MyAyMjQuMzc5KSIgZmlsbD0iI0ZGNUQ1RCI+PC9yZWN0PjxwYXRoIGQ9Ik0xMTYuNTkgMjEwLjU1NUwxMjEuMTUzIDIwOC44MTNMMTIzLjQ3NiAyMTQuODk3TDExOC45MTIgMjE2LjYzOUwxMTYuNTkgMjEwLjU1NVoiIGZpbGw9IiNGRjVENUQiPjwvcGF0aD48cmVjdCB4PSItMC4zOTE0OTIiIHk9IjAuODc0ODQ2IiB3aWR0aD0iNS41NTU1NSIgaGVpZ2h0PSIzOC4zODI4IiB0cmFuc2Zvcm09Im1hdHJpeCgtMC45MzQyNTcgMC4zNTY2IDAuMzU2NiAwLjkzNDI1NyA4OS42NjUyIDE5OS4zMDkpIiBmaWxsPSIjOEU4RThFIiBzdHJva2U9IiM4RThFOEUiIHN0cm9rZS13aWR0aD0iMS4zNTU0NSI+PC9yZWN0PjxwYXRoIGQ9Ik01Mi4xNDg0IDIxNC4yOThMNDUuNjYxMSAyMjguNzk1TDU1LjgyNzEgMjU1LjQyOCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiPjwvcGF0aD48cmVjdCB3aWR0aD0iMTIuMDk0MiIgaGVpZ2h0PSI0LjMxOTM3IiB0cmFuc2Zvcm09Im1hdHJpeCgtMC45MzQyNTcgMC4zNTY2IDAuMzU2NiAwLjkzNDI1NyA5My43NzM0IDE5MC4wOTYpIiBmaWxsPSIjNTM1MzUzIj48L3JlY3Q+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04Ni44NzExIDE4Mi4zMjRMNjUuMDgxNCAxOTAuNjQxTDcwLjA4NyAyMDMuNzU2TDc0LjUyNDUgMjAyLjA2Mkw3MS4yMTI2IDE5My4zODVMODQuMTI3NCAxODguNDU2TDg1Ljg5OSAxOTMuMDk3TDkwLjMzNjUgMTkxLjQwM0w4Ni44NzExIDE4Mi4zMjRaIiBmaWxsPSIjRkY1RDVEIj48L3BhdGg+PHJlY3Qgd2lkdGg9IjEyLjA5NDIiIGhlaWdodD0iNC4zMTkzNyIgdHJhbnNmb3JtPSJtYXRyaXgoLTAuOTM0MjU3IDAuMzU2NiAwLjM1NjYgMC45MzQyNTcgNjIuMjg5MSAyMDIuMTA3KSIgZmlsbD0iIzUzNTM1MyI+PC9yZWN0PjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTguMDM5MSAxOTkuMjYyTDM2LjU5MTEgMjA3LjQ0OEwzOS42OTYzIDIxNS41ODRMNDQuMTMzOSAyMTMuODlMNDIuNzIyNCAyMTAuMTkyTDU5LjczMjggMjAzLjY5OUw1OC4wMzkxIDE5OS4yNjJaIiBmaWxsPSIjNDU2REZGIj48L3BhdGg+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNy44NjY3IDI4NS41MDFWMzA4LjQ1OEgzMC42NzQyTDM2LjA3NDIgMzAzLjE0NFYyOTAuMTk0TDMxLjMwNTYgMjg1LjUwMUgxNy44NjY3WiIgZmlsbD0iIzUzNTM1MyI+PC9wYXRoPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjguMTgwMSAyODUuNTAxVjMwOC40NThIMTUuMzcyN0w5Ljk3MjY2IDMwMy4xNDRWMjkwLjE5NEwxNC43NDEzIDI4NS41MDFIMjguMTgwMVoiIGZpbGw9IiM1MzUzNTMiPjwvcGF0aD48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwNi4wMDUgMzExLjY0N0w5OC4xMjM1IDMwMy43NjZMOTguMTIzNSAyODguNjc0TDEwNi43NCAyODAuMDU4TDExMS4yMTggMjg0LjUzNkwxMDQuNDU3IDI5MS4yOThMMTA0LjQ1NyAzMDEuMTQzTDEwOC42MjggMzA1LjMxNEwxMTguNDczIDMwNS4zMTRMMTI1LjIzNSAyOTguNTUzTDEyOS43MTMgMzAzLjAzMUwxMjEuMDk3IDMxMS42NDdMMTA2LjAwNSAzMTEuNjQ3WiIgZmlsbD0iYmxhY2siPjwvcGF0aD48cGF0aCBkPSJNMTE0Ljg2NyAzMjMuNDk1TDkxLjY1MjMgMjQ2LjI4OUwyMzAuODM2IDI4OC42MjZMMTE0Ljg2NyAzMjMuNDk1WiIgZmlsbD0id2hpdGUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHJlY3QgeD0iMTA5Ljg1NyIgeT0iMzA3LjM3MSIgd2lkdGg9IjE3LjAyODciIGhlaWdodD0iMTcuMDI4NyIgdHJhbnNmb3JtPSJyb3RhdGUoLTE2LjczNDkgMTA5Ljg1NyAzMDcuMzcxKSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiPjwvcmVjdD48cGF0aCBkPSJNMTAyLjYzNyAyODkuMTkxTDEwOS44NzQgMjgyLjMzNCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI1LjY5NzEyIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTE3Ni43OTMgMzA0LjgzNEwxNzQuOTAxIDI5NS4wNDUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNS42OTcxMSIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PC9wYXRoPjxwYXRoIGQ9Ik0xNjAuMTY0IDMxNi4xNjJMMTU2LjUwNCAzMDMuOTg5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuMzczOCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PC9wYXRoPjxwYXRoIGQ9Ik0xNjUuOTM0IDMxNC40MjdMMTYyLjI3MyAzMDIuMjUzIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuMzczOCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PC9wYXRoPjxwYXRoIGQ9Ik0xNDkuODYzIDI3MC4yOTFMMTUzLjQ1IDI1OC4wOTUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTE1NS42NDEgMjcxLjk4MUwxNTkuMjI3IDI1OS43ODYiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTE2MS40MTggMjczLjY4M0wxNjUuMDA0IDI2MS40ODciIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTIzIDI5Ni4zNDFWMzEzLjE2NUwzMy44NTQ2IDMyNC4wMkg4NC44NzE0TDk4LjQzOTYgMzEwLjQ1MiIgc3Ryb2tlPSIjRDBEMEQwIiBzdHJva2Utd2lkdGg9IjE2LjI2NTQiPjwvcGF0aD48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTkxLjY0MSAzMDUuNzg0TDkxLjY0MSAzMTAuNjM5TDk4LjM0IDMxNy4zMzhMMTAzLjgzOCAzMTcuMzM4TDExMC4wMzcgMzExLjE0TDExMC4wMzcgMzA1LjY0MUwxMDMuMzM4IDI5OC45NDJMOTguNDgyNSAyOTguOTQyTDkxLjY0MSAzMDUuNzg0WiIgZmlsbD0iIzUzNTM1MyI+PC9wYXRoPjxsaW5lIHgxPSI5OC4wOTEzIiB5MT0iMzAzLjgiIHgyPSIxMDQuNDA1IiB5Mj0iMzEwLjExNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjcxMDkiPjwvbGluZT48cmVjdCB4PSIyNjIuODIiIHk9IjE4NC4wMDYiIHdpZHRoPSIxMy43Mjk1IiBoZWlnaHQ9IjEzLjcyOTUiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuMzczOCI+PC9yZWN0PjxyZWN0IHg9IjE5MS44NTUiIHk9IjEyNi4zNjkiIHdpZHRoPSI3MC4zODkxIiBoZWlnaHQ9IjcwLjM4OTEiIGZpbGw9IiNGRjVENUQiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4Ij48L3JlY3Q+PHJlY3QgeD0iMjYyLjgyIiB5PSIxOTcuOTM4IiB3aWR0aD0iMTI0LjY2MyIgaGVpZ2h0PSIxMjQuNjYzIiBmaWxsPSIjNDU2REZGIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuMzczOCI+PC9yZWN0PjxyZWN0IHg9IjMzNC42NjUiIHk9IjIuNTMzNDQiIHdpZHRoPSIxNDIuODE5IiBoZWlnaHQ9IjE0Mi44MTkiIHRyYW5zZm9ybT0icm90YXRlKDMwIDMzNC42NjUgMi41MzM0NCkiIGZpbGw9IiNGN0MzMjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4Ij48L3JlY3Q+PHBhdGggZD0iTTMyMC42ODQgMTkyLjk2VjIwMS45MDYiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTMyMC42ODQgMzE4LjgwNFYzMjcuNzUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTMyNi4wNTUgMTkyLjk2VjIwMS45MDYiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTMyNi4wNTUgMzE4LjgwNFYzMjcuNzUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTM5Mi4yNjIgMjU0Ljk4NUwzODMuMzE1IDI1NC45ODUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTI2Ni40MTQgMjU0Ljk4NUwyNTcuNDY4IDI1NC45ODUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTM5Mi4yNjIgMjYwLjM1M0wzODMuMzE1IDI2MC4zNTMiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTI2Ni40MTQgMjYwLjM1M0wyNTcuNDY4IDI2MC4zNTMiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTIyNi43NDYgMTIyLjU4MlYxMzAuMzM1TTIyNi43NDYgMTkyLjY2MVYyMDAuNDE0IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuMzczOCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PC9wYXRoPjxwYXRoIGQ9Ik0yNjYuMTA5IDE2MS4zNDhMMjU4LjM1NiAxNjEuMzQ4TTE5Ni4wMyAxNjEuMzQ4TDE4OC4yNzcgMTYxLjM0OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPjwvcGF0aD48cGF0aCBkPSJNMzg2Ljg0OCAzOC44NTE2TDM5Mi4yNzUgMjguOTAzOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPjwvcGF0aD48cGF0aCBkPSJNMzkxLjU1NSA0MS40MjQ4TDM5Ni45ODIgMzEuNDc3MiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPjwvcGF0aD48cGF0aCBkPSJNMzk2LjI3IDQzLjk5NTFMNDAxLjY5NyAzNC4wNDc1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuMzczOCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PC9wYXRoPjxwYXRoIGQ9Ik0zMTcuNzE1IDE2My41MzhMMzIzLjE0MiAxNTMuNTkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTMyMi40MjIgMTY2LjEwOUwzMjcuODQ5IDE1Ni4xNjIiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTMyNy4xMzcgMTY4LjY3OUwzMzIuNTY0IDE1OC43MzEiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTQxOS4wMTIgMTMxLjE4N0w0MjguNjk5IDEzNy4wNjYiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTQxNi4yMjMgMTM1Ljc3OUw0MjUuOTEgMTQxLjY1OSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPjwvcGF0aD48cGF0aCBkPSJNNDEzLjQzOCAxNDAuMzYyTDQyMy4xMjUgMTQ2LjI0MiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPjwvcGF0aD48cGF0aCBkPSJNMjk3LjYzMyA1Ni4zNzIxTDMwNy4zMiA2Mi4yNTIiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTI5NC44NDQgNjAuOTY0OEwzMDQuNTMxIDY2Ljg0NDgiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMi4zNzM4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+PHBhdGggZD0iTTI5Mi4wNjIgNjUuNTQ3OUwzMDEuNzUgNzEuNDI3OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyLjM3MzgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPjwvcGF0aD48L3N2Zz4="}
                alt="Garaad Global Learning"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Core Values Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Qiimahayaga
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Qiimahayaga aasaasiga ah
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Cilmi-baaris",
                icon: "🔍",
                description:
                  "Waxaan si joogto ah u su&apos;aalnaa, u sahaminnaa, oo aan hal-abuur ku sameynaa si aan u helno hababka ugu wanaagsan.",
              },
              {
                title: "Xawaare",
                icon: "⚡",
                description:
                  "Waxaan si degdeg ah u dhisnaa, u tijaabinnaa, oo aan u hagaajinnaa, annagoo si joogto ah u horumarineyna.",
              },
              {
                title: "Mas&apos;uuliyad",
                icon: "🤝",
                description:
                  "Waxaan si qoto dheer ugu xiranahay guusha Garaad iyo mustaqbalka ardaydeena.",
              },
              {
                title: "Tayo",
                icon: "✨",
                description:
                  "Waxaan ku dadaalnaa heer sare wax kasta oo aan qabanno.",
              },
              {
                title: "Isgaarsiin",
                icon: "💬",
                description:
                  "Waxaan si firfircoon u dhegeysannaa jawaabaha ardaydeena, macallimiinteena, iyo bulshadeena.",
              },
              {
                title: "Hal-abuur",
                icon: "💡",
                description:
                  "Waxaan ku dadaalnaa inaan soo bandhigno xalal cusub oo wax ku ool ah.",
              },
            ].map((value, index) => (
              <motion.div key={index} variants={fadeIn} className="h-full">
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="text-3xl mb-2">{value.icon}</div>
                    <CardTitle className="text-xl text-primary">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What Makes Us Special Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Sifooyinkayaga
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Maxaa Garaad ka dhigaya mid gaar ah?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Si gaar ah loogu talagalay ardayda Soomaaliyeed",
                description:
                  "Waxaan fahamsanahay xaaladda dhaqanka iyo kala duwanaanta luqadda ee dadka aan beegsaneyno.",
                color: "bg-gradient-to-br from-emerald-50 to-teal-50",
                borderColor: "border-l-emerald-400",
              },
              {
                title: "Diiradda saaraya xallinta dhibaatooyinka",
                description:
                  "Koorsooyinkayagu waxay xoogga saaraan waxbarashada ku saleysan ficilka iyo fikirka qoto dheer.",
                color: "bg-gradient-to-br from-sky-50 to-blue-50",
                borderColor: "border-l-sky-400",
              },
              {
                title: "Isticmaal xog yar",
                description:
                  "Waxaan jebineynaa caqabadaha helitaanka anagoo naqshadeynayna barxad isticmaalka xogta yaraysa.",
                color: "bg-gradient-to-br from-amber-50 to-yellow-50",
                borderColor: "border-l-amber-400",
              },
              {
                title: "Dhismaha bulsho",
                description:
                  "Waxaan dhiseynaa nidaam taageero oo ardayda Soomaaliyeed ay ku xiriiri karaan.",
                color: "bg-gradient-to-br from-rose-50 to-pink-50",
                borderColor: "border-l-rose-400",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <div
                  className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${feature.color} p-8 border-l-4 ${feature.borderColor}`}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Vision and Mission */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Yoolkayaga
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Himilada & Aragtida
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Waxaan ku dadaalnaa inaan hormarino waxbarashada ardayda
              Soomaaliyeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeIn}>
              <Card className="h-full border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    Himilada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg">
                    Awoodsiinta ardayda Soomaaliyeed waxbarasho la heli karo oo
                    isdhexgal ah oo dhista fikirka qoto dheer iyo xirfadaha STEM
                    si ay ugu guuleystaan adduun tignoolajiyaddu hoggaamiso.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="h-full border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    Aragtida
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg">
                    Kacdoonka nidaamka dhijitaalka ah iyadoo la bixinayo
                    waxbarasho tayo leh oo awood u siinaysa ardayda Soomaaliyeed
                    inay ku kobcaan caalamka.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="rounded-2xl bg-gradient-to-br from-gray-50 to-slate-100 p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Xiriir
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nala soo xiriir
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 mb-8">
              Waxaan ku faraxsanahay inaan kaa jawaabno su&apos;aalohaaga ama aan kaa
              caawino wixii aad u baahan tahay
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                href="https://www.linkedin.com/company/garaad"
                target="_blank"
                aria-label="LinkedIn"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
              </Link>
              <Link
                href="https://x.com/Garaadstem"
                target="_blank"
                aria-label="Twitter"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </Button>
              </Link>
              <Link
                href="http://facebook.com/Garaadstem"
                target="_blank"
                aria-label="Facebook"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="mailto:Info@garaad.org" aria-label="Email">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
              <Mail className="w-5 h-5 text-primary" />
              <a
                href="mailto:Info@garaad.org"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Info@garaad.org
              </a>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
