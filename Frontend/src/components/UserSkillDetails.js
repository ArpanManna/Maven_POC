import React, { useState } from "react";
import { Select } from "antd";

const UserSkillDetails = ({onSkillChange}) => {
  const [items, setItems] = useState([
  {
    "value": "Solidity",
    "label": "Solidity"
  },
  {
    "value": "Next.js",
    "label": "Next.js"
  },
  {
    "value": "Ethereum",
    "label": "Ethereum"
  },
  {
    "value": "Node.js",
    "label": "Node.js"
  },
  {
    "value": "AWS",
    "label": "AWS"
  },
  {
    "value": "Python",
    "label": "Python"
  },
  {
    "value": "Javascript",
    "label": "JavaScript"
  },
  {
    "value": "UI/UX",
    "label": "UI/UX"
  },
  {
    "value": "Rust",
    "label": "Rust"
  },
  {
    "value": "C++ Programming",
    "label": "C++ Programming"
  },
  {
    "value": "SEO",
    "label": "SEO"
  },
  {
    "value": "Communication",
    "label": "Communication"
  },
  {
    "value": "React.js",
    "label": "React.js"
  },
]);
  
  return (
    <div className="py-2">
      <Select
        mode="multiple"
        size={"middle"}
        placeholder="Please select"
        defaultValue={[]}
        className="w-full"
        options={items}
        onChange={onSkillChange}
      />
    </div>
  );
};

export default UserSkillDetails;
