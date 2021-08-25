/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { colors } from './styles/colors';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { PostSchema } from '.';
import { FaShare } from 'react-icons/fa';
import { Navbar } from './components/Navbar';
import { Input } from './components/Input';
import { PostList } from './components/PostList';
import { Menu } from './components/Menu';
import { Spinner } from './components/Spinner';
import { About } from './components/About';
import { GlobalStyle } from './styles/GlobalStyle';

const App: React.FC = () => {
  const [posts, setPosts] = useState<PostSchema[]>([]);
  const [title, setTitle] = useState<string>('');
  const [postMsg, setPostMsg] = useState<string>('');
  const [onShare, setOnShare] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sentMsg, setSentMsg] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const getPosts = async () => {
    try {
      const res = await axios.get('https://pskl-api.herokuapp.com/api/posts');

      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateLikes = async (id: string) => {
    const postToUpdate = posts.find((post) => post._id === id);

    try {
      await axios.patch(`https://pskl-api.herokuapp.com/api/posts/${id}`, {
        likes: postToUpdate === undefined ? 0 : postToUpdate?.likes + 1,
      });
      getPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (postMsg.length >= 30) {
      setSubmitting(true);
      try {
        await axios.post('https://pskl-api.herokuapp.com/api/posts', {
          username: title.length ? title : 'anonymous',
          userPost: postMsg,
        });

        setSubmitting(false);
        reset();
      } catch (err) {
        console.error(err);
      }
    } else return;
  };

  const reset = () => {
    setSentMsg(true);
    setTitle('');
    setPostMsg('');
    getPosts();

    setTimeout(() => setSentMsg(false), 3000);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Router>
      <div
        css={css`
          margin: 0;
          padding: 0;
          width: 80%;
          height: 100vh;
          margin: 0 auto;
          text-align: center;
        `}
      >
        <Navbar
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          setOnShare={setOnShare}
        />
        <Menu setShowMenu={setShowMenu} showMenu={showMenu} />
        <div
          onClick={() => setShowMenu(false)}
          css={css`
            margin-top: 10rem;

            a {
              color: ${colors.fg1};
              font-weight: 300;
              margin-top: 0.5em;
              cursor: pointer;
            }

            a > h1 {
              color: ${colors.fg};
            }

            svg {
              color: ${colors.fg1};
            }
          `}
        >
          <div style={{ filter: showMenu ? 'blur(4px)' : 'none' }}>
            <Link to='/share'>
              <h1 onClick={() => setOnShare(true)}>
                Share Anything <FaShare />
              </h1>
            </Link>
            {!onShare ? (
              <Link to='/share' onClick={() => setOnShare(true)}>
                want to share someting?
              </Link>
            ) : (
              <Link to='/' onClick={() => setOnShare(false)}>
                go back to posts?
              </Link>
            )}
            {loading && (
              <div
                css={css`
                  margin-top: 5em;
                `}
              >
                <Spinner />
              </div>
            )}
          </div>

          <Switch>
            <Route exact path='/'>
              <div
                css={css`
                  height: auto;
                  padding-bottom: 10vh;
                  filter: ${showMenu ? 'blur(4px)' : 'none'};
                `}
              >
                <PostList posts={posts} updateLikes={updateLikes} />
              </div>
            </Route>

            <Route path='/share'>
              <div style={{ filter: showMenu ? 'blur(4px)' : 'none' }}>
                <Input
                  submitPost={submitPost}
                  title={title}
                  setTitle={setTitle}
                  postMsg={postMsg}
                  setPostMsg={setPostMsg}
                  submitting={submitting}
                  sentMsg={sentMsg}
                />
              </div>
            </Route>

            <Route path='/about'>
              <div style={{ filter: showMenu ? 'blur(4px)' : 'none' }}>
                <About />
              </div>
            </Route>
          </Switch>
        </div>
      </div>
      <GlobalStyle />
    </Router>
  );
};

export default App;
