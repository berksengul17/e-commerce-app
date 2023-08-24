import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Accordion from "../../components/Accordion";

const testData = '[{"Item 1": "Content 1"}, {"Item 2": "Content 2"}]';

test("toggles content when title is clicked", async () => {
  const user = userEvent.setup();

  render(<Accordion data={testData} />);

  const titleElements = screen.getAllByRole("heading", { level: 2 });

  const contentElements = screen.queryAllByText(/Content/);
  expect(
    contentElements.every((element) => !element.className.includes("show"))
  ).toBe(true);

  await user.click(titleElements[0]);
  const expandedContent1 = screen.getByText("Content 1");
  expect(expandedContent1).toBeInTheDocument();

  await user.click(titleElements[1]);
  const expandedContent2 = screen.getByText("Content 2");
  expect(expandedContent2).toBeInTheDocument();

  await user.click(titleElements[0]);
  const shrinkedContent1 = screen.queryByText("Content 1");
  expect(shrinkedContent1.className.includes("show")).toBe(false);
});
