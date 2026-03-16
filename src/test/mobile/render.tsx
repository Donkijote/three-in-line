import type { ReactElement } from "react";

import { render } from "@testing-library/react-native";

export const renderMobile = (ui: ReactElement) => render(ui);
