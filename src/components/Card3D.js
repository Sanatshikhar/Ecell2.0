import React from "react";
import "./Card3D.css";

const Card3D = ({ image, title, children }) => {
  return (
  <div className="card3d-hover relative w-full mb-8 perspective-500" style={{ maxWidth: '380px', height: '480px' }}>
    <div
      className="card w-full h-full relative"
      style={{
        borderRadius: "1rem"
      }}
    >
      <div
        className="card-front"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "1rem"
        }}
      >
        <div className="frame absolute inset-0 flex items-center justify-center rounded-xl">
          {children ? children : (
            <h2 className="text-white text-center text-xl font-bold">
              {title}
            </h2>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Card3D;
