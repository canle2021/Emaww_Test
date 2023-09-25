// src/App.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

// Mock Axios to prevent actual network requests
jest.mock("axios");

describe("App", () => {
  it("renders the component correctly", () => {
    render(<App />);
    const heading = screen.getByText("XML to Redis Exporter");
    expect(heading).toBeInTheDocument();
  });

  it("handles XML parsing correctly", async () => {
    render(<App />);
    const file = new File(["<root><item>Test Data</item></root>"], "test.xml", {
      type: "text/xml",
    });
    const dropzone = screen.getByText(
      "Drag and drop an XML file here, or click to select one"
    );

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    const status = await screen.findByText("XML parsed successfully");
    expect(status).toBeInTheDocument();
  });

  it("handles Redis data sending correctly", async () => {
    render(<App />);
    const file = new File(["<root><item>Test Data</item></root>"], "test.xml", {
      type: "text/xml",
    });
    const dropzone = screen.getByText(
      "Drag and drop an XML file here, or click to select one"
    );

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    const redisKeyInput = screen.getByPlaceholderText("Enter a Redis key");
    const sendButton = screen.getByText("Send to Redis");

    fireEvent.change(redisKeyInput, { target: { value: "testKey" } });
    fireEvent.click(sendButton);

    const status = await screen.findByText("Data sent to Redis successfully.");
    expect(status).toBeInTheDocument();
  });
});
