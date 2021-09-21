import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory, Link, NavLink } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { AuthContext } from '../contextStore/AuthContext';
import {
  getFollowersForUser,
  getFollowingForUser,
  getUserRef,
  toggleFollow,
  isFollowing,
} from '../firebase/collections';
import './FollowersPage.css';

function FollowersPage() {
  const { userId } = useParams();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStates, setFollowStates] = useState({});

  const isFollowers = history.location.pathname.includes('/followers');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = isFollowers ? getFollowersForUser(userId, 100) : getFollowingForUser(userId, 100);
    q.get()
      .then((snap) => {
        const docs = snap.docs.map((d) => d.data());
        const ids = docs.map((d) => (isFollowers ? d.followerId : d.followingId));
        return Promise.all(ids.map((id) => getUserRef(id).get())).then((userSnaps) => {
          const userMap = {};
          userSnaps.forEach((s, i) => {
            if (s.exists && ids[i]) userMap[ids[i]] = { id: s.id, ...s.data() };
          });
          setList(docs.map((doc) => {
            const id = isFollowers ? doc.followerId : doc.followingId;
            return { ...doc, user: userMap[id] };
          }));
        });
      })
      .finally(() => setLoading(false));
  }, [userId, isFollowers]);

  useEffect(() => {
    if (!user?.uid || list.length === 0) return;
    const ids = list.map((d) => (isFollowers ? d.followerId : d.followingId)).filter((id) => id !== user.uid);
    Promise.all(ids.map((id) => isFollowing(user.uid, id))).then((results) => {
      const next = {};
      ids.forEach((id, i) => {
        next[id] = results[i];
      });
      setFollowStates(next);
    });
  }, [user?.uid, list, isFollowers]);

  const handleToggle = (targetId) => {
    if (!user?.uid || user.uid === targetId) return;
    toggleFollow(user.uid, targetId).then(({ action }) => {
      setFollowStates((prev) => ({ ...prev, [targetId]: action === 'followed' }));
    });
  };

  return (
    <Layout>
      <div className="followersPage">
        <div className="followersPageHeader">
          <button type="button" className="followersPageBack" onClick={() => history.push(`/profile/${userId}`)}>
            ← Profile
          </button>
          <h1>{isFollowers ? 'Followers' : 'Following'}</h1>
          <nav className="followersPageTabs">
            <NavLink to={`/profile/${userId}/followers`} className="followersPageTab" activeClassName="active">
              Followers
            </NavLink>
            <NavLink to={`/profile/${userId}/following`} className="followersPageTab" activeClassName="active">
              Following
            </NavLink>
          </nav>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <p className="followersPageEmpty">No one yet.</p>
        ) : (
          <ul className="followersPageList">
            {list.map((item) => {
              const u = item.user;
              const id = isFollowers ? item.followerId : item.followingId;
              if (!u) return null;
              const isOwn = user?.uid === id;
              const following = followStates[id];
              return (
                <li key={id} className="followersPageItem">
                  <Link to={`/profile/${id}`} className="followersPageItemAvatar">
                    {u.avatar ? (
                      <img src={u.avatar} alt="" />
                    ) : (
                      <span>{(u.name || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </Link>
                  <div className="followersPageItemBody">
                    <Link to={`/profile/${id}`} className="followersPageItemName">
                      {u.name || 'User'}
                    </Link>
                    {u.location?.city && (
                      <span className="followersPageItemLocation">{u.location.city}</span>
                    )}
                  </div>
                  {!isOwn && user && (
                    <button
                      type="button"
                      className={`followersPageFollowBtn ${following ? 'following' : ''}`}
                      onClick={() => handleToggle(id)}
                    >
                      {following ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default FollowersPage;
