import { useReducer, useState } from 'react';

type TActionTyoe = 'CHANGE_DEPARTMENT' | 'RESET_DEPARTMENT';

interface IState {
    department: string;
    error: string | null;
}

interface IAction {
    type: TActionTyoe;
    payload?: string;
}

function reducer(state: IState, action: IAction) {
    const { type, payload } = action;
    switch (type) {
        case 'CHANGE_DEPARTMENT':
            const newDepartment = payload;
            const hasError = newDepartment !== '카드메이커';
            return {
                ...state,
                department: hasError
                    ? state.department
                    : newDepartment,
                error: hasError
                    ? '카드메이커만 가능'
                    : null,
            };
        default:
            return state;
    }
}

export const UseReducerCompany = () => {
    const [state, dispatch] = useReducer(reducer, {
        department: 'Software Developer',
        error: null,
    });
    const [department, setDepartment] = useState('');

    const handleChangeDepartment = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDepartment(e.target.value);
    };

    return (
        <>
            <h1>{state.department}</h1>
            {state.error && <p>{state.error}</p>}
            <input
                placeholder='Enter your department'
                value={department}
                onChange={handleChangeDepartment}
            />
            <button
                onClick={() =>
                    dispatch({
                        type: 'CHANGE_DEPARTMENT',
                        payload: department,
                    })
                }
            >
                Change Department
            </button>
        </>
    );
};
