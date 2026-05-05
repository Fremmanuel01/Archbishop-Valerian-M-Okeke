"use client";

import { motion } from "framer-motion";

export default function FrontendTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        y: { type: "spring", stiffness: 90, damping: 22, mass: 0.7 },
      }}
    >
      {children}
    </motion.div>
  );
}
