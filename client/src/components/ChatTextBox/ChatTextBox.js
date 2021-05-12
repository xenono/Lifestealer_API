import React, { useRef, useEffect } from "react";
import { animateScroll } from "react-scroll";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 400px;
  background-color: #fff;
  border-left: 4px solid ${({ theme }) => theme.primary};
  border-right: 4px solid ${({ theme }) => theme.primary};
  overflow-y: scroll;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
`;

const MessageBox = styled.div`
  display: inline-block;
  font-size: 15px;
  padding: 5px;
  text-align: center;
  margin: 2.5px 0;
  border-radius: 5px;
`;
const LeftMessageBox = styled(MessageBox)`
  background-color: ${({ theme }) => theme.primary};

`;
const RightMessageBox = styled(MessageBox)`
  background-color: ${({ theme }) => theme.tertiary};

`;

const ChatTextBox = ({ messages, member, textRef }) => {
  const wrapperRef = useRef(null)
  useEffect(() => {
    if(wrapperRef.current){
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <Wrapper ref={wrapperRef} id="1">
      {messages.length !== 0 ? messages.map(message => {
        if (message.userId === member._id) {
          return <LeftMessageBox key={message._id}>{message.text}</LeftMessageBox>;
        }
        return <RightMessageBox key={message._id}>{message.text}</RightMessageBox>;
      }) : "Loading"}
    </Wrapper>
  );
};

ChatTextBox.propTypes = {};

export default ChatTextBox;