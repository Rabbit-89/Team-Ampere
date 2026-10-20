import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import KButton from "./KButton.vue";

afterEach(() => {
  cleanup();
});

const renderButton = (props = {}, attrs = {}) =>
  render(KButton, { props, attrs, slots: { default: "Spara ändringar" } });

describe("KButton", () => {
  it("är en riktig knapp med texten som namn", () => {
    renderButton();
    expect(
      screen.getByRole("button", { name: "Spara ändringar" }),
    ).toHaveAttribute("type", "button");
  });

  it("går att trycka med tangentbordet (Enter och mellanslag)", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderButton({}, { onClick });

    const button = screen.getByRole("button", {
      name: "Spara ändringar",
    });

    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it.each(["primary", "secondary", "text"])(
    "har inga axe-överträdelser (%s)",
    async (variant) => {
      const { container } = renderButton({ variant });
      expect(await axe(container)).toHaveNoViolations();
    },
  );
});
