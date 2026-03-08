"use client";

import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import RoleSelectionCards from "@/components/auth/sign-up/RoleSelectionCards";
import TagSelector from "@/components/rooms/TagSelector";
import useFetchAvailableTags from "@/hooks/user/use-fetch-available-tags";
import useSetRole from "@/hooks/user/use-set-role";
import useSetUserTags from "@/hooks/user/use-set-user-tags";
import useSkipOnboarding from "@/hooks/user/use-skip-onboarding";

type Step = "role" | "tags";

export default function OnboardingModal() {
  const { user, setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { setRole, isSettingRole } = useSetRole();
  const { setUserTags, isSettingTags } = useSetUserTags();
  const { skipOnboarding, isSkipping } = useSkipOnboarding();
  const { data: availableTags } = useFetchAvailableTags();

  const needsRole = user?.role === null;
  const isNewUser = user?.new_user === true;
  const isOpen = isNewUser || needsRole;

  const [step, setStep] = useState<Step>(needsRole ? "role" : "tags");
  const currentStep = needsRole && step === "role" ? "role" : "tags";

  const handleRoleContinue = useCallback(async () => {
    if (!selectedRole) return;
    try {
      const updatedUser = await setRole(
        selectedRole as "student" | "instructor",
      );
      setUser(updatedUser);
      setStep("tags");
    } catch {
      // Error handled by hook
    }
  }, [selectedRole, setRole, setUser]);

  const handleTagsContinue = useCallback(async () => {
    if (selectedTags.length === 0) return;
    try {
      const updatedUser = await setUserTags(selectedTags);
      setUser(updatedUser);
    } catch {
      // Error handled by hook
    }
  }, [selectedTags, setUserTags, setUser]);

  const handleSkip = useCallback(async () => {
    try {
      const updatedUser = await skipOnboarding();
      setUser(updatedUser);
    } catch {
      // Error handled by hook
    }
  }, [skipOnboarding, setUser]);

  if (!isOpen) return null;

  const tagNames = availableTags?.map((t) => t.name) ?? [];
  const noop = () => {};
  const isRoleStep = currentStep === "role";

  if (isRoleStep) {
    return (
      <Modal
        isOpen
        onClose={noop}
        hideCloseButton
        title="Welcome to Merge!"
        description="Choose your role to get started."
        maxWidth="3xl"
        footer={
          <div className="flex justify-end p-4">
            <Button
              onClick={handleRoleContinue}
              disabled={!selectedRole || isSettingRole}
            >
              {isSettingRole && <Loader2 className="w-4 h-4 animate-spin" />}
              Continue
            </Button>
          </div>
        }
      >
        <RoleSelectionCards value={selectedRole} onChange={setSelectedRole} />
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      onClose={handleSkip}
      title="Choose Your Interests"
      description="Select tags that match your interests. You can change these later."
      maxWidth="3xl"
      footer={
        <div className="flex justify-between p-4">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isSkipping || isSettingTags}
          >
            {isSkipping && <Loader2 className="w-4 h-4 animate-spin" />}
            Skip
          </Button>
          <Button
            onClick={handleTagsContinue}
            disabled={selectedTags.length === 0 || isSettingTags}
          >
            {isSettingTags && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue
          </Button>
        </div>
      }
    >
      <TagSelector
        selectedTags={selectedTags}
        onChange={setSelectedTags}
        availableTags={tagNames}
        maxTags={5}
      />
    </Modal>
  );
}
