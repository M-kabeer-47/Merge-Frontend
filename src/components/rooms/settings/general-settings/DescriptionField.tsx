import { UseFormRegister } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { CharacterCount } from "./CharacterCount";
import {
  MAX_DESCRIPTION_LENGTH,
  type GeneralSettingsFormData,
} from "@/schemas/room/general-settings";

interface DescriptionFieldProps {
  register: UseFormRegister<GeneralSettingsFormData>;
  error?: string;
  disabled?: boolean;
  watchValue: string;
}

export function DescriptionField({
  register,
  error,
  disabled,
  watchValue,
}: DescriptionFieldProps) {
  return (
    <FormField
      label="Room Description"
      htmlFor="room-description"
      error={error}
    >
      <Textarea
        {...register("description")}
        id="room-description"
        rows={4}
        placeholder="Describe what your room is about, topics covered, etc."
        maxLength={MAX_DESCRIPTION_LENGTH}
        disabled={disabled}
        aria-invalid={!!error}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-para-muted">
          Help members understand the purpose and content of this room
        </p>
        <CharacterCount
          current={watchValue?.length || 0}
          max={MAX_DESCRIPTION_LENGTH}
        />
      </div>
    </FormField>
  );
}
