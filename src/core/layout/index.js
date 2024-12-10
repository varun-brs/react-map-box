import React from "react";

export const Layout = (props) => {
  const { children } = props;

  return (
    <>
      <main role="main" className="container-fluid pt-5">
        <div className="pt-5 mt-3">{children}</div>
      </main>
    </>
  );
};
