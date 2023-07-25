import React, { useState } from "react";
import { Select } from "antd";
import skills from '@/constants/skills.json';

const UserSkillDetails = ({onSkillChange}) => {
  const parsedSkills = [];
  for (const skill of skills) {
    parsedSkills.push({
      value: `${skill.name}_${skill.id}`,
      label: skill.name,
    });
  }
  const [items, setItems] = useState(parsedSkills);
  
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
