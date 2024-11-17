"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { StreamChat } from "stream-chat";
import {
    Chat,
    Channel,
    ChannelHeader,
    ChannelList,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";
import type { ChannelSort, ChannelFilters, ChannelOptions } from "stream-chat";
import {jwtDecode} from "jwt-decode";
import { EmojiPicker } from 'stream-chat-react/emojis';
import { userPayload } from "../interfaces/userPayload-int";
import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';

import "./styles/chat.css";
import "stream-chat-react/dist/css/v2/index.css";
import RouteGuard from "@/components/routeGuard";

init({ data });

const apiKey = process.env.NEXT_PUBLIC_STREAMCHAT_API_KEY || "";
function ChatContent(){
    const [userDataToken, setUserDataToken] = useState<userPayload | null>(null);
    const [activeChannel, setActiveChannel] = useState<any>(null);
    const searchParams = useSearchParams();

    const channelId = searchParams.get('channel');

    // Configuración del cliente de Stream Chat
    const client = StreamChat.getInstance(apiKey);

    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        if (token) {
            const decoded = jwtDecode<userPayload>(token);
            setUserDataToken(decoded);
            client.connectUser(
                {
                    id: decoded.sub.toString(),
                },
                decoded.scToken
            );
        }
    }, [client]);

    useEffect(() => {
        if (channelId) {
            const channel = client.channel("messaging", channelId);
            setActiveChannel(channel);
        }
    }, [channelId, client]);

    if (!userDataToken || !userDataToken.scToken) {
        return <div>Loading...</div>;
    }

    const sort: ChannelSort = { last_message_at: -1 };
    const filters: ChannelFilters = {
        type: "messaging",
        members: { $in: [userDataToken.sub.toString()] },
    };
    const options: ChannelOptions = {
        limit: 10,
    };

    return (
        <RouteGuard>
            <Chat client={client} theme="messaging light">
                <div className="chat-app-container">
                    {/* Sidebar: Lista de chats */}
                    <aside className="chat-sidebar">
                        <p className="text-center text-xl py-3 font-bold">Chats</p>
                        <ChannelList 
                            filters={filters} 
                            sort={sort} 
                            options={options} 
                            showChannelSearch
                            setActiveChannelOnMount = {false}
                            
                        />
                    </aside>

                    {/* Área de mensajes */}
                    <main className="chat-main">
                        <Channel channel={activeChannel} EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}>
                            <Window>
                                <ChannelHeader />
                                <MessageList />
                                <MessageInput />
                            </Window>
                            <Thread />
                        </Channel>
                    </main>
                </div>
            </Chat>
        </RouteGuard>
    );
}

export default function ChatPage(){
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <ChatContent />
        </Suspense>
    )
}