import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import TextInput from "@/components/ui/form/TextInput";
import SubmitButton from "@/components/ui/form/SubmitButton";
import TextareaInput from "@/components/ui/form/TextAreaInput";
import { DatePicker } from "@/components/ui/form/Datepicker";
import Select from "@/components/ui/form/Select";
import AddressField from "@/components/ui/form/Address";
import QuotationItemField from "@/components/ui/form/QuotationItem";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextInput,
    TextareaInput,
    DatePicker,
    Select,
    QuotationItemField,
  },
  formComponents: {
    SubmitButton,
    AddressField,
  },
  fieldContext,
  formContext,
});

export default useAppForm;
