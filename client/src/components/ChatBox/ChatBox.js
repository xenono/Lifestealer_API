import React, { useRef, useEffect, useState, forwardRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ProfilePicture from "../profilePicture/profilePicture";
import ChatTextBox from "components/ChatTextBox/ChatTextBox";
import RawInput from "components/Inputs/Input/Input";
import RawButton from "components/Button/Button";
import socket from "socket";

import { API_URL, CLOSE_CHATBOX } from "../../actions/action";

const Wrapper = styled.div`
  width: 100%;
`;

const MemberInfo = styled.div`
  position: relative;
  height: 70px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;
  background-color: ${({ theme }) => theme.primary};
`;

const Paragraph = styled.p`
  font-size: 2rem;
  margin-left: 15px;
  color: #fff;
`;

const SmallerProfilePicture = styled(ProfilePicture)`
  width: 50px;
  height: 50px;
  border: 0;
`;


const InputBox = styled.div`
  width: 100%;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.primary};
  background-color: #fff;
  padding: 5px;
  display: flex;
`;

const Input = styled(RawInput)`
  width: 75%;
  height: 100%;
  min-width: initial;
  border-radius: 0;
  font-size: 1.4rem;

  &:hover, &:active, &:focus {
    border-radius: 0;
  }
`;

const Button = styled(RawButton)`
  padding: 5px 17px;
  margin: 0;
  display: inline-block;
`;

const CloseButton = styled.div`
  position: absolute;
  right: 5%;
  font-size: 25px;
  width: 35px;
  height: 35px;
  border-radius: 100px;
  text-align: center;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.tertiary};
  }
`;

const ChatBox = ({ chat: { member }, closeChatbox }) => {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    axios.post(API_URL + "/addMessage", {
      userId: member._id,
      message
    }, { withCredentials: true })
      .then(() => {}).catch(err => {
        console.log(err);
    });
    e.target.message.value =""
  };


  const getData = () => {
    axios.post(API_URL + "/getChat", { userId: member._id }, {
      withCredentials: true
    }).then(data => {
      setMessages(data.data);
    }).catch(e => {
      console.log(e);
    });
  };

  const onCloseButtonClick = () => {
    closeChatbox(member._id);
  };

  useEffect(() => {
    getData();
    socket.on("updateChats", () => {
      getData();
    });

    return () => {
      socket.off("updateChats", () => {
        getData();
      })
    }
  }, [member]);

  return (
    <Wrapper>
      <MemberInfo>
        <SmallerProfilePicture src={member.profileImage} />
        <Paragraph>{member.name} {member.lastname}</Paragraph>
        <CloseButton onClick={onCloseButtonClick}>&#10006;</CloseButton>
      </MemberInfo>
      <ChatTextBox member={member} messages={messages}/>
      <form onSubmit={handleFormSubmit}>
        <InputBox>
          <Input type="text" name="message" ref={inputRef} />
          <Button fontSize={"14px"} type="submit">Send</Button>
        </InputBox>
      </form>
    </Wrapper>
  );
};

const mapDispatchToProps = dispatch => ({
  closeChatbox: (friendId) => dispatch({ type: CLOSE_CHATBOX, payload: { id: friendId } })
});


ChatBox.propTypes = {};

export default connect(null, mapDispatchToProps)(ChatBox);