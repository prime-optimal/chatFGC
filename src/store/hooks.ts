import { useStore } from '@tanstack/react-store'
import { v4 as uuidv4 } from 'uuid'
import { actions, selectors, store, type Conversation } from './store'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import type { Message } from '../utils/ai'
import { useEffect } from 'react'
import { useConvexAvailability } from '../convex'

// Original app hook that matches the interface expected by the app
export function useAppState() {
  const isLoading = useStore(store, s => selectors.getIsLoading(s));
  const conversations = useStore(store, s => selectors.getConversations(s));
  const currentConversationId = useStore(store, s => selectors.getCurrentConversationId(s));
  const prompts = useStore(store, s => selectors.getPrompts(s));
  const isBannerVisible = useStore(store, s => selectors.getIsBannerVisible(s));

  return {
    conversations,
    currentConversationId,
    isLoading,
    prompts,
    isBannerVisible,

    // Actions
    setCurrentConversationId: actions.setCurrentConversationId,
    addConversation: actions.addConversation,
    deleteConversation: actions.deleteConversation,
    updateConversationTitle: actions.updateConversationTitle,
    addMessage: actions.addMessage,
    setLoading: actions.setLoading,
    setBannerVisible: actions.setBannerVisible,
    createPrompt: actions.createPrompt,
    deletePrompt: actions.deletePrompt,
    setPromptActive: actions.setPromptActive,

    // Selectors
    getCurrentConversation: selectors.getCurrentConversation,
    getActivePrompt: selectors.getActivePrompt,
  };
}

function createConversationId() {
  return uuidv4();
}

function useLocalConversations() {
  const conversations = useStore(store, s => selectors.getConversations(s));
  const currentConversationId = useStore(store, s => selectors.getCurrentConversationId(s));
  const currentConversation = useStore(store, s => selectors.getCurrentConversation(s));

  return {
    conversations,
    currentConversationId,
    currentConversation,
    setCurrentConversationId: actions.setCurrentConversationId,
    createNewConversation: async (title: string = 'New Conversation') => {
      const id = createConversationId();
      const newConversation: Conversation = {
        id,
        title,
        messages: [],
      };

      actions.addConversation(newConversation);
      actions.setCurrentConversationId(id);

      return id;
    },
    updateConversationTitle: async (id: string, title: string) => {
      actions.updateConversationTitle(id, title);
    },
    deleteConversation: async (id: string) => {
      actions.deleteConversation(id);
    },
    addMessage: async (conversationId: string, message: Message) => {
      actions.addMessage(conversationId, message);
    },
  };
}

function useConvexConversations() {
  const conversations = useStore(store, s => selectors.getConversations(s));
  const currentConversationId = useStore(store, s => selectors.getCurrentConversationId(s));
  const currentConversation = useStore(store, s => selectors.getCurrentConversation(s));

  const convexConversations = useQuery(api.conversations.list);
  const createConversationMutation = useMutation(api.conversations.create);
  const updateTitleMutation = useMutation(api.conversations.updateTitle);
  const removeConversationMutation = useMutation(api.conversations.remove);
  const addMessageMutation = useMutation(api.conversations.addMessage);

  useEffect(() => {
    if (!Array.isArray(convexConversations)) {
      return
    }

    const formattedConversations: Conversation[] = convexConversations.map((conv) => ({
      id: conv._id,
      title: conv.title,
      messages: conv.messages as Message[],
    }))

    actions.setConversations(formattedConversations)
  }, [convexConversations])

  return {
    conversations,
    currentConversationId,
    currentConversation,
    setCurrentConversationId: actions.setCurrentConversationId,
    createNewConversation: async (title: string = 'New Conversation') => {
      const id = createConversationId();
      const newConversation: Conversation = {
        id,
        title,
        messages: [],
      };

      actions.addConversation(newConversation);
      actions.setCurrentConversationId(id);

      try {
        const convexId = await createConversationMutation({
          title,
          messages: [],
        });

        actions.updateConversationId(id, convexId);
        actions.setCurrentConversationId(convexId);

        return convexId;
      } catch (error) {
        console.error('Failed to create conversation in Convex:', error);
        return id;
      }
    },
    updateConversationTitle: async (id: string, title: string) => {
      actions.updateConversationTitle(id, title);

      try {
        await updateTitleMutation({ id: id as Id<'conversations'>, title });
      } catch (error) {
        console.error('Failed to update conversation title in Convex:', error);
      }
    },
    deleteConversation: async (id: string) => {
      actions.deleteConversation(id);

      try {
        await removeConversationMutation({ id: id as Id<'conversations'> });
      } catch (error) {
        console.error('Failed to delete conversation from Convex:', error);
      }
    },
    addMessage: async (conversationId: string, message: Message) => {
      actions.addMessage(conversationId, message);

      try {
        await addMessageMutation({
          conversationId: conversationId as Id<'conversations'>,
          message,
        });
      } catch (error) {
        console.error('Failed to add message to Convex:', error);
      }
    },
  };
}

// Hook for Convex integration with fallback to local state
export function useConversations() {
  const isConvexAvailable = useConvexAvailability()

  const useImplementation = isConvexAvailable
    ? useConvexConversations
    : useLocalConversations;

  return useImplementation();
}