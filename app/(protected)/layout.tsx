import React from "react";

interface PendingLayoutProps {
  children: React.ReactNode;
}

const PendingLayout = ({ children }: PendingLayoutProps) => {
  return <div className="">{children}</div>;
};

export default PendingLayout;
