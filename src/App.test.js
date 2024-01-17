import React from "react";
import { render } from "@testing-library/react";
import CarouselUploader from "./CarouselUploader";

test("renders CarouselUploader without errors", () => {
  render(<CarouselUploader />);
});
