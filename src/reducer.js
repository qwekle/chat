export default (state, action) => {
    switch (action.type){
        case 'JOIN':
            return {
                ...state,
                joined: true,
                userName: action.payload.userName,
                roomId: action.payload.roomId,
            }
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload,
            }
        case 'NEW_MESSAGES':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            }
        default:
            return state
    }
}