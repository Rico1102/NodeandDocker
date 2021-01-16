import { PROFILE_LOADED, PROFILE_LOAD_ERROR, CLEAR_PROFILE } from "../actions/types";

const initialState = {
    profile : null,
    profiles : [],
    loading : true,
    errors : {}
}

const profile = (state = initialState, actions) => {
    const {type , payload} = actions
    switch(type){
        case PROFILE_LOADED:
            return {
                ...state,
                profile : payload,
                loading : false
            }
        case PROFILE_LOAD_ERROR:
            return {
                ...state,
                errors : payload,
                profile : null,
                loading : false
            }
        case CLEAR_PROFILE:
            return {
                ...state ,
                profile : null,
                loading : true,
                errors : {}
            }
        default:
            return state;
    }
}

export default profile
