import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Block {
  id: string;
  type: 'text' | 'image' | 'pricing' | 'video' | 'testimonial' | 'cta' | 'signature';
  content: any;
  position: number;
}

export interface ProposalData {
  id: string;
  title: string;
  blocks: Block[];
  updatedAt: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
}

interface EditorState {
  proposal: ProposalData | null;
  selectedBlockId: string | null;
  history: ProposalData[];
  historyIndex: number;
  isSaving: boolean;
  lastSaved: Date | null;

  // Actions
  setProposal: (proposal: ProposalData) => void;
  addBlock: (block: Omit<Block, 'id' | 'position'>) => void;
  updateBlock: (id: string, content: any) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  reorderBlocks: (blocks: Block[]) => void;
  selectBlock: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  setSaving: (isSaving: boolean) => void;
  setLastSaved: (date: Date) => void;
  updateProposalTitle: (title: string) => void;
}

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorState>()(
  devtools(
    (set, get) => ({
      proposal: null,
      selectedBlockId: null,
      history: [],
      historyIndex: -1,
      isSaving: false,
      lastSaved: null,

      setProposal: (proposal) => {
        set({
          proposal,
          history: [proposal],
          historyIndex: 0,
        });
      },

      addBlock: (block) => {
        const state = get();
        if (!state.proposal) return;

        const newBlock: Block = {
          ...block,
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position: state.proposal.blocks.length,
        };

        const updatedProposal = {
          ...state.proposal,
          blocks: [...state.proposal.blocks, newBlock],
          updatedAt: new Date().toISOString(),
        };

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(updatedProposal);

        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        set({
          proposal: updatedProposal,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      updateBlock: (id, content) => {
        const state = get();
        if (!state.proposal) return;

        const updatedProposal = {
          ...state.proposal,
          blocks: state.proposal.blocks.map((block) =>
            block.id === id ? { ...block, content } : block
          ),
          updatedAt: new Date().toISOString(),
        };

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(updatedProposal);

        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        set({
          proposal: updatedProposal,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      deleteBlock: (id) => {
        const state = get();
        if (!state.proposal) return;

        const updatedProposal = {
          ...state.proposal,
          blocks: state.proposal.blocks
            .filter((block) => block.id !== id)
            .map((block, index) => ({ ...block, position: index })),
          updatedAt: new Date().toISOString(),
        };

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(updatedProposal);

        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        set({
          proposal: updatedProposal,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
        });
      },

      duplicateBlock: (id) => {
        const state = get();
        if (!state.proposal) return;

        const blockToDuplicate = state.proposal.blocks.find((b) => b.id === id);
        if (!blockToDuplicate) return;

        const newBlock: Block = {
          ...blockToDuplicate,
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position: blockToDuplicate.position + 1,
        };

        const updatedBlocks = [...state.proposal.blocks];
        updatedBlocks.splice(newBlock.position, 0, newBlock);

        const updatedProposal = {
          ...state.proposal,
          blocks: updatedBlocks.map((block, index) => ({ ...block, position: index })),
          updatedAt: new Date().toISOString(),
        };

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(updatedProposal);

        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        set({
          proposal: updatedProposal,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      reorderBlocks: (blocks) => {
        const state = get();
        if (!state.proposal) return;

        const updatedProposal = {
          ...state.proposal,
          blocks: blocks.map((block, index) => ({ ...block, position: index })),
          updatedAt: new Date().toISOString(),
        };

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(updatedProposal);

        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        set({
          proposal: updatedProposal,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      selectBlock: (id) => {
        set({ selectedBlockId: id });
      },

      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          set({
            proposal: state.history[newIndex],
            historyIndex: newIndex,
          });
        }
      },

      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          set({
            proposal: state.history[newIndex],
            historyIndex: newIndex,
          });
        }
      },

      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },

      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },

      setSaving: (isSaving) => {
        set({ isSaving });
      },

      setLastSaved: (date) => {
        set({ lastSaved: date });
      },

      updateProposalTitle: (title) => {
        const state = get();
        if (!state.proposal) return;

        const updatedProposal = {
          ...state.proposal,
          title,
          updatedAt: new Date().toISOString(),
        };

        set({ proposal: updatedProposal });
      },
    }),
    { name: 'EditorStore' }
  )
);
