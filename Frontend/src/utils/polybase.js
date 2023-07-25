import { Auth } from '@polybase/auth';
import { Polybase } from '@polybase/client';
import * as async from 'async';
import * as crypto from 'crypto';

const auth = typeof window !== "undefined" ? new Auth() : null;

const dbAuth = new Polybase({
    defaultNamespace: 'pk/0xa19aa505ca2151e5f7f6d8f1c5d74afe10a0fa7b5f6968fab70cb8b98a84fdb0187a7b01bb8ff5724f8798a78aeafdc2b435a071846d139031c301a3d036dc6f/maven-prod',
    signer: (async (data) => {
        return {
          h: "eth-personal-sign",
          sig: await auth?.ethPersonalSign(data)
        };
    })
});

const db = new Polybase({
    defaultNamespace: 'pk/0xa19aa505ca2151e5f7f6d8f1c5d74afe10a0fa7b5f6968fab70cb8b98a84fdb0187a7b01bb8ff5724f8798a78aeafdc2b435a071846d139031c301a3d036dc6f/maven-prod',
});

const collections = {
  bid: (auth) => (auth ? dbAuth : db).collection('bidTest0'),
  category: (auth) => (auth ? dbAuth : db).collection('categoryTest0'),
  education: (auth) => (auth ? dbAuth : db).collection('educationTest0'),
  experience: (auth) => (auth ? dbAuth : db).collection('experienceTest0'),
  mlestone: (auth) => (auth ? dbAuth : db).collection('milestoneTest0'),
  portfolio: (auth) => (auth ? dbAuth : db).collection('portfolioTest0'),
  profileSubType: (auth) => (auth ? dbAuth : db).collection('profileSubTypeTest0'),
  profile: (auth) => (auth ? dbAuth : db).collection('profileTest0'),
  ProjectSkillMapping: (auth) => (auth ? dbAuth : db).collection('projectSkillMapping'),
  project: (auth) => (auth ? dbAuth : db).collection('projectTest0'),
  publication: (auth) => (auth ? dbAuth : db).collection('publicationTest0'),
  qualification: (auth) => (auth ? dbAuth : db).collection('qualificationTest0'),
  review: (auth) => (auth ? dbAuth : db).collection('reviewTest0'),
  skill: (auth) => (auth ? dbAuth : db).collection('skillTest0'),
};

const createProject = async (id, address, tba, tokenId, title, desc, mediaUris, skills, ll, ul, deadline) => {
  const params = [
    id, address, tba, tokenId, title, desc, mediaUris, skills,
    ll, ul, deadline, `${Math.round(new Date().getTime() / 1000)}`
  ];
  await collections.project(true).create(params);
};

const publicProject = async (id, projectId) => {
  await collections.ProjectSkillMapping(false)
    .record(id)
    .call('addProject', [collections.project(false).record(projectId)]);
};

const createBid = async (id, address, amount, delivery, desc, media, milestones) => {
  const params = [id, address, amount, delivery, desc, media, milestones];
  // const id = crypto.createHash('sha256')
  //             .update(`${JSON.stringify(params)}_${new Date().getTime()}}`)
  //             .digest('base64');
  await collections.bid(true).create(params);
  return id;
};

const addBidToProject = async (projectId, bidId) => {
  await collections.project(true).record(projectId)
    .call('addBidder', [collections.bid(false).record(bidId)]);
};

const getAllJobPosts = async (status) => {
  const data = [];
  let response = await collections.project(false).get();
                    // .where('status', '==', status)
  do {
    for (const _data of response.data) {
      if (_data.data.status !== status) continue;
      data.push(_data.data);
    }
    response = await response.next();
  } while (response.data.length);
  return data;
};

const getJob = async (id) => {
  const response = await collections.project(false).record(id).get();
  const retData = response.data ? response.data : {};
  if (response.data) {
    const data = {};
    await async.eachLimit(response.data.bids, 50, async (bid) => {
      data[bid.id] = await collections.bid(false).record(bid.id).get();
    });
    retData.bids = [];
    Object.keys(data).forEach((x) => {
      if (data[x].data.milestones) data[x].data.milestones = JSON.parse(data[x].data.milestones);
      retData.bids.push(data[x].data);
    });
  }
  return retData;
};

const createProfileSubType = async (type, publicKey) => {
  const id = `${type}_${publicKey}`;
  try {
    await collections.profileSubType(false).create([id]);
    return id;
  } catch (err) {
    console.log(err);
    return id;
    // throw err;
  }
};

const createProfile = async (publicKey, tokenId, tba, name, title, bio, imageUri, skills) => {
  try {
    const { data } = await collections.profile(false).record(publicKey).get();
    if (data) {
      await collections.profile(true).record(publicKey).call(
        'updateMetadata',
        [tokenId, tba, name, title, bio, imageUri, skills],
      );
      return;
    }
    const threads = [
      createProfileSubType('freelancer', publicKey),
      createProfileSubType('client', publicKey)
    ];
    const [freelancerId, clientId] = await Promise.all(threads);
    
    await collections.profile(true).create([
      publicKey, tokenId, tba, name, title, bio, imageUri, skills,
      collections.profileSubType(false).record(clientId),
      collections.profileSubType(false).record(freelancerId)]
    );
  } catch (err) {
    console.log(err);
  }
};

const getUserProfile = async (id) => {
  const data = await collections.profile(false).record(id).get();
  return data.data;
};

const selectBid = async (id, bidId) => {
  await collections.project(true).record(id).call('selectBidder', [
    collections.bid(false).record(bidId),
  ]);
};

module.exports = {
  createProfile,
  createProject,
  createBid,
  selectBid,
  addBidToProject,
  publicProject,
  getAllJobPosts,
  getUserProfile,
  getJob,
};
