'use client';

import { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    // Create and inject the n8n chat script
    const script = document.createElement('script');
    script.type = 'module';
    script.defer = true;
    script.innerHTML = `
      import Chatbot from "https://cdn.n8nchatui.com/v1/embed.js";
      Chatbot.init({
        "n8nChatUrl": "https://n8n.warpdrivetech.in/webhook/0ce512ef-35e0-47ce-a5aa-0aae056f9607/chat",
        "metadata": {
          "hideBranding": false
        },
        "theme": {
          "button": {
            "backgroundColor": "#019934",
            "right": 20,
            "bottom": 20,
            "size": 50,
            "iconColor": "#e6e6e6",
            "customIconSrc": "https://media.licdn.com/dms/image/v2/C560BAQFvBmw_6K21eg/company-logo_200_200/company-logo_200_200/0/1646296076453/warp_drive_tech_logo?e=2147483647&v=beta&t=jmeu0OjmhbjmSGBDIVPjMkfYPv305lud3td5XAd0eJg",
            "customIconSize": 75,
            "customIconBorderRadius": 15,
            "autoWindowOpen": {
              "autoOpen": false,
              "openDelay": 2
            },
            "borderRadius": "circle"
          },
          "tooltip": {
            "showTooltip": true,
            "tooltipMessage": "Hello 👋",
            "tooltipBackgroundColor": "#fff9f6",
            "tooltipTextColor": "#1c1c1c",
            "tooltipFontSize": 15
          },
          "chatWindow": {
            "borderRadiusStyle": "rounded",
            "avatarBorderRadius": 27,
            "messageBorderRadius": 7,
            "showTitle": true,
            "title": "AI Assistant",
            "titleAvatarSrc": "https://www.svgrepo.com/show/339963/chat-bot.svg",
            "avatarSize": 24,
            "welcomeMessage": "Hello! My name is Warpster. How can I assist you today?",
            "errorMessage": "Sorry, something went wrong. Please try again.",
            "backgroundColor": "#f5f5f5",
            "height": 500,
            "width": 400,
            "fontSize": 16,
            "starterPromptFontSize": 15,
            "renderHTML": true,
            "clearChatOnReload": false,
            "showScrollbar": true,
            "botMessage": {
              "backgroundColor": "#019934",
              "textColor": "#ffffff",
              "showAvatar": true,
              "avatarSrc": "https://www.svgrepo.com/show/334455/bot.svg",
              "showCopyToClipboardIcon": false
            },
            "userMessage": {
              "backgroundColor": "#f0fdf4",
              "textColor": "#166534",
              "showAvatar": true,
              "avatarSrc": "https://www.svgrepo.com/show/532363/user-alt-1.svg"
            },
            "textInput": {
              "placeholder": "Type your message...",
              "backgroundColor": "#ffffff",
              "textColor": "#166534",
              "sendButtonColor": "#019934",
              "maxChars": 1000,
              "autoFocus": false,
              "borderRadius": 6,
              "sendButtonBorderRadius": 50
            },
            "uploadsConfig": {
              "enabled": true,
              "acceptFileTypes": ["jpeg", "jpg", "png", "pdf"],
              "maxFiles": 5,
              "maxSizeInMB": 10
            },
            "voiceInputConfig": {
              "enabled": true,
              "maxRecordingTime": 30
            }
          }
        }
      });
    `;

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null; // The chat widget is rendered outside the React tree
};

export default ChatWidget;


