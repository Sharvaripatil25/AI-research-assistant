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
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  startNewChat: () => void;
  comparedPaperIds: string[];
  addPaperToCompare: (id: string) => void;
  removePaperFromCompare: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const API_URL = 'http://localhost:5000/api';

const samplePapersList: Paper[] = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: 'Vaswani, Shazeer, Parmar, et al.',
    year: '2017',
    publishedIn: 'NeurIPS 2017',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    tags: ['NLP', 'Transformer'],
    citations: 128450,
    uploadDate: '2026-07-20T10:00:00Z',
    pages: '5998–6008',
    doi: '10.5555/3295222.3295349'
  },
  {
    id: 'efficientnet',
    title: 'EfficientNet: Rethinking Model Scaling',
    authors: 'Tan & Le',
    year: '2019',
    publishedIn: 'ICML 2019',
    abstract: 'Convolutional Neural Networks are commonly developed at a fixed resource budget. In this paper, we systematically study model scaling and identify that carefully balancing network depth, width, and resolution can lead to better performance.',
    tags: ['Computer Vision', 'CNN'],
    citations: 18420,
    uploadDate: '2026-07-19T14:30:00Z',
    pages: '6105-6114',
    doi: '10.48550/arXiv.1905.11946'
  },
  {
    id: 'gnn-survey',
    title: 'A Survey on Graph Neural Networks',
    authors: 'Zhou et al.',
    year: '2020',
    publishedIn: 'IEEE TNNLS 2020',
    abstract: 'Deep learning has revolutionized many machine learning tasks. In recent years, graph neural networks (GNNs) have emerged as powerful tools for processing non-Euclidean data structured as graphs.',
    tags: ['Graph ML', 'Survey'],
    citations: 9540,
    uploadDate: '2026-07-17T09:15:00Z'
  },
  {
    id: 'rl-robotics',
    title: 'Reinforcement Learning for Robotics',
    authors: 'Kober et al.',
    year: '2013',
    publishedIn: 'IJRR 2013',
    abstract: 'Reinforcement learning offers to robotics a framework and a set of tools for the design of sophisticated and hard-to-engineer behaviors.',
    tags: ['Robotics', 'RL'],
    citations: 14200,
    uploadDate: '2026-07-15T11:00:00Z'
  },
  {
    id: 'bert-pretraining',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: 'Devlin et al.',
    year: '2018',
    publishedIn: 'NAACL 2019',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.',
    tags: ['NLP', 'BERT'],
    citations: 98400,
    uploadDate: '2026-07-14T16:20:00Z'
  },
  {
    id: 'vit-image-16x16',
    title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition',
    authors: 'Dosovitskiy et al.',
    year: '2020',
    publishedIn: 'ICLR 2021',
    abstract: 'While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. We show that a pure transformer applied directly to sequences of image patches performs very well.',
    tags: ['Computer Vision', 'ViT'],
    citations: 24300,
    uploadDate: '2026-07-12T13:45:00Z'
  }
];

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

  // Papers state: load from localStorage if custom, otherwise default sample papers
  const [papers, setPapers] = useState<Paper[]>(() => {
    const savedPapers = localStorage.getItem('research_papers');
    if (savedPapers) {
      try { return JSON.parse(savedPapers); } catch {}
    }
    return samplePapersList;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'user',
      text: 'What datasets are commonly used in these papers?',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      sender: 'assistant',
      text: "Based on the papers you've uploaded, here are the most commonly used benchmarking datasets across the collection:",
      timestamp: '2 hours ago',
      datasets: ['ImageNet (used in 4 papers)', 'COCO (used in 3 papers)', 'CIFAR-10 / CIFAR-100 (used in 2 papers)', 'MNIST (used in 2 papers)', 'PASCAL VOC (used in 2 papers)'],
      sources: ['EfficientNet (2019)', 'ViT (2020)', 'ResNet (2016)', '+1 more']
    }
  ]);

  const [comparedPaperIds, setComparedPaperIds] = useState<string[]>([
    'attention-is-all-you-need',
    'bert-pretraining',
    'vit-image-16x16'
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Persist papers to localStorage whenever papers change
  useEffect(() => {
    localStorage.setItem('research_papers', JSON.stringify(papers));
  }, [papers]);

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
    setChatMessages([]);
    localStorage.removeItem('research_papers');
  };

  const resetToSamplePapers = () => {
    setPapers(samplePapersList);
    setComparedPaperIds(['attention-is-all-you-need', 'bert-pretraining', 'vit-image-16x16']);
    localStorage.setItem('research_papers', JSON.stringify(samplePapersList));
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);

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
        timestamp: 'Just now',
        sources
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    }, 600);
  };

  const startNewChat = () => {
    setChatMessages([]);
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
        chatMessages,
        sendMessage,
        startNewChat,
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
