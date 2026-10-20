import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/vue";
import { axe } from "jest-axe";
import LoginView from "./LoginView.vue";

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ query: {} }),
}));

const renderLogin = () => render(LoginView);

describe("LoginView – tillgänglighet", () => {
  it("har inga axe-överträdelser", async () => {
    const { container } = renderLogin();
    expect(await axe(container)).toHaveNoViolations();
  });

  // axe godkänner en placeholder som namn – getByLabelText gör det inte
  it("fälten har labels som en skärmläsare hittar", () => {
    renderLogin();
    // Skärmläsare hittar fälten via label-elementen, inte via placeholder-attributet.
    expect(screen.getByLabelText("E-postadress")).toBeTruthy();
    expect(screen.getByLabelText("Lösenord")).toBeTruthy();
  });
});
