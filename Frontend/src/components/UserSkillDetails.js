import React, { useState } from "react";
import { Select } from "antd";

const UserSkillDetails = ({onSkillChange}) => {
  const [items, setItems] = useState([
  {
    "value": "3",
    "label": "PHP"
  },
  {
    "value": "4",
    "label": "Perl"
  },
  {
    "value": "5",
    "label": "ASP"
  },
  {
    "value": "6",
    "label": "C Programming"
  },
  {
    "value": "7",
    "label": "Java"
  },
  {
    "value": "8",
    "label": "JSP"
  },
  {
    "value": "9",
    "label": "JavaScript"
  },
  {
    "value": "10",
    "label": "XML"
  },
  {
    "value": "11",
    "label": "Cold Fusion"
  },
  {
    "value": "12",
    "label": "Adobe Flash"
  },
  {
    "value": "13",
    "label": "Python"
  },
  {
    "value": "14",
    "label": "Visual Basic"
  },
  {
    "value": "15",
    "label": ".NET"
  },
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
