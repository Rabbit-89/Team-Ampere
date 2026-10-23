import "@testing-library/jest-dom/vitest";
import { afterEach, describe, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import { axe } from "jest-axe";
import KField from "./KField.vue";

// Cleanup after each test to avoid memory leaks and ensure a clean state for the next test.
afterEach(() => {
  cleanup();
});

describe("KField", () => {
  it("har en label som är kopplad till fältet", () => {
    render(KField, {
      props: { label: "E-postadress" },
      attrs: { type: "email" },
    });
    expect(screen.getByLabelText("E-postadress")).toHaveAttribute(
      "type",
      "email",
    );
  });

  it("kopplar hjälptexten med aria-describedby", () => {
    render(KField, {
      props: { label: "Inflyttningsdatum", hint: "Skriv som ÅÅÅÅ-MM-DD" },
    });
    expect(
      screen.getByLabelText("Inflyttningsdatum"),
    ).toHaveAccessibleDescription("Skriv som ÅÅÅÅ-MM-DD");
  });

  it("markerar fel med aria-invalid och kopplar felet till fältet", () => {
    render(KField, {
      props: { label: "Postnummer", error: "Postnummer ska vara fem siffror" },
    });
    const input = screen.getByLabelText("Postnummer");
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription(
      "Postnummer ska vara fem siffror",
    );
  });

  it("har inga axe-överträdelser, med hjälptext och fel", async () => {
    const { container } = render(KField, {
      props: {
        label: "Postnummer",
        hint: "Fem siffror",
        error: "Postnummer ska vara fem siffror",
      },
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
