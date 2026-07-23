import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

export interface Paper {
  id: string;
  title: string;
  authors: string;
  year: string;
  publishedIn: string;
  abstract: string;
  tags: string[];
  citations: number;
  uploadDate: string;
  pages?: string;
  doi?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  datasets?: string[];
  sources?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface UserProfile {
  email: string;
  name: string;
  avatarInitials: string;
  plan: string;
}

interface ResearchContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUserName: (name: string) => void;
  logout: () => void;
  papers: Paper[];
  addPaper: (paper: Omit<Paper, 'id' | 'citations' | 'uploadDate'>) => void;
  deletePaper: (id: string) => void;
  clearAllPapers: () => void;
  resetToSamplePapers: () => void;
  chatSessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  deleteChatMessage: (id: string) => void;
  deleteChatSession: (sessionId: string) => void;
  clearChatHistory: () => void;
  startNewChat: () => void;
  selectSession: (sessionId: string) => void;
  comparedPaperIds: string[];
  addPaperToCompare: (id: string) => void;
  removePaperFromCompare: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const API_URL = 'http://localhost:5000/api';

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('research_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch {}
    }
    return {
      email: 'researcher@domain.com',
      name: 'Dr. Researcher',
      avatarInitials: 'DR',
      plan: 'Pro Plan'
    };
  });

  const setUser = (newUser: UserProfile | null) => {
    if (newUser) {
      setUserState(newUser);
      localStorage.setItem('research_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('research_user');
      localStorage.removeItem('token');
      setUserState(null);
    }
  };

  const updateUserName = (name: string) => {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0].toUpperCase())
      .slice(0, 2)
      .join('') || 'U';

    if (user) {
      const updated = { ...user, name, avatarInitials: initials };
      setUserState(updated);
      localStorage.setItem('research_user', JSON.stringify(updated));
    }
  };

  const logout = () => {
    localStorage.removeItem('research_user');
    localStorage.removeItem('token');
    setUserState(null);
  };

  const [papers, setPapers] = useState<Paper[]>(() => {
    const savedPapers = localStorage.getItem('research_papers');
    if (savedPapers) {
      try {
        const parsed = JSON.parse(savedPapers);
        // If saved papers contains the old seed paper IDs, filter them out so workspace is clean
        const seedIds = ['attention-is-all-you-need', 'efficientnet', 'gnn-survey', 'rl-robotics', 'bert-pretraining', 'vit-image-16x16'];
        const customOnly = parsed.filter((p: Paper) => !seedIds.includes(p.id));
        return customOnly;
      } catch {}
    }
    return [];
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('research_chat_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const savedSessions = localStorage.getItem('research_chat_sessions');
    if (savedSessions) {
      try {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        if (parsed.length > 0) return parsed[0].id;
      } catch {}
    }
    return null;
  });

  const activeSession = chatSessions.find(s => s.id === activeSessionId) || null;
  const chatMessages = activeSession ? activeSession.messages : [];

  const [comparedPaperIds, setComparedPaperIds] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState('');

  // Persist papers to localStorage
  useEffect(() => {
    localStorage.setItem('research_papers', JSON.stringify(papers));
  }, [papers]);

  // Persist chat sessions to localStorage
  useEffect(() => {
    localStorage.setItem('research_chat_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const addPaper = (newPaperData: Omit<Paper, 'id' | 'citations' | 'uploadDate'>) => {
    const id = newPaperData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPaper: Paper = {
      ...newPaperData,
      id,
      citations: 0,
      uploadDate: new Date().toISOString()
    };
    setPapers(prev => [newPaper, ...prev]);
    axios.post(`${API_URL}/papers`, newPaperData).catch(() => {});
  };

  const deletePaper = (id: string) => {
    setPapers(prev => prev.filter(p => p.id !== id));
    setComparedPaperIds(prev => prev.filter(pId => pId !== id));
    axios.delete(`${API_URL}/papers/${id}`).catch(() => {});
  };

  const clearAllPapers = () => {
    setPapers([]);
    setComparedPaperIds([]);
    setChatSessions([]);
    setActiveSessionId(null);
    localStorage.removeItem('research_papers');
    localStorage.removeItem('research_chat_sessions');
    axios.delete(`${API_URL}/papers`).catch(() => {});
    axios.delete(`${API_URL}/chat`).catch(() => {});
  };

  const resetToSamplePapers = () => {
    setPapers([]);
    setComparedPaperIds([]);
    localStorage.removeItem('research_papers');
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let targetSessionId = activeSessionId;
    let titleText = text.length > 30 ? text.slice(0, 30) + '...' : text;

    setChatSessions(prevSessions => {
      let existingIndex = prevSessions.findIndex(s => s.id === targetSessionId);
      if (existingIndex === -1 || !targetSessionId) {
        targetSessionId = Date.now().toString();
        setActiveSessionId(targetSessionId);
        const newSession: ChatSession = {
          id: targetSessionId,
          title: titleText,
          createdAt: new Date().toLocaleDateString(),
          messages: [userMsg]
        };
        return [newSession, ...prevSessions];
      } else {
        const updated = [...prevSessions];
        updated[existingIndex] = {
          ...updated[existingIndex],
          messages: [...updated[existingIndex].messages, userMsg]
        };
        return updated;
      }
    });

    setTimeout(() => {
      let aiText = `Regarding "${text}", Transformer models rely on self-attention mechanisms to calculate contextual representations without recurrent bottlenecks.`;
      let sources = papers.length > 0 ? [papers[0].title] : [];

      if (text.toLowerCase().includes('dataset')) {
        aiText = 'Commonly used datasets across your research workspace include ImageNet, COCO, BooksCorpus, and WMT 2014 En-De.';
      } else if (text.toLowerCase().includes('compare') || text.toLowerCase().includes('performance')) {
        aiText = 'Comparison indicates Vision Transformers outperform traditional CNNs when trained on large-scale datasets such as JFT-300M.';
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources
      };

      setChatSessions(prevSessions => {
        return prevSessions.map(s => {
          if (s.id === targetSessionId) {
            return { ...s, messages: [...s.messages, assistantMsg] };
          }
          return s;
        });
      });

      axios.post(`${API_URL}/chat`, { message: text }).catch(() => {});
    }, 600);
  };

  const deleteChatMessage = (id: string) => {
    if (!activeSessionId) return;
    setChatSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: s.messages.filter(m => m.id !== id) };
        }
        return s;
      })
    );
    axios.delete(`${API_URL}/chat/${id}`).catch(() => {});
  };

  const deleteChatSession = (sessionId: string) => {
    setChatSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
    axios.delete(`${API_URL}/chat/session/${sessionId}`).catch(() => {});
  };

  const clearChatHistory = () => {
    if (activeSessionId) {
      deleteChatSession(activeSessionId);
    } else {
      setChatSessions([]);
      setActiveSessionId(null);
      localStorage.removeItem('research_chat_sessions');
      axios.delete(`${API_URL}/chat`).catch(() => {});
    }
  };

  const startNewChat = () => {
    setActiveSessionId(null);
  };

  const selectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const addPaperToCompare = (id: string) => {
    if (!comparedPaperIds.includes(id)) {
      setComparedPaperIds(prev => [...prev, id]);
    }
  };

  const removePaperFromCompare = (id: string) => {
    setComparedPaperIds(prev => prev.filter(pId => pId !== id));
  };

  return (
    <ResearchContext.Provider
      value={{
        user,
        setUser,
        updateUserName,
        logout,
        papers,
        addPaper,
        deletePaper,
        clearAllPapers,
        resetToSamplePapers,
        chatSessions,
        activeSessionId,
        activeSession,
        chatMessages,
        sendMessage,
        deleteChatMessage,
        deleteChatSession,
        clearChatHistory,
        startNewChat,
        selectSession,
        comparedPaperIds,
        addPaperToCompare,
        removePaperFromCompare,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};
