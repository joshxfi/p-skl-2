/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { colors } from '../styles/colors';
import { Spinner } from './Spinner';
import { InputProps } from '..';
import { motion } from 'framer-motion';

export const Input: React.FC<InputProps> = (props) => {
  const maxChar =
    props.postMsg.length < 30
      ? `-${30 - props.postMsg.length}`
      : props.postMsg.length;

  return (
    <form
      onSubmit={(e) => props.submitPost(e)}
      spellCheck='false'
      css={css`
        display: flex;
        flex-direction: column;
        width: 40%;
        margin: 0 auto;
        margin-top: 3em;

        input,
        textarea {
          outline: none;
          border: none;
          padding: 1em;
          background: ${colors.bg1};
          color: ${colors.fg};
          font-size: 1em;
          border-radius: 8px;
          border-left: 2px solid ${colors.fg1};
          border-right: 2px solid ${colors.fg1};

          ::placeholder {
            color: #e0e0e0;
            font-weight: 300;
          }
        }

        input {
          margin-bottom: 10px;
          font-weight: 400;
          color: ${colors.fg1};
        }

        textarea {
          resize: none;
          height: 14em;
          font-weight: 300;
        }

        button {
          outline: none;
          border: none;
          font-size: 1em;
          background: ${colors.bg1};
          color: #fff;
          padding: 0.5em;
          width: 150px;
          margin: 0 auto;
          border-radius: 16px;
          cursor: pointer;
          transition: 0.3s ease;
          border-bottom: 2px solid ${colors.fg1};

          &:hover {
            transform: translateY(-3px);
          }
        }

        a {
          font-size: 1.5em;
          position: relative;
          margin-bottom: 1.5em;

          svg {
            fill: ${colors.fg1};
            position: absolute;
            right: 0;
            cursor: pointer;
            transition: 0.3s ease;

            &:hover {
              transform: translateY(-3px);
            }
          }
        }

        @media screen and (max-width: 768px) {
          width: 90%;
        }
      `}
    >
      <input
        maxLength={50}
        type='text'
        placeholder='title / username (optional)'
        onChange={(e) => props.setTitle(e.target.value)}
        value={props.title}
      />
      <textarea
        placeholder='share a thought!'
        maxLength={400}
        onChange={(e) => props.setPostMsg(e.target.value)}
        value={props.postMsg}
      ></textarea>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          margin-top: 10px;
          color: #e0e0e0;
        `}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: props.sentMsg ? 1 : 0 }}
          transition={{ duration: 1 }}
          css={css`
            padding-left: 1rem;
            color: ${colors.fg1};
          `}
        >
          shared successfully!
        </motion.p>
        <p
          css={css`
            padding-right: 1rem;
            font-weight: 400;
          `}
        >
          <span
            style={{
              color:
                props.postMsg.length < 30 || props.postMsg.length === 400
                  ? '#cc0000'
                  : '',
            }}
          >
            {maxChar}
            /400
          </span>
        </p>
      </div>

      {props.submitting ? (
        <Spinner />
      ) : (
        <button type='submit'>share post</button>
      )}
    </form>
  );
};
