import React, { useState } from "react";
import "./LeftPanel.css";
import Logo from "../Assets/a.jpg";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";

const LeftPanel = () => {
  const [selected, setSelected] = useState(0);

  const [expanded, setExpaned] = useState(true);

  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  };

  const demoOptions = [
    { icon: UilBars, heading: "Option 1" },
    { icon: UilBars, heading: "Option 2" },
    { icon: UilBars, heading: "Option 3" },
    { icon: UilBars, heading: "Option 4" },
    { icon: UilBars, heading: "Option 5" },
    { icon: UilBars, heading: "Option 6" },
    { icon: UilBars, heading: "Option 7" },
    { icon: UilBars, heading: "Option 8" },
    { icon: UilBars, heading: "Option 9" },
    { icon: UilBars, heading: "Option 10" },
  ];

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpaned(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        {/* logo */}
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            Sh<span>o</span>ps
          </span>
        </div>

        <div className="menu">
          {demoOptions.map((item, index) => (
            <div
              className={
                selected === index ? "menuItem active" : "menuItem"
              }
              key={index}
              onClick={() => setSelected(index)}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          ))}
          {/* signoutIcon */}
          <div className="menuItem">
            <UilSignOutAlt />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default LeftPanel;
