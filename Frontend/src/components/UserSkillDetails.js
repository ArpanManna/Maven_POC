import React, { useState } from "react";
import { Select } from "antd";

const UserSkillDetails = ({onSkillChange}) => {
  const [items, setItems] = useState([{
    value: "solidity",
    label: "Solidity",
  },
  {
    value: "java",
    label: "Java",
  },
  {
    value: "C++",
    label: "C++",
  },
  {
    value: "Rust",
    label: "Rust",
  },
  {
    value: "Hardhat",
    label: "hardhat",
  },
  {
    value: "AMM",
    label: "AMM",
  },
  {
    value: "Ethereum",
    label: "Ethereum",
  },
  {
    value: "Solana",
    label: "Solana",
  }
]);
  
  return (
    <div className=" py-2">
      <h2 className="mt-4 mb-2 font-semibold">Skills:</h2>
      <Select
        mode="multiple"
        size={"middle"}
        placeholder="Please select"
        defaultValue={[]}
        className="w-full py-1"
        options={items}
        onChange={onSkillChange}
      />
    </div>
  );
};

export default UserSkillDetails;
