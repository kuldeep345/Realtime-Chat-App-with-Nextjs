// Users

export interface CreateUsernameData {
    createUsername:{
      success:boolean;
      error:string;
    }
  }
  
export interface CreateUsernameVariables {
    username:string
  }
  
export interface SearchUsersInput {
   username:string;
}

export interface SearchUsersData {
  searchUsers:Array<SearchedUser>
}

export interface SearchedUser {
  map(arg0: () => any): import("react").ReactNode;
  id:string;
  username:string;
}

/**
 * Conversations
 * 
 */
export type ParticipantPopulated={
  user:{
    id:string;
    username:string;
  };
}

export interface ConversationPopulated{
  id:string;
  latestMessage:null | string;
  partcipants:{
    hasSeenlatestNessage:boolean
    users:any
  }[];
  updatedAt:string
}

export interface ConversationData {
  conversations:Array<ConversationPopulated>
}

export interface CreateConversationData {
  createConversation:{
    conversationId:string;
  }
}

export interface CreateConversationInput {
  participantIds:Array<string>;
}