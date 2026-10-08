import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChatMessage,
  ChatState,
  SelectedImageProps,
} from "../../schemas/types";

const initialState: ChatState = {
  currentSelectedImage: null,
  imageState: null,
  allMessagesList: [],
  isMessageProcessing: false,
  isCurrentChatScreenActive: false,
  activeStream: { conversationId: undefined, assistantMessageId: "" },
  queryCountData: null,
  isFromCropEdit: false,
};

const chatReducer = createSlice({
  name: "chatReducer",
  initialState,
  reducers: {
    setIsFromCropEditOrNext: (state, action: PayloadAction<boolean>) => {
      state.isFromCropEdit = action.payload;
    },

    setCurrentChatScreen: (state, action: PayloadAction<boolean>) => {
      state.isCurrentChatScreenActive = action.payload;
    },

    setCurrentSelectedImage: (
      state,
      action: PayloadAction<SelectedImageProps | null>,
    ) => {
      state.currentSelectedImage = action.payload;
    },

    setSelectImageState: (
      state,
      action: PayloadAction<SelectedImageProps | null>,
    ) => {
      state.imageState = action.payload;
    },

    setAllMessageList: (state, action: PayloadAction<ChatMessage[]>) => {
      state.allMessagesList = action.payload;
    },

    addUserMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.allMessagesList.unshift(action.payload);
    },

    addAssistantPlaceholder: (state, action: PayloadAction<ChatMessage>) => {
      state.allMessagesList.unshift(action.payload);
      state.isMessageProcessing = true;
    },

    updateAssistantMessage: (
      state,
      action: PayloadAction<{
        id: string | number;
        text: string;
        conversationId?: number | string;
        starred?: boolean;
      }>,
    ) => {
      const msg = state.allMessagesList.find(m => m.id === action.payload.id);
      if (msg && msg.role === "assistant") {
        msg.text = action.payload.text;
        // msg.loading = false;
        if (action.payload?.conversationId) {
          msg.conversationId = action.payload?.conversationId;
        }
      }
    },

    // Immutable update without unnecessary array spread
    appendAssistantDelta: (
      state,
      action: PayloadAction<{ id: string | number; fullContent: string }>,
    ) => {
      const msg = state.allMessagesList.find(m => m.id === action.payload.id);
      if (msg && msg.role === "assistant") {
        // Only update if new text differs
        if (
          action.payload.fullContent &&
          msg.text !== action.payload.fullContent
        ) {
          // if (action.payload.fullContent && msg.text !== action.payload.fullContent) {
          msg.text = action.payload.fullContent;
          msg.loading = false;
        }
      }
    },

    completeAssistantMessage: (
      state,
      action: PayloadAction<{
        id: string | number;
        message_id?: string | number;
        conversationId?: number | string;
        error?: string;
      }>,
    ) => {
      const msg = state.allMessagesList.find(m => m.id === action.payload.id);
      if (msg && msg.role === "assistant") {
        msg.loading = false;
        if (action.payload.message_id) {
          msg.id = action.payload.message_id;
        }
        if (action.payload.conversationId) {
          msg.conversationId = action.payload.conversationId;
        }
        if (action.payload.error) {
          msg.text = action.payload.error;
          msg.isError = true;
        }
      }
      state.isMessageProcessing = false;
    },

    startStreaming: (
      state,
      action: PayloadAction<{
        conversationId: string;
        assistantMessageId: string;
      }>,
    ) => {
      state.activeStream = action.payload;
      if (
        state.activeStream?.conversationId !== action.payload.conversationId ||
        state.activeStream?.assistantMessageId !==
          action.payload.assistantMessageId
      ) {
        state.activeStream = {
          conversationId: action.payload.conversationId,
          assistantMessageId: action.payload.assistantMessageId,
        };
      }
    },

    stopStreaming: state => {
      // Set to undefined instead of reassigning
      state.activeStream = {
        conversationId: undefined,
        assistantMessageId: "",
      };
    },
    setStopGlobalProcessing: state => {
      state.isMessageProcessing = false;
    },

    /**
     * Everything "start a new chat" has to undo, in one transaction. Doing it
     * piecemeal left the door open for an in-flight turn to land between the
     * pieces and re-populate what had just been cleared.
     */
    resetChat: state => {
      state.allMessagesList = [];
      state.isMessageProcessing = false;
      state.activeStream = {
        conversationId: undefined,
        assistantMessageId: "",
      };
      state.currentSelectedImage = null;
      state.isFromCropEdit = false;
    },

    setQueryCountData: (state, action: PayloadAction<any>) => {
      state.queryCountData = action.payload;
    },
  },
});

export const {
  setIsFromCropEditOrNext,
  setCurrentSelectedImage,
  setAllMessageList,
  addUserMessage,
  addAssistantPlaceholder,
  updateAssistantMessage,
  setCurrentChatScreen,
  setSelectImageState,
  appendAssistantDelta,
  completeAssistantMessage,
  startStreaming,
  stopStreaming,
  setQueryCountData,
  setStopGlobalProcessing,
  resetChat,
} = chatReducer.actions;

export default chatReducer.reducer;
