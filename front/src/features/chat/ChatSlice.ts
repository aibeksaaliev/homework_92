import {createSlice} from "@reduxjs/toolkit";
import {ValidationError} from "../../types";
import {RootState} from "../../app/store";

interface ChatState {
  messages: string[];
  messagesLoading: boolean;
  messagesError: boolean;
  messageCreateLoading: boolean;
  messageCreateError: ValidationError | null;
}

const initialState: ChatState = {
  messages: [],
  messagesLoading: false,
  messagesError: false,
  messageCreateLoading: false,
  messageCreateError: null
};

export const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export const chatReducer = ChatSlice.reducer;
export const selectMessages = (state: RootState) => state.chat.messages;
export const selectMessagesLoading = (state: RootState) => state.chat.messagesLoading;
export const selectMessagesError = (state: RootState) => state.chat.messagesError;
export const selectMessageCreateLoading = (state: RootState) => state.chat.messageCreateLoading;
export const selectMessageCreateError = (state: RootState) => state.chat.messageCreateError;