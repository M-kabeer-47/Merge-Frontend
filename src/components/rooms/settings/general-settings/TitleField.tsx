import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { CharacterCount } from "./CharacterCount";
import {
  MAX_TITLE_LENGTH,
  type GeneralSettingsFormData,
} from "@/schemas/room/general-settings";

interface TitleFieldProps {
  register: UseFormRegister<GeneralSettingsFormData>;
  error?: string;
  disabled?: boolean;
  watchValue: string;
}

export function TitleField({
  register,
  error,
  disabled,
  watchValue,
}: TitleFieldProps) {
  return (
    <FormField label="Room Title *" htmlFor="room-title" error={error}>
      <Input
        {...register("title")}
        id="room-title"
        placeholder="Enter room title"
        maxLength={MAX_TITLE_LENGTH}
        disabled={disabled}
        aria-required="true"
        aria-invalid={!!error}
      />
      <CharacterCount
        current={watchValue?.length || 0}
        max={MAX_TITLE_LENGTH}
      />
    </FormField>
  );
}
