import { useEffect, useMemo, useState } from "react";

export const useForm = ( initialForm = {}, formValidations = {} ) => {
  
    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setFormValidation] = useState({});

    useEffect(() => {
        createValidators();
    }, [ formState ])

    useEffect(() => {
      setFormState( initialForm );
    }, [ initialForm ])
    
    
    const isFormValid = useMemo(() => {

        for (const formValue of Object.keys( formValidation )) {
            if( formValidation[formValue] !== null) return false;
        }
        
        return true;        
    }, [ formValidation ]);

    const onInputChange = ({ target }) => {
        const {name, value} = target;
        setFormState({
            ...formState,
            [ name ]: value, //Prop computada de objeto, variable entre corchetes
        })
    }

    const onResetForm = () => {
        setFormState(initialForm);
    }

    const onResetFormWithFocusRef = (focusRef) => {
        setFormState(initialForm);
        focusRef.current.select();
    }

    const createValidators = () => {

        const formCheckesValues = {};

        for (const formField of Object.keys( formValidations )) {
            // fn donde debería ser true, si es false es error
            const [ fn, errorMessage ] = formValidations[formField];

            formCheckesValues[`${ formField }Valid`] = fn( formState[formField] ) ? null : errorMessage;
        }

        setFormValidation ( formCheckesValues );

    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
        onResetFormWithFocusRef,

        ...formValidation,
        isFormValid
    }
}
