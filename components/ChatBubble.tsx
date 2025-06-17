'use client';

import { MessageSquareText } from 'lucide-react';

const ChatBubble = () => {
  return (
    <button className="fixed bottom-8 right-8 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
      <MessageSquareText size={32} />
    </button>
  );
};

export default ChatBubble;