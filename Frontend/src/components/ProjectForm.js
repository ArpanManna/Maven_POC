import React, { useCallback, useState } from 'react'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import moment from 'moment/moment';
import { uploadFileToIPFS } from '@/lib/IPFSClient';
import { createJobPost } from '@/utils/service';
import { useWeb3 } from '@3rdweb/hooks';
import Spinner from './UI/Spinner';
import ToastMessage from './UI/Toast';

const ProjectForm = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ "projectName": "", "projectDescription": "", "priceFrom": "", "priceTo": "" });
    const [deadline, setDeadline] = useState(new Date());
    const { projectName, projectDescription, priceFrom, priceTo } = form;
    const [file, setFile] = useState();
    const { chainId, provider } = useWeb3();

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    const handleFormChange = async (e) => {
        const { name, value } = e.target;
        setForm({
            ...form, [name]: value
        })
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (projectName && projectDescription && priceFrom && priceTo) {
            setLoading(true);
            form.skillsRequired = tags;
            const metaDataURI = await uploadFileToIPFS(JSON.stringify(form))
            let fileURI = '';
            if (file) {
                fileURI = await uploadFileToIPFS(file);
            }
            try {
                await createJobPost(chainId, provider, metaDataURI, priceFrom, priceTo, fileURI, moment(deadline).unix())
                setLoading(false);
                setTags([]);
                setFile();
                setForm({ "projectName": "", "projectDescription": "", "priceFrom": "", "priceTo": "" })
        notify("success", "Sent!", "Transaction Send Successful!");
                
            } catch (err) {
                console.log(err)
            }
        }
    }

    const notify = useCallback((type, title, body) => {
        ToastMessage({ type, title, body });
      }, []);

    const handleSkillChange = value => {
        setTags(value);
    }

    return (
        <form className='my-2'>
            <input id="projectName" name="projectName" value={projectName} onChange={handleFormChange} type="text" required="" placeholder="Choose a name for your project" className="block w-full px-5 py-3 text-mono text-gray-800 font-bold placeholder-gray-400 placeholder:font-bold transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-100 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
            <div className="relative mt-3">
                <label htmlhtmlFor="projectDescription" className="leading-7 text-md mb-2 font-semibold text-gray-600">Project Description</label>
                <textarea id="projectDescription" name="projectDescription" value={projectDescription} onChange={handleFormChange} className="w-full bg-gray-100 mt-1 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white h-32 text-base outline-none text-gray-800 py-1 px-3 resize-none leading-6 transition-colors focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 duration-200 ease-in-out" />
            </div>
            <div className="relative mt-2">
                <input className="block w-full p-3 text-sm text-gray-900 cursor-pointer bg-gray-100 border border-gray-300 border-dotted rounded-lg focus:outline-none" id="file_input" type="file" onChange={handleFileChange} />
            </div>
            <div className="relative mt-3">
                <label htmlhtmlFor="projectSkills" className="leading-7 text-md mb-2 font-semibold text-gray-600">What skills are required?</label>
                <TagsInput
                    inputProps={{
                        placeholder: 'Enter Skills'
                    }}
                    className='tag-box react-tagsinput my-1'
                    maxTags={10}
                    value={tags}
                    onChange={handleSkillChange} />
            </div>
            <div className="relative mt-3">
                <label htmlhtmlFor="projectBudget" className="leading-7 text-md font-semibold text-gray-600">What is your project estimated budget?</label>
                <div className='flex flex-wrap gap-2'>

                    <input id="priceFrom" pattern='[0-9]+' name="priceFrom" value={priceFrom} onChange={handleFormChange} type="text" required="" placeholder="Estimated price from" className="block w-1/3 px-5 py-2 my-2 text-base text-gray-800 font-bold placeholder-gray-400 placeholder:font-semi-bold transition duration-500 ease-in-out transform border-1 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
                    <h2 className='text-gray-800 mt-4 text-lg'> - </h2>
                    <input id="priceTo" pattern='[0-9]+' name="priceTo" value={priceTo} onChange={handleFormChange} type="text" required="" placeholder="Estimated price to" className="block w-1/3 px-5 py-2 my-2 text-base text-gray-800 font-bold placeholder-gray-400 placeholder:font-semi-bold transition duration-500 ease-in-out transform border-1 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
                </div>
            </div>
            <div className="relative mt-3">
                <label htmlhtmlFor="projectDeadline" className="leading-7 text-md mb-2 font-semibold text-gray-600">Estimated Timeline</label>
                <Calendar onChange={setDeadline} showWeekNumbers className="my-2" value={deadline} />
            </div>
            {loading ? 
            <div className='py-8'><Spinner /></div>
 :
            <button disabled={loading} type="button" onClick={handleFormSubmit} className="text-white bg-gradient-to-r mt-2 from-blue-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-30 shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4">Submit the Post</button>

            }
        </form>
    )
}

export default ProjectForm