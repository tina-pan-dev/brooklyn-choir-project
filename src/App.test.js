import { act } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

test("opens and closes the editable information panel", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => root.render(<App />));

  const infoButton = container.querySelector(".info-button");
  act(() => infoButton.click());
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();

  const closeButton = container.querySelector(".close-button");
  act(() => closeButton.click());
  expect(container.querySelector('[role="dialog"]')).toBeNull();

  act(() => root.unmount());
  container.remove();
});
