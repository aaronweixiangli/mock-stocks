import { useEffect, useState } from "react";
import "./NotificationPage.css";
import * as usersAPI from "../../utilities/users-api";

export default function NotificationPage( {user, setUnreadExist} ) {
    const [messages, setMessages] = useState(null);
    const [messageDetail, setMessageDetail] = useState(null);

    useEffect(() => {
        if (!user) return;
        async function getAllNotifications() {
            const messages = await usersAPI.getNotification();
            setMessages(messages);
        }
        getAllNotifications();
    }, [user, messageDetail])

    let allMessages = null;
    if (Array.isArray(messages)) {
        allMessages = messages.map((m) => 
        <div className="message-card" key={m._id} onClick={(evt) => handleShowMessage(evt, m._id)}>
            <div className="message-symbol">
                <img src="https://i.imgur.com/GtqNrzK.png" alt="mockstock" />
            </div>
            <div className="message-info">
                <div className="message-card-time">
                    <div>
                        {(new Date(m.createdAt)).toLocaleString("en-US", {
                            timeZone: "America/Los_Angeles",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                        })}
                    </div>
                    { !(m.read) ? 
                        <div className="unread-sign-container">
                            <div className="unread-sign"></div>
                        </div>
                    :
                        null
                    }
                </div>
                <div className="message-short">
                    <div>{m.text}</div>
                </div>
            </div>
        </div>
        )
    }

    async function handleShowMessage(evt, id) {
        // Get the clicked element and the corresponding message-card class element
        const clickedEl = evt.target;
        const messageCardEl = clickedEl.closest('.message-card');
        // Remove the 'active' class from all the message card elements
        const messageCards = document.querySelectorAll('.message-card');
        messageCards.forEach(card => {
            card.classList.remove('active');
        });
        // Add the 'active' class on the message card element
        messageCardEl.classList.add('active');

        const {message, unreadExist} = await usersAPI.getShowMessage(id);
        setMessageDetail(
                <div className="message-container-right">
                    <div className="message-detail-time">
                        <div>
                            {(new Date(message.createdAt)).toLocaleString("en-US", {
                                timeZone: "America/Los_Angeles",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                            })}
                        </div>
                    </div>
                    <div className="message-detail">
                        <div>{message.text}</div>
                    </div>
                </div>
        );
        setUnreadExist(unreadExist);
    }

    return (
        <main className="NotificationPage">
            <h1>Messages</h1>
            <section className="message-container">
                <div className="message-container-left">
                    {allMessages}
                </div>
                {messageDetail}
            </section>
        </main>
    )
}