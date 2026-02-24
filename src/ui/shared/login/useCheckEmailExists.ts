import { useState } from "react";

import { checkEmailExistsUseCase } from "@/application/users/checkEmailExistsUseCase";
import { userRepository } from "@/infrastructure/convex/repository/userRepository";

export const useCheckEmailExists = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkEmailExists = async (email: string) => {
    setIsChecking(true);
    try {
      return await checkEmailExistsUseCase(userRepository, email);
    } finally {
      setIsChecking(false);
    }
  };

  return { checkEmailExists, isChecking };
};
