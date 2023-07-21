import React, { useCallback, useEffect, useState } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { uploadFileToIPFS } from "@/lib/IPFSClient";
import { createUserProfile, getUserDetails } from "../utils/service";
import UserSkillDetails from "./UserSkillDetails";
import { Avatar, Segmented, Space, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Spinner from "./UI/Spinner";
import { TransactionToastMessage } from "./UI/Toast";
import { OptInChannel, fetchNotifications } from "@/lib/pushProtocol";
import { useRouter } from "next/router";
import { useContextState } from "@/context";
import * as db from '@/utils/polybase';
import { sendNotification } from "@/lib/Notify";

const UserDetailsForm = () => {
  const [user, setUser] = useState("freelancer");
  const [loading, setLoading] = useState(false);
  const { address, chainId, provider } = useWeb3();
  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    summary: "",
  });
  const { fullName, headline, summary } = form;
  const [file, setFile] = useState();
  const [skills, setSkills] = useState([]);
  const router = useRouter();
  const [{}, dispatch] = useContextState();

  const handleFileChange = async (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setForm({ ...form, skills: skills })
    const metaDataURI = await uploadFileToIPFS(JSON.stringify(form));
    let fileURI = "";
    if (file) {
      fileURI = await uploadFileToIPFS(file);
    }
    const profileURI = await uploadFileToIPFS(JSON.stringify({
      metaDataURI, fileURI
    }))

    try {
      const {owner, tokenId, tba} = await createUserProfile(chainId, provider, user, profileURI, txNotify);
      await OptInChannel(address, provider);
      await sendNotification("Profile Created!", `Your profile with NFTId: ${tokenId} and unique Token Bound Address ${tba} has been created.`, address)
      await fetchNotifications(address, dispatch);

      await db.createProfile(owner, tokenId, tba, form.fullName, form.headline, form.summary, fileURI, skills);
      await getUserDetails(chainId, provider, address, dispatch);
       
      router.push('/browse');
    } catch (err) {
      console.log(err);
    }
    setLoading(false)
  };

  const txNotify = useCallback((type, title, txHash) => {
    TransactionToastMessage({ type, title, txHash });
  }, []);

  const handleSkillsChange = (skill) => {
    setSkills(skill);
  }

  useEffect(() => {
    // if (address) sendNotification("Profile Created!", "You profile NFTId: ${22}, Profile Specific Token Bound Address: ${8723} has been created.`, address)

  },[address])

  return (
    <form className="my-2 px-4 pb-2">
      {loading && <Spinner />}
      <label
        htmlFor="fullName"
        className="leading-7 text-md mb-4 font-bold text-gray-600"
      >
        Full Name
      </label>
      <Input
        id="fullName"
        name="fullName"
        value={fullName}
        onChange={handleFormChange}
        type="text"
        required=""
        placeholder="Full Name"
        className="block w-full px-5 py-2 text-mono text-gray-800 font-semibold placeholder-gray-400 placeholder:font-semibold transition duration-500 ease-in-out transform rounded-lg"
      />
      <label
        htmlFor="headline"
        className="leading-7 text-md mb-4 font-bold text-gray-600"
      >
        Professional Headline
      </label>
      <Input
        id="headline"
        name="headline"
        value={headline}
        onChange={handleFormChange}
        type="text"
        required=""
        placeholder="Professional Headline"
        className="block w-full px-5 py-2 mt-1 text-mono text-gray-800 font-semibold placeholder-gray-400 placeholder:font-semibold transition duration-500 ease-in-out transform rounded-lg"
      />
      <div className="relative mt-2">
        <label
          htmlFor="headline"
          className="leading-7 text-md mb-4 font-bold text-gray-600"
        >
          Profile Picture
        </label>
        <Input
          className="block w-full p-2 text-sm text-gray-900 cursor-pointer bg-gray-100 border border-gray-300 border-dotted rounded-lg focus:outline-none"
          id="file_input"
          type="file"
          onChange={handleFileChange}
        />
      </div>
      <div className="relative mt-3">
        <label
          htmlFor="Bio"
          className="leading-7 text-md mb-4 font-bold text-gray-600"
        >
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          value={summary}
          onChange={handleFormChange}
          className="w-full bg-gray-100 mt-1 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white h-32 text-base outline-none text-gray-800 py-1 px-3 resize-none leading-6 transition-colors focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 duration-200 ease-in-out"
        />
      </div>
      <div className="w-full mt-2">
        <h2 className="font-semibold my-4">Select Your Role:</h2>
        <Segmented
          onChange={setUser}
          options={[
            {
              label: (
                <div style={{ padding: 8 }}>
                  <Avatar style={{ backgroundColor: "#f56a00" }} icon={<UserOutlined />}></Avatar>
                  <div>Freelancer</div>
                </div>
              ),
              value: "freelancer",
            },
            {
              label: (
                <div style={{ padding: 4 }}>
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />
                  <div>Hire a freelancer</div>
                </div>
              ),
              value: "client",
            },
          ]}
        />
      </div>

      {user === "freelancer" && <UserSkillDetails onSkillChange={handleSkillsChange} />}
      <div className="px-4 py-2">
        <button
          type="button"
          onClick={handleFormSubmit}
          className="text-white bg-gradient-to-r mt-2 from-blue-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-30 shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 float-right py-2.5 text-center mb-4"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default UserDetailsForm;
