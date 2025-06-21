import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import TextInput from '@/components/ui/form/textinput'
import SubmitButton from '@/components/ui/form/submitbutton'
import TextareaInput from '@/components/ui/form/textareainput'
import { DatePicker } from '@/components/ui/form/datepicker'
import Select from '@/components/ui/form/select'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

const { useAppForm } = createFormHook({
    fieldComponents: {
        TextInput,
        TextareaInput,
        DatePicker,
        Select
    },
    formComponents: {
        SubmitButton
    },
    fieldContext,
    formContext,
})

export default useAppForm