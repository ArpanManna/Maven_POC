import React, { useCallback, useState } from 'react'
import moment from 'moment/moment';
import { uploadFileToIPFS } from '@/lib/IPFSClient';
import { createJobPost } from '@/utils/service';
import { useWeb3 } from '@3rdweb/hooks';
import Spinner from './UI/Spinner';
import { TransactionToastMessage } from './UI/Toast';
import { DatePicker, Input } from 'antd';
import * as db from '@/utils/polybase';
import { useRouter } from 'next/router';
import { useContextState } from '@/context';
import UserSkillDetails from './UserSkillDetails';

const ProjectForm = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ "projectName": "", "projectDescription": "", "priceFrom": "", "priceTo": "" });
    const [deadline, setDeadline] = useState(new Date());
    const { projectName, projectDescription, priceFrom, priceTo } = form;
    const [file, setFile] = useState();
    const { address, chainId, provider } = useWeb3();
    const router = useRouter();
    const [{}, dispatch] = useContextState();

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSkillsChange = (skill) => {
        setSkills(skill);
      }

    const handleFormChange = async (e) => {
        const { name, value } = e.target;
        if (name === ("priceFrom" || "priceTo")) {
            const reg = /^-?\d*(\.\d*)?$/;
            if (reg.test(value) || value === '' || value === '-') {
                setForm({
                    ...form, [name]: value
                })
            }
        } else
            setForm({
                ...form, [name]: value
            })
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (projectName && projectDescription && priceFrom && priceTo && skills) {
            setLoading(true);
            form.skillsRequired = skills;
            const metaDataURI = await uploadFileToIPFS(JSON.stringify(form))
            let fileURI = '';
            if (file) {
                fileURI = await uploadFileToIPFS(file);
            }
            try {
                const res = await createJobPost(chainId, provider, metaDataURI, priceFrom, priceTo, fileURI, moment(deadline).unix(), txNotify, address, dispatch)
                
                await db.createProject(res, projectName, projectDescription, [], skills, priceFrom, priceTo);
                for (let i = 0; i < skills.length; i += 1) {
                    await db.publicProject(skills[i], projectId);
                }
                if (res) await getProjectsByUser(chainId, provider, address);
                router.push("/dashboard");
                // setTags([]);
                // setFile();
                // setDeadline(new Date())
                // setForm({ "projectName": "", "projectDescription": "", "priceFrom": "", "priceTo": "" })
                setLoading(false);
            } catch (err) {
                console.log(err)
                // router.push("/dashboard");
                setLoading(false)
            }
        }
    }

    const txNotify = useCallback((type, title, txHash) => {
        TransactionToastMessage({ type, title, txHash });
    }, []);

    const handleDeadlineChange = (date, dateString) => {
        setDeadline(date);
    };
    return (
        <form className='my-2'>
            <Input id="projectName" name="projectName" value={projectName} onChange={handleFormChange} type="text" required="" maxLength="100" placeholder="Choose a name for your project" className="block w-full px-5 py-3 text-mono text-gray-800 font-bold placeholder-gray-400 placeholder:font-semibold transition duration-500 ease-in-out transform rounded-lg focus:outline-none focus:border-transparent border-gray-400" />
            <div className="relative mt-3">
                <label htmlFor="projectDescription" className="leading-7 text-md mb-2 font-semibold text-gray-600">Project Description:</label>
                <textarea id="projectDescription" name="projectDescription" value={projectDescription} onChange={handleFormChange} className="w-full bg-gray-100 mt-1 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white h-32 text-base outline-none text-gray-800 py-1 px-3 resize-none leading-6 transition-colors focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 duration-200 ease-in-out" />
            </div>
            <div className="relative mt-2">
                <input className="block w-full p-3 text-sm text-gray-900 cursor-pointer bg-gray-50 border border-gray-300 border-dotted rounded-lg focus:outline-none" id="file_input" type="file" onChange={handleFileChange} />
            </div>
            <div className="relative mt-3">
                <label htmlFor="projectSkills" className="leading-7 text-md mb-2 font-semibold text-gray-600">What skills are required?</label>
                {/* <TagsInput
                    inputProps={{
                        placeholder: 'Enter Skills'
                    }}
                    className='tag-box react-tagsinput rounded-lg my-1'
                    maxTags={5}
                    value={tags}
                    onChange={handleSkillChange} />
                     */}
                     <UserSkillDetails onSkillChange={handleSkillsChange} />
            </div>
            <div className="relative mt-3">
                <label htmlFor="projectDeadline" className="leading-7 text-md mb-2 font-semibold text-gray-600">Estimated Timeline:</label>
                <br />
                <DatePicker onChange={handleDeadlineChange} className='border-gray-600 py-2 placeholder:text-gray-400 mt-2' />
            </div>
            <div className="relative mt-3">
                <label htmlFor="projectBudget" className="leading-7 text-md font-semibold text-gray-600">What is your project estimated budget (in wei)?</label>
                <div className='flex flex-wrap gap-2'>

                    <Input id="priceFrom" pattern='[0-9]+' name="priceFrom" value={priceFrom} onChange={handleFormChange} type="text" required="" placeholder="Lowest Price" className="block w-1/3 px-5 py-2 my-2 text-base text-gray-800 placeholder-gray-400 placeholder:font-semi-bold transition duration-500 ease-in-out transform border-1 rounded-lg bg-gray-50 border border-gray-300" />
                    <h2 className='text-gray-800 mt-4 text-lg'> - </h2>
                    <Input id="priceTo" pattern='[0-9]+' name="priceTo" value={priceTo} onChange={handleFormChange} type="text" required="" placeholder="Highest Price" className="block w-1/3 px-5 py-2 my-2 text-base text-gray-800 placeholder-gray-400 placeholder:font-semi-bold transition duration-500 ease-in-out transform border-1 rounded-lg bg-gray-50 border border-gray-300" />
                </div>
            </div>

            {loading ?
                <div className='py-8'><Spinner /></div>
                :
                <button disabled={loading} type="button" onClick={handleFormSubmit} className="text-white bg-gradient-to-r mt-4 from-palatte1 to-palatte4 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-30 shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4">Submit the Post</button>
            }
        </form>
    )
}

export default ProjectForm